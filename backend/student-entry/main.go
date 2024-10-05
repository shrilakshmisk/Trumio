package main

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
	"time"
	"encoding/json"
	"io"
	"errors"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/static"
)

type Users struct {
	Team string
	User string
	Pass string
}

var allUsers = []Users{
	{Team: "0", User:"user0", Pass:"pass0"},
	{Team: "1", User:"user1", Pass:"pass1"},
	{Team: "2", User:"user2", Pass:"pass2"},
}

var prevReqTime time.Time

const (
	base_url = "0.0.0.0:8000" //where this will listen
	server_controller = "http://client:8001" //where this will request the server list from
)

var teamAddrs map[string]string //map of teams -> their servers

// a fake function that we can do strategy here.
func getLoadBalanceAddr(team string) (val string, ok bool) {
	val, ok = teamAddrs[team]
	return
}

func updateAddrs() (err error){
	log.Println("updating server list")
	// defer log.Println("exited update addrs", err)
	resp, err :=http.Get(fmt.Sprintf("%s/servers",server_controller))
	defer log.Println("err:", err)
// 	log.Println(err)
// 	log.Println(resp.StatusCode)
	if (err != nil) {return err}
	if (resp.StatusCode != http.StatusOK) {
		err = errors.New(resp.Status)
		return
	}
	defer resp.Body.Close()
	log.Println(resp.Status)
	
	var respBody []byte
	respBody, err = io.ReadAll(resp.Body)
	if (err != nil) {return err}
	//clear teamAddrs, but back it up first
	backup := make(map[string]string)
	for key, val := range teamAddrs {
		backup[key] = val
		delete(teamAddrs, key)
	}
	//set teamAddrs to response
	err = json.Unmarshal(respBody, &teamAddrs)
	if (err != nil) {
		//restore backup
		for key, val := range backup {
			teamAddrs[key] = val
		}
		return err
	}
	//done
	log.Printf("%v", teamAddrs)
	return nil
}

func appReverseProxyHandler(c *gin.Context) {

	//first check cookie to see if valid
	cred, err := c.Cookie("creds")
	if (err != nil) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}
	creds := strings.Split(cred, ":")
	if (len(creds) != 3) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cookie invalid"})
		return
	}
	reqUser := Users{creds[0], creds[1], creds[2]}
	found := false
	for _, user := range allUsers {
		if (user == reqUser) {
			found = true
			break
		}
	}
	if (!found) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}
	
	//check time and update teamAddrs if necessary
	//update max every 10s
	if (time.Now().Sub(prevReqTime) > 10000) {
		err := updateAddrs()
		if (err != nil) {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}
	}

	//valid user, so set correct proxy
	addr, ok := getLoadBalanceAddr(reqUser.Team)
	if (!ok) {
		c.JSON(http.StatusInternalServerError, gin.H{"error":"server not operating currently"})
		return
	}

	lastDigit := addr[len(addr)-1]
	newAddr := "http://team-"+string(lastDigit)+"-workspace:808"+string(lastDigit)
	log.Println(newAddr)

	proxy, err := url.Parse(newAddr)
	if err != nil {
		log.Printf("error in parse addr: %v", err)
		c.String(500, "error")
		return
	}


	log.Println("accessed path")
	log.Println(c.Request.URL)
	log.Println(c.Param("path"))
	// step 1: resolve proxy address, change scheme and host in requets
	req := c.Request
	req.URL.Scheme = proxy.Scheme
	req.URL.Host = proxy.Host
	req.URL.Path = c.Param("path")
	
	log.Println("request URL:", req.URL.Scheme, req.URL.Host, req.URL.Path, req.URL.RawQuery)
	
	rp := new(httputil.ReverseProxy)
	rp.Director = func(hreq *http.Request) {
		hreq = req
	 //  hreq.URL, err = url.Parse(fmt.Sprintf("%s%s",proxy,c.Param("path")))
	 //  log.Println("in URL:", c.Request.URL, "hreq URL:", hreq.URL)
		
		
	}
	rp.ServeHTTP(c.Writer, c.Request)
}

func authHandler(c *gin.Context) {
	//once logged in, set cookie
	var requestUser Users
	if err := c.ShouldBindJSON(&requestUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	log.Println("user:",requestUser.Team,requestUser.User,requestUser.Pass)
	var foundUser *Users
	for _, user := range allUsers {
		if user == requestUser {
			foundUser = &user
			break
		}
	}
	// check if the user was found
	if foundUser == nil {
		log.Println("user not found:",requestUser.Team,requestUser.User,requestUser.Pass)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}
	
	//user found, so set cookie to their credentials (this is a prototype)
	c.SetCookie("creds", fmt.Sprintf("%s:%s:%s", foundUser.Team, foundUser.User, foundUser.Pass), 86400, "/", base_url, false, true)
	c.JSON(http.StatusOK, gin.H{"message": "Login successful"})
}

func main() {

	teamAddrs = make(map[string]string)
	prevReqTime = time.Now()
	updateAddrs()
	r := gin.Default()
	
	
	r.Use(static.Serve("/", static.LocalFile("./out", true)))
	//serve static files like /student/login, only check auth when handling apps
	
	r.GET("/app/code/*path", appReverseProxyHandler)
	r.POST("/api/auth", authHandler)
	
	
	if err := r.Run(base_url); err != nil {
		log.Printf("Error: %v", err)
	}
}
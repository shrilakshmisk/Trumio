package web

import (
	"fmt"
	"github.com/bmerchant22/DataShieldX-backend/pkg/models"
	"github.com/bmerchant22/DataShieldX-backend/pkg/store"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"net/http"
	"strconv"
)

type Server struct {
	r *gin.Engine
}

var users = []models.User{
	{Team: 1, Username: "user1", Password: "pass1"},
	{Team: 2, Username: "user2", Password: "pass2"},
	{Team: 3, Username: "user3", Password: "pass3"},
}

var RunningServers map[string]string //team string to url

func (srv *Server) StartServerHandler(c *gin.Context) {
	team := c.Param("team")
	portStr := c.Param("port")
	port, err := strconv.Atoi(portStr)
	if err != nil {
		zap.S().Errorf("Error while converting portStr to port : %v", err)
	}

	// Define root directory based on the team
	// rootDir := ""
	// switch team {
	// case "0":
	// 	rootDir = "/out/client"
	// case "1":
	// 	rootDir = "/out/404"
	// case "2":
	// 	rootDir = "/out/assets"
	// default:
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid team"})
	// 	return
	// }

	rootDir := "/home/bmerchant/Desktop/DataShieldX-backend/project_shared_dir"


	// Resolve the root directory path
	// absRootDir, err := store.ResolvePath(rootDir)
	// if err != nil {
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	// 	return
	// }
	zap.S().Infof("Working root directory : %v", rootDir)

	// Start the command
	containerID, err := store.StartDockerContainer(rootDir, team, port)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	//add to RunningServers
	RunningServers[team] = fmt.Sprintf("http://localhost:%d", port)

	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("Docker container started successfully for team %d", team), "containerID": containerID, "port": port, "rootDir": rootDir})

}

func (srv *Server) StopServerHandler(c *gin.Context) {
	team := c.Param("team")
	containerName := store.NameContainer(team)

	err := store.StopDockerContainer(containerName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Docker container stopped successfully", "containerName": containerName})
	
	//remove from RunningServers
	delete(RunningServers, team)
	
}

func (srv *Server) QueryServerHandler(c *gin.Context) {
	c.JSON(http.StatusOK, RunningServers)
}

func (srv *Server) LogsHandler(c *gin.Context) {
	team := c.Param("team")

	teamName := store.NameContainer(team)
	// Get container ID by team name
	containerID, err := store.GetContainerIDByTeamName(teamName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Get logs for the container
	logs, err := store.GetContainerLogs(containerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"team": teamName, "logs": logs})
}

type loginRequest struct {
	UserID     string `json:"user_id" binding:"required"`
	Password   string `json:"password" binding:"required"`
	RememberMe bool   `json:"remember_me"`
}

func (srv *Server) LoginHandler(c *gin.Context) {
	var requestUser models.User
	if err := c.ShouldBindJSON(&requestUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Find the user by username
	var foundUser *models.User
	for _, user := range users {
		if user.Username == requestUser.Username {
			foundUser = &user
			break
		}
	}

	// Check if the user was found
	if foundUser == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	// Check if the password and team match
	if foundUser.Password == requestUser.Password && foundUser.Team == requestUser.Team {
		c.JSON(http.StatusOK, gin.H{"message": "Login successful"})
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username, password, or team"})
	}
}

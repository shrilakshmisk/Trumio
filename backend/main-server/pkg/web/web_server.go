package web

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/static"
	"go.uber.org/zap"
// 	"os"
)

func CreateWebServer() *Server {
	
	RunningServers = make(map[string]string)
	
	srv := new(Server)
	srv.r = gin.Default()
	srv.r.Use(cors.Default())
	
	//static path
	srv.r.Use(static.Serve("/", static.LocalFile("./out", true)))
// 	outFolderPath := "out"
// 	if _, err := os.Stat(outFolderPath); os.IsNotExist(err) {
// 		// If "out" folder doesn't exist, t ry "../out" (adjust as needed)
// 		outFolderPath = "../out"
// 	}

	srv.r.POST(kStartServer, srv.StartServerHandler)
	srv.r.POST(kStopServer, srv.StopServerHandler)
	srv.r.GET(kLogs, srv.LogsHandler)
// 	srv.r.POST(kStudentLogin, srv.LoginHandler)
	
	srv.r.GET(kQueryServers, srv.QueryServerHandler)
	// srv.r.Static("/", "./out")
	//srv.r.StaticFS("/_next", http.Dir(outFolderPath+"/_next"))
	//srv.r.StaticFS("/student", http.Dir(outFolderPath+"/student"))
	//srv.r.StaticFS("/client", http.Dir(outFolderPath+"/client"))
	//srv.r.POST(kList, srv.ListingFilesHandler)
	//srv.r.POST(kFile, srv.DisplayFileContent)

	// CRUD for projects
	srv.r.POST(kCreateProject, srv.CreateProjectHandler)
	srv.r.POST(kDeleteProject, srv.DeleteProjectHandler)
	srv.r.POST(kUpdateProject, srv.UpdateProjectHandler)
	srv.r.GET(kGetProjects, srv.GetProjectsHandler)
	srv.r.GET(kGetProject, srv.GetProjectHandler)

	// // Apps marketplace
	srv.r.GET(kGetApps, srv.GetAppsHandler)

	// // Generative routes.
	srv.r.POST(kGenerateMilestone, srv.GenerateMilestoneHandler)
	// srv.r.POST(kGenerateTasks, srv.GenerateTasksHandler)
	



	if err := srv.r.Run("0.0.0.0:8001"); err != nil {
		zap.S().Errorf("Error while running the server !")
	}

	zap.S().Infof("Web server created successfully !!")

	return srv
}

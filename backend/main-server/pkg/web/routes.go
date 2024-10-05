package web

const (

	kStartServer  = "/start/:team/:port"
	kStopServer   = "/stop/:team"
	kLogs         = "/logs/:team"
	kStudentLogin = "/student/auth"
	kQueryServers = "/servers"
	// CRUD for projects
	kCreateProject 	= "/createProject"	// Creates a new project
	kDeleteProject 	= "/deleteProject"	// Deletes a project
	kUpdateProject 	= "/updateProject"	// Updates a project
	kGetProjects  	= "/getProjects"	// Gets all projects
	kGetProject 	= "/getProject"		// Gets a specific project
	// Apps marketplace
	kGetApps 		= "/getApps"		// Gets all apps from global collection

	// Generative routes.
	kGenerateMilestone 	= "/generateMilestone" 	// Generates a milestone for a project given a basic description
	kGenerateTasks 		= "/generateTasks"		// Generates tasks for a milestone given a milestone


)

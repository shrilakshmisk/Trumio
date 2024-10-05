package web

import(
	"context"
	"net/http"
// 	"encoding/json"
	"github.com/gin-gonic/gin"
	"fmt"
	"github.com/bmerchant22/DataShieldX-backend/pkg/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	// "os"
)

//* Get ENV variables 
var mongoURI 				= "mongodb+srv://trumio:trumio-db-pass!@rocket-chat-cluster.wg1zzcc.mongodb.net/?retryWrites=true&w=majority"			//os.Getenv("MONGO_URI")
var mongoDBName 			= 	"trumio-backend"		//os.Getenv("MONGO_DB_NAME")
var projectsCollectionName 	= "projects-collection"			//os.Getenv("PROJECTS_COLLECTION_NAME")
// var usersCollectionName := 			//os.Getenv("USERS_COLLECTION_NAME")
var appsCollectionName = "apps-collection" 			//os.Getenv("APPS_COLLECTION_NAME")


//* Create MongoDB client and connect to the database
func CreateMongoClient() (*mongo.Client, error) {
	
	// Create a new client
	client, err := mongo.NewClient(options.Client().ApplyURI(mongoURI))
	if err != nil {
		return nil, err
	}
	// Connect to the database
	err = client.Connect(context.Background())
	if err != nil {
		return nil, err
	}
	return client, nil
	
}

//* Generic function to check if a document with a key exists in the collection
//* Returns True if the document exists, False otherwise
func CheckIfDocumentExists(client *mongo.Client, databaseName string, collectionName string, key string, value string) bool {
	// Get the collection
	collection := client.Database(databaseName).Collection(collectionName)
	// Create a filter
	filter := bson.D{{key, value}}
	// Check if the document exists
	if err := collection.FindOne(context.Background(), filter).Err(); err != nil {
		return false
	}
	return true
}

//* Generic function to insert a document into the collection
//* Returns True if the document was inserted successfully, False otherwise
func InsertDocument(client *mongo.Client, databaseName string, collectionName string, document interface{}) (bool,  error) {
	// Get the collection
	collection := client.Database(databaseName).Collection(collectionName)
	// Insert the document
	_, err := collection.InsertOne(context.Background(), document)
	if err != nil {
		return false, err
	}
	return true, nil
}

//* Generic function to delete a document from the collection
//* Returns True if the document was deleted successfully, False otherwise
func DeleteDocument(client *mongo.Client, databaseName string, collectionName string, key string, value string) (bool, error) {
	// Get the collection
	collection := client.Database(databaseName).Collection(collectionName)
	// Create a filter
	filter := bson.D{{key, value}}
	// Delete the document
	_, err := collection.DeleteOne(context.Background(), filter)
	if err != nil {
		return false, err
	}
	return true, nil
}

//* Generic function to update a document in the collection
//* Returns True if the document was updated successfully, False otherwise
func UpdateDocument(client *mongo.Client, databaseName string, collectionName string, id_key string, id_value string, upsert_doc interface{}) (bool, error) {
	// Get the collection
	collection := client.Database(databaseName).Collection(collectionName)
	// Create a filter
	filter := bson.D{{id_key, id_value}}
	// Create an update
	update := bson.D{{"$set", upsert_doc}}
	// Update the document
	_, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return false, err
	}
	return true, nil
}


// Create Project Handler
// TODO : Fix the Milestones, Team and Apps fields when pushed to MongoDb
func (srv *Server) CreateProjectHandler(c *gin.Context) {

	fmt.Printf("Mongo URI: %s\n", mongoURI)
	// Get the JSON request body & parse it as model Project
	var project models.Project
	if err := c.ShouldBindJSON(&project); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if project.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Project name is required"})
		return
	}

	// Print the project details
	fmt.Printf("Project ID: %s\n", project.Project_ID)
	fmt.Printf("Project Name: %s\n", project.Name)
	fmt.Printf("Project Description: %s\n", project.Project_Desc)
	fmt.Printf("Milestones: %s\n", project.Milestones)
	fmt.Printf("Team: %s\n", project.Team)
	fmt.Printf("Apps: %s\n", project.Apps)

	// Create a new client and connect to the server
	mongoClient, err := CreateMongoClient()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if the project already exists
	if CheckIfDocumentExists(mongoClient, mongoDBName, projectsCollectionName, "project_id", project.Project_ID) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Project already exists"})
		return
	}

	// Insert the project into the database
	inserted, err := InsertDocument(mongoClient, mongoDBName, projectsCollectionName, project)
	if err != nil || !inserted {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// Return the response
	c.JSON(http.StatusOK, gin.H{"message": "Project created successfully"})
}

// Delete Project Handler
func (srv *Server) DeleteProjectHandler(c *gin.Context) {

	// Get the JSON request body & parse it as model Project
	var project models.Project
	if err := c.ShouldBindJSON(&project); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Print the project details
	// fmt.Printf("Project ID: %s\n", project.Project_ID)

	// Create a new client and connect to the server
	mongoClient, err := CreateMongoClient()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if the project exists
	if !CheckIfDocumentExists(mongoClient, mongoDBName, projectsCollectionName, "project_id", project.Project_ID) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Project doesn't exist"})
		return
	}

	// Delete the project from the database
	deleted, err := DeleteDocument(mongoClient, mongoDBName, projectsCollectionName, "project_id", project.Project_ID)
	if err != nil || !deleted {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// Return the response
	c.JSON(http.StatusOK, gin.H{"message": "Project deleted successfully"})
}

// Update Project Handler using Upsert functionality
func (srv *Server) UpdateProjectHandler(c *gin.Context) {

	// Get the JSON request body & parse it as model Project
	var project models.Project
	if err := c.ShouldBindJSON(&project); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Print the project details
	// fmt.Printf("Project ID: %s\n", project.Project_ID)
	// fmt.Printf("Project Name: %s\n", project.Name)
	// fmt.Printf("Project Description: %s\n", project.Project_Desc)
	// fmt.Printf("Milestones: %s\n", project.Milestones)
	// fmt.Printf("Team: %s\n", project.Team)
	// fmt.Printf("Apps: %s\n", project.Apps)

	// Create a new client and connect to the server
	mongoClient, err := CreateMongoClient()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if the project exists
	if !CheckIfDocumentExists(mongoClient, mongoDBName, projectsCollectionName, "project_id", project.Project_ID) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Project doesn't exist"})
		return
	}

	// Update the project in the database
	updated, err := UpdateDocument(mongoClient, mongoDBName, projectsCollectionName, "project_id", project.Project_ID, project)
	if err != nil || !updated {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// Return the response
	c.JSON(http.StatusOK, gin.H{"message": "Project updated successfully"})

}


// Get Projects Handler
func (srv *Server) GetProjectsHandler(c *gin.Context) {
	
	// Create a new client and connect to the server
	mongoClient, err := CreateMongoClient()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error1": err.Error()})
		return
	}

	// Get all the projects from the database
	var projects []models.Project
	collection := mongoClient.Database(mongoDBName).Collection(projectsCollectionName)
	cursor, err := collection.Find(context.Background(), bson.D{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error2": err.Error()})
		return
	}
	if err = cursor.All(context.Background(), &projects); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error3": err.Error()})
		return
	}

	// Return the response
// 	ret, err2 := json.Marshal(gin.H{"projects": projects})
	
// 	if (err2 != nil) {c.JSON(http.StatusInternalServerError, gin.H{"error": err2.Error()})}
	c.JSON(http.StatusOK, gin.H{"projects": projects})

}

// Get Project Handler
func (srv *Server) GetProjectHandler(c *gin.Context) {
	
	// Get the JSON request body & parse it as model Project
	var project models.Project
	if err := c.ShouldBindJSON(&project); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Print the project details
	// fmt.Printf("Project ID: %s\n", project.Project_ID)

	// Create a new client and connect to the server
	mongoClient, err := CreateMongoClient()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if the project exists
	if !CheckIfDocumentExists(mongoClient, mongoDBName, projectsCollectionName, "project_id", project.Project_ID) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Project doesn't exist"})
		return
	}

	// Get the project from the database
	var projectFromDB models.Project
	collection := mongoClient.Database(mongoDBName).Collection(projectsCollectionName)
	filter := bson.D{{"project_id", project.Project_ID}}
	if err := collection.FindOne(context.Background(), filter).Decode(&projectFromDB); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Return the response
	c.JSON(http.StatusOK, gin.H{"project": projectFromDB})

}


// Get Apps Handler
func (srv *Server) GetAppsHandler(c *gin.Context) {
	
	// Create a new client and connect to the server
	mongoClient, err := CreateMongoClient()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get all the apps from the database
	var apps []models.App
	collection := mongoClient.Database(mongoDBName).Collection(appsCollectionName)
	cursor, err := collection.Find(context.Background(), bson.D{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err = cursor.All(context.Background(), &apps); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Return the response
	c.JSON(http.StatusOK, gin.H{"apps": apps})
}

//dummy milestone generator handler
func (srv *Server) GenerateMilestoneHandler (c *gin.Context) {
	//in request: a json with fields name and project_desc - unmarshal and send to model, receive milestones in json format and return
	//returning mock data:
	c.JSON(http.StatusOK, gin.H{
		"milestones": []interface{}{
			map[string]string{
				"milestone_id": "1",
				"milestone_desc": "Research ways of reducing server latency",
				"completion_date":"2024/01/05",
			},
			map[string]string{
				"milestone_id": "2",
				"milestone_desc": "Implement netcode for game server",
				"completion_date":"2024/02/05",
			},
			map[string]string{
				"milestone_id": "3",
				"milestone_desc": "Finish auxilliary features",
				"completion_date":"2024/02/15",
			},
		},
	})
	
}
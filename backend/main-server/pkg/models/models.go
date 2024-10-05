package models

type User struct {
    Team     int    `bson:"team,omitempty" json:"team,omitempty"`
    Username string `bson:"username" json:"username"`
    Password string `bson:"password,omitempty" json:"password,omitempty"`
}

type Project struct {
    Project_ID    string      `bson:"project_id" json:"project_id" binding:"required"`
    Name          string      `bson:"name,omitempty" json:"name,omitempty"`
    Project_Desc  string      `bson:"project_desc,omitempty" json:"project_desc,omitempty"`
    Milestones    []Milestone `bson:"milestones,omitempty" json:"milestones,omitempty"`
    Team          []User      `bson:"team,omitempty" json:"team,omitempty"`
    Apps          []App       `bson:"apps,omitempty" json:"apps,omitempty"`
}

type Milestone struct {
    Milestone_ID    string `bson:"milestone_id,omitempty" json:"milestone_id,omitempty"`
    Milestone_Desc  string `bson:"milestone_desc,omitempty" json:"milestone_desc,omitempty"`
    Completion_Date string `bson:"completion_date,omitempty" json:"completion_date,omitempty"`
    Tasks           []Task `bson:"tasks,omitempty" json:"tasks,omitempty"`
}

type Task struct {
    Task_ID     string  `bson:"task_id,omitempty" json:"task_id,omitempty"`
    Task_Desc   string  `bson:"task_desc,omitempty" json:"task_desc,omitempty"`
    Start_Time  string  `bson:"start_time,omitempty" json:"start_time,omitempty"`
    End_Time    string  `bson:"end_time,omitempty" json:"end_time,omitempty"`
    Status      string  `bson:"status,omitempty" json:"status,omitempty"`
    Assignees   []User  `bson:"assignees,omitempty" json:"assignees,omitempty"`
}

type App struct {
    App_Name         string `bson:"app_name,omitempty" json:"app_name,omitempty"`
    App_Desc         string `bson:"app_desc,omitempty" json:"app_desc,omitempty"`
    Approval_Status  string `bson:"approval_status,omitempty" json:"approval_status,omitempty"`
}
// HomeTask.jsx
import React, { useState, useEffect } from 'react';
import dayjs from "dayjs";
import { Box, Button, Card} from '@mui/material';
import Navbar from '@/Navbar';
import GanttChart from '@/GanttChart';

const UpcomingMilestone = ({milestones, handleToggleTasks, isTasksExpanded}) => {
		const milestone = milestones.reduce((mostRecent, current) => { //greater than -> after
			if ((new Date(mostRecent.completion_date)) > (new Date(current.completion_date))) return current; else return mostRecent;
		},{completion_date:"2100/10/10"});
		const [time,setTime] = useState(Math.floor((new Date(milestone.completion_date) - new Date())/1000));
		const days = Math.floor(time/86400);
		const hours = Math.floor((time%86400)/3600);
		const minutes = Math.floor((time%3600)/60);
		const seconds = time%60;
		useEffect(() => {
			const interval = setInterval(() => {
				setTime(Math.floor((new Date(milestone.completion_date) - new Date())/1000));
			}, 1000);
			return () => {clearInterval(interval)}
		}, [])
		return (<>
		<Box border="1px solid #ddd" borderRadius="10px" p={2} sx={{ backgroundColor: "#FFFFFF", maxWidth: '100%', boxShadow: "0px 0px 5px 0px #D1D1D1" }}>
                    <h2>Upcoming Milestone</h2>
                    <h3>{milestone.milestone_desc}</h3>
                    <p style={{ fontSize: '20px' }}>Deadline: <span style={{ fontSize: '14px' }}>{milestone.completion_date}</span></p>
                    <p style={{ fontSize: '20px' }}>Time: <span style={{ fontSize: '14px' }}>
                    {days == 0 ? "" : days == 1 ? "1 day " : `${days} days `}
                    {hours == 0 ? "" : hours == 1 ? "1 hour " : `${hours} hours `}
                    {minutes == 0 ? "" : minutes == 1 ? "1 minute " : `${minutes} minutes `}
                    {seconds == 0 ? "" : seconds == 1 ? "1 second " : `${seconds} seconds `}
                    </span></p>
                  </Box>
                  <Box
                    border="1px solid #ddd"
                    borderRadius="10px"
                    p={2}
                    sx={{
                      backgroundColor: "#FFFFFF",
                      marginTop: '16px',
                      maxWidth: '100%',
                      boxShadow: "0px 0px 5px 0px #D1D1D1",
                      cursor: 'pointer',
                    }}
                    onClick={handleToggleTasks}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h2>Active Tasks</h2>
                      <span style={{ transform: isTasksExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>▶</span>
                    </div>
                    {isTasksExpanded && (
                      <div style={{ marginTop: '8px' }}>
                        {/* Task Cards */}
                        {milestone.tasks.map(el => (<TaskDisplayCard task={el} />))}
                      </div>
                    )}
                  </Box>
                </>)
	}


const Dashboard = () => {
  const [isTasksExpanded, setIsTasksExpanded] = useState(false);
  const [isBacklogExpanded, setIsBacklogExpanded] = useState(false);
  const [isMilestonesExpanded, setIsMilestonesExpanded] = useState(false);
  const [milestoneFormOpen, setMilestoneFormOpen] = useState(false);
  const [currTab, setCurrTab] = useState('Project Management');
  const [project, setProject] = useState("");
	const [loading, setLoading] = useState(true);
// 	const [teamId, setId] = useState("");
  const handleChange = (event, newValue) => {
    setCurrTab(newValue);
  };

  const handleMilestones = () => {
    setIsMilestonesExpanded(!isMilestonesExpanded);
  };

  const handleToggleTasks = () => {
    setIsTasksExpanded(!isTasksExpanded);
  };

	useEffect(() => { //on mount: get id from url params, fetch project data, id is in url params, needs to fail gracefully too
		(async () => {
			if (typeof window === undefined) return; //do nothing during static pre-rendering
			let id = new URLSearchParams(window.location.search).get("id");
			setId(id);
			//let the db verify if the id is really an id -> deal with its errors directly
			try {
				let temp = await getProject(id);
				console.log(temp);
				setProject(temp);
				setUsers(temp.team);
				setLoading(false);
				
			} catch (err) {
				console.error(err);
				setLoading("error");
			}
		})();
		
	}, []);


	const MLTCard = ({milestone, index, deleteMilestone}) => {
		const [isExpanded, setExpanded] = useState(false);
  
	  const [showAddTaskPopup, setShowAddTaskPopup] = useState(false);

	  const handleExpand = () => {
		setExpanded(!isExpanded)
	  }
  

	  return (
		<Box
	  border="1px solid #ddd"
	  borderRadius="10px"
	  p={2}
	  sx={{
		backgroundColor: "#FFFFFF",
		marginTop: '16px',
		maxWidth: '100%',
		boxShadow: "0px 0px 5px 0px #D1D1D1",
		cursor: 'pointer',
	  }}
	>
	  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', position:"relative" }}>
		<div style={{position:"absolute", width:"100%", height:"100%", top:"0", left:"0"}} onClick={handleExpand}></div>
		<div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column' }}>
		  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
			  <div>
				<h2>{milestone.milestone_desc}</h2>
			  </div>
			  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
				<span style={{ fontSize: '20px', color: '#555', marginBottom: '8px', marginLeft: '16px' }}><b>Expected Completion:</b> {milestone.completion_date}</span>
			  </div>
			</div>
			<div style={{ display: 'flex', alignItems: 'center' }}>

			  <span style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', fontSize: '24px', transition: 'transform 0.3s ease', marginLeft: '8px' }}>▶</span>
			</div>
		  </div>
		</div>
	  </div>
		  {isExpanded && (
			<div style={{ marginTop: '8px'}}>
			  {milestone.tasks.map((task, idx) => (<TaskCard task={task} deleteTask={deleteTaskMaker(idx)} />))}
			</div>
		  )}
	</Box>);};



  if (loading) return (
  	<>
  	<div>{/*loader*/}</div>
  	<div>Loading project data...</div>
  	<Dialog open={(loading === 'error')} onClose={() => {}}> {/*uncloseable error dialog*/}
  		<h1>Error loading project</h1>
  	</Dialog>
  	</>
  );

  if (!loading) return (
	<div style={{ display: 'flex', flexDirection: 'column', width:"100%", height: "100%"}}>
    	<Navbar />
    	<div style={{ backgroundColor: '#f6f6f6', width: '100%', minHeight: '100vh', padding: '16px', overflowY: 'auto' }}>
        <div style={{ display: 'flex' }}>
        	<div style={{ display: 'flex', overflowY: 'auto' }}>
                <div style={{ flex: '0 0 63%', maxWidth: '63%', marginRight: '16px', marginTop: '16px', backgroundColor: "#FBF8F8", boxShadow: "0px 0px 5px 0px #D1D1D1", padding: '16px', borderRadius: '10px', overflowY: 'auto' }}>
                  {/* Card 1 */}
                  <div style={{ borderRadius: '10px', backgroundColor: '#FFFFFF', width: '100%', boxShadow: "0px 0px 5px 0px #D1D1D1" }}>
                    <GanttChart style={{ width: '100%' }} project={project}/>
                  </div>
  
                  <Box
                    border="1px solid #ddd"
                    borderRadius="10px"
                    p={2}
                    sx={{
                      backgroundColor: "#FFFFFF",
                      marginTop: '16px',
                      maxWidth: '100%',
                      boxShadow: "0px 0px 5px 0px #D1D1D1",
                      cursor: 'pointer',
                      overflowY: 'auto',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position:"relative"}}>
                    	<div style={{position:"absolute", width:"100%", height:"100%", top:"0", left:"0"}} onClick={handleMilestones}>{/*Placeholder to grab click*/}</div>
                      <h2>Milestones</h2>
                      <Button variant="contained" onClick={() => setMilestoneFormOpen(true)}>Add Milestone</Button>
                      <Button variant="contained" onClick={async () => {
							try {
								let data = await generateMilestones(project);
								//resp.data = milestones: {}...
								setProject({
									...project,
									milestones: data.milestones
								})
							} catch (err) {
								console.error(err);
							}
						}}>Generate Milestones with AI</Button>
                      <span style={{ transform: isMilestonesExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>▶</span>
                    </div>
					<Dialog open={milestoneFormOpen} onClose={() => {
						setMilestoneFormOpen(false)
					}}>
					<Card sx={{display:"flex", flexDirection:"column", alignItems:"center", padding:"20px", gap:"20px"}}>
					<h2>Add Milestone</h2>
					<TextField label="Milestone Description" value={newMilestone.milestone_desc} onChange={(e) => setNewMilestone({...newMilestone, milestone_desc:e.target.valye})}/>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DateField label="Completion Date" value={dayjs(newMilestone.completion_date)} onChange={(newVal) => {
							setNewMilestone({
								...newMilestone,
								completion_date: newVal.format("YYYY/MM/DD")
							})
						}}/>
					</LocalizationProvider>
					<Button variant="contained" onClick={async () => {
						let maxId = 0;
						for (const milestone in project.milestones) if (Number(milestone.milestone_id) > maxId) maxId = Number(milestone.milestone_id);
						setProject({
							...project,
							milestones: [...project.milestones, {
								...newMilestone,
								milestone_id:String(maxId + 1)
							}]
						});
						try {
							await updateProject({
								...project,
								milestones: [...project.milestones, {
									...newMilestone,
									milestone_id:String(maxId + 1)
								}]
							});
							setMilestoneFormOpen(false);
							clearNewMilestone();
						} catch (err) {
							console.error(err)
						}
					}}>Add Milestone</Button>
					</Card>
					</Dialog>
                    {isMilestonesExpanded && (
                      <div style={{ marginTop: '8px' }}>
                        {project.milestones.map((milestone, index) => (
                          <MLTCard
                            key={`milestoneLeftCard${milestone.milestone_id}`}
                            milestone={milestone}
                            index={index}
                            deleteMilestone={deleteMilestoneMaker(index)}
                          />
                        ))}
                      </div>
                    )}
                  </Box>
                </div>
  
                <div style={{ flex: '0 0 32%', maxWidth: '32%', marginRight: '32px', marginLeft: 'auto', backgroundColor: "#FBF8F8", boxShadow: "0px 0px 5px 0px #D1D1D1", padding: '16px', borderRadius: '10px', overflowY: 'auto' }}>
                  <UpcomingMilestone milestones={project.milestones} handleToggleTasks={handleToggleTasks} isTasksExpanded={isTasksExpanded} />
                  {/* Active Tasks Card 
                  i.e. tasks of upcoming milestone*/}
                </div>
              </div>
            </>
          )
        </div>
      </div>
    </div>
);}

const TaskCard = ({task, deleteTask}) => {
	console.log(deleteTask);
	return(
<div key={`task-${task.task_id}`} style={{  backgroundColor: "#FFFFFF", boxShadow: "0px 0px 5px 0px #D1D1D1", padding: '16px', borderRadius: '10px', marginTop: '16px' }}>
	<div style={{display: 'flex', alignItems: 'center', width: "100%", height:"100%"}}>
              <div style={{ flex: 1 }}>
                <h2>{task.task_desc}</h2>
                <br />
              </div>
              {task.status === "completed" ? (<p style={{color:"#0d0", fontSize:"30px"}}>Completed</p>) : (<p style={{color:'Orange', fontSize:'30px'}}>Pending</p>)}
              <IconButton onClick={deleteTask}><DeleteIcon /></IconButton>
    </div>
    <div>Assignees: {task.assignees.map((el,idx) => (idx !== task.assignees.length - 1 ? `${el.username}, ` : el.username))}</div>
</div>)}

const TaskDisplayCard = ({task}) => {
	return (<div key={`task-${task.task_id}`} style={{  backgroundColor: "#FFFFFF", boxShadow: "0px 0px 5px 0px #D1D1D1", padding: '16px', borderRadius: '10px', marginTop: '16px' }}>
	<div style={{display: 'flex', alignItems: 'center', width: "100%", height:"100%"}}>
                <h2>{task.task_desc}</h2>
                <br />
    </div>
    <div>Assignees: {task.assignees.map((el,idx) => (idx !== task.assignees.length - 1 ? `${el.username}, ` : el.username))}</div>
</div>)
}


function ToggleSwitch() {
  // State variables to track the toggle state for each switch
  const [isToggled1, setIsToggled1] = useState(false);
  const [isToggled2, setIsToggled2] = useState(false);

  // Event handler to toggle the first switch
  const toggleSwitch1 = () => {
    // Check if switch 2 is off before toggling switch 1
    if (!isToggled2) {
      setIsToggled1(!isToggled1);
    }
  };

  // Event handler to toggle the second switch
  const toggleSwitch2 = () => {
    // Check if switch 1 is on before toggling switch 2
    if (isToggled1) {
      setIsToggled2(!isToggled2);
    }
  };

  // Styles
  const switchContainerStyle = {
    position: 'relative',
    display: 'inline-block',
    width: '60px', // Adjust the width as needed
    height: '34px', // Adjust the height as needed
    marginRight: '10px', // Add margin between the switches
  };

  const sliderStyle = {
    position: 'absolute',
    cursor: 'pointer',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: '#ccc', // Default background color when switch is off
    transition: '0.4s',
    borderRadius: '34px', // To make the switch round
  };

  const sliderBeforeStyle = {
    position: 'absolute',
    content: '',
    height: '26px',
    width: '26px',
    left: isToggled1 ? '30px' : '4px', // Adjust the positioning as needed
    bottom: '4px', // Adjust the positioning as needed
    backgroundColor: 'white', // Color of the switch
    transition: 'left 0.4s ease, background-color 0.4s ease', // Added transition properties
    borderRadius: '50%', // To make the switch round
  };

  const sliderBeforeStyle2 = {
    position: 'absolute',
    content: '',
    height: '26px',
    width: '26px',
    left: isToggled2 ? '30px' : '4px', // Adjust the positioning as needed
    bottom: '4px', // Adjust the positioning as needed
    backgroundColor: 'white', // Color of the switch
    transition: 'left 0.4s ease, background-color 0.4s ease', // Added transition properties
    borderRadius: '50%', // To make the switch round
  };
  return (
   
      <div>
      {/* First Toggle switch */}
      <label style={switchContainerStyle} className="switch">
        <input type="checkbox" checked={isToggled1} onChange={toggleSwitch1} />
        <span style={{ ...sliderStyle, backgroundColor: isToggled1 ? '#2196F3' : '#ccc' }}>
          <span style={sliderBeforeStyle}></span>
        </span>
      </label>

      {/* Second Toggle switch */}
      <label style={switchContainerStyle} className="switch">
        <input type="checkbox" checked={isToggled2} onChange={toggleSwitch2} disabled={!isToggled1} />
        <span style={{ ...sliderStyle, backgroundColor: isToggled2 ? '#2196F3' : '#ccc' }}>
          <span style={sliderBeforeStyle2}></span>
        </span>
      </label>

      {/* Status text for End */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', marginRight: '15px', marginLeft: '5px' }}>
        <span style={{}}>{isToggled1 ? 'STOP' : 'START'}</span>
        <span style={{}}>{isToggled2 ? 'REVERT' : 'FINISH '}</span>
      </div>
    </div>
  );
}


export default Dashboard;
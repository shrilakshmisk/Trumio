import { Autocomplete, TextField, Button, Card } from "@mui/material";
import { useState, useEffect } from "react";
import {getApps, updateProject} from "@/callbacks/client"


const Project = ({ project, setProject, installedAppsData, isExpanded, onToggleMilestones }) => {
        const [hoveredIndex, setHoveredIndex] = useState(null);
      	const [displayed, setDisplayed] = useState(project.apps);
      	const [toAdd, setToAdd] = useState([]);
      	console.log("apps")
      	console.log(project.apps)
        const handleDelete = (index) => {
        	let newapps = displayed.toSpliced(index, 1);
          setDisplayed(newapps);
          console.log("new project obj:");
          console.log({
	          		...project,
	          		apps:newapps
	    	});
          //send update project post request to change apps
          (async () => {
          	try {
          		
	          	await updateProject({
	          		...project,
	          		apps:newapps
	          	})
	          	setProject({
	          		...project,
	          		apps:newapps
	          	})
// 	          	fetchProjectAppsData();
// 	          	handleTabChange(null, curr);
	        } catch (error) {
	        	console.error(error);
	        }
          })();
        };
    	return (
		<div
		style={{
		  backgroundColor: '#FFFFFF',
		  borderRadius: '10px',
		  boxShadow: '0px 0px 5px 0px #D1D1D1',
		  marginTop: '20px',
		  padding: '10px',
		  display: 'flex',
		  justifyContent: 'space-between',
		  alignItems: 'center',
		  cursor: 'pointer',
		  position:"relative",
		}}
		>
			<div style={{width:"100%", height:"100%", position:"absolute"}} onClick={onToggleMilestones} />
			<div style={{minWidth: "50%"}}>
			  <h2>{project.name}</h2>
			  {isExpanded && (
				<div>
				  <p>APPS:</p>
				  <div>
					  {displayed.map((app, index) => (
	  					<span key={index} style={{ marginRight: '5px' }}>
						<div style={{ position: 'relative', display: 'inline-block' }}>
						  <button
							style={{
							  height: '40px',
							  paddingLeft: '20px',
							  paddingRight: '40px', // Increased paddingRight to accommodate the "x" button
							  margin: '10px',
							  borderRadius: '40px',
							  backgroundColor: index === hoveredIndex ? '#1977d2' : '#FFFFFF',
							  color: index === hoveredIndex ? '#FFFFFF' : '#1977d2',
							  border: `2px solid ${index === hoveredIndex ? '#FFFFFF' : '#1977d2'}`,
							  transition: 'background-color 0.3s ease, color 0.3s ease, border 0.3s ease',
							}}
						  >
							{app.app_name}
						  </button>
						  <button
							onClick={(event) => {
								handleDelete(index);
								event.stopPropagation();
							}}
							style={{
							  position: 'absolute',
							  top: '50%',
							  right: '15%', // Adjust as needed for positioning
							  transform: 'translateY(-60%)',
							  backgroundColor: '#FFFFFF',
							  color: '#DDD',
							  borderRadius: '50%',
							  border: 'none',
							  cursor: 'pointer',
							  display: 'block',
							  fontSize: '20px'
							}}
						  >
							x
						  </button>
						</div>
					  </span>))}
                  </div>
                  <Autocomplete 
						multiple 
						options={installedAppsData.filter(el => {
							//if name is already in displayed, don't add
							let arr = displayed.map(el => el.app_name)
							if (arr.includes(el.app_name)) return false;
							else return true;
						}).map(el => {
							delete el.image;
							el.approval_status = "approved";
							return el;
						})}
						getOptionLabel={(option) => option.app_name}
						value={toAdd}
						onChange={(e, value) => {setToAdd(value)}}
					renderInput={(params) => <TextField {...params} label="Applications to Permit" />}/>
					<Button variant="contained" onClick={()=>{
							if (toAdd == []) return
							let newapps = [...displayed, ...toAdd]
						  setDisplayed(newapps);
						  console.log("new project obj:");
						  console.log({
									...project,
									apps:newapps
							});
						  //send update project post request to change apps
						  (async () => {
							try {
				
								await updateProject({
									...project,
									apps:newapps
								})
								setToAdd([]);
								// fetchProjectAppsData();
// 								handleTabChange(null, curr);
							} catch (error) {
								console.error(error);
							}
						  })();
					}}>Add Applications</Button>
                </div>
              )}
            </div>
            <span style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>▶</span>
          </div>
        );
};

const Extensions = ({ teamid, project }) => {
    console.log(teamid);
    const [ext, setExt] = useState([
        {
            name: "extension 1",
            desc: "description 1",
            status: "enabled"
        },
        {
            name: "extension 2",
            desc: "description",
            status: "disabled"
        }
    ]);
    const [installedAppsData, setInstalledAppsData] = useState([]);
    useEffect(() => {
    	(async () => {
    		try {setInstalledAppsData(await getApps())} catch (error) {console.error(error)}
    	})();
    }, [])
    return (<div>{/*<div style={{
            width: "80%",
            display: "flex",
            gap: "10px",
            rowGap: "10px",
            padding: "10px"
        }}>
		{ext.map(el => (<Card>
				<h1>{el.name}</h1>
				<h5>{el.desc}</h5>
				<Button>View Details</Button>
				<Button>{el.status === "enabled" ? "Disable" : "Enable"}</Button>
			</Card>))}
	</div>*/}
	<Project project={project} installedAppsData={installedAppsData} isExpanded={true} onToggleMilestones={()=>{}} />
	
	</div>);
};
export default Extensions;

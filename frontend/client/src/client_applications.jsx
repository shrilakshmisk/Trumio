import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import { Autocomplete, Box, Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Link from 'next/link';



import AppCard from '@/HomeAppCard';
import StoreAppCard from '@/StoreAppCard';

import {getProjects, updateProject} from "@/callbacks/client"




// const installedAppsData = [
//     {
//         app_name: 'VSCode',
//         app_desc: 'Code editor',
//         image: 'https://imgs.search.brave.com/i_x3Xj7berzbEMNffR4YncVE-AcMw4MHEn6bVCps96c/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9sb2dv/dHlwLnVzL2ZpbGUv/dnMtY29kZS5zdmc.svg',
//     },
// ];

const globalAppsData = [
    {
        app_name: 'VSCode',
        app_desc: 'Code editor',
        image: 'https://imgs.search.brave.com/i_x3Xj7berzbEMNffR4YncVE-AcMw4MHEn6bVCps96c/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9sb2dv/dHlwLnVzL2ZpbGUv/dnMtY29kZS5zdmc.svg',
    },
    {
        app_name: 'Figma',
        app_desc: 'Designing app',
        image: 'https://imgs.search.brave.com/FdIGGfc3R9dZX9ggCvuTLVjuAb0LfOkNMSxiNmq0NrE/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9sb2dv/dHlwLnVzL2ZpbGUv/ZmlnbWEuc3Zn.svg',
    },
];


const AppGrid = () => {
    const [searchValue, setSearchValue] = useState('');
    const [curr, setCurr] = useState("Installed");
	const [installedAppsData, setInstalledAppsData] = useState([]);
    const [milestonesExpanded, setMilestonesExpanded] = useState({});
	const [filteredCards, setFilteredCards] = useState(installedAppsData); // Default to Installed section
	const [projectAppsData, setProjectAppsData] = useState([]);

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };
    
    const fetchProjectAppsData = async () => {
		try {
			setProjectAppsData((await getProjects()))
			console.log(projectAppsData);
		} catch (err) {
			console.error("Couldn't fetch project data", err)
		}
	};
	
	useEffect(() => {
		(async () => {try {
			let apps = await getApps();
			setInstalledAppsData(apps);
			setFilteredCards(apps);
		} catch (err) {console.error(err)}})();
	}, []); //on mount: get installed apps from DB
	
    useEffect(() => {
    	fetchProjectAppsData();
    }, [curr]); //on mount/when section changes: get project data for apps permissions data
    
    
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        // Filter cards based on the search value
        const filtered = getActiveSectionData().filter((card) => card.name.toLowerCase().includes(searchValue.toLowerCase()));
        setFilteredCards(filtered);
    };
    
    
    const handleTabChange = (event, newValue) => {
        setCurr(newValue);
        setFilteredCards(getActiveSectionData(newValue));
    };

    
    const handleMilestones = (projectName) => {
        setMilestonesExpanded((prev) => ({
          ...prev,
          [projectName]: !prev[projectName],
        }));
      };
      

    const getActiveSectionData = (section = curr) => {
        switch (section) {
            case 'Installed':
                return installedAppsData;
            case 'Permissions':
                return projectAppsData.map(el => (
                	{
                	...el,
                	apps: el.apps.filter(app => app.approval_status === "approved")
                	}
                ))
            case 'Requests':
                return projectAppsData.map(el => (
                	{
                	...el,
                	apps: el.apps.filter(app => app.approval_status === "requested")
                	}
                )).filter(el => el.apps.length > 0);
            case 'Global':
                return globalAppsData;
            default:
                return [];
        }
    };

    const ProjectList = ({ projects }) => (
        <div>
          {projects.map((project, index) => (
            <Project
              key={index}
              project={project}
              isExpanded={milestonesExpanded[project.name]}
              onToggleMilestones={() => handleMilestones(project.name)}
              
            />
            
          ))}
          
        </div>
      );
      
      
      const Project = ({ project, isExpanded, onToggleMilestones }) => {
        const [hoveredIndex, setHoveredIndex] = React.useState(null);
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
	
	const RequestsAppCard = ({ linkTo, app_name = 'Lizard', app_desc, image, index, project }) => {
		return (<Card sx={{ maxWidth: 345, height: '100%', borderRadius: "10px", boxShadow: "0px 0px 5px 0px #D1D1D1" }}>
		  {image != undefined ? <CardMedia component="img" alt="Card image" height="250" image={image}/> : ""}
		  <CardContent>
			<Typography gutterBottom variant="h5" component="div">
			{name}
			</Typography>
			<Typography variant="body2" color="text.secondary">
			Project 1
			</Typography>
		  </CardContent>
		  <CardActions>
			<Button variant="contained" onClick={async () => {
				let newapps = project.apps
				newapps[project.apps.findIndex(el => el.app_name === app_name)].approval_status = "approved";
				try {
					let resp = await updateProject({
						...project,
						apps: newapps
					})
				} catch (err) {
					console.error(err)
				}
				setFilteredCards(filteredCards.toSpliced(index, 1)); //remove this card from filtered cards
			}}>Accept</Button> 
			<Button variant="contained" onClick={async () => {
				let newapps = project.apps.filter(el => el.app_name != app_name)
				try {
					let resp = await updateProject({
						...project,
						apps: newapps
					});
					if (resp.status != 200) throw new Error(`status code ${resp.status}`)
				} catch (err) {
					console.error(err);
				}
				setFilteredCards(filteredCards.toSpliced(index, 1)); //remove this card from filtered cards
				}}>Deny</Button>
			//once call goes through, remove self from filtered cards using index
		  </CardActions>
		</Card>);
	};




    return (
        <div style={{
            backgroundColor: "#f6f6f6",
            minHeight: '100vh'
        }}>
            <Container maxWidth="xl">
                <Box border="1px solid #ddd" boxShadow={"0px 0px 5px 0px #D1D1D1"} borderRadius="10px" p={2} sx={{ backgroundColor: "#FBF8F8" }}>
                <div style={{ height: '50px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    {/* Section Tabs */}
    <div style={{ display: 'flex' }}>
        <Button variant={curr === 'Installed' ? 'contained' : 'outlined'} onClick={() => handleTabChange({}, 'Installed')} style={{ marginRight: '8px', width: '150px', borderRadius: '40px' }}>
            Installed
        </Button>
        <Button variant={curr === 'Permissions' ? 'contained' : 'outlined'} onClick={() => handleTabChange({}, 'Permissions')} style={{ marginRight: '8px', width: '150px', borderRadius: '40px' }}>
            Permissions
        </Button>
        <Button variant={curr === 'Requests' ? 'contained' : 'outlined'} onClick={() => handleTabChange({}, 'Requests')} style={{ marginRight: '8px', width: '150px', borderRadius: '40px' }}>
            Requests
        </Button>
        <Button variant={curr === 'Global' ? 'contained' : 'outlined'} onClick={() => handleTabChange({}, 'Global')} style={{ width: '150px', borderRadius: '40px' }}>
            Global
        </Button>
    </div>

    <Box display="flex" alignItems="center">
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', marginRight: '8px' }}>
            <div style={{ position: 'relative' }}>
                <IconButton type="submit" sx={{ p: '10px' }}>
                    <SearchIcon />
                </IconButton>
                <TextField label="Search..." value={searchValue} onChange={handleSearchChange} sx={{ ml: 1, width: '200px', borderRadius: '20px' }} />
            </div>
        </form>
        <Button style={{ width: '150px', height: '60px',borderRadius: '40px', backgroundColor: '#1977d2', color: '#fff' }}>
            Magic Search
        </Button>
    </Box>
</div>
                            
                        
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                {filteredCards.map((card, index) => (
                                    <Grid item key={index} xs={12} sm={6} md={4}>
                                        {/* Use the dynamically determined card component with explicit props */}
                                        {curr == "Installed" && (
                                            <AppCard linkTo={`/client/app?id=${card.name}`} {...card} image={card.image} />
                                        )}
                                        
                                        {curr == "Requests" && (
                                            <RequestsAppCard linkTo={`/client/app?id=${card.name}`} name={card.name} description={card.description} image={card.image} index={index}/>
                                        )}
                                        {curr == "Global" && (
                                            <StoreAppCard linkTo={`/client/app?id=${card.name}`} {...card} image={card.image} />
                                        )}
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>

                        {curr === "Permissions" && (
                                            <>
 <div>
      <ProjectList projects={filteredCards} />
    </div>

                                            </>
                                        )}
                   
                </Box>
            </Container>
        </div>
    );
};
export default AppGrid;
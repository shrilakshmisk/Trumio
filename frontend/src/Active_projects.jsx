import React, {useState, useEffect} from "react";
import { Autocomplete, Card, Button, Container, Box, Grid, Dialog, TextField } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import dayjs from "dayjs";
import Link from "next/link";

const ActiveProjects = ({ projects }) => { 
	const [open, setOpen] = useState(false);
	const [users, setUsers] = useState([]);
	const [apps, setApps] = useState([]);
	const [projDet, setProj] = useState({
		name: "",
		project_desc:"",
		milestones: [],
		team:[],
		apps:[]
	});
	useEffect(() => {
		setUsers(["user0","user1","user2"]);
		setApps(["VSCode"]);
	}, []); //on mount, get list of usernames and apps

	return (
  <div style={{ display: 'flex', overflowY: 'auto', maxHeight: '90vh' }}>
  <Dialog open={open} onClose={() => {setOpen(false)}} fullWidth>
	<LocalizationProvider dateAdapter={AdapterDayjs}>
  <Card style={{display:"flex", flexDirection:"column", flexWrap:"nowrap", gap:"10px", padding:"20px"}}>
  	<h1>Create New Project</h1>
  	<TextField label="Project Name" value={projDet.name} onChange={e => {setProj({...projDet, name:e.target.value})}}/>
  	<TextField multiline label="Project Description" value={projDet.project_desc} onChange={e => {setProj({...projDet, project_desc:e.target.value})}}/>
  	<div style={{display:"flex", justifyContent:"start", alignItems:"center", gap:"10px"}}>
  		<h3>Milestones</h3>
  		<Button variant="contained" onClick={() => {
  			//
  		}}>Auto-Generate</Button>
  	</div>
  	{projDet.milestones.map((el, idx) =>
  	(<>
  	<span style={{display:"flex", alignItems:"center"}}>
  		<TextField style={{flexGrow:"1"}} autoFocus label={`Milestone ${idx + 1}`} key={idx} value={el.milestone_desc} onChange={e => {setProj({
  		...projDet,
  		milestones:[...projDet.milestones.slice(0, idx), {milestone_desc:e.target.value, completion_date:el.completion_date}, ...projDet.milestones.slice(idx + 1)
  		]
  	})}}/>
  		<CloseRoundedIcon style={{height:"40px", width:"40px", cursor:"pointer"}} onClick={() => {
  		setProj({
  			...projDet,
  			milestones:[...projDet.milestones.slice(0,idx), ...projDet.milestones.slice(idx + 1)]
  		})
  	}}/>
  	</span>
  	<DateField label="Completion Date" value={dayjs(el.completion_date)} onChange={(newVal) => {
  		setProj({
  			...projDet,
  			milestones: [
  				...projDet.milestones.slice(0, idx),
  				{
  					milestone_desc:el.milestone_desc,
  					completion_date: newVal.format("YYYY/MM/DD")
  				},
  				...projDet.milestones.slice(idx+1)
  			]
  		})
  	}} />
  	</>))}
  	<TextField label="New Milestone" onFocus={() => {
  		//milestones has to be an array of React elements so that we can focus the latest one
  		setProj({...projDet,milestones:[...projDet.milestones, {milestone_desc:"", completion_date:dayjs().format("YYYY/MM/DD")}]})
  	}}/>
  	<Autocomplete multiple options={users}
  	renderInput={(params) => <TextField {...params} label="Team Members" />}/>
  	<Autocomplete multiple options={apps}
  	renderInput={(params) => <TextField {...params} label="Allowed Applications" />}/>
  	<Button onClick={() => {
  		//send projDet to backend
  	}} variant="contained">Create</Button>
  </Card>
  </LocalizationProvider>
  </Dialog>
  <div style={{ flex: '0 0 63%', maxWidth: '63%', marginRight: '16px', marginTop: '16px', backgroundColor: "#FBF8F8", boxShadow: "0px 0px 5px 0px #D1D1D1", padding: '16px', borderRadius: '10px', overflowY: 'auto' }}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
      <h1>Active projects</h1>
      <Button sx={{height:"50px", borderRadius:"50px"}} variant="contained" onClick={() => {setOpen(true)}}>New Project</Button>
      </div>
      <Grid container spacing={3}>
        {projects.map((el, idx) => (
          <Grid item key={idx} xs={12} sm={6} md={4} lg={4}>
            <Card
              sx={{
                width: "100%", // Adjust card width to 100% of the container
                height: "350px",
                borderRadius: "10px",
                boxShadow: "0px 0px 5px 0px #D1D1D1",
                margin: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box textAlign="center">
                <h1>{el.name}</h1>
                <h5 color="grey">{el.text}</h5>
              </Box>
              <Box textAlign="center" pb={2}>
                <Link href={`/client/instance?id=${idx}`} passHref>
                  <Button variant="contained">View details</Button>
                </Link>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
  </div>

<div style={{ flex: '0 0 32%', maxWidth: '32%',maxHeight: '100vh', marginRight: '32px', marginLeft: 'auto', backgroundColor: "#FBF8F8", boxShadow: "0px 0px 5px 0px #D1D1D1", padding: '16px', borderRadius: '10px', overflowY: 'auto' }}>
{/* Card 1 */}
<Box border="1px solid #ddd" borderRadius="10px" p={2} sx={{ backgroundColor: "#FFFFFF", maxWidth: '100%', boxShadow: "0px 0px 5px 0px #D1D1D1" }}>
  <h2>Next Milestone Deadline</h2>
  <p style={{ fontSize: '20px' }}>Name: <span style={{ fontSize: '14px' }}>Project 1</span></p>
  <p style={{ fontSize: '20px' }}>Deadline: <span style={{ fontSize: '14px' }}>2021-10-20</span></p>
  <p style={{ fontSize: '20px' }}>Time: <span style={{ fontSize: '14px' }}>2d 3h 5m</span></p>
</Box>

<Box border="1px solid #ddd" borderRadius="10px" p={2} sx={{ backgroundColor: "#FFFFFF", maxWidth: '100%', boxShadow: "0px 0px 5px 0px #D1D1D1" }}>
  <h2>Recived Payments</h2>
  <p style={{ fontSize: '40px', textAlign:'center' }}> $2000</p>
 
</Box>
</div>
</div>

);
}
export default ActiveProjects;
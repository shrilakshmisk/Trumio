import axios from "axios";
import React, {useState, useEffect} from "react";
import { Autocomplete, Card, Button, Container, Box, Grid, Dialog, TextField } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import dayjs from "dayjs";
import Link from "next/link";
import {createProject, getUsers, generateMilestones} from "@/callbacks/client";

const ActiveProjects = ({ projects }) => { 
	const [open, setOpen] = useState(false);
	const [buttonText, setButtonText] = useState("Create");
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
		(async () => {
			try {
				setUsers(await getUsers());
				setApps([{app_name:"VSCode", app_desc:"desc"}]);
// 				setApps((await axios.get(`${process.env.NEXT_PUBLIC_SERVER_CONTROLLER}/getApps`)).data)
			} catch (err) {
				console.error(err)
			}
		})();
	}, []); //on mount, get list of usernames and apps

	return (
  <div>
  
  <Dialog open={open} onClose={() => {setOpen(false); setButtonText("Create")}} fullWidth>
	<LocalizationProvider dateAdapter={AdapterDayjs}>
  <Card style={{display:"flex", flexDirection:"column", flexWrap:"nowrap", gap:"10px", padding:"20px", overflowY:"auto"}}>
  	<h1>Create New Project</h1>
  	<TextField label="Project Name" value={projDet.name} onChange={e => {setProj({...projDet, name:e.target.value})}}/>
  	<TextField multiline label="Project Description" value={projDet.project_desc} onChange={e => {setProj({...projDet, project_desc:e.target.value})}}/>
  	<div style={{display:"flex", justifyContent:"start", alignItems:"center", gap:"10px"}}>
  		<h3>Milestones</h3>
  		<Button variant="contained" onClick={async () => {
  			try {
  				let data = await generateMilestones(projDet);
  				//resp.data = milestones: {}...
  				setProj({
  					...projDet,
  					milestones: data.milestones
  				})
  			} catch (err) {
  				console.error(err);
  			}
  		}}>Generate using AI</Button>
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
  			milestones:projDet.milestones.toSpliced(idx, 1)
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
  		setProj({...projDet,milestones:[...projDet.milestones, {milestone_desc:"", completion_date:dayjs().format("YYYY/MM/DD"), tasks:[]}]})
  	}}/>
  	<Autocomplete 
  		multiple 
  		options={users}
  		getOptionLabel={(option) => option.username}
  		onChange={(e, value) => {setProj({
  		...projDet,
  		team: value
  	})}}
  	renderInput={(params) => <TextField {...params} label="Team Members" />}/>
  	<Autocomplete 
  		multiple 
  		options={apps}
  		getOptionLabel={(option) => option.app_name}
  		onChange={(e, value) => {setProj({
  		...projDet,
  		apps: value
  	})}}
  	renderInput={(params) => <TextField {...params} label="Allowed Applications" />}/>
  	<Button onClick={async () => {
		setButtonText("Loading...");
  		//find max id
  		let max_id = 0
  		for (const proj of projects) {
  			if (Number(proj.project_id) > max_id) max_id = Number(proj.project_id)
  		}
  		console.log("max_id:",max_id)
  		let submit = {
  			...projDet,
  			milestones:projDet.milestones.map((el, idx) => ({...el, milestone_id:String(idx + 1)})),
  			apps:projDet.apps.map(el => ({
  				...el,
  				approval_status:"approved",
  			})),
  			project_id: String(max_id+1)
  		};
  		try {
  			await createProject(submit);
  		} catch (err) {
  			console.error(err);
  		}
  		setButtonText("Create")
  		setOpen(false)
  		setProj({
		name: "",
		project_desc:"",
		milestones: [],
		team:[],
		apps:[]
		})
		window.location.reload()
  	}} variant="contained">{buttonText}</Button>
  </Card>
  </LocalizationProvider>
  </Dialog>
  
  
  <div style={{backgroundColor: "#FBF8F8", boxShadow: "0px 0px 5px 0px #D1D1D1", padding: '16px', borderRadius: '10px' }}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
      <h1>Active projects</h1>
      <Button sx={{height:"50px", borderRadius:"50px"}} variant="contained" onClick={() => {setOpen(true)}}>New Project</Button>
      </div>
      <Grid container spacing={3}>
        {projects.map((el, idx) => (
          <Grid item key={idx} xs={12} sm={6} md={4} lg={3}>
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
                <h5 color="grey">{el.project_desc}</h5>
              </Box>
              <Box textAlign="center" pb={2}>
                <Link href={`/client/instance?id=${el.project_id}`} passHref>
                  <Button variant="contained">View details</Button>
                </Link>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
  </div>
</div>

);
}
export default ActiveProjects;
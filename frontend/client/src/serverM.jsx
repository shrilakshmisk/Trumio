import axios from 'axios';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, Dialog, DialogTitle } from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import Extensions from "@/client_extensions";
import { startTeamServer, stopTeamServer, getApps } from '@/callbacks/client';
import Logs from '@/logs';
// import Storage from "./client_storage";

//this used to be client_instance.tsx

export default function Inst(props) {
    const [id, setId] = useState(-1);
    const [started, setStarted] = useState(false);
    const [extDiag, toggleExtDiag] = useState(false);
    // const [filesDiag, toggleFilesDiag] = useState(false);
//     const [files, setFiles] = useState([]);
//     const [folderChain, setChain] = useState([]);
    const url = "google.com";
    
    useEffect(() => {
    	setId((new URLSearchParams(window.location.search)).get("id"));
    }, []);
    
    useEffect(() => {
        //on mount: check if server on or not by querying server controller (i.e. this)
        (async () => {
        console.log("Getting all servers")
        try {
			let resp = (await axios.get(`${process.env.NEXT_PUBLIC_SERVER_CONTROLLER}/servers`)).data;
			if (id in Object.keys(resp)) setStarted(true)
		}
		catch (error) {
			console.error('Could not reach server controller:', error);
		}
        })();
    }, [id]);
    const handleButtonClick = async () => {
        try {
            if (id !== undefined) {
                if (started) {
                    // Force Stop
                    await stopTeamServer(parseInt(id));
                }
                else {
                    // Start
                    await startTeamServer(parseInt(id));
                }
                // Update the state after successful request
                setStarted(!started);
            }
        }
        catch (error) {
            console.error('Error:', error);
            // Handle the error as needed
        }
    };
    return (<div style={{
            width: "100vw",
            minHeight: "100vh",
            backgroundColor: "#f6f6f6"
        }}>
			<Card sx={{
            display: "flex",
            flexDirection: "column",
            flexWrap:"nowrap",
            alignItems: "start",
            gap: "10px",
            width: "80%",
//             height: "80%",
            margin: "auto",
            padding: 2,
        }}>
        		{(id !== -1) && <>
				<span>
					{/*<Button 
						variant="contained" 
						style={{ display: "inline" }} 
						onClick={() => { window.history.back();}}>
						Back
					</Button>*/}
					<h1 style={{ display: "inline", marginLeft: "30px" }}>{`Team ${id} server`}</h1>
				</span>
				<Button 
					variant="contained" 
					onClick={() => { toggleExtDiag(true); }}>
					Configure approved apps
				</Button>
				{/*{<Button onClick={() => {toggleFilesDiag(!filesDiag)}}>View files</Button>}*/}
				<Dialog open={extDiag} onClose={() => { toggleExtDiag(!extDiag); }} fullWidth={true} maxWidth="lg">
					<Box sx={{ width: "100%" }}>
					<DialogTitle>Team {id} apps</DialogTitle>
					{id !== undefined ? (<Extensions project={props.project}/>) : (
        // Optional: Render something else or nothing when id is undefined
        null)}
					</Box>
				</Dialog>
				{/*<Dialog open={filesDiag} onClose={() => {toggleFilesDiag(!filesDiag)}} fullWidth={true} maxWidth="lg">
                            <Box sx={{width: "100%"}}>
                            <DialogTitle>Team {id} files</DialogTitle>
                            <Storage teamid={id}/>
                            </Box>
                        </Dialog>*/}
				{/*<Box sx={{ width: "100%" }}>
				<h2>Team Files</h2>
				<FullFileBrowser files={files} folderChain={folderChain}/>
				</Box>*/}
				<Accordion sx={{ width: "100%" }}>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}><h5>Advanced Configuration</h5></AccordionSummary>
				<AccordionDetails>
				<Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            gap: "10px",
            width: "100%",
        }}>
				<h3>URL to server: {url}</h3>
				<h3>Logs: </h3>
				{((id !== -1) && (id !== undefined) && (started)) ? (
        // Parse id to a number and pass it to teamid
        <Logs teamID={parseInt(id)}/>) : (
        // Optional: Render something else or nothing when id is undefined
        null)}
				<Button variant="contained" onClick={handleButtonClick}>{started ? "Force Stop" : "Start"}</Button>
				</Box>
				</AccordionDetails>
				</Accordion>
			</>}
			</Card>
		</div>);
}

export { Inst };
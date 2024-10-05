import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, Typography, Button, Paper, Grid, } from '@mui/material';
export default function ClientAppInstance(props) {
    const [id, setId] = useState(-1);
    const [started, setStarted] = useState(false);
    const [diag, toggleDiag] = useState(false);
    const url = "google.com";
    
    useEffect(() => {
    	setId((new URLSearchParams(window.location.search)).get("id"));
    }, []);
    
    return (<div style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#f6f6f6"
        }}>
			<Card sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            gap: "10px",
            width: "80%",
            height: "80%",
            margin: "auto",
            padding: 2,
        }}>
				{(id !== -1) && <>
				<span>
					<Link href={"/client/dashboard"}><Button variant="contained" style={{ display: "inline" }}>Back</Button></Link>
					<h1 style={{ display: "inline", marginLeft: "30px" }}>{`${id}`}</h1>
				</span>
				<Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
					<Grid container spacing={3}>
						<Grid item xs={12}>
						<Typography variant="h4">My Awesome App</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
						<Card>
							<CardContent>
							<Typography variant="h5" component="div">
								App Features
							</Typography>
							<Typography variant="body2" color="text.secondary">
								- Feature 1
								<br />
								- Feature 2
								<br />
								- Feature 3
							</Typography>
							</CardContent>
						</Card>
						</Grid>
						<Grid item xs={12} sm={6}>
						<Card>
							<CardContent>
							<Typography variant="h5" component="div">
								Description
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Welcome to my awesome app! This is a sample description of what
								makes this app great. You can customize this section with your
								specific details.
							</Typography>
							</CardContent>
						</Card>
						</Grid>
						<Grid item xs={12}>
						<Button variant="contained" color="primary">
							Install Now
						</Button>
						</Grid>
					</Grid>
				</Paper>
				{/* <Button variant="contained" onClick={() => {toggleDiag(true)}}>Configure installed extensions</Button>
        <Dialog open={diag} onClose={()=>{toggleDiag(!diag)}} fullWidth={true} maxWidth="lg">
            <Box sx={{width: "100%"}}>
            <DialogTitle>Team {id} server extensions</DialogTitle>
            </Box>
        </Dialog> */}
				{/* <Accordion sx={{width:"100%"}}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><h5>Advanced Configuration</h5></AccordionSummary>
        <AccordionDetails>
        <Box sx={{
            display:"flex",
            flexDirection:"column",
            alignItems:"start",
            gap:"10px",
            width:"100%",
        }}>
        <h3>URL to server: {url}</h3>
        <h3>Logs: </h3>
        <Logs />
        <Button variant="contained" onClick={() => setStarted(!started)}>{started ? "Force Stop" : "Start"}</Button>
        </Box>
        </AccordionDetails>
        </Accordion> */}
        	</>}
			</Card>
		</div>);
}

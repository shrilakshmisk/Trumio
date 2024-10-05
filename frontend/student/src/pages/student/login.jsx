import React, { useState } from 'react';
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material"


export default function SignInSide() {
	// console.log(` ${process.env.NEXT_PUBLIC_STUDENT_SERVER}`);
    const [loginError, setLoginError] = useState(false);
//     const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const creds = {
                    team: data.get("team"),
                    username: data.get("username"),
                    password: data.get("password"),
                }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_STUDENT_SERVER}/api/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({
                    team: data.get("team"),
                    username: data.get("username"),
                    password: data.get("password"),
                }),
            });
            if (response.ok) {
                setLoginError(false);
                if (typeof window !== undefined) {//put credentials into localstorage
                	localStorage.setItem("creds", creds)
                }
                // Redirect to /student/dashboard upon successful login
                window.location.assign('/student/dashboard/');
            }
            else {
                setLoginError(true);
            }
        }
        catch (error) {
            console.error('Error during login:', error);
            setLoginError(true);
        }
    };
    return (<Container component="main" maxWidth="90vh">
    <Box sx={{ marginTop: 8, display: 'flex', height: '90vh' }}>

        <Box sx={{
            flexBasis: '50%',
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 1,
        }}>
          <Box sx={{
            backgroundColor:'#f1f9fe',
            width:'60%',
            height: '130%',
            display: "flex",
            flexDirection: "column",

            justifyContent: "center",
            borderRadius: '40px',
            boxShadow: '4px 4px 10px #D1D1D1',
        }}>
          <div> <img src="/assets/logo.jpg" marginTop="20px" alt="Company Logo" width="250px" height="60px" borderRadius="50%" /></div>
            <CssBaseline />
            
            <Typography component="h1" variant="h5" align='center'>
                Sign in
            </Typography>
            <form noValidate onSubmit={handleSubmit} style={{ height: "100%" }}>
                <TextField margin="normal" required fullWidth id="team" label="Team" name="team" autoComplete="team" autoFocus />
                <TextField margin="normal" required fullWidth id="username" label="Username" name="username" autoComplete="username" autoFocus />
                <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Sign In
                </Button>
            </form>
            </Box>
        </Box>

        <Box sx={{
            flexBasis: '50%',
            backgroundImage: 'url("/assets/login_image.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxHeight: '900vh',
            maxWidth: '100vh',
            marginRight: '0'
        }}>
        </Box>

    </Box>
</Container>
);
}

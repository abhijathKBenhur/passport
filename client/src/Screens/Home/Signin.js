import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useHistory } from "react-router-dom";


const theme = createTheme();

export default function SignInSide() {
  const [signUp, setSignUp] = React.useState(false)
  const history = useHistory();


  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    history.push("/configure")
    if(signUp){
      
    }else{
      
    }
  };

  
  const login = () =>{
    
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundColor: "#F1F1F1",
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span>PASSPORT</span>
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
            {signUp? "Register" : "Login"}
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              {signUp && <TextField
                margin="normal"
                required
                fullWidth
                name="Company"
                label="Company"
                id="Company"
                autoComplete="Company name"
              />}
             
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => {

                }}
              >
                {signUp? "Register" : "Login"}
              </Button>
              <Grid container>
                <Grid item xs>
                  
                </Grid>
                <Grid item>
                { signUp ? <Link onClick={() => {
                    setSignUp(false)
                  }} variant="body2">
                    {"Already have an account? Login"}
                  </Link>
                  :
                  <Link onClick={() => {
                    setSignUp(true)
                  }} variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                }
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
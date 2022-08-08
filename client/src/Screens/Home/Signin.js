import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useHistory } from "react-router-dom";
import AuthInterface from "../../Interfaces/AuthInterface";
import CONSTANTS from "../../commons/Constants";
import { useSnackbar } from 'react-simple-snackbar'

const theme = createTheme();

export default function SignInSide() {
  const [signUp, setSignUp] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(false);
  const [mailSent, setMailSent] = React.useState(false);
  const [formData, setFormData] = React.useState({});
  const [openSnackbar, closeSnackbar] = useSnackbar()
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const submitData = Object.fromEntries(data);
    let validation = validate(submitData);
    
    if (signUp) {
      if(mailSent){
        AuthInterface.register({...formData,...submitData}).then((success) => {
          console.log(success);
          sessionStorage.setItem(CONSTANTS.SESSION_KEYS.PASSPORT_TOKEN,success?.data?.token);
          history.push("/dashboard")
        });
      }else{
        if(!validation.valid){
          setErrorMessage(validation.message)
          return;
        }
        setMailSent(true)
        setFormData(submitData)
        openSnackbar("Verification code will be sent to the mail address.", 10000)
        setErrorMessage("")
        AuthInterface.verify(submitData).then((success) => {
          if(success?.data.success){
          }else{
            openSnackbar("Sorry! We were unable to share you the verification code to the mail address", 5000)
          }
        });
      }
    } else {
      AuthInterface.signIn(submitData).then((success) => {
        console.log("Login succesfully");
      });
    }
  };

  const validate = (submitData) =>{
    let valid = true;
    let message = ""
    if(!String(submitData.email).toLowerCase()
      .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    ){
      valid = false;
      message = "Invalid mail ID"
    }
    if(!String(submitData.password).match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)){
      valid = false;
      message = "Password should have atleast one numner and one special charecter"
    }
    if(!submitData.Company || submitData.Company.length == 0){
      valid = false;
      message = "Please provide the company name"
    }
    return {
      valid,
      message
    };
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundColor: "#F1F1F1",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span>PASSPORT</span>
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {signUp ? "Register" : "Login"}
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                disabled={mailSent}
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
                disabled={mailSent}
              />
              {signUp && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="Company"
                  label="Company"
                  id="Company"
                  autoComplete="Company name"
                  disabled={mailSent}
                />
              )}
              {mailSent && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="tenantId"
                  label="Verification Code"
                  id="tenantId"
                  autoComplete="Verification Code"
                />
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => {}}
              >
                {signUp ? 
                  mailSent? "Register" :"Verify" 
                : "Login"}
              </Button>
              <Grid container>
              <Grid item xs>
                  <span style={{color:"red"}}>
                    {errorMessage}
                  </span>
                </Grid>
                <Grid item>
                  {signUp ? (
                    <Link
                      onClick={() => {
                        setSignUp(false);
                      }}
                      variant="body2"
                    >
                      {"Already have an account? Login"}
                    </Link>
                  ) : (
                    <Link
                      onClick={() => {
                        setSignUp(true);
                      }}
                      variant="body2"
                    >
                      {"Don't have an account? Sign Up"}
                    </Link>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

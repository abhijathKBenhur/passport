import * as React from "react";
import {useEffect} from "react";
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
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useSnackbar } from "react-simple-snackbar";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

const theme = createTheme();

export default function Login() {
  const [signUp, setSignUp] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(false);
  const [mailSent, setMailSent] = React.useState(false);
  const [formData, setFormData] = React.useState({});
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const options = [
    {
      text: 'I am an individual',
      value: 'individual'
    },
    {
      value: 'startup',
      text:'I represent a startup'
    }];

  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };


  useEffect(() => {
    checkForSession()
  }, []);


  const checkForSession = () =>{
    let token = sessionStorage.getItem("PASSPORT_TOKEN");
    AuthInterface.validate({ token })
    .then((success) => {
      history.push("/console");
    })
    .catch((err) => {
    });
  }


  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const submitData = Object.fromEntries(data);
    submitData["userType"] = options[selectedIndex].value
    let validation = validate(submitData);

    if (signUp) {
      if (mailSent) {
        AuthInterface.register({ ...formData, ...submitData }).then(
          (success) => {
            console.log(success);
            sessionStorage.setItem("PASSPORT_TOKEN", success?.data?.token);
            history.push("/console");
          }
        );
      } else {
        if (!validation.valid) {
          setErrorMessage(validation.message);
          return;
        }
        setMailSent(true);
        setFormData(submitData);
        openSnackbar(
          "Verification code will be sent to the mail address.",
          10000
        );
        setErrorMessage("");
        AuthInterface.verify(submitData).then((success) => {
          if (success?.data.success) {
          } else {
            openSnackbar(
              "Sorry! We were unable to share you the verification code to the mail address",
              5000
            );
          }
        });
      }
    } else {
      AuthInterface.login(submitData)
        .then((success) => {
          console.log("Login succesful");
          sessionStorage.setItem("PASSPORT_TOKEN", success?.data?.token);
          history.push("/console");
        })
        .catch((error) => {
          openSnackbar("Sorry! Please use a valid credentials to login", 5000);
        });
    }
  };

  const validate = (submitData) => {
    let valid = true;
    let message = "";
    if (
      !String(submitData.email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      valid = false;
      message = "Invalid mail ID";
    }
    if (
      !String(submitData.password).match(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
      )
    ) {
      valid = false;
      message =
        "Password should have atleast one numner and one special charecter";
    }
    if ((!submitData.companyName || submitData.companyName.length == 0) && submitData.userType == "startup") {
      valid = false;
      message = "Please provide the company name";
    }
    return {
      valid,
      message,
    };
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          square
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
              {signUp && options[selectedIndex].value == "startup" ? (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="companyName"
                  label="company Name"
                  id="companyName"
                  disabled={mailSent}
                />
              ) : (
                <div></div>
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
              {
              <div>
                <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button" fullWidth>
                <Button onClick={handleClick} sx={{pl:2, justifyContent:"flex-start"}}>
                  <span align="left">{options[selectedIndex].text}</span>
                </Button>
                <Button
                  style={{maxWidth:"80px"}}
                  size="small"
                  aria-controls={open ? 'split-button-menu' : undefined}
                  aria-expanded={open ? 'true' : undefined}
                  aria-label="select merge strategy"
                  aria-haspopup="menu"
                  onClick={handleToggle}
                >
                  <ArrowDropDownIcon />
                </Button>
              </ButtonGroup>
              <Popper
              fullWidth
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper fullWidth>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList fullWidth id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      fullWidth
                      key={option}
                      disabled={index === 2}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option.text}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper></div>}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: (t) =>
                    t.palette.mode === "lidarkght"
                      ? t.palette.grey[50]
                      : t.palette.grey[900],
                }}
              >
                {signUp ? (mailSent ? "Register" : "Verify") : "Login"}
              </Button>
              <Grid container>
                <Grid item style={{cursor:"pointer"}}>
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
              <Grid container>
                <Grid item xs>
                  <span style={{ color: "red" }}>{errorMessage}</span>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
        <Grid
          square
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignContent: "center",
            alignItems: "center",
          }}
          component={Paper}
          elevation={6}
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            height: "100vh",
            paddingLeft: "30px",
            backgroundColor: (t) =>
              t.palette.mode === "lidarkght"
                ? t.palette.grey[50]
                : t.palette.grey[900],
          }}
        >
          <div style={{ color: "#F1F1F1" }}>
            <Typography variant="h2"> TRIBEGOLD </Typography>
            <Typography variant="h5" component="h2">
              A revolutionary, NEW way to drive user adoption
            </Typography>
            <Typography variant="h6" gutterBottom>
              h6 gutter bottom
            </Typography>
          </div>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

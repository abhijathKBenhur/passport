    import * as React from "react";
    import { useEffect } from "react";
    import { Button, Container, CssBaseline } from "@mui/material";
    import TextField from "@mui/material/TextField";
    import Link from "@mui/material/Link";
    import Box from "@mui/material/Box";
    import Grid from "@mui/material/Grid";
    import { Typography, Toolbar, AppBar } from "@mui/material";
    import { createTheme, ThemeProvider } from "@mui/material/styles";
    import { useHistory } from "react-router-dom";
    import AuthInterface from "../../Interfaces/AuthInterface";
    import { useSnackbar } from "react-simple-snackbar";
    import _ from "lodash";

    const theme = createTheme();

    export default function LoginForm(props) {
      const [signUp, setSignUp] = React.useState(false);
      const [errorMessage, setErrorMessage] = React.useState(false);
      const [mailSent, setMailSent] = React.useState(false);
      const [hasInvite, setHasInvite] = React.useState(false);
      const [formData, setFormData] = React.useState({});
      const [openSnackbar, closeSnackbar] = useSnackbar();
      const anchorRef = React.useRef(null);
      const [selectedIndex, setSelectedIndex] = React.useState(1);

      const style = {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
      };

      useEffect(() => {
        checkForSession();
      }, []);

      const checkForSession = () => {
        let token = sessionStorage.getItem("PASSPORT_TOKEN");
        AuthInterface.validate({ token })
          .then((success) => {
            history.push("/console");
          })
          .catch((err) => {});
      };

      const history = useHistory();

      const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const submitData = Object.fromEntries(data);
        submitData["userType"] = _.get(props.history,"location.state.type");
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
        if (
          (!submitData.companyName || submitData.companyName.length == 0) &&
          submitData.userType == "corporate"
        ) {
          valid = false;
          message = "Please provide the company name";
        }
        return {
          valid,
          message,
        };
      };

      const darkTheme = createTheme({
        palette: {
          mode: "light",
          primary: {
            main: "#212121",
          },
        },
      });

      return (
        <ThemeProvider theme={darkTheme}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={() =>{
                history.push("/home")
              }}>
                ideaTribe
              </Typography>
            </Toolbar>
          </AppBar>
          <Grid
            container
            component="main"
            sx={{
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
                  marginTop: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography component="h1" variant="h5">
                  {_.get(props.history,"location.state.type") == "corporate" ? "CORPORATE":"USER" }{signUp ? " REGISTER" : " LOGIN"}
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
                    {hasInvite && <TextField
                    margin="normal"
                    fullWidth
                    id="referredBy"
                    label="Invite code"
                    name="referredBy"
                    autoComplete="referredBy"
                    autoFocus
                    disabled={mailSent}
                  />}
                  {signUp && _.get(props.history,"location.state.type") == "corporate" ? (
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
                  <Grid container style={{display:"flex", justifyContent:"space-between"}}>
                    <Grid item style={{ cursor: "pointer" }}>
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
                    {signUp && !hasInvite && !mailSent && <Grid item>
                      <Link onClick={()=>{
                        setHasInvite(true)
                      }} variant="body2">
                        Got invite code?
                      </Link>
                    </Grid>}
                  </Grid>
                  <Grid container>
                    <Grid item xs>
                      <span style={{ color: "red" }}>{errorMessage}</span>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </ThemeProvider>
      );
    }

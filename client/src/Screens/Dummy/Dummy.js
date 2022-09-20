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
import CompanyInterface from "../../Interfaces/CompanyInterface";
import CustomerInterface from "../../Interfaces/CustomerInterface";

import Container from "@mui/material/Container";
import { useSnackbar } from "react-simple-snackbar";

const theme = createTheme();

export default function Dummy() {
  const [values, setValues] = React.useState({});
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const history = useHistory();

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (newAction) => {
    CompanyInterface.getTokenForDummy({
        companyName:values.companyName
      }
    ).then(result =>{
      CustomerInterface.incentivise({
        action:newAction,
        email:values.email,
        token: result.data.data
      }).then(success =>{
        openSnackbar("TRBG has been shared to the user.", 10000);
      })
    })
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        component="main"
        sx={{ height: "100vh" }}
        style={{ justifyContent: "center" }}
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
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Sample actions
            </Typography>
            <Box
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                onChange={handleChange}
                margin="normal"
                required
                fullWidth
                id="email"
                label="User email"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                onChange={handleChange}
                margin="normal"
                required
                fullWidth
                name="companyName"
                label="Company Name"
                id="companyName"
                autoComplete="company-name"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={()=>{
                  handleSubmit("sign-up")
                }}
                sx={{
                  mt: 3,
                  mb: 2,
                }}
              >
                Sign up
              </Button>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={()=>{
                  handleSubmit("sign-in")
                }}
                sx={{
                  mt: 3,
                  mb: 2,
                }}
              >
                Sign in
              </Button>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={()=>{
                  handleSubmit("download-app")
                }}
                sx={{
                  mt: 3,
                  mb: 2,
                }}
              >
                App Download
              </Button>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={()=>{
                  handleSubmit("review-product")
                }}
                sx={{
                  mt: 3,
                  mb: 2,
                }}
              >
                Review Product
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

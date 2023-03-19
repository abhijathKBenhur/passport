import * as React from "react";
import { useHistory } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import _ from "lodash";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import LoginCard from "../../components/HomeCard";
import { Grid, Toolbar, Box, Modal } from "@mui/material";
import logoImage from "../../logo.png"
import LoginForm from "./LoginForm";
import HelpIcon from '@mui/icons-material/Help';

const theme = createTheme();

export default function Home() {
  const history = useHistory();
  const darkTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#212121",
      },
    },
  });
  return (
    <ThemeProvider
      theme={darkTheme}
      style={{
        display: "flex",
        alignItems: "center",
        justifyItems: "center",
        backgroundColor: "grey",
      }}
      className="typesContainer"
    >
      <AppBar position="static" color="primary">
        <Toolbar>
            <img height="40px" weight="40px"
            src={logoImage}></img>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            IdeaTribe
          </Typography>
          <HelpIcon></HelpIcon> 
        </Toolbar>
      </AppBar>
      <Grid
        container
        xs={12}
        md={12}
        lg={12}
        spacing={3}
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item xs={12} md={1}></Grid>
        <Grid item xs={12} md={4}>
          <LoginCard
            onLoginClick={(type) => {
              history.push({
                pathname: "/login",
                state: {
                  type: "individual",
                },
              });
            }}
            type="user"
            className="LoginCard
            "
          />
        </Grid>
        <Grid item xs={12} md={2}></Grid>
        <Grid item xs={12} md={4}>
          <LoginCard
            onLoginClick={() => {
              history.push({
                pathname: "/login",
                state: {
                  type: "corporate",
                },
              });
            }}
          />
        </Grid>
        <Grid item xs={12} md={1}></Grid>
      </Grid>
    </ThemeProvider>
  );
}

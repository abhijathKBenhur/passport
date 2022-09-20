import Login from "./Screens/Login/Login";
import Console from "./Screens/Console/Console";
import _ from "lodash";
import React, { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import SnackbarProvider from "react-simple-snackbar";
import theme  from "./theme";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  withRouter,
  useLocation,
} from "react-router-dom";
import Dummy from "./Screens/Dummy/Dummy";


const App = (props) => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div className="appContainer">
          <div className="app-content">
            <SnackbarProvider>
              <Switch>
                <Route path="/login" render={(props) => <Login />} />
                <Route path="/console" component={Console} />
                <Route path="/dummy" component={Dummy} />
                <Route
                  exact
                  path="/"
                  render={() => <Redirect from="/" to="/console" />}
                />
              </Switch>
            </SnackbarProvider>
          </div>
        </div>
      </ThemeProvider>
    </Router>
  );
};

export default withRouter(App);

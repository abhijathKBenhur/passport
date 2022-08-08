import SignInSide from "./Screens/Home/Signin";
import Dashboard from "./Screens/Dashboard/Dashboard";
import _ from "lodash";
import React, { useEffect } from "react";
import SnackbarProvider from "react-simple-snackbar";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  withRouter,
  useLocation,
} from "react-router-dom";

const App = (props) => {
  return (
    <Router>
      <div className="appContainer">
        <div className="app-content">
          <SnackbarProvider>
            <Switch>
              <Route path="/home" render={(props) => <SignInSide />} />
              <Route path="/configure" component={Dashboard} />
              <Route
                exact
                path="/"
                render={() => <Redirect from="/" to="/home" />}
              />
            </Switch>
          </SnackbarProvider>
        </div>
      </div>
    </Router>
  );
};

export default withRouter(App);

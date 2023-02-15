import Login from "./Screens/Login/Login";
import Console from "./Screens/Console/Console";
import _ from "lodash";
import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import SnackbarProvider from "react-simple-snackbar";
import theme  from "./theme";
import { UserContext } from "./contexts/UserContext";


import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  withRouter,
  useLocation,
} from "react-router-dom";
import Dummy from "./Screens/Dummy/Dummy";
import Entries from "./Screens/Entries/Entries";


const App = (props) => {
  const [company, setCompany] = useState(0);
  return (
    
    <Router>
      <ThemeProvider theme={theme}>
      <UserContext.Provider value={{company, setCompany}}>
        <div className="appContainer">
          <div className="app-content">
            <SnackbarProvider>
              <Switch>
                <Route path="/login" render={(props) => <Login />} />
                <Route path="/console" component={Console} />
                <Route path="/dummy" component={Dummy} />
                <Route path="/entries" component={Entries} />
                <Route
                  exact
                  path="/"
                  render={() => <Redirect from="/" to="/console" />}
                />
              </Switch>
            </SnackbarProvider>
          </div>
        </div>
        </UserContext.Provider>
      </ThemeProvider>
    </Router>
  );
};

export default withRouter(App);

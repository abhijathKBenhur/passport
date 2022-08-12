import React, { useEffect } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { Avatar, Box, Card, CardContent, Divider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import Dashboard from "../Dashboard/Dashboard";
import Customers from "../Customers/Customers";
import Wallet from "../Wallet/Wallet";
import Account from "../Account/Account";
import Configure from "../Configure/Configure";
import AuthInterface from "../../Interfaces/AuthInterface";

const drawerWidth = 260;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "#FFFFFF",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    color: "#9CA3AF",
    backgroundColor: "#111827",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

export default function Console() {
  const [open, setOpen] = React.useState(true);
  const [activeMenu, setActiveMenu] = React.useState("Dashboard");

  useEffect(() => {
    let liveToken = sessionStorage.getItem("PASSPORT_TOKEN")
    AuthInterface.validate({token:liveToken}).then(success =>{

    }).catch(err =>{

    })
  },[]);

  const sideBar = [
    {
      name: "Dashboard",
      icon: <DashboardIcon />,
    },
    {
      name: "Customers",
      icon: <PeopleIcon />,
    },
    {
      name: "Wallet",
      icon: <ShoppingCartIcon />,
    },
    {
      name: "Configure",
      icon: <BarChartIcon />,
    },
    {
      name: "Account",
      icon: <LayersIcon />,
    },
  ];
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const getConsoleContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return <Dashboard></Dashboard>;
        break;
      case "Wallet":
        return <Wallet></Wallet>;
        break;
      case "Customers":
        return <Customers></Customers>;
        break;
      case "Dashboard":
        return <Dashboard></Dashboard>;
        break;
      case "Configure":
        return <Configure></Configure>;
        break;
      case "Account":
        return <Account></Account>;
        break;
    }
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="info"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
          
            <IconButton color="inherit" sx={{
              

            }}>
              <NotificationsIcon color="info"/>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open} sx={{}}>
          <Toolbar
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.grey[100]
                  : "#1A2130",
              color: "#9CA3AF",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-center",
              px: [],
            }}
          >
            {" "}
            IDEATRIBE | PASSPORT
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <React.Fragment>
              {sideBar.map((item) => {
                return (
                  <ListItemButton
                    onClick={() => {
                      setActiveMenu(item.name);
                    }}
                  >
                    <ListItemIcon
                      style={{
                        color: item.name == activeMenu ? "#30B981" : "#9CA3AF",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      style={{
                        color: item.name == activeMenu ? "#30B981" : "#9CA3AF",
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </React.Fragment>
          </List>
        </Drawer>
        {getConsoleContent()}
      </Box>
    </ThemeProvider>
  );
}

import React, { useEffect, useContext } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, Box, Grid, Container, Divider, Card } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { useHistory } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import IncentiveTable from "../../components/IncentiveTable";
import { showToaster } from "../../commons/common.utils";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LogoutIcon from "@mui/icons-material/Logout";
import InfoIcon from "@mui/icons-material/Info";
import ArticleIcon from "@mui/icons-material/Article";
import SecurityIcon from "@mui/icons-material/Security";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HelpIcon from '@mui/icons-material/Help';
import logoImage from "../../logo.png"


import LayersIcon from "@mui/icons-material/Layers";
import Dashboard from "../Dashboard/Dashboard";
import Customers from "../Customers/Customers";
import Account from "../Account/Account";
import Transaction from "../Transactions/Transactions";
import Configure from "../Configure/Configure";
import AuthInterface from "../../Interfaces/AuthInterface";
import WalletCard from "../Wallet/WalletCard";
import { useSnackbar } from "react-simple-snackbar";
import ReceiptIcon from "@mui/icons-material/Receipt";
import Payment from "../../components/stripe/Payment";
import { UserContext } from "../../contexts/UserContext";

const drawerWidth = 260;
const drawerWidthCollapsed = 71;
const dark = "#111827";
const lightDark = "#1A2130";
const highlightGreen = "#30B981";
const greyText = "#9CA3AF";
const greyBackground = "#F9FAFC";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  "@media all": {
    minHeight: 128,
  },
  width: `calc(100% - ${drawerWidthCollapsed}px)`,
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
    color: greyText,
    backgroundColor: dark,
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
  const { company, setCompany } = useContext(UserContext);
  const [companyStatus, setCompanyStatus] = React.useState();
  const [showPayment, setShowPayment] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState("Dashboard");
  const history = useHistory();

  useEffect(() => {
    let liveToken = sessionStorage.getItem("PASSPORT_TOKEN");
    if (!liveToken) {
      history.push("/login");
    }
    AuthInterface.validate({ token: liveToken })
      .then((success) => {
        let companyData = success?.data?.company;
        let companyDetails = companyData?.details || {};
        console.log({ ...companyData, companyDetails });
        setCompanyStatus(companyData.status);
        if (companyData.status != "VERIFIED") {
          setActiveMenu(sideBar[3].name);
        }
        setCompany({ ...companyData, details: companyDetails });
      })
      .catch((err) => {
        history.push("/login");
      });
  }, []);

  const sideBar = [
    {
      name: "Dashboard",
      icon: <DashboardIcon />,
    },
    {
      name: "Users",
      icon: <PeopleIcon />,
    },
    {
      name: "Configure",
      icon: <BarChartIcon />,
    },
    {
      name: "Account",
      icon: <LayersIcon />,
    },
    {
      name: "Transactions",
      icon: <ReceiptIcon />,
    },
  ];

  const userSideBar = [
    {
      name: "Dashboard",
      icon: <DashboardIcon />,
    },
    {
      name: "Transactions",
      icon: <ReceiptIcon />,
    },
    {
      name: "Redeem",
      icon: <LayersIcon />,
    },
  ];

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const getConsoleContent = () => {
    switch (activeMenu) {
      case "Users":
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
      case "Transactions":
        return <Transaction></Transaction>;
        break;
      case "Redeem":
        return <IncentiveTable></IncentiveTable>;
        break;
    }
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {
          <AppBar position="absolute" open={open}>
            <Toolbar
              sx={{
                backgroundColor: "#F1F1F1",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <Box className="left-actions">
                {company.status == "VERIFIED" &&
                  company.userType == "corporate" && (
                    <Button
                      color="error"
                      size="small"
                      variant="contained"
                      onClick={() => setShowPayment(true)}
                    >
                      Buy TRBG
                    </Button>
                  )}
                {company.userType != "corporate" && (
                  <Button
                    color="error"
                    size="small"
                    variant="contained"
                    onClick={() => {
                      setActiveMenu("Redeem");
                    }}
                  >
                    REDEEM TRBG
                  </Button>
                )}
                {<Payment open={showPayment} company={company}></Payment>}
              </Box>
              <Box className="right-actions">
                <Typography style={{ color: "red" }}>
                  {company?.companyName || company?.email}
                </Typography>
              </Box>
            </Toolbar>
            <Toolbar
              sx={{
                p: "0 !important", // keep right padding when drawer closed
              }}
            >
              <Box
                component="main"
                sx={{
                  backgroundColor: (theme) => greyBackground,
                  flexGrow: 1,
                  overflow: "auto",
                }}
              >
                <Container maxWidth="" sx={{ mt: 4, mb: 4 }}>
                  {company.userType == "corporate" ? (
                    <Grid container xs={12} md={12} lg={12} spacing={3}>
                      <Grid item xs={12} md={3}>
                        <WalletCard
                          entity={company.userType}
                          type="balance"
                          balance={company.balance}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <WalletCard
                          entity={company.userType}
                          type="given"
                          distributed={company.distributed}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <WalletCard entity={company.userType} type="rate" />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <WalletCard entity={company.userType} type="users" />
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid container xs={12} md={12} lg={12} spacing={3}>
                      <Grid item xs={12} md={12}>
                        <WalletCard
                          entity={company.userType}
                          type="balance"
                          balance={company.balance}
                        />
                      </Grid>
                    </Grid>
                  )}
                </Container>
              </Box>
            </Toolbar>
          </AppBar>
        }
        <Drawer variant="permanent" open={open} sx={{}}>
          <Toolbar
            sx={{
              backgroundColor: (theme) => dark,
              color: greyText,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-center",
              px: [],
            }}
          >
            {open ? (
              <Box style={{display:"flex", alignItems:"center"}}>
                <img height="30px" weight="30px" src={logoImage}></img> 
                IDEATRIBE
              </Box>
            ) : (
              <IconButton
                edge="start"
                color="info"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
          <Divider />
          <List component="nav">
            {company.userType == "corporate" ? (
              <React.Fragment>
                {sideBar.map((item) => {
                  return (
                    <ListItemButton
                      style={{
                        cursor:
                          companyStatus == "VERIFIED" ? "pointer" : "no-drop",
                      }}
                      onClick={() => {
                        if (companyStatus == "VERIFIED") {
                          setActiveMenu(item.name);
                        } else {
                          showToaster("Not allowed");
                        }
                      }}
                    >
                      <ListItemIcon
                        style={{
                          color:
                            item.name == activeMenu ? highlightGreen : greyText,
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.name}
                        style={{
                          color:
                            item.name == activeMenu ? highlightGreen : greyText,
                        }}
                      />
                    </ListItemButton>
                  );
                })}
              </React.Fragment>
            ) : (
              <React.Fragment>
                {userSideBar.map((item) => {
                  return (
                    <ListItemButton
                      style={{
                        cursor:
                          companyStatus == "VERIFIED" ? "pointer" : "no-drop",
                      }}
                      onClick={() => {
                        if (companyStatus == "VERIFIED") {
                          setActiveMenu(item.name);
                        } else {
                          showToaster("Not allowed");
                        }
                      }}
                    >
                      <ListItemIcon
                        style={{
                          color:
                            item.name == activeMenu ? highlightGreen : greyText,
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.name}
                        style={{
                          color:
                            item.name == activeMenu ? highlightGreen : greyText,
                        }}
                      />
                    </ListItemButton>
                  );
                })}
              </React.Fragment>
            )}
          </List>
          <ListItemButton
            style={{
              position: "fixed",
              bottom: "200px",
              cursor: "pointer",
            }}
          >
            <ListItemIcon
              style={{
                color: greyText,
              }}
            >
              <HelpIcon
                onClick={() => {
                  sessionStorage.removeItem("PASSPORT_TOKEN");
                  history.push("/login");
                }}
              ></HelpIcon>
            </ListItemIcon>
            <ListItemText
              primary="How to use"
              style={{
                color: greyText,
              }}
            />
          </ListItemButton>
          <ListItemButton
            style={{
              position: "fixed",
              bottom: "160px",
              cursor: "pointer",
            }}
          >
            <ListItemIcon
              style={{
                color: greyText,
              }}
            >
              <AccountBalanceIcon
                onClick={() => {
                  sessionStorage.removeItem("PASSPORT_TOKEN");
                  history.push("/login");
                }}
              ></AccountBalanceIcon>
            </ListItemIcon>
            <ListItemText
              primary="Tokenomics"
              style={{
                color: greyText,
              }}
            />
          </ListItemButton>
          <ListItemButton
            style={{
              position: "fixed",
              bottom: "120px",
              cursor: "pointer",
            }}
          >
            <ListItemIcon
              style={{
                color: greyText,
              }}
            >
              <ArticleIcon
                onClick={() => {
                  sessionStorage.removeItem("PASSPORT_TOKEN");
                  history.push("/login");
                }}
              ></ArticleIcon>
            </ListItemIcon>
            <ListItemText
              primary="Terms &  Conditions"
              style={{
                color: greyText,
              }}
            />
          </ListItemButton>
          <ListItemButton
            style={{
              position: "fixed",
              bottom: "80px",
              cursor: "pointer",
            }}
          >
            <ListItemIcon
              style={{
                color: greyText,
              }}
            >
              <SecurityIcon
                onClick={() => {
                  sessionStorage.removeItem("PASSPORT_TOKEN");
                  history.push("/login");
                }}
              ></SecurityIcon>
            </ListItemIcon>
            <ListItemText
              primary="Privacy"
              style={{
                color: greyText,
              }}
            />
          </ListItemButton>
          <ListItemButton
            style={{
              position: "fixed",
              bottom: "40px",
              cursor: "pointer",
            }}
          >
            <ListItemIcon
              style={{
                color: greyText,
              }}
            >
              <InfoIcon
                onClick={() => {
                  sessionStorage.removeItem("PASSPORT_TOKEN");
                  history.push("/login");
                }}
              ></InfoIcon>
            </ListItemIcon>
            <ListItemText
              primary="About us"
              style={{
                color: greyText,
              }}
            />
          </ListItemButton>
          <ListItemButton
            style={{
              position: "fixed",
              bottom: "0",
              cursor: "pointer",
            }}
          >
            <ListItemIcon
              style={{
                color: greyText,
              }}
            >
              <LogoutIcon
                onClick={() => {
                  sessionStorage.removeItem("PASSPORT_TOKEN");
                  history.push("/login");
                }}
              ></LogoutIcon>
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              style={{
                color: greyText,
              }}
            />
          </ListItemButton>
        </Drawer>

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) => greyBackground,
            flexGrow: 1,
            overflow: "auto",
            marginTop: "300px",
          }}
        >
          {/*  */}
          <Grid item xs={12} md={12} lg={12}>
            <Box
              component="main"
              sx={{
                backgroundColor: (theme) => greyBackground,
                flexGrow: 1,
                height: "100vh",
                overflow: "auto",
              }}
            >
              <Container maxWidth="">{getConsoleContent()}</Container>
            </Box>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

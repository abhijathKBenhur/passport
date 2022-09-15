import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SellIcon from "@mui/icons-material/Sell";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CustomerInterface from "../../Interfaces/CustomerInterface";

const WalletCard = (props) => {
  const [goldBalance, setGoldBalance] = useState(0);
  const [distributed, setDistributed] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    if(props?.type == "users"){
      CustomerInterface.getTotalUserCount()
      .then((success) => {
        let count = success?.data?.data;
        setTotalUsers(count);
      })
      .catch((err) => {});
    }
   
  }, []);

  const getTopText = (props) => {
    switch (props?.type) {
      case "balance":
        return "Balance";
        break;
      case "given":
        return "DISTRIBUTED";
        break;
      case "rate":
        return "Current conversion";
        break;
      case "users":
        return "Total users";
        break;
      default:
        return "DEFAULT";
    }
  };

  const getMainTitle = (props) => {
    switch (props?.type) {
      case "balance":
        return props.balance+ " TRBG";
        break;
      case "given":
        return props.distributed+ " TRBG";
        break;
      case "rate":
        return "0.2$";
        break;
      case "users":
        return totalUsers;
        break;
      default:
        return "DEFAULT";
    }
  };

  const getFooterText = (props) => {
    return "";

    switch (props?.type) {
      case "balance":
        return "Lasts for 206 transactions";
        break;
      case "given":
        return "In last one month";
        break;
      case "users":
        return "2% increase from yesterday";
        break;
      case "rate":
        return "As of today";
        break;
      default:
        return "";
    }
  };

  const getIcon = (props) => {
    switch (props?.type) {
      case "balance":
        return (
          <Avatar
            sx={{
              backgroundColor: "error.main",
              height: 56,
              width: 56,
            }}
          >
            <AccountBalanceWalletIcon />
          </Avatar>
        );
        break;
      case "given":
        return (
          <Avatar
            sx={{
              backgroundColor: "error.main",
              height: 56,
              width: 56,
            }}
          >
            <SellIcon />
          </Avatar>
        );

        break;
      default:
        return (
          <Avatar
            sx={{
              backgroundColor: "error.main",
              height: 56,
              width: 56,
            }}
          >
            <AttachMoneyIcon />
          </Avatar>
        );
        return "DEFAULT";
    }
  };

  return(
    <Card {...props}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {getTopText(props)}
            </Typography>
            <Typography color="textPrimary" variant="h4">
              {getMainTitle(props)}
            </Typography>
          </Grid>
          <Grid item>{getIcon(props)}</Grid>
        </Grid>
        <Box
          sx={{
            pt: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* <ArrowDownwardIcon color="error" /> */}
          <Typography
            color="error"
            sx={{
              mr: 1,
            }}
            variant="body2"
          >
            {/* 12% */}
          </Typography>
          <Typography color="textSecondary" variant="caption">
            {getFooterText(props)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WalletCard;

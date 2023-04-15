import { useState, useEffect, useContext } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import _ from "lodash";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SellIcon from "@mui/icons-material/Sell";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CustomerInterface from "../../Interfaces/CustomerInterface";
import {UserContext} from "../../contexts/UserContext"
import TransactionInterface from "../../Interfaces/TransactionInterface";

const WalletCard = (props) => {
  const [goldBalance, setGoldBalance] = useState(0);
  const [distributed, setDistributed] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const {company} = useContext(UserContext)

  useEffect(() => {
    if(props?.type != "users"){
      TransactionInterface.getAllTransactions(company)
      .then((success) => {
        let transactionArray = success?.data?.data;

        let mailGroups = _.mapValues(_.groupBy(transactionArray, 'email'),
                          clist => clist.map(transaction => _.omit(transaction, 'email')));
        let emailList = Object.keys(mailGroups)
        setTotalUsers(emailList.length);
      })
      .catch((err) => {});
    }
    console.log("UserContext  ", company)
  }, []);

  const getTopText = (props) => {
    switch (props?.type) {
      case "balance":
        return _.get(company,"userType") == "individual" ? "Gold Balance": "Balance";
        break;
      case "given":
        return "DISTRIBUTED";
        break;
      case "rate":
        return "ONE TRBG is";
        break;
      case "users":
        return "Total users";
        break;
      default:
        return "DEFAULT";
    }
  };

  const getMainTitle = (props) => {
    console.log("Requetsing from ", props.type)
    switch (props?.type) {
      case "balance":
        return (props.balance || 0) / 1000000000000000000 + " TRBG";
        break;
      case "given":
        return  (props.distributed || 0) / 1000000000000000000 + " TRBG";
        break;
      case "rate":
        return "0.2USDC";
        break;
      case "users":
        return totalUsers
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

import { Box, Container, Grid, Toolbar } from "@mui/material";
import { useState, useEffect } from "react";
import { Chart, ArcElement } from "chart.js";
import LatestOrders from "../Transactions/LatestOrders";
import Sales from "./Sales";
import GoldByAction from "./GoldByAction";
import TransactionInterface from "../../Interfaces/TransactionInterface";

const Dashboard = (props) => {
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
      TransactionInterface.getAllTransactions()
        .then((success) => {
          let transactions = success?.data?.data;
          let transactionsMaps = [];
          transactions.reduce(function (res, value) {
            if (!res[value.action]) {
              res[value.action] = { action: value.action, amount: 0, emails:0 };
              transactionsMaps.push(res[value.action]);
            }
            res[value.action].amount += value.amount;
            res[value.action].emails += 1;
            return res;
          }, {});
          setTransactions(transactionsMaps);
        })
        .catch((err) => {});
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item lg={8} md={12} xl={9} xs={12}>
        {transactions && transactions.length > 0 && <Sales transactions={transactions} />}
      </Grid>
      <Grid item lg={4} md={6} xl={3} xs={12}>
      {transactions && transactions.length > 0 && <GoldByAction transactions={transactions} sx={{ height: "100%" }} />}
      </Grid>
    </Grid>
  );
};

export default Dashboard;

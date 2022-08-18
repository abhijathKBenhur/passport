import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Toolbar,
  Container,
} from "@mui/material";
import { useSnackbar } from "react-simple-snackbar";
import CompanyInterface from "../../Interfaces/CompanyInterface";
import LatestOrders from "./LatestOrders";

const Transactions = (props) => {
  useEffect(() => {
    CompanyInterface.getDetails()
      .then((success) => {
        let details = success?.data?.data?.details;
        try {
          // setValues(JSON.parse(details))
        } catch (err) {
          console.log("Could not fetch company details");
        }
      })
      .catch((err) => {});
  }, []);

  return (
    <Card>
      <CardHeader
        subheader="The information can be edited"
        title="Transactions"
      />
      <Divider />
      <CardContent>
        <LatestOrders />
      </CardContent>
      <Divider />
    </Card>
  );
};

export default Transactions;

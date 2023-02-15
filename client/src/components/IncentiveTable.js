import React, { useState, useEffect, useContext } from "react";
import TransactionsInterface from "../Interfaces/TransactionInterface";
import _ from "lodash";
import CustomerInterface from "../Interfaces/CustomerInterface";
import ReactDOM from 'react-dom';
import {UserContext} from "../contexts/UserContext"
import {
  Box,
  Button,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from "@mui/material";

const IncentiveTable = (props) => {
  const [rows, setRows] = useState([]);
  const {company} = useContext(UserContext)
  

  useEffect(() => {
    TransactionsInterface.getGroupedEarnings({
      email:company.email
    })
      .then((success) => {
        let data = _.get(success,"data.data");
        setRows(data);
      })
      .catch((err) => {});
  }, []);

  const redeemFromCompany = (row) =>{
    CustomerInterface.redeemGold({...company,companyName:row._id} ).then(success =>{
      window.location.reload();
    }).catch(err =>{
      const alertPropertyError = {
        isDismissible: true,
        variant: "danger",
        content: "Deposit has been failed. Please reach out to the customer team.",
      }
      alert("Deposit has been failed. Please reach out to the customer team.")
      // ReactDOM.render(<AlertBanner {...alertPropertyError}></AlertBanner>, document.querySelector('.aleartHeader'))
    })
  }

  return (
    <Card {...props}>
    <CardHeader title="Transaction" />
      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>
                Redeem
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {rows.map((order) => (
              
              (<TableRow hover  >
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>
                  <Button>  {
              order.status == "COMPLETED" ? <Button disabled={order.total == 0} onClick={() =>{ redeemFromCompany(order) }}>Redeem </Button> :
              "Redeemed"
              }</Button>
                </TableCell>
              </TableRow>)
            ))}
          </TableBody>
        </Table>
      </Box>
   
  </Card>
  );
};

export default IncentiveTable;

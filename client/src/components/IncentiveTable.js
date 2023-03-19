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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";

const IncentiveTable = (props) => {
  const [rows, setRows] = useState([]);
  const [values, setValues] = useState([]);
  const [showRedeem, setShowRedeem] = useState(false);
  const [redeemOrder, setRedeemOrder] = useState();
  const {company} = useContext(UserContext)

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
    console.log(values);
  };

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

  const handleClose = (order) =>{
    setShowRedeem(false)
    setRedeemOrder()
  }

  const redeemFromCompany = () =>{
    CustomerInterface.redeemGold({...company,companyName:redeemOrder._id, metamaskId: values.address} ).then(success =>{
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
                <TableCell>{order.total/1000000000000000000}</TableCell>
                <TableCell>
                  <Button>  {
              order.status == "COMPLETED" ? <Button disabled={order.total == 0} onClick={() =>{ 
                setShowRedeem(true);
                setRedeemOrder(order) }}>Redeem </Button> :
              "Redeemed"
              }</Button>
                </TableCell>
              </TableRow>)
            ))}
          </TableBody>
        </Table>
      </Box>
      <Dialog open={showRedeem} onClose={handleClose}>
        <DialogTitle>Redeem</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tribe gold will be shared to this wallet address. Please make sure you have the access to the address before redeeming.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="address"
            name="address"
            label="Wallet address"
            type="text"
            onChange={handleChange}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => {
              redeemFromCompany(redeemOrder);
              setShowRedeem(false)
            }}> Redeem </Button>
        </DialogActions>
      </Dialog>
  </Card>
  );
};

export default IncentiveTable;

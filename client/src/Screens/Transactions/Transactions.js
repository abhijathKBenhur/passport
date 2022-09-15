import { useState, useEffect } from "react";
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
import { useSnackbar } from "react-simple-snackbar";
import CompanyInterface from "../../Interfaces/CompanyInterface";
import LatestOrders from "./LatestOrders";
import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import PerfectScrollbar from "react-perfect-scrollbar";
import TransactionInterface from "../../Interfaces/TransactionInterface"
import ArrowRightIcon from "@mui/icons-material/ArrowRight";


const orders = [
  {
    id: uuid(),
    ref: "CDD1049",
    amount: 30.5,
    customer: {
      name: "Ekaterina Tankova",
    },
    createdAt: 1555016400000,
    status: "pending",
  },
  {
    id: uuid(),
    ref: "CDD1048",
    amount: 25.1,
    customer: {
      name: "Cao Yu",
    },
    createdAt: 1555016400000,
    status: "delivered",
  },
  {
    id: uuid(),
    ref: "CDD1047",
    amount: 10.99,
    customer: {
      name: "Alexa Richardson",
    },
    createdAt: 1554930000000,
    status: "refunded",
  },
  {
    id: uuid(),
    ref: "CDD1046",
    amount: 96.43,
    customer: {
      name: "Anje Keizer",
    },
    createdAt: 1554757200000,
    status: "pending",
  },
  {
    id: uuid(),
    ref: "CDD1045",
    amount: 32.54,
    customer: {
      name: "Clarke Gillebert",
    },
    createdAt: 1554670800000,
    status: "delivered",
  },
  {
    id: uuid(),
    ref: "CDD1044",
    amount: 16.76,
    customer: {
      name: "Adam Denisov",
    },
    createdAt: 1554670800000,
    status: "delivered",
  },
];

const Transactions = (props) => {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    
    TransactionInterface.getAllTransactions()
      .then((success) => {
        let transactions = success?.data?.data;
        try {
          setTransactions(transactions)
        } catch (err) {
          console.log("Could not fetch company details");
        }
      })
      .catch((err) => {});
  }, []);

  return (
    <Card {...props}>
    <CardHeader title="Transaction" />
    <PerfectScrollbar>
      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Action</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>
                Customer
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((order, index) => (
               order.amount > 0 && 
              
              (<TableRow hover key={index} >
                <TableCell>{order.action}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>{order.email}</TableCell>
              </TableRow>)
            ))}
          </TableBody>
        </Table>
      </Box>
    </PerfectScrollbar>
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        p: 2,
      }}
    >
      <Button
        color="primary"
        endIcon={<ArrowRightIcon fontSize="small" />}
        size="small"
        variant="text"
      >
        View all
      </Button>
    </Box>
  </Card>
  );
};

export default Transactions;

import { useState, useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Avatar,
  Box,
  Card,
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Grid,
  CardHeader,
} from "@mui/material";
import getInitials from "../../utils/get-initials";
import { v4 as uuid } from "uuid";
import { Container } from "@mui/system";
import { SeverityPill } from "../../commons/severity-pills";
import Search from "@mui/icons-material/Search";
import Upload from "@mui/icons-material/Upload";
import Download from "@mui/icons-material/Download";
import CustomerInterface from "../../Interfaces/CustomerInterface";

export const Customers = ({ ...rest }) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [customerList, setCustomerList] = useState([]);

  useEffect(() => {
    CustomerInterface.getAllUsers()
      .then((success) => {
        let customers = success?.data?.data || [];
        try {
          setCustomerList(customers);
        } catch (err) {
          console.log("Could not fetch company details");
        }
      })
      .catch((err) => {});
  }, []);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Grid>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? "#F9FAFC"
              : theme.palette.grey[900],
          flexGrow: 1,
        }}
      >
        <Card {...rest}>
          <CardHeader subheader="List of users" title="Users" />
          <PerfectScrollbar>
            <Box sx={{ minWidth: 1050 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Balance (TRBG)</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customerList.slice(0, limit).map((customer) => (
                    <TableRow hover key={customer.id}>
                      <TableCell
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        {" "}
                        <Avatar src={customer.avatarUrl} sx={{ mr: 2 }}>
                          {getInitials(customer.email)}
                        </Avatar>
                        <Typography color="textPrimary" variant="body1">
                          {customer.name}
                        </Typography>
                        {customer.email}
                      </TableCell>
                      <TableCell>{customer.balance}</TableCell>
                      <TableCell>
                        {customer.incentivisedActions &&
                          Object.keys(customer.incentivisedActions).map((key) => {
                            return (
                              <SeverityPill color={"success"} sx={{ml:1}}>
                                {key} : {customer.incentivisedActions[key]}
                              </SeverityPill>
                            );
                          })}

                        {/* {customer.incentivisedActions.join(",")} */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </PerfectScrollbar>
          {/* <TablePagination
                component="div"
                count={customerList.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 25]}
              /> */}
        </Card>
      </Box>
    </Grid>
  );
};

export default Customers;

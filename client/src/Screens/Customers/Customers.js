import { useState } from "react";
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
  Button,
} from "@mui/material";
import getInitials from "../../utils/get-initials";
import { v4 as uuid } from "uuid";
import { Container } from "@mui/system";

import Search from "@mui/icons-material/Search";
import Upload from "@mui/icons-material/Upload";
import Download from "@mui/icons-material/Download";

export const Customers = ({ ...rest }) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const customerList = [
    {
      id: uuid(),
      avatarUrl: "/static/images/avatars/avatar_3.png",
      createdAt: 1555016400000,
      email: "ekaterina.tankova@devias.io",
      name: "Ekaterina Tankova",
      wallet: "0x7f091f97e197BaE0B48DCc99d1AB5533c7fCe46c",
    },
    {
      id: uuid(),
      avatarUrl: "/static/images/avatars/avatar_4.png",
      createdAt: 1555016400000,
      email: "cao.yu@devias.io",
      name: "Cao Yu",
      wallet: "0x7f091f97e197BaE0B48DCc99d1AB5533c7fCe46c",
    },
    {
      id: uuid(),
      avatarUrl: "/static/images/avatars/avatar_2.png",
      createdAt: 1555016400000,
      email: "alexa.richardson@devias.io",
      name: "Alexa Richardson",
      wallet: "0x7f091f97e197BaE0B48DCc99d1AB5533c7fCe46c",
    },
    {
      id: uuid(),
      avatarUrl: "/static/images/avatars/avatar_5.png",
      createdAt: 1554930000000,
      email: "anje.keizer@devias.io",
      name: "Anje Keizer",
      wallet: "0x7f091f97e197BaE0B48DCc99d1AB5533c7fCe46c",
    },
    {
      id: uuid(),
      avatarUrl: "/static/images/avatars/avatar_6.png",
      createdAt: 1554757200000,
      email: "clarke.gillebert@devias.io",
      name: "Clarke Gillebert",
      wallet: "0x7f091f97e197BaE0B48DCc99d1AB5533c7fCe46c",
    },
    {
      id: uuid(),
      avatarUrl: "/static/images/avatars/avatar_1.png",
      createdAt: 1554670800000,
      email: "adam.denisov@devias.io",
      name: "Adam Denisov",
      wallet: "0x7f091f97e197BaE0B48DCc99d1AB5533c7fCe46c",
    },
    {
      id: uuid(),
      avatarUrl: "/static/images/avatars/avatar_7.png",
      createdAt: 1554325200000,
      email: "ava.gregoraci@devias.io",
      name: "Ava Gregoraci",
      wallet: "0x7f091f97e197BaE0B48DCc99d1AB5533c7fCe46c",
    },
    {
      id: uuid(),
      avatarUrl: "/static/images/avatars/avatar_8.png",
      createdAt: 1523048400000,
      email: "emilee.simchenko@devias.io",
      name: "Emilee Simchenko",
      wallet: "0x7f091f97e197BaE0B48DCc99d1AB5533c7fCe46c",
    },
    {
      id: uuid(),
      avatarUrl: "/static/images/avatars/avatar_9.png",
      createdAt: 1554702800000,
      email: "kwak.seong.min@devias.io",
      name: "Kwak Seong-Min",
      wallet: "0x7f091f97e197BaE0B48DCc99d1AB5533c7fCe46c",
    },
    {
      id: uuid(),
      avatarUrl: "/static/images/avatars/avatar_10.png",
      createdAt: 1522702800000,
      email: "merrile.burgett@devias.io",
      name: "Merrile Burgett",
      wallet: "0x7f091f97e197BaE0B48DCc99d1AB5533c7fCe46c",
    },
  ];

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light" ? "#F9FAFC" : theme.palette.grey[900],
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Container maxWidth="" sx={{ mt: 4, mb: 2 }}>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            m: -1,
          }}
        >
          <Typography sx={{ m: 1 }} variant="h4">
            Customers
          </Typography>
          {/* <Box sx={{ m: 1 }}>
            <Button startIcon={<Upload fontSize="small" />} sx={{ mr: 1 }}>
              Import
            </Button>
            <Button startIcon={<Download fontSize="small" />} sx={{ mr: 1 }}>
              Export
            </Button>
            <Button color="primary" variant="contained">
              Add Customers
            </Button>
          </Box> */}
        </Box>
        <Box sx={{ mt: 1 }}>
          <Card>
            <CardContent>
              <Box sx={{ maxWidth: 500 }}>
                <TextField
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon color="action" fontSize="small">
                          <Search />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Search customer"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? "#F9FAFC"
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="" sx={{ mt: 0, mb: 2 }}>
            <Card {...rest}>
              <PerfectScrollbar>
                <Box sx={{ minWidth: 1050 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>wallet</TableCell>
                        <TableCell>Transfer date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customerList.slice(0, limit).map((customer) => (
                        <TableRow hover key={customer.id}>
                          <TableCell>
                            <Box
                              sx={{
                                alignItems: "center",
                                display: "flex",
                              }}
                            >
                              <Avatar src={customer.avatarUrl} sx={{ mr: 2 }}>
                                {getInitials(customer.name)}
                              </Avatar>
                              <Typography color="textPrimary" variant="body1">
                                {customer.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{customer.email}</TableCell>
                         
                          <TableCell>{customer.wallet}</TableCell>
                          <TableCell>
                            {format(customer.createdAt, "dd/MM/yyyy")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </PerfectScrollbar>
              <TablePagination
                component="div"
                count={customerList.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </Card>
          </Container>
        </Box>
      </Container>
    </Box>
  );
};

export default Customers;

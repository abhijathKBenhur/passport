import React from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Toolbar,
  Typography,
} from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Download from "@mui/icons-material/Download";
import AccessTime from "@mui/icons-material/Assignment";
import WalletCard from "./WalletCard";

const Wallet = () => {
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
    <Container maxWidth="" sx={{ mt: 4, mb: 4 }}>
      <Grid container xs={12} md={12} lg={12} spacing={3}>
        <Grid item xs={12} md={4} lg={3}>
          <WalletCard />
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <WalletCard />
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <WalletCard />
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <WalletCard />
        </Grid>
      </Grid>
      </Container>
    </Box>
  );
};

export default Wallet;

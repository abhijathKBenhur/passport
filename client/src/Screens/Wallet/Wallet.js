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
      <Toolbar />
      <Container maxWidth="" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={2}>
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
          {/* Recent Orders */}
          <Grid item xs={12} md={4} lg={3}>
          </Grid>
          <Grid item key={"product.id"} lg={6} md={8} xs={12}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    pb: 3,
                  }}
                >
                  <Avatar alt="Product" src="product.media" variant="square" />
                </Box>
                <Typography
                  align="center"
                  color="textPrimary"
                  gutterBottom
                  variant="h5"
                >
                  product.title
                </Typography>
                <Typography align="center" color="textPrimary" variant="body1">
                  product.description
                </Typography>
              </CardContent>
              <Box sx={{ flexGrow: 1 }} />
              <Divider />
              <Box sx={{ p: 2 }}>
                <Grid
                  container
                  spacing={2}
                  sx={{ justifyContent: "space-between" }}
                >
                  <Grid
                    item
                    sx={{
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <AccessTime color="action" />
                    <Typography
                      color="textSecondary"
                      display="inline"
                      sx={{ pl: 1 }}
                      variant="body2"
                    >
                      Updated 2hr ago
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    sx={{
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <Download color="action" />
                    <Typography
                      color="textSecondary"
                      display="inline"
                      sx={{ pl: 1 }}
                      variant="body2"
                    >
                      product.totalDownloads Downloads
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Wallet;

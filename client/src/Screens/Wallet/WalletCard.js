import { Avatar, Box, Card, CardContent, Grid, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MoneyIcon from '@mui/icons-material/Money';

const WalletCard = (props) => (
  <Card
    {...props}
  >
    <CardContent>
      <Grid
        container
        spacing={3}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid item>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"
          >
            Wallet
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            2400 TRBG
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: 'error.main',
              height: 56,
              width: 56
            }}
          >
            <MoneyIcon />
          </Avatar>
        </Grid>
      </Grid>
      <Box
        sx={{
          pt: 2,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* <ArrowDownwardIcon color="error" /> */}
        <Typography
          color="error"
          sx={{
            mr: 1
          }}
          variant="body2"
        >
          {/* 12% */}
        </Typography>
        <Typography
          color="textSecondary"
          variant="caption"
        >
          Lasts for 32 more transactions
        </Typography>
      </Box>
    </CardContent>
  </Card>
);
export default WalletCard
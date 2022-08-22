import { Avatar, Box, Card, CardContent, Grid, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SellIcon from '@mui/icons-material/Sell';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const getMainTitle = (props) =>{
  switch(props?.type){
    case "balance":
      return "240"
      break;
    case "given":
      return "322"
      break;
      default:
        return "DEFAULT"
  }
}


const getTopText = (props) =>{
  switch(props?.type){
    case "balance":
      return "TRBG"
      break;
    case "given":
      return "TRBG"
      break;
      default:
        return "TRBG" 
  }
}


const getIcon = (props) =>{
  switch(props?.type){
    case "balance":
      return <Avatar
      sx={{
        backgroundColor: 'error.main',
        height: 56,
        width: 56
      }}
    >
      <AccountBalanceWalletIcon />
    </Avatar>
      break;
    case "given":
      return <Avatar
      sx={{
        backgroundColor: 'error.main',
        height: 56,
        width: 56
      }}
    >
      <SellIcon />
    </Avatar>
      
      break;
      default:
        return <Avatar
      sx={{
        backgroundColor: 'error.main',
        height: 56,
        width: 56
      }}
    >
      <AttachMoneyIcon />
    </Avatar>
        return "DEFAULT"
  }
}


const getFooterText = (props) =>{
  switch(props?.type){
    case "balance":
      return "Lasts for 20 transactions"
      break;
    case "given":
      break;
      default:
        return "DEFAULT"
  }
}


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
            {getTopText(props)}
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            {getMainTitle(props)}
          </Typography>
        </Grid>
        <Grid item>
        {getIcon(props)}
         
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
          {getFooterText()}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);
export default WalletCard
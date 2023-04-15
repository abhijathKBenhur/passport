import { useState, useEffect, useContext } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { useHistory } from "react-router-dom";

const WalletCard = (props) => {
  const history = useHistory();
  
  useEffect(() => {}, [])

  const getTitle = (props) =>{
    if(props.type == "user"){
      return "USER"
    }else{
      return "CORPORATE"
    }
  }

  const getDescription = () =>{
    if(props.type == "user"){
      return "Check your TRBG balance, find sweet deals and redeem your tokens for money! Users earn TribeGold [TRBG] for their engagement with apps. By checking your balance regularly, you can take advantage of exclusive deals and promotions. Plus, redeeming your tokens for cash is quick and easy."
    }else{
      return "Buy TRBG, configure campaigns and analyze your token distribution strategies! TribeGold [TRBG] is a versatile token that helps you run custom marketing campaigns to engage customers and drive sales. Use analytics tools to track the success of your strategies and optimize your token distribution to maximize ROI."
    }
  }


  return (
    <Card variant="outlined">  
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
                {getTitle(props)}
            </Typography>
          </Grid>
        </Grid>
        <Box
          sx={{
            pt: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* <ArrowDownwardIcon color="error" /> */}
          <Typography variant="body2" color="text.secondary">
          {getDescription()}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        
        <Button size="small" variant="contained" fullWidth sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: (t) =>
                    t.palette.mode === "lidarkght"
                      ? t.palette.grey[50]
                      : t.palette.grey[900],
                }} onClick={() =>{
          props.onLoginClick(props.type)
        }}>Login</Button>
      </CardActions>
    </Card>
  );
};

export default WalletCard;

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
          In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.
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

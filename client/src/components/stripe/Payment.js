import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import React, { useEffect, useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Typography, TextField } from "@mui/material";
import PaymentInterface from "../../Interfaces/PaymentInterface";
import './payment.css';

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

function Payment(props) {
  const [open, setOpen] = React.useState(props.open);
  const [secret, setSecret] = useState(undefined);
  const [stripeKey, setStripeKey] = useState(undefined);
  const [step, setStep] = useState("INPUT");
  const [numberOfGold, setNumberOfGold] = useState(10000);
  const [centsValue, setCentsValue] = useState(1000);

  useEffect(() => {
    PaymentInterface.getClientKey().then(success =>{
        setStripeKey(success?.data?.data)
    }).catch(err =>{
        console.log("Could not get stripe key", err)
    })
  },[]);
  const handleChange = (event, index) => {
    setNumberOfGold(event.target.value);
    setCentsValue(event.target.value / 10 * 100);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const gotoStep1 = () => {
    setStep("CARD");
    PaymentInterface.getClientSecret({ amount: centsValue }).then((success) => {
      let cSecret = success?.data?.data?.client_secret;
      setSecret(cSecret);
    });
  };

  const payResponse = (value) =>{
    if(value.success){
        PaymentInterface.depositGold({account:props.company.contractAddress,goldToDeposit:numberOfGold}).then(success =>{
            setStep("SUCCESS")
        }).catch(err =>{
            setStep("FAILURE")
        })
    }else{
        setStep("FAILURE")
    }
   
    console.log(value)
  }

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        Buy TRBG
      </BootstrapDialogTitle>

      <DialogContent dividers>
        <Typography gutterBottom>
          Please buy TRBG with your credit card. Price of each TRBG token is 10
          cents (US$ 0.1). You can buy upto 100,000 tokens at this price.
        </Typography>
        {step == "CARD" && (
          <Typography
            gutterBottom
            style={{ marginTop: "30px", marginBottom: "30px" }}
          >
            You are about to pay ${centsValue / 100} Dollars towards purchage of
            ${numberOfGold} TRBG
          </Typography>
        )}

        {step == "INPUT" ? (
          <Typography gutterBottom style={{ marginTop: "30px" }}>
            <TextField
              fullWidth
              min={10000}
              label="No of TRBG to purchase"
              name="TRBG"
              onChange={(e) => handleChange(e)}
              required
              value={numberOfGold}
              variant="outlined"
            />
          </Typography>
        ) : (
          secret && (
            <Elements stripe={loadStripe(
                stripeKey
              )} options={{ clientSecret: secret }}>
              <CheckoutForm payResponse={payResponse}/>
            </Elements>
          )
        )}
        <Typography gutterBottom style={{ marginTop: "30px" }}>
          {/* Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
            magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
            ullamcorper nulla non metus auctor fringilla. */}
        </Typography>
      </DialogContent>
      {step == "INPUT" && (
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              gotoStep1();
            }}
          >
            Next
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

export default Payment;

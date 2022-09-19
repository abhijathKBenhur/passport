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
import DoneAllIcon from "@mui/icons-material/DoneAll";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";

import "./payment.css";

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
  const [open, setOpen] = React.useState(false);
  const [secret, setSecret] = useState(undefined);
  const [step, setStep] = useState("INPUT");
  const [numberOfGold, setNumberOfGold] = useState(10000);
  const [centsValue, setCentsValue] = useState(100000);
  const [inputError, setInputError] = useState(false);
  const [stripeContext, setStripeContext] = useState(undefined);

  useEffect(() => {
    PaymentInterface.getClientKey()
      .then((success) => {
        let stripeKey = success?.data?.data;
        setStripeContext(loadStripe(stripeKey));
      })
      .catch((err) => {
        console.log("Could not get stripe key", err);
      });
  }, []);


  useEffect(() => {
   setOpen(props.open)
  }, [props.open]);


  
  const handleChange = (event, index) => {
    if(event.target.value < 10000){
      setInputError(true)
    }else{
      setInputError(false)
    }
    setNumberOfGold(event.target.value);
    setCentsValue((event.target.value / 10) * 100);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const gotoStep1 = () => {
    if(!inputError){
      setStep("CARD");
      PaymentInterface.getClientSecret({ value: parseInt(centsValue) }).then(
        (success) => {
          let cSecret = success?.data?.data?.client_secret;
          setSecret(cSecret);
        }
      );
    }
  };

  const payResponse = (value) => {
    if (value.success) {
      PaymentInterface.depositGold({
        email:props.company.email,
        tenantId:props.company.tenantId,
        metamaskId: props.company.contractAddress,
        goldToDeposit: numberOfGold,
      })
        .then((success) => {
          
          setStep("SUCCESS");
        })
        .catch((err) => {
          setStep("FAILURE");
        });
    } else {
      setStep("FAILURE");
    }

    console.log(value);
  };

  const getDialogTitle = () => {
    switch (step) {
      case "INPUT":
        return "Buy TRBG";
        break;
      case "CARD":
        return "Payment";
        break;
      case "SUCCESS":
        return "Payment Successful";
        break;
      case "FAILURE":
        return "Transaction failure";
        break;
    }
  };

  const getDialogueTopContent = (specific) => {
    switch (specific || step) {
      case "INPUT":
        return (
          <Typography gutterBottom>
            Please buy TRBG with your credit card. Price of each TRBG token is
            10 cents (US$ 0.1). You can buy upto 100,000 tokens at this price.
          </Typography>
        );
        break;
      case "CARD":
        return (
          <>
            {getDialogueTopContent("INPUT")}
            <Typography
              gutterBottom
              style={{ marginTop: "30px", marginBottom: "30px" }}
            >
              You are about to pay ${centsValue / 100} Dollars towards purchase
              of {numberOfGold} TRBG
            </Typography>
          </>
        );
      case "SUCCESS":
        return (
          <>
            <div style={{display:"flex", justifyContent:"center"}}>
              <DoneAllIcon fontSize="large" color="green"/>
            </div>
            <Typography
              gutterBottom
              style={{ marginTop: "30px", marginBottom: "30px" }}
            >
              Congratulations! Your payment of ${centsValue / 100} has been
              received and your account will be credited with {numberOfGold}{" "} TRBG shortly.
            </Typography>
          </>
        );
        break;
      case "FAILURE":
        return (
          <>
           <div style={{display:"flex", justifyContent:"center"}}>
              <AssignmentLateIcon fontSize="large" color="green"/>
            </div>
            <Typography
              gutterBottom
              style={{ marginTop: "30px", marginBottom: "30px" }}
            >
              Transaction failure! This transaction of ${centsValue / 100} was failed,
              please check the payment information provided. Please react out to
              us for any queries!
            </Typography>
          </>
        );
        break;
    }
  };

  const getDialogueCenterContent = () => {
    switch (step) {
      case "CARD":
        return (
          secret && (
            <Elements stripe={stripeContext} options={{ clientSecret: secret }}>
              <CheckoutForm payResponse={payResponse} />
            </Elements>
          )
        );
        break;
      case "INPUT":
        return (
          <>
            <Typography gutterBottom style={{ marginTop: "30px" }}>
              <TextField
                error={inputError}
                helperText={inputError?"Minimum purchase should be 10,000 TRBG" : ""}
                fullWidth
                label="No of TRBG to purchase"
                name="TRBG"
                type="number"
                onChange={(e) => handleChange(e)}
                required
                value={numberOfGold}
                variant="outlined"
              />
            </Typography>
            <Typography
              gutterBottom
              style={{ marginTop: "30px", fontStyle: "italic" }}
            >
              Minimum purchase is 10,000 TRBG
            </Typography>
          </>
        );
      default:
      case "SUCCESS":
        
        break;
    }
  };

  const getDialogueFooter = () => {
    switch (step) {
      case "INPUT":
        return (
          <Button
            autoFocus
            onClick={() => {
              gotoStep1();
            }}
          >
            Next
          </Button>
        );
        break;
      case "SUCCESS":
        return (
          <Button
            autoFocus
            onClick={() => {
              window.location.reload();
            }}
          >
            Reload
          </Button>
        );
        break;
      case "FAILURE":
        return (
          <Button
            autoFocus
            onClick={() => {
              handleClose();
            }}
          >
            Close
          </Button>
        );
        break;
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      keepMounted
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          style={{display:"flex",alignItems:"center"}}
          onClose={handleClose}
        >
          {getDialogTitle()}
          

        </BootstrapDialogTitle>

        <DialogContent dividers>
          {getDialogueTopContent()}
          {getDialogueCenterContent()}
        </DialogContent>

          <DialogActions>{getDialogueFooter()}</DialogActions>
      </>
    </Dialog>
  );
}

export default Payment;

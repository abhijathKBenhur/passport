import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm'
import React, { useEffect, useState } from "react";
import PaymentInterface from '../../Interfaces/PaymentInterface';
const stripePromise = loadStripe('pk_test_51LiDbWGqGIZBjd9PyLyRzgPcRGc0sNzatUTgqiI2YtZOvZFTfsMfIJHKSLVO3qAkLdSrBVTNmVhGh0h164cwaGtZ00C1Glbapq');

function Payment() {
    const [secret, setSecret] = useState(undefined)
    useEffect(() => {
        PaymentInterface.getClientSecret().then(success =>{
            let cSecret = success?.data?.data?.client_secret;
            setSecret(cSecret)
        })
      }, []);

  const options = {
    // passing the client secret obtained from the server
    clientSecret: secret,
  };

  return (
    secret && <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements> 
  );
};

export default Payment

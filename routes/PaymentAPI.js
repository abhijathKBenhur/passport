const IncentiveSchema = require("../db-config/Incentive.Schema");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

getClientSecret = async (req, res) => {
    try{
        const intent = await stripe.paymentIntents.create({
            amount: req.body.value,
            currency: 'usd',
            setup_future_usage: 'off_session',
        });
        return res.status(200).json({ success: true, data: intent });
    }
        catch(err){
            return res.status(400).json({ success: false, data: err });
        }
    }


    getClientKey = async (req, res) => {
    console.log("calling api getClientKey")
    try{
        return res.status(200).json({ success: true, data: process.env.STRIPE_PUBLIC_KEY });
    }
        catch(err){
            return res.status(400).json({ success: false, data: err });
        }
    }
   

router.post("/getClientSecret", getClientSecret);
router.post("/getClientKey", getClientKey);


module.exports = router;

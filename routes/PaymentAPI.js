const IncentiveSchema = require("../db-config/Incentive.Schema");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const stripe = require('stripe')('sk_test_51LiDbWGqGIZBjd9PzwRNwnvgMcHZkfbh9ddmxuOI8FMwoWEo4vtC7F6D1pSOO0FPxckdsOQBqXe5nusYVRBIBPEm00A1f3ipK5');

getClientSecret = async (req, res) => {
    console.log("calling api getClientSecret")
    try{
        const intent = await stripe.paymentIntents.create({
            amount: 999,
            currency: 'usd',
            setup_future_usage: 'off_session',
        });
        return res.status(200).json({ success: true, data: intent });
    }
        catch(err){
            return res.status(400).json({ success: false, data: err });
        }
    }
   

router.get("/getClientSecret", getClientSecret);


module.exports = router;

const IncentiveSchema = require("../db-config/Incentive.Schema");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

getAllTransactions = async (req, res) => {
  console.log("req from :::::" + req.body.userType)
  let payload = {
    action: { $ne: "PURCHASE" }
  }
  if(req.body.userType != "individual"){
    payload.companyName = req.body.companyName
  }else{
    payload.email = req.body.email
  }
    await IncentiveSchema.find(
      payload,
       // { tenantId: req.tenantId },
        (err, transactions) => {
          if (err) {
            return res.status(400).json({ success: false, error: err });
          }
          if (!transactions) {
            return res.status(404).json({ success: true, data: [] });
          }
          console.log("returning", transactions);
          return res.status(200).json({ success: true, data: transactions.map(item =>{
            let transformedAmount =  (item.amount && item.amount > 0)  ? item.amount / 1000000000000000000 : item.amount
            item.amount = transformedAmount
            return item
         })});
        }
      ).catch((err) => {
        return res.status(400).json({ success: false, data: err });
      });
}

getGroupedEarnings = async (req, res) => {
  let findCriteria = {};
  console.log("request", req.body.email)
  if (req.body.email) {
    findCriteria.email = req.body.email;
  }

  await IncentiveSchema.aggregate([
    {
      $match: {
        email: findCriteria.email,
      },
    },
    {
      $group: { 
        total: { $sum: "$amount" }, 
        status: { $first: "$status" }, 
        _id: "$companyName" ,
      }
    }
  ]).exec((err, transaction) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!transaction) {
      return res.status(404).json({ success: true, data: [] });
    }
    return res.status(200).json({ success: true, data: transaction });
  });
};

getIncentivesList = async (req, res) => {
  let findCriteria = {};
  if (req.body.status) {
    findCriteria.status = req.body.status;
  }

  await IncentiveSchema.find(findCriteria).exec((err, transaction) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!transaction) {
      return res.status(404).json({ success: true, data: [] });
    }
    return res.status(200).json({ success: true, data: transaction });
  });
};

router.post("/getAllTransactions", getAllTransactions);
router.post("/getGroupedEarnings", getGroupedEarnings);
router.get("/getIncentivesList", getIncentivesList);


module.exports = router;

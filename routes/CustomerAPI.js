const CompanySchema = require("../db-config/Company.schema");
const CustomerSchema = require("../db-config/Customer.Schema");
const IncentiveSchema = require("../db-config/Incentive.Schema");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");

incentivise = async (req, res) => {
  const incentiveObject = req.body;
  let requestAction = req.body.action;
  let incentiveUser = req.body.email;

  try{
    let companyDetails = await getCompanyDetails(req, res);
    let goldConfig = JSON.parse(companyDetails.goldConfig);

    console.log("companyDetails", companyDetails);
    if(companyDetails.status != "VERIFIED"){
      throw new ("Company is not yet elligible to participate in incentives programme")
    }
    let goldToGive = _.find(goldConfig, { action: requestAction }).value;
    console.log(
      "requesting ",
      goldToGive,
      " number of gold for action - ",
      requestAction + "to send to : " + incentiveUser
    );
    let updatedDistribution = parseFloat(companyDetails.distributed) + parseFloat(goldToGive);
    console.log(updatedDistribution)

    let updatedUser = await addOrUpdateUser(req, goldToGive);
    let updatedCompany = await updateCompanyDetails(req, {
      distributed: updatedDistribution,
    });
    let addedTransaction = await addTransaction({
      amount: goldToGive,
      action: requestAction,
      email: incentiveUser,
      tenantId: req.tenantId,
    });
    return res
    .status(200)
    .json({ success: true, data: "User has been incentivised successfully", mailAddress: incentiveUser });
  }catch(errorMessage){
    console.log("ERROR-- " + errorMessage)
    return res
      .status(400)
      .json({ success: false, error: errorMessage });
  }

};

const addTransaction = async (info) => {
  console.log("Adding transaction ");
  return new Promise((resolve, reject) => {
    const newIncentive = IncentiveSchema(info);
    newIncentive
      .save()
      .then((success) => {
        console.log("Add transaction success");
        resolve(success);
      })
      .catch((error) => {
        reject("Add transaction error"+ error);
      });
  });
};

const updateCompanyDetails = async (req, updates) => {
  console.log("updating company ");
  return new Promise((resolve, reject) => {
    CompanySchema.findOneAndUpdate(
      { key: req.key, secret: req.secret },
      updates,
      { upsert: true }
    )
      .then((user, b) => {
        console.log("Update company success");
        resolve(user);
      })
      .catch((error) => {
        reject("Update company error"+ error);
      });
  });
};

const getCompanyDetails = async (req, res) => {
  const myPromise = new Promise((resolve, reject) => {
    console.log("geting company");
    CompanySchema.findOne({ key: req.key, secret: req.secret }, (err, user) => {
      if (err) {
        reject("Get company error" + err);
      }
      if (!user) {
        reject("Could not get company details");
      }else{
        console.log("Get company success");
        console.log(user);
        resolve(user);
      }
    }).catch((err) => {
      reject("Get company error"+ err);
    });
  });
  return myPromise;
};

const addOrUpdateUser = async (req, goldToGive) => {
  return new Promise((resolve, reject) => {
    console.log("updating User ");
    let newAction = req.body.action;
    const newUser = CustomerSchema({
      email: req.body.email,
      balance: parseFloat(goldToGive),
      incentiveCount: 1,
      incentivisedActions: [newAction],
      tenantId: req.tenantId,
    });
    console.log("FInding with " + req.tenantId + " and " + req.body.email);
    CustomerSchema.findOne(
      { tenantId: newUser.tenantId, email: newUser.email },
      (err, user) => {
        if (err) {
          reject("Add user err", err);
        }
        if (!user || user == null) {
          console.log("user reeived" , user)
          newUser
            .save()
            .then((success) => {
              console.log("Add user success");
              resolve(success);
            })
            .catch((error) => {
              reject("Add user error"+ error);
            });
        } else {
          console.log("Found user", user);
          let userBalance = user.balance;
          let existingIncentivesCount = user.incentiveCount;
          let existingIncentivisedActions = user.incentivisedActions;
          console.log("existingIncentivisedActions", console.log(existingIncentivisedActions))
          // if(existingIncentivesCount.indexOf(newAction) > -1){
          //   throw new ("User was already incentivised for this action")
          // }

          console.log(existingIncentivisedActions.push(newAction),)
          console.log("new array", console.log(existingIncentivisedActions))
          

          let newGoldBalance = parseFloat(userBalance) + parseFloat(goldToGive);
          let updates = {
            balance:newGoldBalance,
            incentiveCount: (parseInt(existingIncentivesCount) + 1),
            incentivisedActions: existingIncentivisedActions
          };

          CustomerSchema.findOneAndUpdate(
            { tenantId: req.tenantId, email: req.body.email },
            updates,
            { upsert: true }
          )
            .then((user, b) => {
              console.log("details updated", user, b);
              resolve(user);
            })
            .catch((error) => {
              reject("Update user error"+ error);
            });
        }
      }
    );
  });
};

getAllUsers = async (req, res) => {
  await CustomerSchema.find(
    { tenantId: req.tenantId },
    (err, users) => {
      console.log("userss details fetched" , users);
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      if (!users) {
        return res.status(404).json({ success: true, data: [] });
      }
      console.log("returning");
      return res.status(200).json({ success: true, data: users });
    }
  ).catch((err) => {
    return res.status(400).json({ success: false, data: err });
  });
};

router.get("/getAllUsers", getAllUsers);
router.post("/incentivise", incentivise);

module.exports = router;

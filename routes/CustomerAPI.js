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

  try {
    let companyDetails = await getCompanyDetails(req, res);
    let goldConfig = JSON.parse(companyDetails.goldaConfig);

    console.log("goldConfig", goldConfig);
    if (companyDetails.status != "VERIFIED") {
      throw new "Company is not yet elligible to participate in incentives programme"();
    }
    let goldDistributed = await addOrUpdateUser(req, goldConfig);
    console.log("Gold distributed", goldDistributed);
    let updatedDistribution =
      parseFloat(companyDetails.distributed) + parseFloat(goldDistributed);

    let updatedCompany = await updateCompanyDetails(req, {
      distributed: updatedDistribution,
      $inc : {'balance' : -goldDistributed}
    });
    let addedTransaction = await addTransaction({
      amount: goldDistributed,
      action: requestAction,
      email: incentiveUser,
      tenantId: req.tenantId,
      type:"USER_INCENTIVE",
      status:"COMPLETED"
    });
    return res
      .status(200)
      .json({
        success: true,
        data: "User has been incentivised successfully",
        mailAddress: incentiveUser,
      });
  } catch (errorMessage) {
    console.log("ERROR-- " + errorMessage);
    return res.status(400).json({ success: false, error: errorMessage });
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
        reject("Add transaction error" + error);
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
        reject("Update company error" + error);
      });
  });
};

const getCompanyDetails = async (req, res) => {
  const myPromise = new Promise((resolve, reject) => {
    console.log("geting company :: ", req.key + " :: ", req.secret);
    CompanySchema.findOne(
      { key: req.key, secret: req.secret },
      (err, company) => {
        if (err) {
          reject("Get company error" + err);
        }
        if (!company) {
          reject("Could not get company details");
        } else {
          console.log("Get company success");
          console.log(company);
          resolve(company);
        }
      }
    ).catch((err) => {
      reject("Get company error" + err);
    });
  });
  return myPromise;
};

const getGoldToBeGiven = (action, n, config) => {
  n = n.toString()

  let matchingListing =
    _.find(config, { action: action, frequency: "always" }) ||
    _.find(config, { action: action, frequency: "n", NValue: n }) ||
    (n == 1 && _.find(config, { action: action, frequency: "once" }));
  
  console.log("matchingListing", matchingListing)
  return _.get(matchingListing, "value") || 0;
};

const addOrUpdateUser = async (req, goldConfig) => {
  return new Promise((resolve, reject) => {
    console.log("add or update User ");
    let newAction = req.body.action;
    console.log("Getting gold to give");
    let goldToGive = parseFloat(getGoldToBeGiven(newAction, 1, goldConfig));
    if(goldToGive == 0){
      console.log("No gold to be deposited")
    }
    let incentivisedActionsMap = {}
    incentivisedActionsMap[newAction] = 1
    const newUser = CustomerSchema({
      email: req.body.email,
      balance: goldToGive,
      incentiveCount: 1,
      incentivisedActions:incentivisedActionsMap,
      tenantId: req.tenantId,
    });
    console.log("New user object", newUser)
    console.log("FInding with " + req.tenantId + " and " + req.body.email);
    CustomerSchema.findOne(
      { tenantId: newUser.tenantId, email: newUser.email },
      (err, user) => {
        if (err) {
          reject("Add user err", err);
        }
        if (!user || user == null) {
          console.log("creating customer", newUser);
          if (goldToGive == 0) {
            console.log("No gold incentivised, skipping user creation");
          }
          console.log("creating customer", newUser);
          newUser
            .save()
            .then((success) => {
              console.log("Add user success");
              resolve(goldToGive);
            })
            .catch((error) => {
              reject("Add user error" + error);
            });
        } else {
          console.log("Found user, updating", user);
          let userBalance = user.balance;
          let existingIncentivesCount = user.incentiveCount;
          console.log("total existingIncentivesCount", existingIncentivesCount);

          let existingIncentivisedActions = user.incentivisedActions;
          console.log("total existingIncentivisedActions", existingIncentivisedActions);

          let incetiveCountForAction = existingIncentivisedActions.get(newAction) || 0
          console.log("total incetiveCountForAction", incetiveCountForAction);


          let newMap = Object.fromEntries(existingIncentivisedActions);
          newMap[newAction] = incetiveCountForAction + 1
          console.log("new map",newMap );
          goldToGive = getGoldToBeGiven(
            newAction,
            newMap[newAction],
            goldConfig
          );
          console.log("gold to give ", goldToGive)
          if (goldToGive == 0) {
            console.log("No gold incentivised for existing user");
          } 
            let newGoldBalance =
              parseFloat(userBalance) + parseFloat(goldToGive);
            let updates = {
              balance: newGoldBalance,
              incentiveCount: parseInt(existingIncentivesCount) + 1,
              incentivisedActions: newMap,
            };

            CustomerSchema.findOneAndUpdate(
              { tenantId: req.tenantId, email: req.body.email },
              updates,
              { upsert: true }
            )
              .then((user, b) => {
                resolve(goldToGive);
              })
              .catch((error) => {
                reject("Update user error" + error);
              });
        }
      }
    );
  });
};

getAllUsers = async (req, res) => {
  await CustomerSchema.find({ tenantId: req.tenantId }, (err, users) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!users) {
      return res.status(404).json({ success: true, data: [] });
    }
    console.log("returning");
    return res.status(200).json({ success: true, data: users });
  }).catch((err) => {
    return res.status(400).json({ success: false, data: err });
  });
};

getTotalUserCount = async (req, res) => {
  let userCount = await CustomerSchema.countDocuments();
  console.log("userCount",userCount)
  return res.status(200).json({ success: true, data: userCount });
};

router.get("/getAllUsers", getAllUsers);
router.post("/incentivise", incentivise);
router.post("/getTotalUserCount", getTotalUserCount);


module.exports = router;

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
    let goldConfig = JSON.parse(companyDetails.goldConfig);

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
    });
    let addedTransaction = await addTransaction({
      amount: goldDistributed,
      action: requestAction,
      email: incentiveUser,
      tenantId: req.tenantId,
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
  console.log(
    "Finding gold for " + n + "th Occurence of " + action + " from config :::",
    config
  );
  let matchingListing =
    _.find(config, { action: action, frequency: "always" }) ||
    _.find(config, { action: action, frequency: "n", NValue: n }) ||
    (n == 1 && _.find(config, { action: action, frequency: "once" }));
  return _.get(matchingListing, "value") || 0;
};

const addOrUpdateUser = async (req, goldConfig) => {
  return new Promise((resolve, reject) => {
    console.log("updating User ");
    let newAction = req.body.action;
    console.log("Getting gold to give");
    let goldToGive = parseFloat(getGoldToBeGiven(newAction, 1, goldConfig));
    const newUser = CustomerSchema({
      email: req.body.email,
      balance: goldToGive,
      incentiveCount: 1,
      incentivisedActions: {
        action: newAction,
        count: 1,
      },
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
          if (goldToGive == 0) {
            reject("No gold incentivised");
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
          console.log("Found user", user);
          console.log("updating User ");
          let userBalance = user.balance;
          let existingIncentivesCount = user.incentiveCount;
          let existingIncentivisedActions = user.incentivisedActions;
          console.log(
            "existingIncentivisedActions",
            console.log(existingIncentivisedActions)
          );
          // if(existingIncentivesCount.indexOf(newAction) > -1){
          //   throw new ("User was already incentivised for this action")
          // }

          let existingActionCount =
            _.get(existingIncentivisedActions[newAction], "count") || 0;
          existingIncentivisedActions[newAction] = existingActionCount + 1;
          console.log("new map", console.log(existingIncentivisedActions));
          goldToGive = getGoldToBeGiven(
            newAction,
            existingIncentivesCount + 1,
            goldConfig
          );
          if (goldToGive == 0) {
            reject("No gold incentivised");
          } else {
            let newGoldBalance =
              parseFloat(userBalance) + parseFloat(goldToGive);
            let updates = {
              balance: newGoldBalance,
              incentiveCount: parseInt(existingIncentivesCount) + 1,
              incentivisedActions: existingIncentivisedActions,
            };

            CustomerSchema.findOneAndUpdate(
              { tenantId: req.tenantId, email: req.body.email },
              updates,
              { upsert: true }
            )
              .then((user, b) => {
                console.log("details updated", user, b);
                resolve(goldToGive);
              })
              .catch((error) => {
                reject("Update user error" + error);
              });
          }
        }
      }
    );
  });
};

getAllUsers = async (req, res) => {
  await CustomerSchema.find({ tenantId: req.tenantId }, (err, users) => {
    console.log("userss details fetched", users);
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

router.get("/getAllUsers", getAllUsers);
router.post("/incentivise", incentivise);

module.exports = router;

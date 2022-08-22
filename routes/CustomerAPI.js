const CompanySchema = require("../db-config/Company.schema");
const UserSchema = require("../db-config/User.schema");
const TransactionSchema = require("../db-config/Transaction.schema");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");

incentivise = async (req, res) => {
  const incentiveObject = req.body;
  let requestAction = req.body.action;
  let incentiveUser = req.body.email;

  let companyDetails = await getCompanyDetails(req, res);
  let goldConfig = JSON.parse(companyDetails.goldConfig);

  console.log("companyDetails", companyDetails);
  console.log("companyDetails.distributed", companyDetails.distributed);
  let goldToGive = _.find(goldConfig, { action: requestAction }).value;
  console.log(
    "requesting ",
    goldToGive,
    " number of gold for action - ",
    requestAction + "to send to : " + incentiveUser
  );

  let updatedUser = await addOrUpdateUser(req, goldToGive);
  let updatedDistribution = +companyDetails.distributed + goldToGive;
  let updatedCompany = await updateCompanyDetails(req, {
    distributed: updatedDistribution,
  });
  let addedTransaction = await addTransaction({
    amount: goldToGive,
    action: requestAction,
    email: incentiveUser,
  });
};

const addTransaction = async (info) => {
  console.log("Adding transaction ");
  const newTransaction = TransactionSchema(info);
  newTransaction
    .save()
    .then((success) => {
      console.log("Add transaction success");
      resolve(success);
    })
    .catch((error) => {
      console.log("Add transaction error");
      reject(undefined);
    });
};

const updateCompanyDetails = async (req, updates) => {
  console.log("updating company ");
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
      console.log("Update company error", error);
      reject(undefined);
    });
};

const getCompanyDetails = async (req, res) => {
  const myPromise = new Promise((resolve, reject) => {
    CompanySchema.findOne({ key: req.key, secret: req.secret }, (err, user) => {
      if (err) {
        console.log("get company success");
        reject(undefined);
      }
      if (!user) {
        reject(undefined);
      }
      console.log("Get company success");
      resolve(user);
    }).catch((err) => {
      console.log("Get company error");
      reject(undefined);
    });
  });
  return myPromise;
};

const addOrUpdateUser = async (req, goldToGive) => {
  console.log("updating User ");
  let newAction = req.body.action;
  const newUser = UserSchema({
    email: req.body.email,
    balance: goldToGive,
    incentiveCount: 1,
    incentivisedActions: [newAction],
    tenantId: req.tenantId,
  });
  console.log("FInding with " + req.tenantId + "adn " + req.body.email);
  UserSchema.findOne(
    { key: newUser.tenantId, email: newUser.email },
    (err, user) => {
      if (err) {
        console.log("Add user err", err);
        reject(undefined);
      }
      if (!user || user == null) {
        newUser
          .save()
          .then((success) => {
            console.log("Add user success");
            resolve(success);
          })
          .catch((error) => {
            console.log("Add user error");
            reject(undefined);
          });
      } else {
        console.log("Found user", user);
        let userBalance = user.balance;
        let existingIncentivesCount = user.incentiveCount;
        let existingIncentivisedActions = user.incentivisedActions;
        let newGoldBalance = userBalance + goldToGive;
        let updates = {
          balance:newGoldBalance,
          incentiveCount: (existingIncentivesCount += 1),
          incentivisedActions: existingIncentivisedActions.push(newAction),
        };

        UserSchema.findOneAndUpdate(
          { key: req.tenantId, email: req.body.email },
          updates,
          { upsert: true }
        )
          .then((user, b) => {
            console.log("details updated", user, b);
            resolve(user);
          })
          .catch((error) => {
            console.log("Update user error");
            reject(undefined);
          })
          .catch((err) => {
            reject(undefined);
          });
      }
    }
  );
};
router.post("/incentivise", incentivise);

module.exports = router;

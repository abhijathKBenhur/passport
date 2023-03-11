const CompanySchema = require("../db-config/Company.schema");
const CustomerSchema = require("../db-config/Customer.Schema");
const IncentiveSchema = require("../db-config/Incentive.Schema");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");
const { buyGold } = require("./BlockchainAPIs/TribeGoldAPIs");

incentivise = async (req, res) => {
  const incentiveObject = req.body;
  let requestAction = req.body.action;
  let incentiveUser = req.body.email;



  try {
    let companyDetails = await getCompanyDetails(req, res);
    console.log("JSON parsing", companyDetails.goldConfig);
    if(req.body.password != "passport@100"){
      return res.status(400).json({ success: false, data: "Not authorised" });
    }
    let goldConfig = JSON.parse(companyDetails.goldConfig);

    console.log("goldConfig", goldConfig);
    if (companyDetails.status != "VERIFIED") {
      throw new "Company is not yet elligible to participate in incentives programme as it is not verified by Ideatribe"();
    }
  
    if (companyDetails.balance < _.max(_.map(goldConfig,"value"))) {
      throw new "Company is not yet elligible to participate in incentives programme as the balance is too low"();
    }
    let goldDistributed = await addOrUpdateUser(req, goldConfig);
    console.log("Gold distributed", goldDistributed);
    if (companyDetails.status != "VERIFIED") {
      throw new "Company is not yet elligible to participate in incentives programme"();
    }
    let updatedDistribution =
      parseFloat(companyDetails.distributed) + parseFloat(goldDistributed);

    let updatedCompany = await updateCompanyDetails(req, {
      distributed: updatedDistribution,
      $inc : {'balance' : 0 - (goldDistributed )}
    });
    let addedTransaction = await addTransaction({
      amount: goldDistributed,
      action: requestAction,
      email: incentiveUser,
      tenantId: req.tenantId,
      type:"USER_INCENTIVE",
      status:"COMPLETED",
      companyName:companyDetails.companyName
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
  console.log("updating company with", updates);
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
  console.log("action : ", action + " n:" ,n )
  console.log(config)
  let matchingListing =
    _.find(config, { action: action, frequency: "always" }) ||
    _.find(config, { action: action, frequency: "n", NValue: n }) ||
    (n == 1 && _.find(config, { action: action, frequency: "once" }));
  
  console.log("matchingListing", matchingListing)
  return (parseFloat(_.get(matchingListing, "value"))* 1000000000000000000) || 0;
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
      {email: newUser.email },
      (err, user) => {
        if (err) {
          reject("Add user err", err);
        }
        if (!user || user == null) {
          reject("No gold incentivised, user not found");

          // if (goldToGive == 0) {
          //   console.log("No gold incentivised, skipping user creation");
          //   reject("No gold incentivised, user not found");
          // }
          // console.log("creating customer", newUser);
          // newUser
          //   .save()
          //   .then((success) => {
          //     console.log("Add user success");
          //     resolve(goldToGive);
          //   })
          //   .catch((error) => {
          //     reject("Add user error" + error);
          //   });
        } else {
          console.log("Found user, updating", user);
          let userBalance = user.balance;
          let existingIncentivesCount = user.incentiveCount;
          console.log("total existingIncentivesCount", existingIncentivesCount);
          const map1 = new Map();
          map1.set(newAction, 0);

          let existingIncentivisedActions = user.incentivisedActions || map1
          console.log("total existingIncentivisedActions", existingIncentivisedActions);

          let incetiveCountForAction = existingIncentivisedActions[newAction] || 0
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
              parseFloat(userBalance) +  parseFloat(goldToGive)
            let updates = {
              balance: newGoldBalance,
              incentiveCount: parseInt(existingIncentivesCount) + 1,
              incentivisedActions: newMap,
            };

            CustomerSchema.findOneAndUpdate(
              {email: req.body.email },
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


redeemGold = async (req, res) => {
  console.log("Redeeming gold")
  let findCriteria = {};
  if (req.body.email) {
    findCriteria.companyName = req.body.companyName;
  }

  let userElligibility = await IncentiveSchema.aggregate([
    {
      $match: {
        email: req.body.email,
        status: "COMPLETED"
      },
    },
    {
      $group: {
        total: { $sum: "$amount" },
        _id: "$companyName",
      },
    },
    {
      $match: {
        _id: findCriteria.companyName,
      },
    },
  ]).exec();

  console.log(userElligibility);
  let company = await CompanySchema.findOne(findCriteria);
  console.log("Found company details", company)
  if (userElligibility && userElligibility[0] && userElligibility[0].total <= company.balance  && userElligibility[0].total <= req.body.balance) {
    console.log("Transferring , ", userElligibility[0].total + " from the company balance of "+ company.balance)
    console.log("private key ---- "+company.pKey);

    buyGold(
      req.body,
      userElligibility[0].total / 1000000000000000000,
      "REDEEM",
      company
    )
      .then((success) => {
        console.log("deposited", success);
        CustomerSchema.findOneAndUpdate(
          {email: req.body.email },
          {
            $inc : 
            {
              'balance' : 0 - (userElligibility[0].total),
            }
          },
          { upsert: true }
        )
          .then((user, b) => {
            IncentiveSchema.updateMany(
              {
                tenantId:company.tenantId,
                email:req.body.email
        
              },
              { "status": "REDEEMED" }
            )
          })
          .catch((error) => {
            console.log("ERRORING OUT")
          });

        console.log("reduced user balance", userElligibility[0].total);
        console.log("updating all incentives with ", company.tenantId + " email : " + req.body.email)
        console.log("updated redeem status");

        return res.status(200).json({ success: true, data: "Redemption is success" });
      })
      .catch((err) => {
        console.log("error", err);
        return res.status(400).json({ success: false, data: err });
      });

  }else{
    return res.status(400).json({ success: false, data: "Not enough balance" });
  }

};

router.get("/getAllUsers", getAllUsers);
router.post("/incentivise", incentivise);
router.post("/getTotalUserCount", getTotalUserCount);
router.post("/redeemGold", redeemGold);

module.exports = router;

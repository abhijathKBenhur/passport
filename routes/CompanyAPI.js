const CompanySchema = require("../db-config/Company.schema");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");

updateDetails = async (req, res) => {
  const newUser = req.body;
  let updates = {
    details: req.body.details,
    status:req.body.status
  };
  console.log(`updating with key ${req.key} and value ${req.secret}`);

  CompanySchema.findOneAndUpdate(
    { key: req.key, secret: req.secret },
    updates,
    { upsert: true , new: true}
  )
    .then((user, b) => {
      console.log("details updated", user, b);
      return res.status(201).json({
        success: true,
        data: user,
        message: "details updated!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "details update failed!",
      });
    });
};


configureDistribution = async (req, res) => {
  console.log("Saving gold config ", req.body.goldConfig)

  let updates = {
    goldConfig: req.body.goldConfig,
  };
  console.log(`updating with key ${req.key} and value ${req.secret}`);

  CompanySchema.findOneAndUpdate(
    { key: req.key, secret: req.secret },
    updates,
    { upsert: true }
  )
    .then((user, b) => {
      console.log("details updated", user, b);
      return res.status(201).json({
        success: true,
        data: user,
        message: "details updated!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "details update failed!",
      });
    });
};

getDetails = async (req, res) => {
  let findCriteria = {};
  findCriteria.key = req.key;
  findCriteria.secret = req.secret;
  await CompanySchema.findOne(
    { key: req.key, secret: req.secret },
    (err, user) => {
      console.log("company details fetched" , user);
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      if (!user) {
        return res.status(404).json({ success: true, data: [] });
      }
      return res.status(200).json({ success: true, data: user });
    }
  ).catch((err) => {
    return res.status(400).json({ success: false, data: err });
  });
};


getTokenForDummy = async (req, res) => {
  console.log("getTokenForDummy details fetching");
  let findCriteria = {};
  
  findCriteria.companyName = req.companyName;
  console.log("company details fetching", findCriteria);
  await CompanySchema.findOne(
    { companyName: req.body.companyName },
    (err, company) => {
      console.log("company details fetched" , company);
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      if (!company) {
        return res.status(404).json({ success: true, data: [] });
      }
      console.log("company details fetched", company);
      var token = jwt.sign(
        {
          tenantId: company.tenantId,
          key: company.key,
          secret: company.secret,
        },
        process.env.TWEETER_KOO
      );
      console.log("token generated here now", token);
      console.log("returning");
      return res.status(200).json({ success: "true", data: token });
    }
  ).catch((err) => {
    return res.status(400).json({ success: false, data: err });
  });
};



router.post("/updateDetails", updateDetails);
router.get("/getDetails", getDetails);
router.post("/configureDistribution", configureDistribution);
router.post("/getTokenForDummy", getTokenForDummy);






module.exports = router;

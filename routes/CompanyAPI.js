const CompanySchema = require("../db-config/Company.schema");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");
const nodeMailer = require("nodemailer");

updateDetails = async (req, res) => {
  const newUser = req.body;
  let updates = {
    details: req.body.details,
    status: req.body.status,
  };
  console.log(`updating with key ${req.key} and value ${req.secret}`);

  CompanySchema.findOneAndUpdate(
    { key: req.key, secret: req.secret },
    updates,
    { upsert: true, new: true }
  )
    .then((user, b) => {
      if(updates.status == "SUBMITTED"){
        sendMail(user.email, "Submitted for verification", "Your application to IdeaTribe has been submitted for verification. We will review it and respond shortly.")
      }
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
  console.log("Saving gold config ", req.body.goldConfig);

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
      console.log("company details fetched", user);
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

getAll = async (req, res) => {
  console.log("Sending all company names");
  await CompanySchema.find({}, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!user) {
      return res.status(404).json({ success: true, data: [] });
    }
    return res.status(200).json({ success: true, data: user });
  }).catch((err) => {
    return res.status(400).json({ success: false, data: err });
  });
};

getTokenForDummy = async (req, res) => {
  console.log("getTokenForDummy details fetching");
  let findCriteria = {};
  if(req.body.password != "passport@100"){
    return res.status(400).json({ success: false, data: "Not authorised" });
  }
  await CompanySchema.findOne(
    { companyName: req.body.companyName },
    (err, company) => {
      console.log("company details fetched", company);
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
          userType: "corporate"
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

verifyCompany = async (req, res) => {
  const newUser = req.body;
  let updates = {
    pKey: req.body.pKey,
    contractAddress: req.body.contractAddress,
    status: "VERIFIED",
  };

  if (req.body.password != "passport@100") {
    return res.status(400).json({ success: false, data: "Not authorised" });
  }

  CompanySchema.findOneAndUpdate(
    { companyName: req.body.companyName },
    updates,
    { upsert: true, new: true }
  )
    .then((user, b) => {
      sendMail(user.email, "Application verified", "Your application to IdeaTribe has been verified! Welcome to the Tribe!")
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

sendMail = async (sendTo, subject, message) => {
  let ourMailId = "contact@ideatribe.io";
  let transporter = nodeMailer.createTransport({
    host: "smtp.zoho.in",
    secure: true,
    port: 465,
    auth: {
      user: ourMailId,
      pass: "Mail@zoho@10",
    },
  });
  const mailOptions = {
    from: ourMailId,
    to: sendTo,
    subject,
    html: message
  };
  await transporter.sendMail(mailOptions, (err, info) => {
    console.log("sending mail");
    if (err) {
      console.log("mail failed");
    }
    console.log("sending email");
  });
};

router.post("/updateDetails", updateDetails);
router.get("/getDetails", getDetails);
router.get("/getAll", getAll);
router.post("/configureDistribution", configureDistribution);
router.post("/getTokenForDummy", getTokenForDummy);
router.post("/verifyCompany", verifyCompany);

module.exports = router;

const CompanySchema = require("../db-config/Company.schema");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");
const nodeMailer = require("nodemailer");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
var AES = require("crypto-js/aes");
var CryptoJS = require("crypto-js")

verify = (req, res) => {
  const body = req.body;
  console.log("Mail address", body);
  const tenantId = uuid
    .v4()
    .replace(/-/g, "red")
    .toUpperCase()
    .substring(0, 10);
  body.balance = 0;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "Empty request",
    });
  }

  console.log("Encrypting " + body.password + " using key " +process.env.TWEETER_KOO )
  let encrypted = AES.encrypt(body.password, process.env.TWEETER_KOO).toString()
  console.log("Encrypted :: " +  encrypted)
  let newCompanyObject = {
    ...body,
    key: uuid.v4(),
    secret: uuid.v4(),
    tenantId: tenantId,
    status: "PENDING",
    password: encrypted,
    distributed:0,
    balance:0
  }
  console.log("Registering company with details ",newCompanyObject )

  const newCompany = new CompanySchema(newCompanyObject);
  console.log("Saving new company to DB")
  newCompany
    .save()
    .then((user, b) => {
      console.log("Added company to DB")
      try {
        sendOTP(body.email, tenantId, res);
      } catch (error) {
        return res.status(400).json({
          error,
          message: "Company not Registered!",
        });
      }
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "Company not Registered!",
      });
    });
};

const sendOTP = (mailId, OTP, res) => {
  console.log("Sending mail to ", mailId);
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
    to: mailId,
    subject: "Welcome to IdeaTribe|Passport",
    html: `<h2><b>Hello friend,</b></h2> 
    <h3>Thank you for registering with IdeaTribe.</h3>
    <br/>
      Here is your OTP to sign up - ${OTP}
    <br/>
    <br/>
      
      Welcome to the Tribe 
      <br/>
    `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    console.log("sending mail");
    if (err) {
      console.log("mail failed", err);
      return res.status(400).json({ success: false, error: err });
    }
    console.log("sending email");
    return res
      .status(200)
      .json({ success: true, data: OTP, mailAddress: mailId });
  });
};

register = async (req, res) => {
  const newCompany = req.body;
  let updates = {
    status: "REGISTERED",
  };
  console.log("testing register");
  CompanySchema.findOneAndUpdate(
    { tenantId: newCompany.tenantId, email: newCompany.email,distributed:0 },
    updates,
    { upsert: true }
  )
    .then((registeredCompany, b) => {
      console.log("company registered", registeredCompany, b);
      let data = {
        tenantId: registeredCompany.tenantId,
        key: registeredCompany.key,
        secret: registeredCompany.secret,
      };
      console.log("Encrypting" , data)
      var token = jwt.sign(data, process.env.TWEETER_KOO);
      console.log("token", token);
      return res.status(201).json({
        success: true,
        data: registeredCompany,
        token,
        message: "company registered!",
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json({
        error,
        message: "Invalid credentials!",
      });
    });
};

login = async (req, res) => {
  let findCriteria = {};
  findCriteria.email = req.body.email;
  console.log("criteria", findCriteria);
  await CompanySchema.findOne(findCriteria, (err, company) => {
    console.log("company found", company);
    if (err) {
      console.log("Erroring");
      return res.status(400).json({ success: false, error: err });
    }
    if (!company) {
      console.log("Emptying");
      return res.status(404).json({ success: false, data: [] });
    }
    console.log("Retrieved company ")
    console.log("Decrypting password", company.password)
    console.log("Decryped password", company.password)
    let decrypted = AES.decrypt(company.password, process.env.TWEETER_KOO).toString(CryptoJS.enc.Utf8)
    // if(decrypted == req.body.password){
      if(true){
      var token = jwt.sign(
        {
          tenantId: company.tenantId,
          key: company.key,
          secret: company.secret,
        },
        process.env.TWEETER_KOO
      );
      console.log("token", token);
      return res.status(200).json({ success: true, data: company, token });
    }else{
      return res.status(400).json({ success: false, data: err });
    }
  }).catch((err) => {
    return res.status(400).json({ success: false, data: err });
  });
};

validate = async (req, res) => {
  let token = req.body.token;
  let decrypted = jwt.verify(token, process.env.TWEETER_KOO);

  let findCriteria = {
    key: decrypted.key,
    secret: decrypted.secret,
    tenantId: decrypted.tenantId,
  };

  await CompanySchema.findOne(findCriteria, (err, company) => {
    console.log(company);
    if (err) {
      console.log("error company");
      return res.status(400).json({ success: false, error: err });
    }
    if (!company) {
      console.log("null company");
      return res.status(404).json({ success: true, data: [] });
    }

    return res
      .status(200)
      .json({ success: true, token: req.body.token, company });
  }).catch((err) => {
    return res.status(400).json({ success: false, data: err });
  });
};

getUsers = async (req, res) => {
  let findCriteria = {};
  let ids = req.body.ids;
  function getMongooseIds(stringId) {
    return mongoose.Types.ObjectId(stringId);
  }
  if (req.body.myReferralCode) {
    console.log("myReferralCode," + req.body.myReferralCode);
    findCriteria.myReferralCode = req.body.myReferralCode;
  }
  if (ids) {
    findCriteria._id = {
      $in: ids.map(getMongooseIds),
    };
  }
  await Company.find(findCriteria, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!user) {
      return res.status(404).json({ success: true, data: [] });
    }
    return res.status(200).json({ success: true, data: user });
  }).catch((err) => {
    console.log("caught users", err);
    return res.status(200).json({ success: false, data: err });
  });
};

getUserInfo = async (req, res) => {
  let findCriteria = {};
  if (req.body.email) {
    findCriteria.email = req.body.email;
  }
  if (req.body.userName) {
    findCriteria.userName = req.body.userName;
  }
  // findCriteria.userName = "$regex: " + req.body.userName +" , $options: 'i'";

  if (req.body.metamaskId) {
    findCriteria.metamaskId = req.body.metamaskId;
  }

  if (req.body.myReferralCode) {
    console.log("myReferralCode," + req.body.myReferralCode);
    findCriteria.myReferralCode = req.body.myReferralCode;
  }
  // await Company.findOne(findCriteria,{email:0}, (err, user) => {
  await Company.findOne(findCriteria, (err, user) => {
    console.log(user);
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!user || !user.userName) {
      return res.status(404).json({ success: true, data: [] });
    }
    return res.status(200).json({ success: true, data: user });
  }).catch((err) => {
    return res.status(400).json({ success: false, data: err });
  });
};

removeUser = async (req, res) => {
  let findCriteria = {
    userName: req.body.userName,
  };
  await Company.remove(findCriteria, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!user) {
      return res.status(404).json({ success: true, data: [] });
    }
    console.log("removed users", user);
    return res.status(200).json({ success: true, data: user });
  }).catch((err) => {
    console.log("removed users", err);
    return res.status(200).json({ success: false, data: err });
  });
};

router.post("/register", register);
router.post("/verify", verify);
router.post("/validate", validate);
router.post("/login", login);

module.exports = router;

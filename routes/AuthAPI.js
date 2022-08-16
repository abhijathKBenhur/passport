const CompanySchema = require("../db-config/Company.schema");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");
const nodeMailer = require("nodemailer");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
var AES = require("crypto-js/aes");
const { find } = require("../db-config/Company.schema");



verify = (req, res) => {
  const body = req.body;
  console.log("Mail address", body)
  const tenantId = uuid.v4().replace(/-/g, "red").toUpperCase().substring(0,10);
  body.balance = 0;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "Empty request",
    });
  }

  const newCompany = new CompanySchema({ ...body,
    key: uuid.v4(),
    secret: uuid.v4(),
    tenantId: tenantId,
    status: "PENDING",
    password: AES.encrypt(body.password, process.env.TWEETER_KOO).toString()
  });

  newCompany
  .save()
  .then((user, b) => {
    try{
      sendOTP(body.email,tenantId, res)
    }catch(error){
      return res.status(400).json({
        error,
        message: "Company not Registered!",
      });
    };
  })
  .catch((error) => {
    return res.status(400).json({
      error,
      message: "Company not Registered!",
    });
  });
};

const sendOTP = (mailId, OTP, res) =>{
  console.log("Sending mail to ", mailId)
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
      console.log("mail failed",err);
      return res.status(400).json({ success: false, error: err });
    }
    console.log("sending email");
    return res.status(200).json({ success: true, data: OTP, mailAddress:mailId });
  });
}

register = async (req, res) => {
  const newCompany = req.body;
  let updates = {
    status: "REGISTERED"
  };
  console.log("testing register");
  CompanySchema.findOneAndUpdate({tenantId:newCompany.tenantId, email:newCompany.email}, updates, { upsert: true })
    .then((user, b) => {
      console.log("company registered", user, b);
      let data = { 
        clientId:newCompany.clientId,  
        key:newCompany.key,  
        secret:newCompany.secret,  
      }
      console.log("encrypting",data)
      var token = jwt.sign(data, process.env.TWEETER_KOO);
      console.log("token", token)
      return res.status(201).json({
        success: true,
        data: user,
        token,
        message: "company registered!",
      });
    })
    .catch((error) => {
      console.log(error)
      return res.status(400).json({
        error,
        message: "Invalid credentials!",
      });
    });
};

login = async (req, res) => {
  let findCriteria = {};
  if (req.body.email) {
    findCriteria.email = req.body.email;
  }
  if (req.body.password) {
    findCriteria.password = AES.encrypt(req.body.password, process.env.TWEETER_KOO).toString();
  }
  console.log("criterua" , findCriteria)
  // findCriteria.userName = "$regex: " + req.body.userName +" , $options: 'i'";

  await CompanySchema.findOne(findCriteria, (err, company) => {
    console.log(company);
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!company || !company.userName) {
      return res.status(404).json({ success: true, data: [] });
    }
    var token = jwt.sign({ 
      clientId:company.clientId,  
      key:company.key,  
      secret:company.secret,  
    }, process.env.TWEETER_KOO);
    console.log("token", token)
    return res.status(200).json({ success: true, data: user, token });
  }).catch((err) => {
    return res.status(400).json({ success: false, data: err });
  });
};

validate = async (req, res) => {
  console.log("decrypted", decrypted)

    let token = req.body.token;
    let decrypted = jwt.verify(token, process.env.TWEETER_KOO);
    console.log("decrypted", decrypted)

    let findCriteria = {
      email: decrypted.email,
      key: decrypted.key,

    }
  await CompanySchema.findOne(findCriteria, (err, company) => {
    console.log(company);
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!company || !company.userName) {
      return res.status(404).json({ success: true, data: [] });
    }
   
    return res.status(200).json({ success: true,  token: req.body.token });
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

sendMail = async (req, res) => {
  let sendTo = req.body.tempEmail;
  let ourMailId = "contact@ideatribe.io";
  let otp = (Math.random() + 1).toString(36).substring(7).toUpperCase();

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
    subject: "Welcome to IdeaTribe",
    html: `<h2><b>Hello friend,</b></h2> 
    <h3>Thank you for registering with IdeaTribe.</h3>
    <br/>
      Here is your OTP to sign up - ${otp}
    <br/>
    <br/>
      
Welcome to the Tribe 
<br/>
- Founding Tribers
    <br/>

    `,
  };

  await transporter.sendMail(mailOptions, (err, info) => {
    console.log("sending mail");
    if (err) {
      console.log("mail failed");
      return res.status(400).json({ success: false, error: err });
    }
    console.log("sending email");
    return res.status(200).json({ success: true, data: otp });
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

updateUser = async (req, res) => {
  const newUser = req.body;
  let updates = {
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    facebookUrl: newUser.facebookUrl,
    linkedInUrl: newUser.linkedInUrl,
    twitterUrl: newUser.twitterUrl,
    instaUrl: newUser.instaUrl,
    bio: newUser.bio,
    imageUrl: newUser.imageUrl
  };
  console.log("testing");
  Company.findByIdAndUpdate(req.body.id, updates, { upsert: true })
    .then((user, b) => {
      console.log("user updated", user, b);
      return res.status(201).json({
        success: true,
        data: user,
        message: "user updated!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "user update failed!",
      });
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

sendMail = async (req, res) => {
  let sendTo = req.body.tempEmail;
  let ourMailId = "contact@ideatribe.io";
  let otp = (Math.random() + 1).toString(36).substring(7).toUpperCase();

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
    subject: "Welcome to IdeaTribe",
    html: `<h2><b>Hello friend,</b></h2> 
    <h3>Thank you for registering with IdeaTribe.</h3>
    <br/>
      Here is your OTP to sign up - ${otp}
    <br/>
    <br/>
      
Welcome to the Tribe 
<br/>
- Founding Tribers
    <br/>

    `,
  };

  await transporter.sendMail(mailOptions, (err, info) => {
    console.log("sending mail");
    if (err) {
      console.log("mail failed");
      return res.status(400).json({ success: false, error: err });
    }
    console.log("sending email");
    return res.status(200).json({ success: true, data: otp });
  });
};
router.post("/register", register);
router.post("/verify", verify);
router.post("/validate", validate);
router.post("/login", login);


module.exports = router;

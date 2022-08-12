const CompanySchema = require("../db-config/Company.schema");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");


updateUser = async (req, res) => {
  const newUser = req.body;
  let updates = {
    details: newUser.firstName,
  };
  console.log("testing");
  CompanySchema.findByIdAndUpdate(req.body.id, updates, { upsert: true })
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

router.post("/updateUser", updateUser);

module.exports = router;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Company = new Schema(
  {
    password: { type: String },
    companyName: { type: String },
    goldConfig: { type: String },
    balance: { type: Number },
    mailAddress:{ type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", Company);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Company = new Schema(
  {
    password: { type: String },
    companyName: { type: String },
    goldConfig: { type: String },
    balance: { type: Number },
    email:{ type: String },
    status:{ type: String },
    tenantId: { type: String },
    key: { type: String },
    secret: { type: String }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", Company);

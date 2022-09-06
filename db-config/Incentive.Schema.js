const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Incentive = new Schema(
  {
    amount: { type: Number },
    action:{ type: String },
    frequency:{ type: String },
    NValue:{ type: Number },
    message:{ type: String },
    tenantId:{ type: String },
    email:{ type: String },
    type:{ type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Incentive", Incentive);

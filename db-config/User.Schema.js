const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Customer = new Schema(
  {
    wallet: { type: String },
    email: { type: Number },
    balance:{ type: String },
    incentiveCount:{ type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", Customer);

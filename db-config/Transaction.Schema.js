const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Transaction = new Schema(
  {
    amount: { type: Number },
    action:{ type: String },
    message:{ type: String },
    tenantId:{ type: String },
    email:{ type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", Transaction);

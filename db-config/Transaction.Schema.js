const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Transaction = new Schema(
  {
    wallet: { type: String },
    amount: { type: Number },
    action:{ type: String },
    txn:{ type: String },
    status:{ type: String },
    time:{ type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", Transaction);

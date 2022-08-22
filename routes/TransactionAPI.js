const TransactionSchema = require("../db-config/Transaction.schema");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

getAllTransactions = async (req, res) => {
    await TransactionSchema.find(
        {  },
        // { tenantId: req.tenantId },
        (err, transactions) => {
          console.log("userss details fetched" , transactions);
          if (err) {
            return res.status(400).json({ success: false, error: err });
          }
          if (!transactions) {
            return res.status(404).json({ success: true, data: [] });
          }
          console.log("returning");
          return res.status(200).json({ success: true, data: transactions });
        }
      ).catch((err) => {
        return res.status(400).json({ success: false, data: err });
      });
}

router.get("/getAllTransactions", getAllTransactions);


module.exports = router;

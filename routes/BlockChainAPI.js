const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { tribeGoldContract } = require("./BlockchainAPIs/BlockChainUtils");

const getBalance = (req, res) => {
  tribeGoldContract.getBalance(req.body.account).then(success =>{
    return res.status(200).json({ success: true, data: success });
  }).catch(err =>{
        return res.status(404).json({ success: true, data: err });
  })
};

const depositGold = (req, res) => {
  tribeGoldContract.depositGold(
    req.body.account,
    goldToDeposit
  ).then(success =>{
    return res.status(200).json({ success: true, data: success });
  }).catch(err =>{
        return res.status(404).json({ success: true, data: err });
  })
};


router.post("/getBalance", getBalance);
router.post("/depositGold", depositGold);

module.exports = router;

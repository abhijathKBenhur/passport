const Web3Utils = require("web3-utils");
const _ = require("lodash");

const BlockchainUtils = require("../BlockchainAPIs/BlockChainUtils");
const TransactionSchema = require("../../db-config/Incentive.Schema")
const CompanySchema = require("../../db-config/Company.schema");

const web3Instance = BlockchainUtils.web3Instance;
const tribeGoldContract = BlockchainUtils.tribeGoldContract;
const transactionObject = {};

web3Instance.eth.getAccounts().then(result => {
  transactionObject.from = result[1];
})

getBalance = (account) =>{
  return tribeGoldContract.getBalance(account)
}

depositGold = (receiverUserObject, ethValue) => {
  console.log("INITIATING GOLD DEPOSITS TO " + receiverUserObject.metamaskId);
  const promise = new Promise((resolve, reject) => {
    tribeGoldContract.methods
      .transfer(receiverUserObject.metamaskId, ethValue)
      .send(transactionObject)
      .on("transactionHash", function (hash) {
        new TransactionSchema({
          amount: ethValue,
          action: "PURCHASE",
          type:"USER_INCENTIVE",
          status:"PENDING",
          hash:hash,
          // through stripe metadata
          email: "company mail address",
          tenantId: "req.tenantId",
        }).save();
      })
      .once("receipt", function (receipt) {
        TransactionSchema.findOneAndUpdate(
          { type: receipt.transactionHash },
          { status: "COMPLETED" }
        );
        CompanySchema.findOneAndUpdate(
          { email: "req.key", tenantId: "req.tenantId" },
          {$inc : {'balance' : ethValue}},
          { upsert: true }
        )
        resolve(receipt.transactionHash);
      })
      .once("error", function (error) {
        let transactionHash = _.get(error, "receipt.transactionHash");
        TransactionSchema.findOneAndUpdate(
          { type: transactionHash },
          { status: "FAILED" }
        );
        console.log("Deposit feiled to new user in TBGApi");
        console.log("error ", error);
        web3Instance.eth
          .getTransaction(transactionHash)
          .then((tx) => {
            web3Instance.eth
              .call(tx, tx.blockNumber)
              .then((result) => {
                resolve(result);
              })
              .catch((err) => {
                console.log("err.message ", err.message);
                reject(err.message);
              });
          })
          .catch((err) => {
            reject(err.toString());
          });
      });
  });
  return promise;
};

module.exports = {
  depositGold,
  getBalance,
};

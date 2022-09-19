const Web3Utils = require("web3-utils");
const _ = require("lodash");

const BlockchainUtils = require("../BlockchainAPIs/BlockChainUtils");
const TransactionSchema = require("../../db-config/Incentive.Schema")
const CompanySchema = require("../../db-config/Company.schema");

const web3Instance = BlockchainUtils.web3Instance;
const tribeGoldContract = BlockchainUtils.tribeGoldContract;
const transactionObject = {};

web3Instance.eth.getAccounts().then(result => {
  transactionObject.from = result[0];
})

getBalance = (account) =>{
  return tribeGoldContract.getBalance(account)
}

transferGold = (requestObject, ethValue) => {
  console.log("INITIATING GOLD DEPOSITS TO " + requestObject.metamaskId, " ::: " , ethValue);
  const promise = new Promise((resolve, reject) => {
    tribeGoldContract.methods
      .transfer(requestObject.metamaskId, ethValue)
      .send(transactionObject)
      .on("transactionHash", function (hash) {
        console.log("Started transaction ")
        new TransactionSchema({
          amount: ethValue,
          action: "PURCHASE",
          type:"USER_INCENTIVE",
          status:"PENDING",
          hash:hash,
          // through stripe metadata
          email: requestObject.email,
          tenantId:requestObject.tenantId,
        }).save();
      })
      .once("receipt", function (receipt) {
        console.log("Completed transaction ")
        TransactionSchema.findOneAndUpdate(
          { hash: receipt.transactionHash },
          { status: "COMPLETED" }
        ).then(success =>{
          console.log("Completed transaction with satus ")
        }).catch(err =>{
          console.log("Failed transaction with satus ")
        })
        CompanySchema.findOneAndUpdate(
          { email: requestObject.email, tenantId: requestObject.tenantId },
          { $inc : {'balance' : ethValue}},
          { upsert: true }
        ).then(success =>{
          console.log("Completed balance ")
        }).catch(err =>{
          console.log("Failed balance update ")
        })
        console.log("Completed updations ")
        resolve(receipt.transactionHash);
      })
      .once("error", function (error) {
        let transactionHash = _.get(error, "receipt.transactionHash");
        TransactionSchema.findOneAndUpdate(
          { hash: transactionHash },
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
  transferGold,
  getBalance,
};

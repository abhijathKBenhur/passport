const Web3Utils = require("web3-utils");
const _ = require("lodash");

const BlockchainUtils = require("../BlockchainAPIs/BlockChainUtils");
const TransactionSchema = require("../../db-config/Incentive.Schema")
const CompanySchema = require("../../db-config/Company.schema");

const web3Instance = BlockchainUtils.web3Instance;
const tribeGoldContract = BlockchainUtils.tribeGoldContract;
const transactionObject = {};

web3Instance.eth.getAccounts().then(result => {
  console.log("ETH INSTANCE", result)
  transactionObject.from = result[0];
})

getBalance = (account) =>{
  return tribeGoldContract.getBalance(account)
}



buyGold = (requestObject, ethValue, action, fromCompany) => {
  console.log("requestObject")
  console.log(requestObject)
  let ethInWeiValue = Web3Utils.toWei(ethValue.toString(), "ether")
  console.log("INITIATING GOLD DEPOSITS TO " + requestObject.metamaskId, " ::: " , ethInWeiValue);
  if(action == "REDEEM"){
    web3Instance.eth.personal.importRawKey(fromCompany.pKey, process.env.TWEETER_KOO)
    web3Instance.eth.accounts.wallet.add({address: fromCompany.contractAddress, privateKey: fromCompany.pKey})
    web3Instance.eth.personal.unlockAccount(fromCompany.contractAddress,process.env.TWEETER_KOO, 600)
    transactionObject.from = fromCompany.contractAddress
    transactionObject.gasLimit = 50000
    // web3Instance.eth.accounts.wallet.remove('<public-key>')
  }
  console.log("Transaction object : " ,transactionObject)
  const promise = new Promise((resolve, reject) => {
    tribeGoldContract.methods
      .transfer(requestObject.metamaskId, ethInWeiValue)
      .send(transactionObject) 
      .on("transactionHash", function (hash) {
        console.log("Started transaction ")
        new TransactionSchema({
          amount: ethInWeiValue,
          action: action,
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
          console.log("Completed transaction with status ")
        }).catch(err =>{
          console.log("Failed transaction with satus ")
        })
        if(action != "REDEEM"){
          CompanySchema.findOneAndUpdate(
            { email: requestObject.email, tenantId: requestObject.tenantId },
            { $inc : {'balance' : ethInWeiValue}},
            { upsert: true }
          ).then(success =>{
            console.log("Completed balance ")
          }).catch(err =>{
            console.log("Failed balance update ")
          })
        }
        resolve(receipt.transactionHash);
      })
      .once("error", function (error) {
        let transactionHash = _.get(error, "receipt.transactionHash");
        TransactionSchema.findOneAndUpdate(
          { hash: transactionHash },
          { status: "FAILED" }
        );
        console.log("Deposit failed to new user in TBGApi");
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
  buyGold,
  getBalance,
};

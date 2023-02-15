const Web3 = require("web3");
const tribeGoldJSON = require("../../client/src/contracts/tribeGold.json");
const tribeGoldTestJSON = require("../../client/src/contracts/tribeGold_test.json");
const programmerKey = process.env.PROGRAMMER_KEY;
const HDWalletProvider = require("@truffle/hdwallet-provider");
const _ = require("lodash");
// let hdWallet = new HDWalletProvider({
//   privateKeys: [programmerKey],
//   providerOrUrl: process.env.NETWORK_URL,
//   pollingInterval: 2000000,
//   networkCheckTimeout : 2000000
// });
// const web3Instance = new Web3(hdWallet);
//   const tribeGoldContract = new web3Instance.eth.Contract(
//     process.env.CHAIN_ENV == "mainnet" ? tribeGoldJSON.abi : tribeGoldTestJSON.abi,
//     process.env.CHAIN_ENV == "mainnet" ? tribeGoldJSON.address : tribeGoldTestJSON.address
//   );


  let tribeGoldContract = {}
  let web3Instance = {}
module.exports = {
  tribeGoldContract,
  web3Instance,
};

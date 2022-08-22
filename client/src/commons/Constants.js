
const STATUS ={
  PENDING: "PENDING",
  REGISTERED: "REGISTERED",
  SUBMITTED:"SUBMITTED",
  VERIFIED:"VERIFIED",
}

const CATEGORIES ={
  HEALTH: "HEALTH",
}

const SESSION_KEYS = {
  PASSPORT_TOKEN:"PASSPORT_TOKEN",
  TENANTID: "PASSPORT_TENANTID",
  SELL: "SELL",
  COLLAB: "COLLABORATE",
  KEEP: "KEEP",
  LICENSE:  "LICENSE",
};

const ENTITIES = {
  IDEA: "IDEA",
  PROFILE: "PROFILE",
  CLAN: "CLAN",
  PUBLIC: "PUBLIC",
};

const ACTIONS = {
  UPVOTE: "UPVOTE",
  FOLLOW: "FOLLOW",
  PERSONAL_MESSAGE: "PERSONAL_MESSAGE",
  UNFOLLOWED: "UNFOLLOWED",
  COMMENT: "COMMENT",
  POST_IDEA: "POST_IDEA",
  BUY_IDEA: "BUY_IDEA",
  BUY_IDEA: "UPDATE_PRICE",
  CREATE_CLAN: "CREATE_CLAN",
  INCENTIVICED: "INCENTIVICED",
  DEPOSIT: "DEPOSIT",
};

const ACTION_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  DECLINED: "DECLINED",
  FAILED: "FAILED",
  INIT: "INIT",
};

const STORAGE_TYPE = [
  { value: "PUBLIC", label: "PUBLIC - The file will be stored in IPFS. Anyone can view it." },
  {
    value: "SECURE",
    label: "SECURE - We will store the file in our secure servers (upto 5MB).",
  },
  {
    value: "SELF",
    label:
      "SELF - The file wont be stored with us. Losing or modifying this file will make your idea unverifiable.",
  },
];

const COLLAB_TYPE = [
  { value: "ENHANCE", label: "ENHANCE: Find people to improve your Idea" },
  { value: "PRODUCTIONIZE", label: "PRODUCTIONIZE: Find people to implement your Idea" },
  { value: "FINANCE", label: "FINANCE: Find people to fund your Idea" },
  { value: "PROMOTE", label: "PROMOTE: Find people to market your Idea" },
 
];

const SCANNER_TESTNET_URL = "https://mumbai.polygonscan.com"
const SCANNER_MAINNET_URL = "https://polygonscan.com"

const CONSTANTS = {
  CATEGORIES,
  STATUS
};
export default CONSTANTS
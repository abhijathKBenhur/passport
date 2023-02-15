const jwt = require("jsonwebtoken");



const authorizer = (req, res, next) => {
  let validateList = [
    "/api/payment/depositGold",
    "/api/company/updateDetails",
    "/api/company/getDetails",
    "/api/company/configureDistribution",
    "/api/customer/getAllUsers",
    "/api/customer/incentivise",
    "/api/customer/getTotalUserCount",
    "/api/payment/getClientSecret",
    "/api/payment/getClientKey",
    "/api/payment/getAllTransactions"];
  console.log("API in list of checklist",req.path + "::" + validateList.indexOf(req.path) > -1 );
  
  if (validateList.indexOf(req.path) > -1 && req.method != "OPTIONS") {
      console.log(" checking for token validity in ", req.path);

      const token = req.headers["x-access-token"];
      if (token && token != null && token != "null") {
        try {
          console.log("Decodeding Token", token)
          const decoded = jwt.verify(token, process.env.TWEETER_KOO);
          console.log("Decoded Token", decoded)
          let key = decoded.key;
          let secret = decoded.secret;
          let tenantId = decoded.tenantId;
          let userType = decoded.userType;
          req.key = key;
          req.secret = secret;
          req.tenantId = tenantId;
          req.userType = userType
          console.log("Forwarding request")
          return next();
        } catch (err) {
          console.log(err);
          return res.status(401).json({
            success: true,
            data: {
              error: "Authorization failed",
            },
          });
        }
      }else{
        console.log("Token not found! All subsequent apis will fail!")
        return res.status(403).json({
          success: true,
          data: {
            error: "Authorization failed",
          },
        });
      }
    } else {
      console.log("Skipped token validation")
      return next();
    }
};

module.exports = authorizer;

const jwt = require("jsonwebtoken");

const authorizer = (req, res, next) => {
  let skipInjection = ["/api/auth/login"];
  console.log("in authorizer",req.path);
  if (skipInjection.indexOf(req.path) == -1 && req.method != "OPTIONS") {
      const token = req.headers["x-access-token"];
      if (!token) {
        return res.status(403).json({
          success: true,
          data: {
            error: "Authorization failed",
          },
        });
      }
      try {
        const decoded = jwt.verify(token, process.env.TWEETER_KOO);
        let key = decoded.key;
        let secret = decoded.secret;
        req.key = key;
        req.secret = secret;
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
    } else {
      next();
    }
};

module.exports = authorizer;

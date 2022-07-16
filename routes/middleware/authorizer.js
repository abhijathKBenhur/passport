const jwt = require("jsonwebtoken");

const authorizer = (req, res, next) => {
  // implement restriction layer here
  next();
};


module.exports = authorizer;

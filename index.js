const express = require("express");
const cors = require("cors");
const mongotConnection = require("./db-config/mongodb");
const AuthAPI = require("./routes/AuthAPI");
const CompanyAPI = require("./routes/CompanyAPI");
const CustomerAPI = require("./routes/CustomerAPI");
const TransactionAPI = require("./routes/TransactionAPI");
const PaymentAPI = require("./routes/PaymentAPI");
const BlockchainAPI = require("./routes/BlockChainAPI");



const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");
const authorizer = require("./routes/middleware/authorizer");

const app = express();
const PORT = process.env.PORT || 4000;

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authorizer)


app.use(
  cors({
    origin: function (origin, callback) {
      // console.log("API requested from " + origin);
      if (!origin || ( origin.indexOf("localhost") > -1|| origin.indexOf("passport") > -1)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use((req, res, next) => {
  if (req.header("x-forwarded-proto") != undefined && req.header("x-forwarded-proto") !== "https") {
    res.redirect(`https://${req.header("host")}${req.url}`);
  }
  else {
    next();
  }
});

app.use("/api/auth", AuthAPI);
app.use("/api/company", CompanyAPI);
app.use("/api/customer", CustomerAPI);
app.use("/api/transaction", TransactionAPI);
app.use("/api/payment", PaymentAPI);
app.use("/api/payment", BlockchainAPI);



console.log("Deploying full application")
console.log("Checking node environment ::" + process.env.NODE_ENV);
if (process.env.NODE_ENV == "production" || process.env.NODE_ENV == "test") {
  console.log("Found node environment as" + process.env.NODE_ENV , __dirname);
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}


var server = app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});

module.exports = app
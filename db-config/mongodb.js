const mongoose = require("mongoose");

// const baseUrl = "mongodb+srv://sauabhi:Mongodb@10@cluster0.buaag.mongodb.net/ideatribe?retryWrites=true&w=majority";
const baseUrl = "mongodb://127.0.0.1:27017/passport";
mongoose.connect(process.env.MONGODB_URL ? process.env.MONGODB_URL : baseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", function() {
  console.log("Connection with MongoDB was successful");
});

connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

module.exports = connection;

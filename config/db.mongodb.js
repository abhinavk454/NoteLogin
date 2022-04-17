require("dotenv");
const mongoose = require("mongoose");

var count = 0;
const mongo_options = {
  autoIndex: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectDB = (uri) => {
  mongoose
    .connect(uri, mongo_options)
    .then((res) => {
      console.log("Connected to db successfully");
    })
    .catch((err) => {
      console.log(err);
      console.log("DB connection failed retry after 5sec ", ++count);
      setTimeout(connectDB, 5000);
    });
};

try {
  console.log(process.env.MONGO_URI);
  connectDB(process.env.MONGO_URI);
} catch {
  console.log("Connection failed");
}

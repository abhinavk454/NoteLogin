require("dotenv").config();
require("../config/db.mongodb");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello from dev");
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port} .`);
});

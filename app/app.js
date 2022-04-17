require("dotenv");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("../config/db.mongodb");

app.get("/", (req, res) => {
  res.send("Hello from main.");
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port} .`);
});

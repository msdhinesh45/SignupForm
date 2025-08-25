const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Api working");
});

console.log("MONGO_URI:", process.env.MONGO_URI);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

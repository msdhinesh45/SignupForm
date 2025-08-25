const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.send("API working"));

app.use("/api/users", authRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

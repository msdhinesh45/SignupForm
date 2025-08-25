const express = require("express");
const User = require("../models/Schema");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Middleware
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      return next();
    } catch (err) {
      console.error("Token Verification failed: ", err.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  return res.status(401).json({ message: "Not authorized, token failed" });
};

// Register
router.post("/register", async (req, res) => {
  const { firstname, lastname, mobileNumber, email, password } = req.body;

  try {
    if (!firstname || !lastname || !mobileNumber || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const userExists = await User.findOne({ $or: [{ email }, { mobileNumber }] });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      firstname,
      lastname,
      mobileNumber,
      email,
      password,
    });
    const token = generateToken(user._id);
    res.status(201).json({
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      mobileNumber: user.mobileNumber,
      email: user.email,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { mobileNumber, email, password } = req.body;

  try {
    if ((!email && !mobileNumber) || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const user = await User.findOne(email ? { email } : { mobileNumber });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user._id);
    res.status(200).json({
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      mobileNumber: user.mobileNumber,
      email: user.email,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/me", protect, async (req, res) => {
  res.status(200).json(req.user);
});

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = router;
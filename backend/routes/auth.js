const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/Schema");
const { protect } = require("../middleware/auth");

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// Register
router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, mobileNumber, email, password } = req.body;

    if (!firstname || !lastname || !mobileNumber || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const existing = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { mobileNumber }],
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "User with email or mobile already exists" });
    }

    const user = await User.create({
      firstname,
      lastname,
      mobileNumber,
      email: email.toLowerCase(),
      password,
    });

    return res.status(201).json({
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      mobileNumber: user.mobileNumber,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      const key = Object.keys(err.keyValue)[0];
      return res
        .status(400)
        .json({ message: `${key} already in use` });
    }
    return res.status(500).json({ message: "Server Error" });
  }
});

// Login (email+password OR mobileNumber+password)
router.post("/login", async (req, res) => {
  try {
    const { email, mobileNumber, password } = req.body;

    if ((!email && !mobileNumber) || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const query = email
      ? { email: email.toLowerCase() }
      : { mobileNumber };

  
    const user = await User.findOne(query).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      mobileNumber: user.mobileNumber,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
});

// Logout
router.post("/logout", protect, async (_req, res) => {
  return res.status(200).json({ message: "Logged out successfully" });
});

// Get current user
router.get("/me", protect, async (req, res) => {
  return res.status(200).json(req.user);
});

// update user current 
router.put("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    // Allows only your account
    if (id !== String(req.user._id)) {
      return res.status(403).json({ message: "You can update only your account" });
    }

    const allowed = ["firstname", "lastname", "email", "mobileNumber", "password"];
    const updates = {};
    for (const k of allowed) {
      if (k in req.body && req.body[k] !== undefined && req.body[k] !== null) {
        updates[k] = k === "email" ? String(req.body[k]).toLowerCase() : req.body[k];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const user = await User.findById(id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    Object.assign(user, updates);
    await user.save(); 

    return res.status(200).json({
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      mobileNumber: user.mobileNumber,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      const key = Object.keys(err.keyValue)[0];
      return res.status(400).json({ message: `${key} already in use` });
    }
    return res.status(500).json({ message: "Server Error" });
  }
});

// Get current user data
 router.get("/", protect, async (_req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
});

// Get all users except current user
router.get("/others", protect, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const { validationResult } = require("express-validator");

// Register a New User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ success: true, token, userId: user._id, name: user.name });
  } catch (error) {
    console.error("Error in registerUser:", error.message); 
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// Login a User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
      console.log("Login attempt with:", email); // Debug
      console.log("MongoDB Connection Status:", mongoose.connection.readyState);

      const user = await User.findOne({ email });
      if (!user) {
          console.log("User not found");
          return res.status(400).json({ success: false, message: "Invalid credentials" });
      }

      console.log("User found:", user);

      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password match:", isMatch);

      if (!isMatch) {
          return res.status(400).json({ success: false, message: "Invalid credentials" });
      }

      // Generate JWT Token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

      console.log("Token generated:", token);
      res.json({ success: true, token });

  } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
};



module.exports = { registerUser, loginUser };

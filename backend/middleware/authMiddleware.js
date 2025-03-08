const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  console.log("Received Token:", token); // Debugging: Check if token is received

  if (!token) {
    return res.status(401).json({ success: false, message: "Access Denied. No token provided." });
  }

  try {
    const extractedToken = token.replace("Bearer ", "");
    console.log("Extracted Token:", extractedToken); // Debugging: Check token format

    const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request object
    console.log("Decoded User:", decoded); // Debugging: Check if decoding works

    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error("JWT Verification Error:", error); // Debugging: Log verification errors
    res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

module.exports = authMiddleware;

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Extract token

      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

      req.user = await User.findById(decoded.id).select("-password"); // Attach user to request

      return next(); // Move to next middleware
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  }

  return res.status(401).json({ success: false, message: "No token provided." });
};

module.exports = protect;

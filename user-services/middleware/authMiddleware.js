const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if incomming request contain the authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request object
    next(); // Pass control to the next middleware/route handler
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(403).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;

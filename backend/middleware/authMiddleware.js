const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded; // user info store
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
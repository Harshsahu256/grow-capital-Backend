const jwt = require("jsonwebtoken");
const JWT_SECRET = "growb_secret_key";

exports.verifyAdmin = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access Denied! No Token Provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Not Authorized as Admin!" });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token!" });
  }
};


exports.verifyUser = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access Denied! No Token Provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    if (decoded.role !== "user") {
      return res.status(403).json({ message: "Not Authorized as User!" });
    }

    req.user = decoded; // store user info
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token !" });
  }
};

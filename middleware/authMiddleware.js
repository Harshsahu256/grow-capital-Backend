// const jwt = require("jsonwebtoken");
// const JWT_SECRET = "growb_secret_key";

// exports.verifyAdmin = (req, res, next) => {
//   const token = req.header("Authorization");

//   if (!token) {
//     return res.status(401).json({ message: "Access Denied! No Token Provided." });
//   }

//   try {
//     const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
//     if (decoded.role !== "admin") {
//       return res.status(403).json({ message: "Not Authorized as Admin!" });
//     }

//     req.admin = decoded;
// req.user = decoded;  // ✅ add this line

//     next();
//   } catch (error) {
//     res.status(400).json({ message: "Invalid Token!" });
//   }
// };


// exports.verifyUser = (req, res, next) => {
//   const token = req.header("Authorization");

//   if (!token) {
//     return res.status(401).json({ message: "Access Denied! No Token Provided." });
//   }

//   try {
//     const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
//     if (decoded.role !== "user") {
//       return res.status(403).json({ message: "Not Authorized as User!" });
//     }

//     req.user = decoded; // store user info
//     next();
//   } catch (error) {
//     res.status(400).json({ message: "Invalid Token !" });
//   }
// };

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || "growb_secret_key"; // fallback

// ✅ VERIFY ADMIN
exports.verifyAdmin = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Access Denied! No Token Provided." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Not Authorized as Admin!" });
    }

    req.admin = decoded;
    next();

  } catch (error) {
    return res.status(400).json({ message: "Invalid Token!" });
  }
};


// // ✅ VERIFY USER
// exports.verifyUser = (req, res, next) => {
//   try {
//     const token = req.header("Authorization")?.replace("Bearer ", "");
//     if (!token) {
//       return res.status(401).json({ message: "Access Denied! No Token Provided." });
//     }

//     const decoded = jwt.verify(token, JWT_SECRET);

//     if (decoded.role !== "user") {
//       return res.status(403).json({ message: "Not Authorized as User!" });
//     }

//     req.user = decoded;
//     next();

//   } catch (error) {
//     return res.status(400).json({ message: "Invalid Token!" });
//   }
// };



exports.verifyUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Access Denied! No Token Provided." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "user") {
      return res.status(403).json({ message: "Not Authorized as User!" });
    }

    // ✅ DB se poora user fetch
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // poora user attach
    next();

  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(400).json({ message: "Invalid Token!" });
  }
};
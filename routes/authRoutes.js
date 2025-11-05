// routes/authRoutes.js

const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { getAllAccounts } = require("../controllers/bankAccountController");

const router = express.Router();

/* ==========================================================
   🔹 User Authentication Routes
   ========================================================== */

// ✅ Registration Route
// Endpoint → POST http://localhost:5000/api/auth/register
router.post("/register", registerUser);

// ✅ Login Route
// Endpoint → POST http://localhost:5000/api/auth/login
router.post("/login", loginUser);
router.get("/bankAccounts",  getAllAccounts); 

const { verifyUser } = require("../middleware/authMiddleware");
const Position = require("../models/Position");

router.get("/positions/user", verifyUser, async (req, res) => {
  try {
    const userId = req.user.id; // token se user id mili

    const positions = await Position.find({ user: userId })
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    if (!positions || positions.length === 0) {
      return res.status(404).json({ message: "No positions found for this user." });
    }

    res.json({
      message: "User-specific positions fetched successfully!",
      total: positions.length,
      positions,
    });
  } catch (error) {
    console.error("❌ Error fetching user positions:", error);
    res.status(500).json({ message: "Server error" });
  }
});


/* ==========================================================
   🔹 Export Router
   ========================================================== */
module.exports = router;

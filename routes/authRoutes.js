// routes/authRoutes.js

const express = require("express");
const { registerUser, loginUser, getMyTotalAmount ,getProfile} = require("../controllers/authController");
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
const { uploadSingleFile, getUserDeposits } = require("../controllers/fileController");
const upload = require("../middleware/multer.middleware");
const { createWithdrawRequest, getUserTransactionHistory } = require("../controllers/withdrawController");
const { createMessage } = require("../controllers/contactController");


router.post("/single", verifyUser, upload.single("file"), uploadSingleFile);
router.get("/my-deposits", verifyUser, getUserDeposits);

router.get("/my-total-amount", verifyUser, getMyTotalAmount);


router.get("/transactions", verifyUser, getUserTransactionHistory);


// ✅ User: create withdraw request
router.post("/create", verifyUser, createWithdrawRequest);

router.post("/submit", createMessage);

router.get("/positions/user", verifyUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const positions = await Position.find({ user: userId })
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    // ✅ Return empty array if no positions found
    res.json({
      message: "User-specific positions fetched successfully!",
      total: positions.length,
      positions, // empty array bhi chalega
    });
  } catch (error) {
    console.error("❌ Error fetching user positions:", error);
    res.status(500).json({ message: "Server error" });
  }
});



router.get("/profile", verifyUser, getProfile);



module.exports = router;


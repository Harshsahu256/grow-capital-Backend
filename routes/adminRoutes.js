
const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  getAllUsers,
  approveUser,
  rejectUser,
  getPendingUsers
} = require("../controllers/adminController");



const { verifyAdmin } = require("../middleware/authMiddleware");

const {
  createAccount,
  getAllAccounts,
  updateAccount,
  deleteAccount
} = require("../controllers/bankAccountController");
const User = require("../models/User");

const Position = require("../models/Position");
const upload = require("../middleware/multer.middleware"); // multer middleware
const {
  uploadSingleFile,
  uploadMultipleFiles,
   getAllFilesForAdmin,   // <-- add this
   approveFile
} = require("../controllers/fileController"); // file upload logic
const { getAllWithdrawRequests, updateWithdrawRequestStatus } = require("../controllers/withdrawController");
const { getAllMessages } = require("../controllers/contactController");

const router = express.Router();

// ✅ Admin Registration & Login
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// ✅ Protected Route — Get All Users
router.get("/users", verifyAdmin, getAllUsers);

// ✅ Bank Account Routes
router.post("/createAccount", verifyAdmin, createAccount);
router.get("/getAllAccounts", verifyAdmin, getAllAccounts);
router.put("/getAllAccounts/:id", verifyAdmin, updateAccount);
router.delete("/deleteAccount/:id", verifyAdmin, deleteAccount);

// ✅ Admin Dashboard Example Route
router.get("/dashboard", verifyAdmin, (req, res) => {
  res.json({ message: `Welcome Admin ${req.admin.id}!` });
});




//==============================addPosition==============================///
router.post("/addPosition", async (req, res) => {
  try {
    const { userId, companyName, buy, sell, quantity, gain  } = req.body;

    // ✅ Validation
    if (!userId || !companyName || !quantity) {
      return res
        .status(400)
        .json({ message: "User, company name & quantity are required" });
    }

    // ✅ Check user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Create new position
    const newPosition = new Position({
      user: userId,
      companyName,
      buy,
      sell,
      quantity,
       gain: gain || 0,
    });

    await newPosition.save();

    res.status(201).json({
      message: "Position added successfully",
      position: newPosition,
    });
  } catch (error) {
    console.error("❌ Error adding position:", error);
    res.status(500).json({ message: "Server error while adding position" });
  }
});




/* =====================================================
   📊 Get All Positions (Trades)
   Endpoint: GET /api/admin/positions
===================================================== */

router.get("/positions", async (req, res) => {
  try {
    const positions = await Position.find()
      .populate("user", "fullName email mobileNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({ positions });
  } catch (error) {
    console.error("❌ Error fetching positions:", error);
    res.status(500).json({ message: "Server error while fetching positions" });
  }
});



// ===========================
// 📝 Update Position API
// PUT /api/admin/updatePosition/:id
// ===========================
router.put("/updatePosition/:id", async (req, res) => {
  try {
    const positionId = req.params.id;
    const { buy, sell, quantity, gain, tradeType, companyName } = req.body;

    // ✅ Find position
    const position = await Position.findById(positionId);
    if (!position) {
      return res.status(404).json({ message: "Position not found" });
    }

    // ✅ Update fields if provided
    if (companyName !== undefined) position.companyName = companyName;
    if (buy !== undefined) position.buy = buy;
    if (sell !== undefined) position.sell = sell;
    if (quantity !== undefined) position.quantity = quantity;
    if (gain !== undefined) position.gain = gain;
    if (tradeType !== undefined) position.tradeType = tradeType;

    await position.save();

    res.status(200).json({
      message: "Position updated successfully",
      position,
    });
  } catch (error) {
    console.error("❌ Error updating position:", error);
    res.status(500).json({ message: "Server error while updating position" });
  }
});


// ✅ Admin: get all requests
router.get("/getAllWithdrawRequests", verifyAdmin, getAllWithdrawRequests);

// ✅ Admin: update status (approve/reject)
router.patch("/update/:id", verifyAdmin, updateWithdrawRequestStatus);
router.get("/messages", verifyAdmin, getAllMessages);



// GET all files (admin view) with optional filters, pagination, search
router.get("/files", verifyAdmin, getAllFilesForAdmin);

router.post("/approve", verifyAdmin, approveFile);


//=============================//////=======================//

router.put('/admin/approve-user', verifyAdmin, approveUser);
router.put('/admin/reject-user', verifyAdmin,  rejectUser);
router.get('/admin/pending-users', verifyAdmin, getPendingUsers);





module.exports = router;

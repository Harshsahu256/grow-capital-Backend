// const express = require("express");
// const { registerAdmin, loginAdmin, getAllUsers } = require("../controllers/adminController");
// const { verifyAdmin } = require("../middleware/authMiddleware");
// const { createAccount, getAllAccounts, updateAccount, deleteAccount } = require("../controllers/bankAccountController");

// const router = express.Router();

// // ✅ Admin Registration
// router.post("/register", registerAdmin);

// // ✅ Admin Login (JWT Token)
// router.post("/login", loginAdmin);


// // ✅ Protected Route — Get All Users
// router.get("/users", verifyAdmin, getAllUsers);
// router.post("/createAccount", verifyAdmin, createAccount);           // Create
// router.get("/getAllAccounts", verifyAdmin, getAllAccounts);           // Read All
      
// router.put("/getAllAccounts/:id", verifyAdmin, updateAccount);         // Update
// router.delete("/deleteAccount/:id", verifyAdmin, deleteAccount); 

// // ✅ Example Protected Route (only admin can access)
// router.get("/dashboard", verifyAdmin, (req, res) => {
//   res.json({ message: `Welcome Admin ${req.admin.id}!` });
// });

// module.exports = router;

const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  getAllUsers
} = require("../controllers/adminController");

const {
  verifyAdmin
} = require("../middleware/authMiddleware");

const {
  createAccount,
  getAllAccounts,
  updateAccount,
  deleteAccount
} = require("../controllers/bankAccountController");

const Position = require("../models/Position"); // 👈 import your model

const router = express.Router();

// ✅ Admin Registration
router.post("/register", registerAdmin);

// ✅ Admin Login (JWT Token)
router.post("/login", loginAdmin);

// ✅ Protected Route — Get All Users
router.get("/users", verifyAdmin, getAllUsers);

// ✅ Bank Account Routes
router.post("/createAccount", verifyAdmin, createAccount);   // Create
router.get("/getAllAccounts", verifyAdmin, getAllAccounts);  // Read All
router.put("/getAllAccounts/:id", verifyAdmin, updateAccount); // Update
router.delete("/deleteAccount/:id", verifyAdmin, deleteAccount); // Delete

// ✅ Example Protected Route (only admin can access)
router.get("/dashboard", verifyAdmin, (req, res) => {
  res.json({ message: `Welcome Admin ${req.admin.id}!` });
});


// // 🧾 ✅ Add Position Route (Admin adds portfolio position)
// router.post("/addPosition", verifyAdmin, async (req, res) => {
//   try {
//     const { companyName, buy, sell, totalPrice } = req.body;

//     if (!companyName || buy == null || sell == null || totalPrice == null) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const newPosition = new Position({
//       companyName,
//       buy,
//       sell,
//       totalPrice
//     });

//     // profit/loss auto calculate (pre-save hook handles it)
//     await newPosition.save();

//     res.status(201).json({
//       message: "Position added successfully!",
//       position: newPosition
//     });
//   } catch (error) {
//     console.error("Error creating position:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });
router.post("/addPosition", verifyAdmin, async (req, res) => {
  try {
    const { userId, companyName, buy, sell, totalPrice } = req.body;

    if (!userId || !companyName || buy == null || sell == null || totalPrice == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newPosition = new Position({
      user: userId,
      companyName,
      buy,
      sell,
      totalPrice
    });

    await newPosition.save();
    await newPosition.populate("user", "fullName email");

    res.status(201).json({
      message: "Position added successfully!",
      position: newPosition
    });
  } catch (error) {
    console.error("Error creating position:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// 📊 ✅ Get All Positions (for Admin Dashboard)
// router.get("/positions", verifyAdmin, async (req, res) => {
//   try {
//     const positions = await Position.find().sort({ createdAt: -1 });
//     res.json({ positions });
//   } catch (error) {
//     console.error("Error fetching positions:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });
router.get("/positions", verifyAdmin, async (req, res) => {
  try {
    const positions = await Position.find()
      .populate("user", "fullName email") // 👈 show user info
      .sort({ createdAt: -1 });

    res.json({ positions });
  } catch (error) {
    console.error("Error fetching positions:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;

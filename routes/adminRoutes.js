const express = require("express");
const { registerAdmin, loginAdmin, getAllUsers } = require("../controllers/adminController");
const { verifyAdmin } = require("../middleware/authMiddleware");
const { createAccount, getAllAccounts, updateAccount, deleteAccount } = require("../controllers/bankAccountController");

const router = express.Router();

// ✅ Admin Registration
router.post("/register", registerAdmin);

// ✅ Admin Login (JWT Token)
router.post("/login", loginAdmin);


// ✅ Protected Route — Get All Users
router.get("/users", verifyAdmin, getAllUsers);
router.post("/createAccount", verifyAdmin, createAccount);           // Create
router.get("/getAllAccounts", verifyAdmin, getAllAccounts);           // Read All
      
router.put("/getAllAccounts/:id", verifyAdmin, updateAccount);         // Update
router.delete("/deleteAccount/:id", verifyAdmin, deleteAccount); 

// ✅ Example Protected Route (only admin can access)
router.get("/dashboard", verifyAdmin, (req, res) => {
  res.json({ message: `Welcome Admin ${req.admin.id}!` });
});

module.exports = router;

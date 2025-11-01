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

/* ==========================================================
   🔹 Export Router
   ========================================================== */
module.exports = router;

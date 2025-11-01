const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");


const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", adminRoutes);


// Default Route
app.get("/", (req, res) => {
  res.send("✅ GrowB Server is Running with MongoDB Connected!");
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

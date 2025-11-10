// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const authRoutes = require("./routes/authRoutes");
// const adminRoutes = require("./routes/adminRoutes");


// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(express.json());
// app.use(cors());

// // MongoDB Connection
// connectDB();

// // Routes
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/admin", adminRoutes);


// // Default Route
// app.get("/", (req, res) => {
//   res.send("✅ GrowB Server is Running with MongoDB Connected!");
// });

// // Start Server
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const adminRoutes = require("./routes/adminRoutes");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json());
// app.use(cors());

// // MongoDB Connection
// connectDB(process.env.MONGO_URI);

// // Routes
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/admin", adminRoutes);

// // Default Route
// app.get("/", (req, res) => {
//   res.send("✅ GrowB Server is Running with MongoDB Connected!");
// });

// // Start Server
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));



require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
connectDB(process.env.MONGO_URI);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
// app.use("/api/files", fileRoutes); // ✅ File upload routes

// Default Route
app.get("/", (req, res) => {
  res.send("✅ GrowB Server is Running with MongoDB Connected!");
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

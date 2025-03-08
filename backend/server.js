require("dotenv").config(); // Ensure .env is loaded at the top

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", require("./routes/tripRoutes")); // Importing tripRoutes directly

// Simple Route
app.get("/", (req, res) => {
  res.send("TripWise API is running...");
});

console.log("Registered Routes:");
console.log(app._router.stack.map(layer => layer.route ? layer.route.path : null));


// Debugging: Print MONGO_URI to check if it's loaded correctly
console.log("MONGO_URI:", process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the app if DB connection fails
  });

console.log("Registered Routes:");
console.log(app._router.stack);

app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(`${Object.keys(middleware.route.methods).join(",").toUpperCase()} ${middleware.route.path}`);
  } else if (middleware.name === "router") {
    middleware.handle.stack.forEach((route) => {
      if (route.route) {
        console.log(`${Object.keys(route.route.methods).join(",").toUpperCase()} /api/trips${route.route.path}`);
      }
    });
  }
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});


// Error Handler Middleware
app.use(errorHandler);
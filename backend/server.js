// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/database.js"; 
import authRoutes from "./routes/authRoutes.js";
import docRoutes from "./routes/docRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// Load environment variables
dotenv.config();

// Setup __dirname since we’re using ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON bodies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/docs", docRoutes);
// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", userRoutes);
// Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Port
const PORT = process.env.PORT || 5000;

// Start server AFTER DB connects
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect DB:", err.message);
    process.exit(1);
  });

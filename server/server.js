import express, { urlencoded } from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import taskRoutes from "./routes/taskRoutes.js";
import authRouter from "./routes/authroutes.js";
import { authMiddleware } from "./middleware/authMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/tasks", authMiddleware, taskRoutes);
app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const user = "ai";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

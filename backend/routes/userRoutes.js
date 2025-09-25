import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { updateUser } from "../controllers/userController.js";

const router = express.Router();

router.put("/update", protect, updateUser);

export default router;

import express from "express";
import {
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  updateUserEmail,
  updateUserPassword,
} from "../controllers/userControllers";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile/:id", protect, getUserProfile);
router.patch("/update-email/:id", protect, updateUserEmail);
router.patch("/update-password/:id", protect, updateUserPassword);

export default router;

import express from "express";
import {
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  updateUserEmail,
} from "../controllers/userControllers";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile/:id", protect, getUserProfile);
router.patch("/update-email/:id", protect, updateUserEmail);
export default router;

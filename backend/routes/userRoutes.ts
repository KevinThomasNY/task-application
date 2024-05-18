import express from "express";
import {
  deleteUserProfile,
  getAllUserProfiles,
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  updateUserEmail,
  updateUserPassword,
} from "../controllers/userControllers";
import { protect, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile/:id", protect, getUserProfile);
router.patch("/update-email/:id", protect, updateUserEmail);
router.patch("/update-password/:id", protect, updateUserPassword);
router.delete("/delete-own-profile/:id", protect, deleteUserProfile)
router.delete("/delete-user-profile/:id", protect, isAdmin, deleteUserProfile)
router.get("/all-user-profiles/", protect, isAdmin, getAllUserProfiles)
export default router;

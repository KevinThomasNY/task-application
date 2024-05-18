import { Request, Response } from "express";
import bcript from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import {
  checkUserExists,
  createUser,
  deleteUserById,
  fetchAllUsers,
  fetchUserByEmail,
  fetchUserById,
  updateEmail,
  updatePassword,
} from "../models/userModel";

//@desc register a new user
//@route POST /api/users
//@access Public
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userExists = await checkUserExists(email);

    if (userExists) {
      throw new Error("User already exists");
    }

    const role = "user";

    const user = await createUser(email, password, role);

    if (user) {
      res.status(201).json({
        message: "User created successfully",
        user_id: user.user_id,
        email: user.email,
      });
    } else {
      res.status(400).json({ message: "Failed to create user" });
    }
  }
);

const generateToken = (id: number, role: string): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
};

//@desc login user and get token
//@route POST /api/users/login
//@access Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await fetchUserByEmail(email);

  if (!user) {
    throw new Error("Email not found");
  }

  const isMatch = await bcript.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const token = generateToken(user.user_id, user.role);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ message: "Login successful", token });
});

//@desc logout user and remove token
//@route GET /api/users/logout
//@access Public
export const logoutUser = (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    sameSite: "strict",
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

//@desc get user profile
//@route GET /api/users/profile/user_id
//@access Private
export const getUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (!isNaN(id)) {
      const user = await fetchUserById(id);
      res.status(200).json(user);
    } else {
      throw new Error("User id not found");
    }
  }
);

//@desc update user email
//@route PATCH /api/users/update-email/:id
//@access Private
export const updateUserEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const id = parseInt(req.params.id, 10);
    if (!isNaN(id)) {
      const user = await fetchUserById(id);
      if (user) {
        const isMatch = await bcript.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Invalid password");
        }
        await updateEmail(id, email);
        res.status(200).json({ message: "Email updated successfully" });
      } else {
        throw new Error("User not found");
      }
    } else {
      throw new Error("User id not found");
    }
  }
);

//@desc update user password
//@route PATCH /api/users/update-password/:id
//@access Private
export const updateUserPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { password, newPassword, confirmPassword } = req.body;
    const id = parseInt(req.params.id, 10);
    if (!isNaN(id)) {
      const user = await fetchUserById(id);
      if (user) {
        const isMatch = await bcript.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Invalid password");
        }
        if (newPassword === confirmPassword) {
          await updatePassword(id, newPassword);
          res.status(200).json({ message: "Password updated successfully" });
        } else {
          throw new Error("Passwords do not match");
        }
      } else {
        throw new Error("User not found");
      }
    } else {
      throw new Error("User id not found");
    }
  }
);

//@desc delete user profile
//@route DELETE /api/users/delete-own-profile/:id
//@route DELETE /api/users/delete-user-profile/:id
//@access Private
export const deleteUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (!isNaN(id)) {
      const user = await fetchUserById(id);
      if (user) {
        await deleteUserById(id);
        res.status(200).json({ message: "User deleted successfully" });
      } else {
        throw new Error("User not found");
      }
    }
  }
);

//@desc get all user profiles
//@route GET /api/users/all-user-profiles/
//@access Private
export const getAllUserProfiles = asyncHandler(
  async (req: Request, res: Response) => {
    const users = await fetchAllUsers();
    res.status(200).json(users);
  }
);

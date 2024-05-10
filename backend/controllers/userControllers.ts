import { Request, Response } from "express";
import bcript from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { checkUserExists, createUser, fetchUser } from "../models/userModel";

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

    const role = 'user';

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

  const user = await fetchUser(email);

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

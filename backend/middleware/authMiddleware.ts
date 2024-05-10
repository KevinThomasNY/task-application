import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";

export interface AuthenticatedRequest extends Request {
  user?: { id: number; role: string };
}

const protect = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      if (typeof decoded === "object" && decoded.id && decoded.role) {
        req.user = { id: decoded.id, role: decoded.role };
        next();
      } else {
        throw new Error("Invalid token structure");
      }
    } catch (error) {
      res.status(401).json({ message: "Invalid token", error });
    }
  }
);

export default protect;

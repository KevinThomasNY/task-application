import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

const protect = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as
        | string
        | JwtPayload;

      req.user = decoded;

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ message: "Token expired" });
      } else {
        res.status(401).json({ message: "Invalid token" });
      }
    }
  }
);

export default protect;

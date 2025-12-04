import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const authCheck = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.user = {
      id: decoded.userId,
    };
    next();
  } catch (e) {
    console.log("error", e);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

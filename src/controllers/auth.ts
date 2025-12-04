import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
const login: RequestHandler = async (req, res) => {
  const { username, password } = req.body;
  const isUserExist = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  if (!isUserExist) {
    return res.status(400).json({ message: "User not found" });
  }
  const passwordMatch = await bcrypt.compare(password, isUserExist.password);

  if (!passwordMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }
  const token = jwt.sign({ userId: isUserExist.id }, JWT_SECRET);
  return res.status(200).json({
    data: {
      token,
      user: {
        ...isUserExist,
        password: undefined,
      },
    },
    message: "Login successful",
  });
};
export { login };

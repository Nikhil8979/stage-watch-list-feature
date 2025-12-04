import { Request, Response, NextFunction } from "express";
import { error } from "../utils/response";
import { Prisma } from "../generated/prisma/client";

interface AppError extends Error {
  status?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.status || 500;
  let message = err.message || "Internal Server Error";

  if (
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err instanceof Prisma.PrismaClientValidationError
  ) {
    statusCode = 400;
    message = `${err.message}`;
  }

  res.status(statusCode).json(
    error({
      message,
      errors: [process.env.NODE_ENV === "production" ? undefined : err.stack],
    })
  );
};

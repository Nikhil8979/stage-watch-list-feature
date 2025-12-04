import { ZodSchema, infer as ZodInfer } from "zod";
import { Request, Response, NextFunction } from "express";
import { error } from "./response";

export const validate =
  <T extends ZodSchema>(schema: T) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const data = { ...req.body, ...req.query };

    const validationResult = schema.safeParse(data);
    if (validationResult.success) {
      (req as Request & { body: ZodInfer<T> }).body = validationResult.data;
      next();
    } else {
      const errors = validationResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      const message = validationResult.error.issues[0].message;
      res.status(400).json(error({ errors, message }));
    }
  };

import { RequestHandler, Request, Response, NextFunction } from "express";

export interface IErrorResponse<T, E> {
  data?: T;
  type?: "error";
  message?: string;
  errors?: E[];
}

export const error = <T, E>({
  data,
  errors = [],
  message,
}: {
  data?: T;
  errors?: E[];
  message?: string;
}): IErrorResponse<T, E> => {
  return { data, type: "error", errors, message };
};

interface ISuccessResponse<T> {
  data?: T;
  type?: "success";
  message: string;
}

export const success = <T>({
  message = "Success",
  data,
}: {
  data?: T;
  message?: string;
}): ISuccessResponse<T> => {
  return {
    type: "success",
    message,
    data,
  };
};

export const wrapRequestHandler =
  (fn: RequestHandler): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };

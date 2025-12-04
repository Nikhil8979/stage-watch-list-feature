import { Router } from "express";
import { validate } from "../../utils/validate";
import { UserLoginSchema } from "../../zod/auth";
import { wrapRequestHandler } from "../../utils/response";
import { login } from "../../controllers/auth";

const authRouter = Router();

authRouter.post("/login", validate(UserLoginSchema), wrapRequestHandler(login));

export default authRouter;

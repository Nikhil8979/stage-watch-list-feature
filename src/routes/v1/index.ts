import { Router } from "express";
import watchListRouter from "./watchList";
import { authCheck } from "../../middleware/authCheck";
import authRouter from "./auth";
const router = Router();
router.use("/auth", authRouter);

router.use(authCheck);

router.use("/watch-list", watchListRouter);

export default router;

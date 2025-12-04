import { Router } from "express";
import {
  addItemToWatchList,
  getWatchList,
  removeItemFromWatchList,
} from "../../controllers/watchList";
import { wrapRequestHandler } from "../../utils/response";
import {
  AddItemToWatchListSchema,
  RemoveItemFromWatchListSchema,
  watchListSchema,
} from "../../zod/watchList";
import { validate } from "../../utils/validate";

const watchListRouter = Router();

watchListRouter.post(
  "/",
  validate(AddItemToWatchListSchema),
  wrapRequestHandler(addItemToWatchList)
);
watchListRouter.get(
  "/",
  validate(watchListSchema),
  wrapRequestHandler(getWatchList)
);
watchListRouter.delete(
  "/",
  validate(RemoveItemFromWatchListSchema),
  wrapRequestHandler(removeItemFromWatchList)
);

export default watchListRouter;
// 22.12

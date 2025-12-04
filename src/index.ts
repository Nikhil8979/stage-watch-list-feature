import express from "express";
import v1Router from "./routes/v1";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
export const app = express();

const corsOptions = {
  origin: process.env.NEXT_APP_BASE_URL,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/v1", v1Router);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("stage backend is running");
});

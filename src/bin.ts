/// <reference path="./global.d.ts" />
import { app } from ".";
import { PORT } from "./config";

app.listen(PORT, () => {
  console.log("stage is running on port", PORT);
});

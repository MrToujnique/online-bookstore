import express from "express";
import { use } from "passport";
import { bookRouter } from "../routes/bookRouter";
import { categoryRouter } from "../routes/categoryRouter";
import { subOrderRouter } from "../routes/subOrderRouter";
import { usersRouter } from "../routes/usersRouter";

function createServer() {
  const app = express();

  app.use(express.json());

  app.use("/api", bookRouter);
  app.use("/api", categoryRouter);
  app.use("/api", subOrderRouter);
  app.use("/api", usersRouter);
  
  return app;
}

export default createServer;
import { Router } from "express";

const TaskRouter = Router();

TaskRouter.get("/tasks", (req, res) => {
  res.send("Hello");
});

TaskRouter.post("/tasks", (req, res) => {
  res.send("tasks");
});

export default TaskRouter;

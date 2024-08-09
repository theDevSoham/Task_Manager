import { Router } from "express";
import multer from "multer";
import Task from "../models/TaskModel";
import { statusObject } from "../static/Static";

const TaskRouter = Router();

// setup multer
const uploads = multer({ dest: "uploads/" });

TaskRouter.get("/tasks", async (req, res) => {
  try {
    const tasksList = await Task.find();

    res.status(200).json({
      completed: tasksList.filter((task) => task.status === "Completed"),
      inProgress: tasksList.filter((task) => task.status === "In Progress"),
      pending: tasksList.filter((task) => task.status === "Pending"),
    });
  } catch (error) {
    console.error("Error getting taskslist: ", error);
    res.status(500).json({ message: "Unexpected failure on server side" });
  }
});

TaskRouter.get("/task/:id", async (req, res) => {
  const taskId = req.params.id;

  if (!taskId)
    return res.status(400).json({ message: "Cannot find without id " });

  try {
    const task = await Task.findById(taskId);

    if (task) {
      res.status(200).json({ message: "Found document", task });
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

TaskRouter.post("/tasks", uploads.none(), async (req, res) => {
  const taskTitle = req.body["task-title"];
  const taskDesc = req.body["task-desc"];
  const taskStatus = req.body["task-status"];
  console.log("All data: ", taskTitle, taskDesc, taskStatus);

  if (!taskTitle || !taskDesc || !taskStatus) {
    return res.status(400).json({ message: "Please enter missing fields" });
  }

  try {
    const task = new Task({
      title: taskTitle,
      description: taskDesc,
      status: statusObject[taskStatus as string],
    });

    const newTask = await task.save();
    res.status(200).json({ message: "New task created", id: newTask._id });
  } catch (error) {
    console.error("Error creating new task: ", error);
    res.status(500).json({ message: "Unexpected failure on server side" });
  }
});

TaskRouter.put("/task/:id", uploads.none(), async (req, res) => {
  const taskId = req.params.id; // Extract the task _id from the URL
  const taskTitle = req.body["task-title"];
  const taskDesc = req.body["task-desc"];
  const newStatus = req.body["task-status"];
  console.log("All data: ", taskTitle, taskDesc, newStatus);

  if (!taskId || (!taskTitle && !taskDesc && !newStatus))
    return res
      .status(400)
      .json({ message: "Need id and atleast one param to perform update" });

  try {
    const resp = await Task.findByIdAndUpdate(
      taskId,
      {
        title: taskTitle,
        description: taskDesc,
        status: statusObject[newStatus as string],
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Updated task with id " + taskId, id: resp?._id });
  } catch (error) {
    console.error("Error updating task: ", error);
    res
      .send(500)
      .json({ message: "Unexpected failure to update task on server side" });
  }
});

TaskRouter.delete("/task/:id", async (req, res) => {
  const taskId = req.params.id; // Extract the task _id from the URL
  if (!taskId)
    return res.status(400).json({ message: "Cannot delete without id" });

  try {
    const resp = await Task.findByIdAndDelete(taskId);

    res
      .status(200)
      .json({ message: "Deletion successful", deleted_task: resp });
  } catch (error) {
    console.error("Error deleting task: ", error);
    res
      .send(500)
      .json({ message: "Unexpected failure to delete task on server side" });
  }
});

export default TaskRouter;

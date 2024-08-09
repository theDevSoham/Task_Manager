import { Router } from "express";
import fs from "node:fs";
import multer from "multer";
import * as xlsx from "xlsx";
import Task from "../models/TaskModel";
import { JsonFromExcelType, statusObject } from "../static/Static";
import { createTasks } from "../static/helpers/Tasks";

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
    const newIds = await createTasks([
      { taskTitle, taskDesc, taskStatus: taskStatus as string },
    ]);
    res.status(200).json({ message: "New task created", id: newIds });
  } catch (error) {
    console.error("Error creating new task: ", error);
    res.status(500).json({ message: "Unexpected failure on server side" });
  }
});

TaskRouter.post(
  "/tasks/upload",
  uploads.single("excel-file"),
  async (req, res) => {
    if (!req.file) {
      res
        .status(400)
        .json({ message: "Cannot upload empty. File is required" });
    }

    try {
      const pathToFile: string = req.file?.path as string;
      console.log("Path to file: ", pathToFile);

      const workbook = xlsx.readFile(pathToFile);

      // Assuming data is in first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert sheet data to JSON
      const jsonData: JsonFromExcelType[] = xlsx.utils.sheet_to_json(worksheet);

      // Delete the file after processing
      fs.unlinkSync(pathToFile);

      console.log("Extracted json: ", jsonData);

      const newIds = await createTasks(
        jsonData.map((task) => ({
          taskTitle: task["Title"],
          taskDesc: task["Description"],
          taskStatus: task["Status"],
        }))
      );
      res.status(200).json({ message: "New tasks created from excel sheet", id: newIds });

      res
        .status(200)
        .json({ message: "Successfully created tasks from excel file" });
    } catch (error) {
      console.error("Error occured during upload: ", error);
      res
        .status(500)
        .send({ message: "Unexpected error occured while parsing file" });
    }

    res.status(404);
  }
);

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

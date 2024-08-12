import Task from "../../models/TaskModel";
import fs from "node:fs";
import { statusObject } from "../Static";

type TaskType = {
  taskTitle: string;
  taskDesc: string;
  taskStatus: string;
  taskPdf?: Buffer;
};

export const createTasks = async (tasks: TaskType[]) => {
  try {
    const taskResp = await Task.insertMany(
      tasks.map((task) => ({
        title: task.taskTitle,
        description: task.taskDesc,
        status: statusObject[task.taskStatus],
        ...(task.taskPdf
          ? {
              pdfContent: task.taskPdf.toString("base64"),
            }
          : {}),
      }))
    );

    return taskResp.length > 0 ? taskResp.map((task) => task._id) : [];
  } catch (error) {
    console.error("Error creating new task: ", error);
    return [];
  }
};

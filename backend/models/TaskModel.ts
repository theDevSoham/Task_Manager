import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Define the schema for tasks
const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
  dueDate: Date,
});

// Create and export the model
const Task = mongoose.model("Task", TaskSchema);

export default Task;

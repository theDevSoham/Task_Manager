import express, { Request, Response } from "express";
import { config } from "dotenv";
import path from "node:path";
import mongoose from "mongoose";
import TaskRouter from "./controller/TaskController";

// configures dotenv to work in your application
config();

// initiate mongoose
mongoose.connect(process.env.MONGODB_URI as string);

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Bind connection to open event (to get notification of successful connection)
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// initiate app
const app = express();

// to use json in body
app.use(express.json());

const PORT = process.env.PORT;

// all routers
app.use("/api/tasks", TaskRouter);

// Default redirect
app.get("/", (req: Request, res: Response) => {
  res.redirect("/api/tasks/home");
});

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
  });

import express, { Request, Response } from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import cors, { CorsOptions } from "cors";
import TaskRouter from "./controller/TaskController";

// configures dotenv to work in your application
config();

// include cors
const corsOption: CorsOptions =
  process.env.NODE_ENV === "PRODUCTION"
    ? { origin: [process.env.HOSTED_FRONTEND as string] }
    : { origin: ["http://127.0.0.1:5500", "http://localhost:5500"] };

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

const PORT = process.env.PORT;

// initiate app
const app = express();

app.use(express.json());
app.use(cors(corsOption));

// all routers
app.use("/api", TaskRouter);

// Default redirect
app.get("/", (req: Request, res: Response) => {
  res.send("Ping successful");
});

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
  });

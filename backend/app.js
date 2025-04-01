import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import foodItemsRoutes from "./routes/food_items.js";
import progress from "./routes/progress.js";
import workoutsRoutes from "./routes/workouts.js";
import usersRoutes from "./routes/users.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: true, // Replace with your frontend's origin
    credentials: true, // Allow cookies and credentials
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use("/food_items", foodItemsRoutes);

app.use("/progress", progress);

app.use("/workouts", workoutsRoutes);

app.use("/user", usersRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

export default app;


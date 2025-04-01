import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import foodItemsRoutes from "./routes/food_items.js"; 
import progress from "./routes/progress.js";
import workoutsRoutes from "./routes/workouts.js";
import exercisesRoutes from "./routes/exercises.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

// Middleware

app.use("/food_items", foodItemsRoutes);

app.use("/progress", progress);

app.use("/workouts", workoutsRoutes);

app.use("/exercises", exercisesRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

export default app;
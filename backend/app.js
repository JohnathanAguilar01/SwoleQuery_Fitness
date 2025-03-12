import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // Import cookie-parser
// import foodItemsRoutes from "./routes/food_items.js"; // Import the routes

dotenv.config();

const app = express();

app.use(
  cors({
    origin: true, // Replace with your frontend's origin
    credentials: true, // Allow cookies and credentials
  }),
);
app.use(cookieParser()); // Use cookie-parser separately
app.use(express.json());

// Middleware to use food items routes
// app.use("/food_items", foodItemsRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

export default app;

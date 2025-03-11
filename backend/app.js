import express from "express";
import cors from "cors";
import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend's origin
    credentials: true, // Allow cookies and credentials
  }),
);
app.use(express.json());

// Middleware to use Vehicles routes
// const VehiclesRoutes = require("./routes/Vehicles.js");
// app.use("/Vehicles", VehiclesRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

export default app;

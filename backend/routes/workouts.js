import express from "express";
import db from "../db.js";
const router = express.Router();

// Endpoint to add a new workout
router.post("/add", async (req, res) => {
  try {
    const { user_id, workout_date, notes } = req.body;

    if (!user_id || !workout_date) {
      return res
        .status(400)
        .json({ error: "user_id and workout_date are required" });
    }

    const insertQuery = `
    INSERT INTO workouts (user_id, workout_date, notes)
    VALUES (?, ?, ?)
    `;

    const [result] = await db.query(insertQuery, [
      user_id,
      workout_date,
      notes || "",
    ]);

    res.json({
      message: "workout added successfully",
      workout_id: result.insertId,
    });
  } catch (error) {
    console.error("error in /add workout route:", error);
    res.status(500).send("server error");
  }
});

// Endpoint to update the notes for an existing workout
router.patch("/update", async (req, res) => {
  try {
    const { workout_id, notes } = req.body;

    if (!workout_id) {
      return res.status(400).json({ error: "workout_id is required" });
    }

    const updateQuery = `
      UPDATE workouts
      SET notes = ?
      WHERE workout_id = ?
    `;

    const [result] = await db.query(updateQuery, [notes || "", workout_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "workout not found" });
    }

    res.json({ message: "notes updated successfully" });
  } catch (error) {
    console.error("error in /update route:", error);
    res.status(500).send("server error");
  }
});

// Endpoint to fetch workouts by user ID
router.get("/search/user", async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    if (isNaN(Number(user_id))) {
      return res.status(400).json({ error: "user_id must be a number" });
    }

    const query = "SELECT * FROM workouts WHERE user_id = ?";

    const [rows] = await db.query(query, [user_id]);

    res.json({
      message: "workouts retrieved successfully",
      workouts: rows,
    });
  } catch (error) {
    console.error("error in fetch workouts route:", error);
    res.status(500).send("server error");
  }
});

// Endpoint to fetch workouts by user ID and date
router.get("/search/by-user-date-single", async (req, res) => {
  try {
    const { user_id, workout_date } = req.query;

    if (!user_id || !workout_date) {
      return res.status(400).json({ error: "user_id and date are required" });
    }

    if (isNaN(Number(user_id))) {
      return res.status(400).json({ error: "user_id must be a number" });
    }

    if (isNaN(Date.parse(workout_date))) {
      return res
        .status(400)
        .json({ error: "workout_date must be a valid date" });
    }

    const query =
      "SELECT * FROM workouts WHERE user_id = ? AND workout_date = ?";

    const [rows] = await db.query(query, [user_id, workout_date]);

    res.json({
      message: "workouts retrieved successfully",
      workouts: rows,
    });
  } catch (error) {
    console.error("error in fetch workouts route:", error);
    res.status(500).send("server error");
  }
});

// Endpoint to fetch workouts by user ID and date range
router.get("/search/by-user-date-range", async (req, res) => {
  try {
    const { user_id, start_date, end_date } = req.query;

    if (!user_id || !start_date || !end_date) {
      return res
        .status(400)
        .json({ error: "user_id, start_date and end_date are required" });
    }

    if (isNaN(Number(user_id))) {
      return res.status(400).json({ error: "user_id must be a number" });
    }

    if (isNaN(Date.parse(start_date)) || isNaN(Date.parse(end_date))) {
      return res
        .status(400)
        .json({ error: "start and end date must be valid dates" });
    }

    if (new Date(start_date) > new Date(end_date)) {
      return res
        .status(400)
        .json({ error: "start_date must be before or equal to end_date" });
    }

    const query =
      "SELECT * FROM workouts WHERE user_id = ? AND workout_date BETWEEN ? AND ?";

    const [rows] = await db.query(query, [user_id, start_date, end_date]);

    res.json({
      message: "workouts retrieved successfully",
      workouts: rows,
    });
  } catch (error) {
    console.error("error in fetch workouts route:", error);
    res.status(500).send("server error");
  }
});

export default router;


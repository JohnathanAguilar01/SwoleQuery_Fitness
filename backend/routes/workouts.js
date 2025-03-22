import express from "express";
import db from "../db.js";
const router = express.Router();


// Endpoint to add a new workout
router.post("/add", async (req, res) => {
  try{
    const { user_id, workout_date, notes } = req.body;

    if (!user_id || !workout_date) {
      return res.status(400).json({ error: "user_id and workout_date are required" });
    }

    const insertQuery = `
    INSERT INTO workouts (user_id, workout_date, notes)
    VALUES (?, ?, ?)
    `;

    const [result] = await db.query(insertQuery, [user_id, workout_date, notes || ""]);
    
    res.json({
      message: "Workout added successfully",
      workout_id: result.insertId,
    });

  }catch(error){
      console.error("Error in /add workout route:", error);
      res.status(500).send("Server error");
  }
});

// Endpoint to fetch workouts by user ID
router.get("/search/user", async (req, res) => {
  try {
    const {user_id} = req.query;
    
    if(!user_id){
      return res.status(400).json({ error: "user_id is required" });
    }

    if (isNaN(Number(user_id))) {
      return res.status(400).json({ error: "user_id must be a number" });
    }

    const query = 'SELECT * FROM workouts WHERE user_id = ?'

    const [rows] = await db.query(query, [user_id]);

    res.json({
      message: "Workouts retrieved successfully",
      workouts: rows
    });

  } catch (error) {
    console.error("Error in fetch workouts route:", error);
    res.status(500).send("Server error");
  }
});

export default router;
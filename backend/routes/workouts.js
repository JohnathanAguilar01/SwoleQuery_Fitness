import express from "express";
import db from "../db.js";
const router = express.Router();


// Endpoint to add a new workout
router.post("/add", async (req, res) => {
    try{
        res.json({ message: "Workout endpoint reached (placeholder)" });
    }catch(error){
        console.error("Error in /add workout route:", error);
        res.status(500).send("Server error");
    }
});

// Endpoint to fetch workouts by user ID
router.get("/:user_id", async (req, res) => {
    try {
      res.json({ message: "Fetch workouts endpoint reached (placeholder)" });
    } catch (error) {
      console.error("Error in fetch workouts route:", error);
      res.status(500).send("Server error");
    }
});

export default router;
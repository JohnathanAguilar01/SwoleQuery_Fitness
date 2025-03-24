import express from "express";
import db from "../db.js";
const router = express.Router();

// localhost:5000/food_items/search
router.get("/search", async (req, res) => {
  try {
    const { food_id } = req.query;

    if (!food_id) {
      return res.status(400).json({ error: "food_id is required" });
    }

    const query = "SELECT * FROM food_items WHERE food_id = ?";

    // Use async/await for database query
    const [rows] = await db.query(query, [food_id]);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error: this big bad");
  }
});


// Endpoint to add a new food item
router.post("/add", async (req, res) => {
  try {
    const {
      meal_id,
      food_item_name,
      quantity,
      unit,
      calories,
      protein,
      carbs,
      fat
    } = req.body;

    // Validate required fields
    if (!meal_id || !food_item_name || !quantity || !unit || !calories) {
      return res.status(400).json({
        error: "meal_id, food_item_name, quantity, unit, and calories are required"
      });
    }

    const insertQuery = `
      INSERT INTO food_items
        (meal_id, food_item_name, quantity, unit, calories, protein, carbs, fat, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await db.query(insertQuery, [
      meal_id,
      food_item_name,
      quantity,
      unit,
      calories,
      protein || 0,
      carbs || 0,
      fat || 0
    ]);

    res.json({
      message: "Food item added successfully",
      food_item_id: result.insertId
    });
  } catch (error) {
    console.error("Error in /add food item route:", error);
    res.status(500).send("Server error");
  }
});

export default router;

//backend/routes/food_items.js
/****************************\
* Enpoint for food items     *
*                            *
* Author:Alexander Boutselis *
\****************************/

import express from "express";
import db from "../db.js";
const router = express.Router();

/*
 * GET /food_items/search/food?food_id=1
 * Description: Returns a single food item by its ID
 */
router.get("/search/food", async (req, res) => {
  try {
    const { food_id } = req.query;

    if (!food_id) {
      return res.status(400).json({ error: "food_id is required" });
    }

    if (isNaN(Number(food_id))) {
      return res.status(400).json({ error: "food_id must be a number" });
    }

    const query = "SELECT * FROM food_items WHERE food_id = ?";
    const [rows] = await db.query(query, [food_id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Food item not found" });
    }

    res.status(200).json({
      message: "Food item retrieved successfully",
      food_item: rows[0],
    });
  } catch (error) {
    console.error("Error fetching food item by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


/**
 * GET /food_items/search/meal?meal_id=1
 * Description: Returns all food items that belong to a specific meal
 */
router.get("/search/meal", async (req, res) => {
  try {
    //Extract meal_id from the query string
    const { meal_id } = req.query;

    //If meal_id is not provided, respond with a 400 error
    if (!meal_id) {
      return res.status(400).json({ error: "meal_id is required" });
    }

    //If meal_id is not a number (e.g., a string like "abc"), respond with 400
    if (isNaN(Number(meal_id))) {
      return res.status(400).json({ error: "meal_id must be a number" });
    }

    //Define the SQL query to select all food items with the given meal_id
    const query = "SELECT * FROM food_items WHERE meal_id = ?";

    //Execute the SQL query using parameterized values to prevent SQL injection
    const [rows] = await db.query(query, [meal_id]);

    //Response will always be 200 even if no food items are found — we return an empty array in that case
    res.status(200).json({
      message: "Food items retrieved successfully",
      food_items: rows, // This is either an array of food items, or an empty array
    });

  } catch (error) {
    //Catch and log any unexpected errors from the DB or server
    console.error("Error fetching food items by meal_id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


/**
 * POST /food_items/add
 * Description: Creates a new food item entry for a given meal.
 * Required fields: meal_id, food_name, quantity, unit, calories
 * Optional fields: protein, carbs, fats
 */
router.post("/add", async (req, res) => {
  try {
    //Destructure values from the request body
    const {
      meal_id,
      food_name,
      quantity,
      unit,
      calories,
      protein = null,
      carbs = null,
      fats = null,
    } = req.body;

    //Check that all required fields are present
    if (!meal_id || !food_name || !quantity || !unit || !calories) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    //Make sure everything pretending to be a number is actually a number
    if (
      isNaN(Number(meal_id)) ||
      isNaN(Number(quantity)) ||
      isNaN(Number(calories)) ||
      (protein !== null && isNaN(Number(protein))) ||
      (carbs !== null && isNaN(Number(carbs))) ||
      (fats !== null && isNaN(Number(fats)))
    ) {
      return res.status(400).json({ error: "One or more fields have invalid data types" });
    }

    //SQL query to insert new food item into the database
    const insertQuery = `
      INSERT INTO food_items (
        meal_id, food_name, quantity, unit, calories, protein, carbs, fats
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    //Execute the query
    const [result] = await db.query(insertQuery, [
      meal_id,
      food_name,
      quantity,
      unit,
      calories,
      protein,
      carbs,
      fats,
    ]);

    //Send back success response with new food_id from the insert
    res.status(200).json({
      message: "Food item added successfully",
      food_id: result.insertId,
    });

  } catch (error) {
    console.error("Error adding food item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
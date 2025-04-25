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
 * SELECT /food_items/search/food?food_id=1
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

/*
 * SELECT /food_items/search/by_user_and_date?user_id=[User_ID]&start_date=[Start_date]&end_date=[End_Date]
 * Description: Returns all food items that belong to a specific user between the selected start and end dates
 */
router.get("/search/user_and_dates", async (req, res) => {
  try {
    const { user_id, start_date, end_date } = req.query;

    //Validate user_id, start_date, and end_date
    if (!user_id || !start_date || !end_date) {
      return res
        .status(400)
        .json({ error: "user_id, start_date, and end_date are required" });
    }

    //Validate that user_id is a number
    if (isNaN(Number(user_id))) {
      return res.status(400).json({ error: "user_id must be a number" });
    }

    //Build SELECT query
    const query = `
      SELECT fi.*
      FROM food_items fi
      JOIN meals m ON fi.meal_id = m.meal_id
      WHERE m.user_id = ?
      AND m.meal_date BETWEEN ? AND ?
      ORDER BY m.meal_date ASC
    `;

    //Execute the SQL query using parameterized values to prevent SQL injection
    const [rows] = await db.query(query, [user_id, start_date, end_date]);

    //Response will always be 200 even if no food items are found, return an empty array
    res.status(200).json({
      message: "Food items retrieved successfully",
      food_items: rows,
    });
  } catch (error) {
    //Catch any failed SELECT with code 500
    console.error("Error fetching food items by user and date:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * SELECT /food_items/search/meal?meal_id=1
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

    //If meal_id is not a number, respond with 400
    if (isNaN(Number(meal_id))) {
      return res.status(400).json({ error: "meal_id must be a number" });
    }

    //Define the SQL query to select all food items with the given meal_id
    const query = "SELECT * FROM food_items WHERE meal_id = ?";

    //Execute the SQL query using parameterized values to prevent SQL injection
    const [rows] = await db.query(query, [meal_id]);

    //Response will always be 200 even if no food items are found, return an empty array
    res.status(200).json({
      message: "Food items retrieved successfully",
      food_items: rows,
    });
  } catch (error) {
    //Catch and log any unexpected errors from the DB or server
    console.error("Error fetching food items by meal_id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * INSERT /food_items/add
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
      return res
        .status(400)
        .json({ error: "One or more fields have invalid data types" });
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

/*
 * UPDATE /food_items/update
 * Description: Updates a food item based on food_id. Accepts any combination of fields to update.
 */
router.put("/update", async (req, res) => {
  try {
    const {
      food_id,
      meal_id,
      food_name,
      quantity,
      unit,
      calories,
      protein,
      carbs,
      fats,
    } = req.body;

    // Validate that food_id is present
    if (!food_id) {
      return res.status(400).json({ error: "food_id is required" });
    }

    // Build the dynamic update fields and values
    const updates = [];
    const values = [];

    if (meal_id !== undefined) {
      updates.push("meal_id = ?");
      values.push(meal_id);
    }
    if (food_name !== undefined) {
      updates.push("food_name = ?");
      values.push(food_name);
    }
    if (quantity !== undefined) {
      updates.push("quantity = ?");
      values.push(quantity);
    }
    if (unit !== undefined) {
      updates.push("unit = ?");
      values.push(unit);
    }
    if (calories !== undefined) {
      updates.push("calories = ?");
      values.push(calories);
    }
    if (protein !== undefined) {
      updates.push("protein = ?");
      values.push(protein);
    }
    if (carbs !== undefined) {
      updates.push("carbs = ?");
      values.push(carbs);
    }
    if (fats !== undefined) {
      updates.push("fats = ?");
      values.push(fats);
    }

    // Validate that there is at least one field to update
    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    // Build UPDATE query string
    const updateQuery = `
      UPDATE food_items
      SET ${updates.join(", ")}
      WHERE food_id = ?
    `;

    // Add food_id to the end of the values array
    values.push(food_id);

    // Execute the SQL query
    const [result] = await db.query(updateQuery, values);

    // Check if a row was actually updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Food item not found" });
    }

    // If all goes well, return success
    res.status(200).json({ message: "Food item updated successfully" });
  } catch (error) {
    // Catch any failed UPDATE with code 500
    console.error("Error updating food item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * DELETE /food_items/delete?food_id=1
 * Description: Deletes a food item by its ID (food_id).
 * We assume the client is passing the food_id via query string.
 *
 * Manual Deletion: curl -X DELETE "http://localhost:5000/food_items/delete?food_id=[food_id]"
 */
router.delete("/delete", async (req, res) => {
  try {
    //Extract the food_id from the query params
    const { food_id } = req.query;

    //Step 1: Validate not null
    if (!food_id) {
      return res.status(400).json({ error: "food_id is required" });
    }

    //Step 2: Validate that it’s actually a number
    if (isNaN(Number(food_id))) {
      return res.status(400).json({ error: "food_id must be a number" });
    }

    //Step 3: Execute the delete query
    const deleteQuery = "DELETE FROM food_items WHERE food_id = ?";
    const [result] = await db.query(deleteQuery, [food_id]);

    //Step 4: Check if anything was deleted
    if (result.affectedRows === 0) {
      // Nothing matched that ID
      return res
        .status(404)
        .json({ error: "Food item not found or already deleted" });
    }

    //Step 5: Success
    res.status(200).json({ message: "Food item deleted successfully" });
  } catch (error) {
    //If we hit this block, something exploded
    console.error("Error deleting food item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

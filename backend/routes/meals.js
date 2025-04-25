//backend/routes/meals.js
/****************************\
* Enpoint for meals          *
*                            *
* Author:Alexander Boutselis *
\****************************/

import express from "express";
import db from "../db.js";
const router = express.Router();

/*
CREATE TABLE IF NOT EXISTS meals(
  meal_id int auto_increment PRIMARY KEY,
  user_id int NOT NULL,
  meal_date date NOT NULL,
  calories int NOT NULL,
  protein decimal(6,2),
  carbs decimal(6,2),
  fats decimal(6,2),
  notes varchar(256),
*/

/**
 * INSERT /meals/add
 * Description: Creates a new meal entry for a given day.
 * Required fields: user_id, meal_date, calories
 * Optional fields: protein, carbs, fats, notes
 */
router.post("/add", async (req, res) => {
  try {
    const {
      user_id,
      meal_date,
      calories,
      protein = null,
      carbs = null,
      fats = null,
      notes = null,
    } = req.body;

    //Validate required fields
    if (!user_id || !meal_date || !calories) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    //Make sure everything pretending to be a number is actually a number
    if (
      isNaN(Number(user_id)) ||
      isNaN(Number(calories)) ||
      (protein !== null && isNaN(Number(protein))) ||
      (carbs !== null && isNaN(Number(carbs))) ||
      (fats !== null && isNaN(Number(fats)))
    ) {
      return res
        .status(400)
        .json({ error: "One or more fields have invalid data types" });
    }

    //Build INSERT query for meals
    const insertQuery = `
      INSERT INTO meals (
      user_id, meal_date, calories, protein, carbs, fats, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

    //Send query and handle response
    const [result] = await db.query(insertQuery, [
      user_id,
      meal_date,
      calories,
      protein,
      carbs,
      fats,
      notes,
    ]);

    res.status(200).json({
      message: "Meal added successfully",
      meal_id: result.insertId,
    });
  } catch (error) {
    console.error("Error adding meal:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/*
 * PUT /meals/update
 * Description: Updates a meal by meal_id. Accepts any combination of fields to update.
 * Required: meal_id
 */
router.put("/update", async (req, res) => {
  try {
    const {
      meal_id,
      user_id,
      meal_date,
      calories,
      protein,
      carbs,
      fats,
      notes,
    } = req.body;

    if (!meal_id) {
      return res.status(400).json({ error: "meal_id is required" });
    }

    const updates = [];
    const values = [];

    if (user_id !== undefined) {
      updates.push("user_id = ?");
      values.push(user_id);
    }
    if (meal_date !== undefined) {
      updates.push("meal_date = ?");
      values.push(meal_date);
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
    if (notes !== undefined) {
      updates.push("notes = ?");
      values.push(notes);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const updateQuery = `
      UPDATE meals
      SET ${updates.join(", ")}
      WHERE meal_id = ?
    `;

    values.push(meal_id);
    const [result] = await db.query(updateQuery, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Meal not found" });
    }

    res.status(200).json({ message: "Meal updated successfully" });
  } catch (error) {
    console.error("Error updating meal:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /meals/:userId/range
 * Description: Returns all meals for a user between two dates (inclusive).
 * Required query params: start (yyyy-mm-dd), end (yyyy-mm-dd)
 */
router.get("/:userId/range", async (req, res) => {
  try {
    const { userId } = req.params;
    const { start, end } = req.query;

    if (!start || !end) {
      return res
        .status(400)
        .json({ error: "Start and end dates are required" });
    }

    const query = `
      SELECT * FROM meals
      WHERE user_id = ?
      AND meal_date BETWEEN ? AND ?
      ORDER BY meal_date ASC
      `;

    const [rows] = await db.query(query, [userId, start, end]);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching meals by date range:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /meals/:userId/day
 * Description: Returns all meals for a user on a specific date.
 * Required query param: date (yyyy-mm-dd)
 */
router.get("/:userId/day", async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    const query = `
      SELECT * FROM meals
      WHERE user_id = ?
      AND meal_date = ?
      ORDER BY meal_date ASC
      `;

    const [rows] = await db.query(query, [userId, date]);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching meals by specific date:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

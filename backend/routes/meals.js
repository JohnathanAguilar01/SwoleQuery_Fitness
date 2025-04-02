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
      return res.status(400).json({ error: "One or more fields have invalid data types" });
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

export default router;
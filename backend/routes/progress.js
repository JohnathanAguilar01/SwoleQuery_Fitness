import express from "express";
import db from "../db.js";
const router = express.Router();

// localhost:5000/food_items/search
router.get("/", async (req, res) => {
  try {
    const query = "SELECT * FROM progress";
    // Use async/await for database query
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error: This Big Bad!");
  }
});

router.get("/search/user", async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    if (Number.isInteger(user_id)) {
      return res.status(400).json({ error: "user_id is not a integer" });
    }

    const query = "SELECT * FROM progress WHERE user_id = ?";
    const [rows] = await db.query(query, [user_id]);
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error: This Big Bad!");
  }
});

export default router;

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
    let { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    // Convert user_id to a number
    user_id = parseInt(user_id, 10);

    if (!Number.isInteger(user_id)) {
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

router.post("/add", async (req, res) => {
  try {
    const { user_id, recorded_at, weight, body_fat_percentage, muscle_mass } =
      req.body;

    if (!user_id || !weight) {
      return res.status(400).json({ error: "user_id or weight not present" });
    }

    const queryProgress =
      "INSERT INTO progress (user_id, recorded_at, weight, body_fat_percentage, muscle_mass) VALUES (?,?,?,?,?)";

    const queryUser = "UPDATE users SET weight = ? WHERE user_id = ?;";

    const [rows] = await db.query(queryProgress, [
      user_id,
      recorded_at,
      weight,
      body_fat_percentage,
      muscle_mass,
    ]);

    const [rows2] = await db.query(queryUser, [weight, user_id]);

    res.json({
      ProgressRow: rows,
      userRow: rows2,
    });
  } catch (error) {
    console.error("Server Error:", error.message);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

export default router;

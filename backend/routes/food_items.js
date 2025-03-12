import express from "express";
import db from "../db";
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

export default router;

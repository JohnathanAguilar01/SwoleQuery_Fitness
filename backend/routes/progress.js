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
    res.status(500).send("Server error: this big bad");
  }
});

export default router;

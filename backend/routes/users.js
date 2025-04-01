import express from "express";
import db from "../db.js";
import bcrypt from "bcrypt";
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { first_name, last_name, username, email, password, height, weight } =
      req.body;

    if (!first_name || !last_name || !username || !email || !password) {
      return res.status(400).json({
        error: "Missing user input",
      });
    }
    const saltRounds = 10;
    const salted_password = await bcrypt.hash(password, saltRounds);

    const query =
      "INSERT INTO users (first_name, last_name, username, email, password, height, weight) VALUES (?,?,?,?,?,?,?)";

    const [results] = await db.query(query, [
      first_name,
      last_name,
      username,
      email,
      salted_password,
      height,
      weight,
    ]);

    res.status(200).json({ user_id: results.insertId });
  } catch (error) {
    console.error("Server Error:", error.message);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

export default router;

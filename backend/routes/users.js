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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    // Validate password strength (min 8 chars, at least one number and one letter)
    if (
      password.length < 8 ||
      !/\d/.test(password) ||
      !/[a-zA-Z]/.test(password)
    ) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters and contain at least one letter and one number",
      });
    }

    // Check if username or email already exists
    const [existingUsers] = await db.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email],
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        error: "Username or email already exists",
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

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Missing user input",
      });
    }

    const query = "SELECT * FROM users WHERE username = ?";
    const [results] = await db.query(query, [username]);

    if (results.length === 0) {
      return res.status(400).json({ error: "User Not Found" });
    }

    const user = results[0];
    const correct_user = await bcrypt.compare(password, user.password);

    if (!correct_user) {
      return res.status(401).json({ error: "Invalid Username or Password" });
    }

    res.status(200).json({
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      height: user.height,
      weight: user.weight,
    });
  } catch (error) {
    console.error("Server Error:", error.message);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

export default router;

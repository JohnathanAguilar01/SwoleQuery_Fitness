import request from "supertest";
import app from "../app";
import db from "../db.js";

describe("/meals/add", () => {
  describe("Positive test: insert meal successfully", () => {
    test("should add a new meal with all fields", async () => {
      const response = await request(app)
        .post("/meals/add")
        .send({
          user_id: 1,
          meal_date: "2025-03-30",
          calories: 750,
          protein: 45.6,
          carbs: 88.2,
          fats: 32.9,
          notes: "Test meal - healthy lunch"
        })
        .set("Content-Type", "application/json")
        .expect(200);

      expect(response.body).toHaveProperty("message", "Meal added successfully");
      expect(response.body).toHaveProperty("meal_id");
    });
  });

  describe("Negative test: missing required fields", () => {
    test("should return 400 if user_id is missing", async () => {
      const response = await request(app)
        .post("/meals/add")
        .send({
          meal_date: "2025-03-30",
          calories: 500
        })
        .set("Content-Type", "application/json")
        .expect(400);

      expect(response.body).toHaveProperty("error", "Missing required fields");
    });

    test("should return 400 if calories is missing", async () => {
      const response = await request(app)
        .post("/meals/add")
        .send({
          user_id: 1,
          meal_date: "2025-03-30"
        })
        .set("Content-Type", "application/json")
        .expect(400);

      expect(response.body).toHaveProperty("error", "Missing required fields");
    });
  });

  describe("Negative test: invalid data types", () => {
    test("should return 400 if protein is not a number", async () => {
      const response = await request(app)
        .post("/meals/add")
        .send({
          user_id: 1,
          meal_date: "2025-03-30",
          calories: 600,
          protein: "not-a-number",
          carbs: 20,
          fats: 10,
        })
        .set("Content-Type", "application/json")
        .expect(400);

      expect(response.body).toHaveProperty("error", "One or more fields have invalid data types");
    });
  });
});

// Close the DB pool after tests
afterAll(() => {
  db.end();
});
//food_items.test.js

import request from "supertest";
import app from "../app.js";

describe("POST /food_items/add", () => {
  describe("positive tests", () => {
    test("should add a food item with all fields", async () => {
      const response = await request(app)
        .post("/food_items/add")
        .send({
          meal_id: 1,
          food_item_name: "Oatmeal",
          quantity: 100,
          unit: "g",
          calories: 380,
          protein: 10,
          carbs: 66,
          fat: 7
        })
        .set("Content-Type", "application/json")
        .expect(200);

      expect(response.body).toHaveProperty("message", "Food item added successfully");
      expect(response.body).toHaveProperty("food_item_id");
    });

    test("should add food item with missing optional macros", async () => {
      const response = await request(app)
        .post("/food_items/add")
        .send({
          meal_id: 1,
          food_item_name: "Banana",
          quantity: 1,
          unit: "piece",
          calories: 105
        })
        .set("Content-Type", "application/json")
        .expect(200);

      expect(response.body).toHaveProperty("message", "Food item added successfully");
      expect(response.body).toHaveProperty("food_item_id");
    });
  });

  describe("negative tests", () => {
    test("missing required fields should return 400", async () => {
      const response = await request(app)
        .post("/food_items/add")
        .send({
          food_item_name: "Apple"
        })
        .set("Content-Type", "application/json")
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    test("invalid data types should return 500", async () => {
      const response = await request(app)
        .post("/food_items/add")
        .send({
          meal_id: "abc",
          food_item_name: "Protein Bar",
          quantity: "a lot",
          unit: "bar",
          calories: "many"
        })
        .set("Content-Type", "application/json")
        .expect(500);
    });
  });
});

describe("GET /food_items/search", () => {
  test("should retrieve food item by food_id", async () => {
    const response = await request(app)
      .get("/food_items/search")
      .query({ food_id: 1 })
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  test("missing food_id should return 400", async () => {
    const response = await request(app)
      .get("/food_items/search")
      .expect(400);

    expect(response.body).toHaveProperty("error", "food_id is required");
  });
});

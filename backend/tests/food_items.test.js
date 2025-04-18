//docker exec -it swole-backend npm test tests/food_items.test.js

import request from "supertest";
import app from "../app";
import db from "../db.js"; 


describe("/food_items/search/food", () => {
  describe("Validate GET food_item by food_id with seeded food_item", () => {
    test("should return food item with food_id = 1", async () => {
      const response = await request(app)
        .get("/food_items/search/food")
        .query({ food_id: 1 })
        .expect(200);

      expect(response.body).toHaveProperty("message", "Food item retrieved successfully");
      expect(response.body).toHaveProperty("food_item");
      expect(response.body.food_item.food_id).toBe(1);
      expect(response.body.food_item.food_name).toBe("taco");
    });
  });
});

describe("/food_items/search/meal", () => {
  describe("Validate GET food_items by meal with seeded meal", () => {
    test("should return food items for meal_id = 1", async () => {
      const response = await request(app)
        .get("/food_items/search/meal")
        .query({ meal_id: 1 })
        .expect(200);

      expect(response.body).toHaveProperty("message", "Food items retrieved successfully");
      expect(Array.isArray(response.body.food_items)).toBe(true);
      expect(response.body.food_items.length).toBeGreaterThan(0);
      expect(response.body.food_items[0].meal_id).toBe(1);
    });
  });
});


describe("/food_items/add", () => {
  let proteinBarId;
  let soupId;

  describe("Creates food item called Protein Bar", () => {
    test("should create food_item: Protein Bar with all macros", async () => {
      const response = await request(app)
        .post("/food_items/add")
        .send({
          meal_id: 1,
          food_name: "Protein Bar",
          quantity: 13,
          unit: "ounces",
          calories: 3,
          protein: 15,
          carbs: 2,
          fats: 1,
        })
        .set("Content-Type", "application/json")
        .expect(200);

      expect(response.body).toHaveProperty("message", "Food item added successfully");
      expect(response.body).toHaveProperty("food_id");

      proteinBarId = response.body.food_id;
    });

    test("should create food_item: Soup without macros", async () => {
      const response = await request(app)
        .post("/food_items/add")
        .send({
          meal_id: 1,
          food_name: "Soup",
          quantity: 250,
          unit: "ml",
          calories: 90,
        })
        .set("Content-Type", "application/json")
        .expect(200);

      expect(response.body).toHaveProperty("message", "Food item added successfully");
      expect(response.body).toHaveProperty("food_id");

      soupId = response.body.food_id;
    });

    test("should retrieve Protein Bar by food_id", async () => {
      const response = await request(app)
        .get("/food_items/search/food")
        .query({ food_id: proteinBarId })
        .expect(200);

      expect(response.body).toHaveProperty("food_item");
      expect(response.body.food_item.food_name).toBe("Protein Bar");
    });

    test("should retrieve all food items for meal_id = 1", async () => {
      const response = await request(app)
        .get("/food_items/search/meal")
        .query({ meal_id: 1 })
        .expect(200);

      const names = response.body.food_items.map(item => item.food_name);
      expect(names).toEqual(expect.arrayContaining(["Protein Bar", "Soup"]));
    });
  });

  describe("Test to POST bad request", () => {
    test("should return 400 for missing required fields", async () => {
      const response = await request(app)
        .post("/food_items/add")
        .send({
          food_name: "Air",
          quantity: 1,
          unit: "inhalation",
          calories: 0,
        })
        .set("Content-Type", "application/json")
        .expect(400);

      expect(response.body).toHaveProperty("error", "Missing required fields");
    });

    test("should return 400 for non-numeric input", async () => {
      const response = await request(app)
        .post("/food_items/add")
        .send({
          meal_id: "not-a-number",
          food_name: "Chaos Meal",
          quantity: "yolo",
          unit: "dimension",
          calories: "nope",
        })
        .set("Content-Type", "application/json")
        .expect(400);

      expect(response.body).toHaveProperty("error", "One or more fields have invalid data types");
    });
  });
});

describe("/food_items/update", () => {
  let updateTestId;

  // Create a food item before tests so we can update it
  beforeAll(async () => {
    const response = await request(app)
      .post("/food_items/add")
      .send({
        meal_id: 1,
        food_name: "Update Test Food",
        quantity: 50,
        unit: "grams",
        calories: 100,
      })
      .set("Content-Type", "application/json");

    updateTestId = response.body.food_id;
  });

  test("should update food_name and calories for food_id", async () => {
    const response = await request(app)
      .put("/food_items/update")
      .send({
        food_id: updateTestId,
        food_name: "Updated Food Name",
        calories: 150,
      })
      .set("Content-Type", "application/json")
      .expect(200);

    expect(response.body).toHaveProperty("message", "Food item updated successfully");
  });

  test("should return updated values on GET", async () => {
    const response = await request(app)
      .get("/food_items/search/food")
      .query({ food_id: updateTestId })
      .expect(200);

    expect(response.body.food_item.food_name).toBe("Updated Food Name");
    expect(Number(response.body.food_item.calories)).toBe(150);
  });

  test("should return 400 if no update fields are given", async () => {
    const response = await request(app)
      .put("/food_items/update")
      .send({
        food_id: updateTestId,
      })
      .set("Content-Type", "application/json")
      .expect(400);

    expect(response.body).toHaveProperty("error", "No fields to update");
  });

  test("should fetch items by user_id and date range", async () => {
    const response = await request(app)
      .get("/food_items/search/user_and_dates")
      .query({
        user_id: 1,
        start_date: "2025-03-01",
        end_date: "2025-12-31",
      })
      .expect(200);

    expect(response.body).toHaveProperty("message", "Food items retrieved successfully");
    expect(Array.isArray(response.body.food_items)).toBe(true);
    expect(response.body.food_items.length).toBeGreaterThan(0);
  });
});


// Clean up MySQL connection pool
afterAll(() => {
  db.end();
});

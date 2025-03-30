import request from "supertest";
import app from "../app";
import db from "../db.js"; // for afterAll cleanup


describe("/food_items/search/food", () => {
  describe("positive tests", () => {
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
  describe("positive tests", () => {
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

  describe("positive tests", () => {
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

  describe("negative tests", () => {
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

// Clean up MySQL connection pool
afterAll(() => {
  db.end();
});

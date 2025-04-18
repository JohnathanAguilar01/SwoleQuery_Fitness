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

describe("/meals/update", () => {
  let testMealId;
  
  beforeAll(async () => {
    // Insert a test meal for update testing
    const res = await request(app)
    .post("/meals/add")
    .send({
      user_id: 1,
      meal_date: "2025-04-01",
      calories: 500,
      notes: "Initial meal for update"
    });
    testMealId = res.body.meal_id;
  });
  
  test("should update an existing meal's notes and calories", async () => {
    const response = await request(app)
    .put("/meals/update")
    .send({
      meal_id: testMealId,
      calories: 650,
      notes: "Updated notes"
    })
    .expect(200);
    
    expect(response.body).toHaveProperty("message", "Meal updated successfully");
  });
  
  test("should return 400 if meal_id is missing", async () => {
    const response = await request(app)
    .put("/meals/update")
    .send({
      calories: 700
    })
    .expect(400);
    
    expect(response.body).toHaveProperty("error", "meal_id is required");
  });
  
  test("should return 400 if no fields to update are provided", async () => {
    const response = await request(app)
    .put("/meals/update")
    .send({ 
      meal_id: testMealId 
    })
    .expect(400);
    
    expect(response.body).toHaveProperty("error", "No fields to update");
  });
  
  test("should return 404 if meal does not exist", async () => {
  const response = await request(app)
  .put("/meals/update")
  .send({
    meal_id: 999999,
    calories: 1000 
  })
  .expect(404);
  
  expect(response.body).toHaveProperty("error", "Meal not found");
  });
});

// Close the DB pool after tests
afterAll(() => {
  db.end();
});
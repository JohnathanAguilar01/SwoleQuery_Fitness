import request from "supertest";
import app from "../app";
import { response } from "express";
import db from "../db";

describe("Testing the progress route root and serach by user", () => {
  test("Checking root endpoint to get all progress data", async () => {
    await request(app)
      .get("/progress")
      .expect("Content-Type", /json/)
      .expect(200);
  });

  test("checking /search/user to get progress data for specified user", async () => {
    const response = await request(app).get("/progress/search/user?user_id=2");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        progress_id: 2,
        user_id: 2,
        recorded_at: "2025-03-12T11:25:46.000Z",
        weight: "120.60",
        body_fat_percentage: null,
        muscle_mass: null,
      },
    ]);
  });
});

describe("Testing the /progress/add to add progress", () => {
  test("Test for when adding is all ok", async () => {
    const response = await request(app)
      .post("/progress/add")
      .send({
        user_id: 1,
        weight: 150.7,
        body_fat_percentage: null,
        muscle_mass: null,
      })
      .set("Content-Type", "application/json")
      .expect(200);
  });

  test("Testing if user dose not input weight", async () => {
    const response = await request(app)
      .post("/progress/add")
      .send({ user_id: 1 })
      .set("Content-Type", "application/json")
      .expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("user_id or weight not present");
  });

  test("Testing if user dose not input user_id", async () => {
    const response = await request(app)
      .post("/progress/add")
      .send({ weight: 190.5 })
      .set("Content-Type", "application/json")
      .expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("user_id or weight not present");
  });

  test("Testing if user dose not input user_id as an int", async () => {
    const response = await request(app)
      .post("/progress/add")
      .send({ user_id: "hat", weight: 190.5 })
      .set("Content-Type", "application/json")
      .expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe(
      "user_id or weight are not correct data type",
    );
  });

  test("Testing if user dose not input weight as a float", async () => {
    const response = await request(app)
      .post("/progress/add")
      .send({ user_id: 1, weight: "test" })
      .set("Content-Type", "application/json")
      .expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe(
      "user_id or weight are not correct data type",
    );
  });
});

// Clean up MySQL connection pool
afterAll(() => {
  db.end();
});

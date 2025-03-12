import request from "supertest";
import app from "../app";
import { response } from "express";

describe("Testing the progress route", () => {
  test("Checking root endpoint to get all progress data", async () => {
    const response = await request(app).get("/progress");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        progress_id: 1,
        user_id: 1,
        recorded_at: "2025-03-12T11:25:46.000Z",
        weight: "120.60",
        body_fat_percentage: null,
        muscle_mass: null,
      },
    ]);
  });

  test("checking /search/user to get progress data for specified user", async () => {
    const response = await request(app).get("/progress/search/user?user_id=1");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        progress_id: 1,
        user_id: 1,
        recorded_at: "2025-03-12T11:25:46.000Z",
        weight: "120.60",
        body_fat_percentage: null,
        muscle_mass: null,
      },
    ]);
  });
});

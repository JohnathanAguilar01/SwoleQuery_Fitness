import request from "supertest";
import app from "../app";

describe("POST /add", () => {
    describe("given working data for all fields, cardio", () => {
        test("should successfully add an exercise", async () => {
          const response = await request(app).post("/exercises/add").send({
                "user_id": 1,
                "workout_id": 9,
                "intensity": 25.00,
                "exercise_type": "cardio",
                "calories_burned": 250,
                "exercise_time": 30
            })
            .set("Content-Type", "application/json")
            .expect(200);
        });
    });
});
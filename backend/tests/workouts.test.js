import request from "supertest";
import app from "../app";

describe("POST /add", () =>{
    describe("given user_id, workout_date, notes", () => {
        // should add the workout to the database
        // should respond with a json object containing a message and workout_id
        // should respond with 200 status code
        test("should successfully add a workout", async () => {
          const response = await request(app).post("/workouts/add").send({
              user_id: 1,
              workout_date: "2025-03-19 14:30:00",
              notes: "Leg day, felt strong",
            })
            .set("Content-Type", "application/json")
            .expect(200);
        });
    });
});
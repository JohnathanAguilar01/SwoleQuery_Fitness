import request from "supertest";
import app from "../app";
import db from "../db";

describe("POST /add", () => {
  describe("positive tests", () => {
    describe("given working data for all fields, cardio", () => {
      test("should successfully add an exercise, cardio", async () => {
        const response = await request(app)
          .post("/exercises/add")
          .send({
            user_id: 1,
            workout_id: 9,
            intensity: 25.0,
            exercise_type: "cardio",
            calories_burned: 250,
            exercise_time: 30,
          })
          .set("Content-Type", "application/json")
          .expect(200);
      });
    });

    describe("given working data for all fields, strength", () => {
      test("should successfully add an exercise, strength", async () => {
        const response = await request(app)
          .post("/exercises/add")
          .send({
            user_id: 1,
            workout_id: 9,
            intensity: 25.0,
            exercise_type: "strength training",
            calories_burned: 250,
            weight: 100.0,
            sets: 5,
            reps: 5,
          })
          .set("content-Type", "application/json")
          .expect(200);
      });
    });
  });
  describe("negative tests", () => {
    test("should fail when required fields are missing", async () => {
      // Missing user_id, workout_id, and intensity (only exercise_type and calories_burned provided)
      const response = await request(app)
        .post("/exercises/add")
        .send({
          exercise_type: "cardio",
          calories_burned: 250,
          exercise_time: 30,
        })
        .set("Content-Type", "application/json");
      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(
        "user_id, workout_id, intensity, and exercise_type are required",
      );
    });

    test("should fail when exercise_type is invalid", async () => {
      const response = await request(app)
        .post("/exercises/add")
        .send({
          user_id: 1,
          workout_id: 9,
          intensity: 25.0,
          exercise_type: "yoga", // invalid exercise type
          calories_burned: 250,
        })
        .set("Content-Type", "application/json");
      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(
        "exercise_type must be 'cardio' or 'strength training'",
      );
    });

    test("should fail when cardio exercise is missing exercise_time", async () => {
      const response = await request(app)
        .post("/exercises/add")
        .send({
          user_id: 1,
          workout_id: 9,
          intensity: 25.0,
          exercise_type: "cardio",
          calories_burned: 250,
          // exercise_time is missing
        })
        .set("Content-Type", "application/json");
      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(
        "cardio exercises must have an excercise_time",
      );
    });

    describe("strength training negative tests", () => {
      test("should fail when weight is missing", async () => {
        const response = await request(app)
          .post("/exercises/add")
          .send({
            user_id: 1,
            workout_id: 9,
            intensity: 25.0,
            exercise_type: "strength training",
            calories_burned: 250,
            sets: 5,
            reps: 5,
            // weight is missing
          })
          .set("Content-Type", "application/json");
        expect(response.status).toBe(400);
        expect(response.body.error).toMatch(
          "strength training excercises must have weight, sets, and reps",
        );
      });

      test("should fail when sets is missing", async () => {
        const response = await request(app)
          .post("/exercises/add")
          .send({
            user_id: 1,
            workout_id: 9,
            intensity: 25.0,
            exercise_type: "strength training",
            calories_burned: 250,
            weight: 100.0,
            reps: 5,
            // sets is missing
          })
          .set("Content-Type", "application/json");
        expect(response.status).toBe(400);
        expect(response.body.error).toMatch(
          "strength training excercises must have weight, sets, and reps",
        );
      });

      test("should fail when reps is missing", async () => {
        const response = await request(app)
          .post("/exercises/add")
          .send({
            user_id: 1,
            workout_id: 9,
            intensity: 25.0,
            exercise_type: "strength training",
            calories_burned: 250,
            weight: 100.0,
            sets: 5,
            // reps is missing
          })
          .set("Content-Type", "application/json");
        expect(response.status).toBe(400);
        expect(response.body.error).toMatch(
          "strength training excercises must have weight, sets, and reps",
        );
      });
    });

    test("should fail when calories_burned is not positive", async () => {
      const response = await request(app)
        .post("/exercises/add")
        .send({
          user_id: 1,
          workout_id: 9,
          intensity: 25.0,
          exercise_type: "cardio",
          calories_burned: 0, // non-positive value
          exercise_time: 30,
        })
        .set("Content-Type", "application/json");
      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(
        "an excercise must have a positive int for calories_burned",
      );
    });
  });
});

// Clean up MySQL connection pool
afterAll(() => {
  db.end();
});


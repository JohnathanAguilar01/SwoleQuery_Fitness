import request from "supertest";
import app from "../app";
import db from "../db";

describe("POST /add", () => {
  describe("positive tests", () => {
    describe("given user_id, workout_date, notes", () => {
      test("should successfully add a workout", async () => {
        const response = await request(app)
          .post("/workouts/add")
          .send({
            user_id: 1,
            workout_date: "2025-03-19 14:30:00",
            notes: "Leg day, felt strong",
          })
          .set("Content-Type", "application/json")
          .expect(200);
      });
    });

    describe("given user_id, workout_date, no notes", () => {
      test("should successfully add a workout without notes", async () => {
        const response = await request(app)
          .post("/workouts/add")
          .send({
            user_id: 1,
            workout_date: "2025-03-20 14:30:00",
          })
          .set("Content-Type", "application/json")
          .expect(200);
      });
    });

    describe("given user_id, workout_date, and empty string for notes", () => {
      test("should add a workout and store empty notes", async () => {
        const response = await request(app)
          .post("/workouts/add")
          .send({
            user_id: 1,
            workout_date: "2025-03-21 10:00:00",
            notes: "",
          })
          .set("Content-Type", "application/json")
          .expect(200);
      });
    });
  });

  describe("negative tests", () => {
    describe("missing user_id", () => {
      test("should respond with 400 and error message", async () => {
        const response = await request(app)
          .post("/workouts/add")
          .send({
            workout_date: "2025-03-21 10:00:00",
            notes: "Missing user_id",
          })
          .set("Content-Type", "application/json")
          .expect(400);

        expect(response.body).toHaveProperty(
          "error",
          "user_id and workout_date are required",
        );
      });
    });

    describe("missing workout_date", () => {
      test("should respond with 400 and error message", async () => {
        const response = await request(app)
          .post("/workouts/add")
          .send({
            user_id: 1,
            notes: "Missing workout_date",
          })
          .set("Content-Type", "application/json")
          .expect(400);

        expect(response.body).toHaveProperty(
          "error",
          "user_id and workout_date are required",
        );
      });
    });

    describe("invalid data type for user_id", () => {
      test("should respond with 500 server error due to SQL type mismatch", async () => {
        const response = await request(app)
          .post("/workouts/add")
          .send({
            user_id: "abc",
            workout_date: "2025-03-21 10:00:00",
            notes: "user_id is string",
          })
          .set("Content-Type", "application/json")
          .expect(500);
      });
    });

    describe("invalid date format", () => {
      test("should respond with 500 because of date format issue", async () => {
        const response = await request(app)
          .post("/workouts/add")
          .send({
            user_id: 1,
            workout_date: "not-a-date",
            notes: "Invalid date format",
          })
          .set("Content-Type", "application/json")
          .expect(500);
      });
    });

    describe("empty body", () => {
      test("should respond with 400 due to missing required fields", async () => {
        const response = await request(app)
          .post("/workouts/add")
          .send({})
          .set("Content-Type", "application/json")
          .expect(400);

        expect(response.body).toHaveProperty(
          "error",
          "user_id and workout_date are required",
        );
      });
    });

    describe("extra unexpected fields", () => {
      test("should ignore extra fields and still succeed", async () => {
        const response = await request(app)
          .post("/workouts/add")
          .send({
            user_id: 1,
            workout_date: "2025-03-22 08:00:00",
            notes: "Extra field test",
            something_weird: "should be ignored",
          })
          .set("Content-Type", "application/json")
          .expect(200);

        expect(response.body).toHaveProperty(
          "message",
          "workout added successfully",
        );
        expect(response.body).toHaveProperty("workout_id");
      });
    });
  });
});

describe("/search/user", () => {
  describe("positive tests", () => {
    describe("given valid user_id with workouts", () => {
      test("should return 200 and workouts array", async () => {
        const response = await request(app)
          .get("/workouts/search/user")
          .query({ user_id: 1 })
          .expect(200);

        expect(response.body).toHaveProperty(
          "message",
          "workouts retrieved successfully",
        );
        expect(Array.isArray(response.body.workouts)).toBe(true);
      });
    });
  });

  describe("negative tests", () => {
    describe("missing user_id in query", () => {
      test("should respond with 400 and error message", async () => {
        const response = await request(app)
          .get("/workouts/search/user")
          .expect(400);

        expect(response.body).toHaveProperty("error", "user_id is required");
      });
    });

    describe("non-numeric user_id", () => {
      test("should respond with 400 and error message", async () => {
        const response = await request(app)
          .get("/workouts/search/user")
          .query({ user_id: "abc" })
          .expect(400);

        expect(response.body).toHaveProperty(
          "error",
          "user_id must be a number",
        );
      });
    });
  });
});

describe("/search/by-user-date-single", () => {
  describe("positive tests", () => {
    describe("given valid user_name and date", () => {
      test("should return 200 and workouts array", async () => {
        const response = await request(app)
          .get("/workouts/search/by-user-date-single")
          .query({ user_id: 1, workout_date: "2025-11-11 00:00:00" })
          .expect(200);

        expect(response.body).toHaveProperty(
          "message",
          "workouts retrieved successfully",
        );
        expect(Array.isArray(response.body.workouts)).toBe(true);
      });
    });
  });

  describe("negative tests", () => {
    describe("missing user_id and date in query", () => {
      test("should respond with 400 and error message", async () => {
        const response = await request(app)
          .get("/workouts/search/by-user-date-single")
          .expect(400);

        expect(response.body).toHaveProperty(
          "error",
          "user_id and date are required",
        );
      });
    });

    describe("missing only user_id", () => {
      test("should respond with 400 and error message", async () => {
        const response = await request(app)
          .get("/workouts/search/by-user-date-single")
          .query({ workout_date: "025-11-11 00:00:00" })
          .expect(400);

        expect(response.body).toHaveProperty(
          "error",
          "user_id and date are required",
        );
      });
    });

    describe("missing only workout_date", () => {
      test("should respond with 400 and error message", async () => {
        const response = await request(app)
          .get("/workouts/search/by-user-date-single")
          .query({ user_id: 1 })
          .expect(400);

        expect(response.body).toHaveProperty(
          "error",
          "user_id and date are required",
        );
      });
    });
  });
});

describe("/search/by-user-date-range", () => {
  describe("positive tests", () => {
    describe("given valid user_id, start_date and end_date", () => {
      test("should return 200 and workouts array", async () => {
        const response = await request(app)
          .get("/workouts/search/by-user-date-range")
          .query({
            user_id: 1,
            start_date: "2025-11-01 00:00:00",
            end_date: "2025-11-30 00:00:00",
          })
          .expect(200);

        expect(response.body).toHaveProperty(
          "message",
          "workouts retrieved successfully",
        );
        expect(Array.isArray(response.body.workouts)).toBe(true);
      });
    });
  });

  describe("negative tests", () => {
    describe("missing user_id, start_date and end_date in query", () => {
      test("should respond with 400 and error message", async () => {
        const response = await request(app)
          .get("/workouts/search/by-user-date-range")
          .expect(400);

        expect(response.body).toHaveProperty(
          "error",
          "user_id, start_date and end_date are required",
        );
      });
    });

    describe("missing only user_id", () => {
      test("should respond with 400 and error message", async () => {
        const response = await request(app)
          .get("/workouts/search/by-user-date-range")
          .query({
            start_date: "2025-11-01 00:00:00",
            end_date: "2025-11-30 00:00:00",
          })
          .expect(400);

        expect(response.body).toHaveProperty(
          "error",
          "user_id, start_date and end_date are required",
        );
      });
    });

    describe("missing only start_date", () => {
      test("should respond with 400 and error message", async () => {
        const response = await request(app)
          .get("/workouts/search/by-user-date-range")
          .query({
            user_id: 1,
            end_date: "2025-11-30 00:00:00",
          })
          .expect(400);

        expect(response.body).toHaveProperty(
          "error",
          "user_id, start_date and end_date are required",
        );
      });
    });

    describe("missing only end_date", () => {
      test("should respond with 400 and error message", async () => {
        const response = await request(app)
          .get("/workouts/search/by-user-date-range")
          .query({
            user_id: 1,
            start_date: "2025-11-01 00:00:00",
          })
          .expect(400);

        expect(response.body).toHaveProperty(
          "error",
          "user_id, start_date and end_date are required",
        );
      });
    });
  });
});

// Clean up MySQL connection pool
afterAll(() => {
  db.end();
});


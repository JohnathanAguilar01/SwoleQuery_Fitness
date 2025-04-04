import request from "supertest";
import app from "../app";

describe("/add", () => {
    describe("positive tests", () => {
        describe("given working data for all fields, cardio", () => {
            test("should successfully add an exercise, cardio", async () => {
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
        
        describe("given working data for all fields, strength", () => {
            test("should successfully add an exercise, strength", async () => {
                const response = await request(app).post("/exercises/add").send({
                    "user_id": 1,
                    "workout_id": 9,
                    "intensity": 25.00,
                    "exercise_type": "strength training",
                    "calories_burned": 250,
                    "weight": 100.00,
                    "sets" : 5,
                    "reps" : 5
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
            expect(response.body.error).toMatch("user_id, workout_id, intensity, and exercise_type are required");
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
            expect(response.body.error).toMatch("exercise_type must be 'cardio' or 'strength training'");
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
            expect(response.body.error).toMatch("cardio exercises must have an excercise_time");
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
            expect(response.body.error).toMatch("strength training excercises must have weight, sets, and reps");
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
            expect(response.body.error).toMatch("strength training excercises must have weight, sets, and reps");
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
            expect(response.body.error).toMatch("strength training excercises must have weight, sets, and reps");
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
            expect(response.body.error).toMatch("an excercise must have a positive int for calories_burned");
        });
    });
});

describe("/update", () => {
    describe("positive tests", () => {
        test("should successfully update a cardio exercise", async () => {
            const response = await request(app)
                .post("/exercises/update")
                .send({
                    exercise_id: 1,
                    intensity: 30,
                    exercise_type: "cardio",
                    calories_burned: 300,
                    exercise_time: 45
                })
                .set("Content-Type", "application/json");
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Exercise updated successfully");
            expect(response.body.exercise_id).toBe(1);
        });

        test("should successfully update a strength training exercise", async () => {
            const response = await request(app)
                .post("/exercises/update")
                .send({
                    exercise_id: 2,
                    intensity: 40,
                    exercise_type: "strength training",
                    calories_burned: 400,
                    weight: 150,
                    sets: 3,
                    reps: 10
                })
                .set("Content-Type", "application/json");
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Exercise updated successfully");
            expect(response.body.exercise_id).toBe(2);
        });
    });

    describe("negative tests", () => {
        test("should fail when required fields are missing", async () => {
            // Missing exercise_id, intensity, and exercise_type
            const response = await request(app)
                .post("/exercises/update")
                .send({
                    calories_burned: 300,
                    exercise_time: 45
                })
                .set("Content-Type", "application/json");
            expect(response.status).toBe(400);
            expect(response.body.error).toMatch("exercise_id, intensity, and exercise_type are required");
        });

        test("should fail when exercise_type is invalid", async () => {
            const response = await request(app)
                .post("/exercises/update")
                .send({
                    exercise_id: 1,
                    intensity: 30,
                    exercise_type: "yoga", // invalid type
                    calories_burned: 300,
                    exercise_time: 45
                })
                .set("Content-Type", "application/json");
            expect(response.status).toBe(400);
            expect(response.body.error).toMatch("exercise_type must be 'cardio' or 'strength training'");
        });

        test("should fail when calories_burned is not positive", async () => {
            const response = await request(app)
                .post("/exercises/update")
                .send({
                    exercise_id: 1,
                    intensity: 30,
                    exercise_type: "cardio",
                    calories_burned: 0, // non-positive value
                    exercise_time: 45
                })
                .set("Content-Type", "application/json");
            expect(response.status).toBe(400);
            expect(response.body.error).toMatch("an exercise must have a positive int for calories_burned");
        });

        test("should fail when cardio exercise is missing exercise_time", async () => {
            const response = await request(app)
                .post("/exercises/update")
                .send({
                    exercise_id: 1,
                    intensity: 30,
                    exercise_type: "cardio",
                    calories_burned: 300
                    // missing exercise_time
                })
                .set("Content-Type", "application/json");
            expect(response.status).toBe(400);
            expect(response.body.error).toMatch("cardio exercises must have an exercise_time");
        });

        describe("strength training negative tests", () => {
            test("should fail when weight is missing", async () => {
                const response = await request(app)
                    .post("/exercises/update")
                    .send({
                        exercise_id: 2,
                        intensity: 40,
                        exercise_type: "strength training",
                        calories_burned: 400,
                        sets: 3,
                        reps: 10
                        // missing weight
                    })
                    .set("Content-Type", "application/json");
                expect(response.status).toBe(400);
                expect(response.body.error).toMatch("strength training exercises must have weight, sets, and reps");
            });

            test("should fail when sets is missing", async () => {
                const response = await request(app)
                    .post("/exercises/update")
                    .send({
                        exercise_id: 2,
                        intensity: 40,
                        exercise_type: "strength training",
                        calories_burned: 400,
                        weight: 150,
                        reps: 10
                        // missing sets
                    })
                    .set("Content-Type", "application/json");
                expect(response.status).toBe(400);
                expect(response.body.error).toMatch("strength training exercises must have weight, sets, and reps");
            });

            test("should fail when reps is missing", async () => {
                const response = await request(app)
                    .post("/exercises/update")
                    .send({
                        exercise_id: 2,
                        intensity: 40,
                        exercise_type: "strength training",
                        calories_burned: 400,
                        weight: 150,
                        sets: 3
                        // missing reps
                    })
                    .set("Content-Type", "application/json");
                expect(response.status).toBe(400);
                expect(response.body.error).toMatch("strength training exercises must have weight, sets, and reps");
            });
        });
    });
});
import express from "express";
import db from "../db.js";
const router = express.Router();

// add an exercise
router.post("/add", async (req, res) => {
    try{
        const {
            user_id,
            workout_id,
            intensity,
            exercise_type,
            calories_burned
        } = req.body;

        let exercise_time;
        let weight;
        let sets;
        let reps;
        let additionalData = {};

        if(exercise_type === "cardio"){
            exercise_time = req.body.exercise_time;
            additionalData = { exercise_time };
        }

        if(exercise_type === "strength training"){
            weight = req.body.weight;
            sets = req.body.sets;
            reps = req.body.reps;
            additionalData = { weight, sets, reps};
        }

        const completeData = {
            user_id,
            workout_id,
            intensity,
            exercise_type,
            calories_burned,
            ...additionalData
        };

        if (!user_id || !workout_id || !intensity || !exercise_type) {
            return res.status(400).json({ error: "user_id, workout_id, intensity, and exercise_type are required" });
        }

        if(exercise_type != "cardio" && exercise_type != "strength training"){
            return res.status(400).json({error: "exercise_type must be 'cardio' or 'strength training'"});
        }

        if(exercise_type === "cardio"){
            if(!exercise_time){
                return res.status(400).json({error: "cardio exercises must have an excercise_time"});
            }
        }

        if(exercise_type === "strength training"){
            if(!weight || !sets || !reps){
                return res.status(400).json({error: "strength training excercises must have weight, sets, and reps"});
            }
        }

        if(calories_burned <= 0){
            return res.status(400).json({error: "an excercise must have a positive int for calories_burned"});
        }

        const insertQuery = `
            INSERT INTO exercises (user_id, workout_id, intensity, exercise_type, calories_burned)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(insertQuery, [user_id, workout_id, intensity, exercise_type, calories_burned]);
        const exercise_id = result.insertId;

        if(exercise_type === "cardio"){
            const cardioInsertQuery = `
                INSERT INTO calisthenics_exercises (exercise_id, exercise_time)
                VALUES (?, ?)
            `;
            await db.query(cardioInsertQuery, [exercise_id, exercise_time]);
        }

        if(exercise_type === "strength training"){
            const strengthInsertQuery = `
                INSERT INTO weight_exercises (exercise_id, weight, sets, reps)
                VALUES (?, ?, ?, ?)
            `;
            await db.query(strengthInsertQuery, [exercise_id, weight, sets, reps]);
        }

        res.json({
            message: "Exercise added successfully",
            exercise_id: exercise_id,
        });
    }catch(error){
        console.error("Error in /add exercise route:", error);
        res.status(500).send("Server error");
    }
});

// update an existing exercise
router.post("/update", async (req, res) => {
    try {
        const { exercise_id, intensity, exercise_type, calories_burned } = req.body;
        let exercise_time, weight, sets, reps;
        
        if (!exercise_id || !intensity || !exercise_type) {
            return res.status(400).json({ error: "exercise_id, intensity, and exercise_type are required" });
        }
        if (exercise_type !== "cardio" && exercise_type !== "strength training") {
            return res.status(400).json({ error: "exercise_type must be 'cardio' or 'strength training'" });
        }
        if (calories_burned <= 0) {
            return res.status(400).json({ error: "an exercise must have a positive int for calories_burned" });
        }
        
        if (exercise_type === "cardio") {
            exercise_time = req.body.exercise_time;
            if (!exercise_time) {
                return res.status(400).json({ error: "cardio exercises must have an exercise_time" });
            }
        }
        
        if (exercise_type === "strength training") {
            weight = req.body.weight;
            sets = req.body.sets;
            reps = req.body.reps;
            if (!weight || !sets || !reps) {
                return res.status(400).json({ error: "strength training exercises must have weight, sets, and reps" });
            }
        }
        
        const updateQuery = `
            UPDATE exercises
            SET intensity = ?, exercise_type = ?, calories_burned = ?
            WHERE exercise_id = ?
        `;
        await db.query(updateQuery, [intensity, exercise_type, calories_burned, exercise_id]);
        
        if (exercise_type === "cardio") {
            const cardioUpdateQuery = `
                UPDATE calisthenics_exercises
                SET exercise_time = ?
                WHERE exercise_id = ?
            `;
            await db.query(cardioUpdateQuery, [exercise_time, exercise_id]);
        }
        
        if (exercise_type === "strength training") {
            const strengthUpdateQuery = `
                UPDATE weight_exercises
                SET weight = ?, sets = ?, reps = ?
                WHERE exercise_id = ?
            `;
            await db.query(strengthUpdateQuery, [weight, sets, reps, exercise_id]);
        }
        
        res.json({ message: "Exercise updated successfully", exercise_id });
    } catch (error) {
        console.error("Error in /update exercise route:", error);
        res.status(500).send("Server error");
    }
});

export default router;
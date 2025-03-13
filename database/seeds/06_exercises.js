exports.seed = async function (knex) {
  await knex("exercises").del(); // Optional: Clears existing data
  await knex("exercises").insert([
    {
      user_id: 1, // Ensure a valid user_id is provided
      workout_id: 1,
      intensity: 3.2,
      exercise_type: "cardio", // 'cardio', 'strength training'
      calories_burned: 10,
    },
    {
      user_id: 1, // Ensure a valid user_id is provided
      workout_id: 1,
      intensity: 5.2,
      exercise_type: "strength training", // 'cardio', 'strength training'
      calories_burned: 10,
    },
  ]);
};

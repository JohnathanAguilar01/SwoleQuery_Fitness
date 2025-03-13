exports.seed = async function (knex) {
  await knex("workouts").del(); // Optional: Clears existing data
  await knex("workouts").insert([
    {
      user_id: 1, // Ensure a valid user_id is provided
      workout_date: "2025-11-11",
      notes: "it hurt!",
    },
  ]);
};

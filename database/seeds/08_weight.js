exports.seed = async function (knex) {
  await knex("weight_exercises").del(); // Optional: Clears existing data
  await knex("weight_exercises").insert([
    {
      exercise_id: 1,
      weight: 120,
      sets: 2,
      reps: 3,
    },
  ]);
};

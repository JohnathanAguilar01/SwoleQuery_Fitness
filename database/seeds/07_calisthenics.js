exports.seed = async function (knex) {
  await knex("calisthenics_exercises").del(); // Optional: Clears existing data
  await knex("calisthenics_exercises").insert([
    {
      exercise_id: 1,
      exercise_time: 10,
    },
  ]);
};

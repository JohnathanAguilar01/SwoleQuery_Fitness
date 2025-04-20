exports.seed = async function (knex) {
  await knex("workouts").del(); // Optional: Clears existing data
  await knex("workouts").insert([
    {
      user_id: 1, // Ensure a valid user_id is provided
      workout_date: "2025-04-11",
      notes: "it hurt!",
    },
    {
      user_id: 1, // Ensure a valid user_id is provided
      workout_date: "2025-04-11",
      notes:
        "This is a long message in where I got into detail about how I did my workouts and how cool they were ya ya ya ya ahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
    },
    {
      user_id: 1, // Ensure a valid user_id is provided
      workout_date: "2025-04-11",
      notes: "just another note",
    },
    {
      user_id: 1, // Ensure a valid user_id is provided
      workout_date: "2025-04-11",
      notes: "just another note 2",
    },
    {
      user_id: 1, // Ensure a valid user_id is provided
      workout_date: "2025-04-11",
      notes: "just another note 3",
    },
  ]);
};

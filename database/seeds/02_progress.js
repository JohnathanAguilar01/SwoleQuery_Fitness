exports.seed = async function (knex) {
  await knex("progress").del(); // Optional: Clears existing data
  await knex("progress").insert([
    {
      user_id: 1, // Ensure a valid user_id is provided
      recorded_at: "2025-03-12 11:25:46.00",
      weight: 120.6, // Example field
    },
    {
      user_id: 2, // Ensure a valid user_id is provided
      recorded_at: "2025-03-12 11:25:46.00",
      weight: 120.6, // Example field
    },
  ]);
};

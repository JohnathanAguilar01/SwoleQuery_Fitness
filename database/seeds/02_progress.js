exports.seed = async function (knex) {
  await knex("progress").del(); // Optional: Clears existing data
  await knex("progress").insert([
    {
      user_id: 1, // Ensure a valid user_id is provided
      weight: 120.6, // Example field
    },
  ]);
};

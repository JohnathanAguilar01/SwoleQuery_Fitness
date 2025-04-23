exports.seed = async function (knex) {
  await knex("meals").del(); // Optional: Clears existing data
  await knex("meals").insert([
    {
      user_id: 1, // Ensure a valid user_id is provided
      meal_date: "2025-04-11",
      calories: 2190,
      protein: 34,
      carbs: 300,
      fats: 90,
      notes: "it tasted good.",
    },
    {
      user_id: 1, // Ensure a valid user_id is provided
      meal_date: "2025-04-11",
      calories: 1408,
      protein: 34,
      carbs: 300,
      fats: 90,
      notes: "it tasted good also bud.",
    },
  ]);
};

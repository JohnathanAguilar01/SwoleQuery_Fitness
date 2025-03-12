exports.seed = async function (knex) {
  await knex("food_items").del(); // Optional: Clears existing data
  await knex("food_items").insert([
    {
      meal_id: 1, // Ensure a valid user_id is provided
      food_name: "taco",
      quantity: 2,
      unit: "items",
      calories: 498,
      protein: 34,
      carbs: 300,
      fats: 90,
    },
  ]);
};

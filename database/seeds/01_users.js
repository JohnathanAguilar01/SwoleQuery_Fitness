/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      first_name: "John",
      last_name: "Doe",
      username: "jondoe",
      email: "johndoe@gmail.com",
      password: "password",
      height: "120.5",
      weight: "190.4",
    },
    {
      first_name: "Jane",
      last_name: "Doe",
      username: "janedoe",
      email: "janedoe@gmail.com",
      password: "qwerty",
      height: "94.6",
      weight: "164.4",
    },
  ]);
};

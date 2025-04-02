/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const bcrypt = require("bcrypt");

exports.seed = async function (knex) {
  const saltRounds = 10;
  const salted_password = await bcrypt.hash("password1234", saltRounds);

  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      first_name: "John",
      last_name: "Doe",
      username: "jondoe",
      email: "johndoe@gmail.com",
      password: salted_password,
      height: "120.5",
      weight: "190.4",
    },
    {
      first_name: "Jane",
      last_name: "Doe",
      username: "janedoe",
      email: "janedoe@gmail.com",
      password: salted_password,
      height: "94.6",
      weight: "164.4",
    },
  ]);
};

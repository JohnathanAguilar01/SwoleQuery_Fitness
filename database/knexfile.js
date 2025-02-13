require("dotenv").config({ path: "../.env" });

module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: "./migrations", // Ensure migrations are stored in the correct folder
    },
    seeds: {
      directory: "./seeds", // Ensure seeds are stored in the correct folder
    },
  },
};

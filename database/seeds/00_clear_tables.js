exports.seed = async function (knex) {
  // Disable foreign key checks
  await knex.raw("SET FOREIGN_KEY_CHECKS = 0");

  // Retrieve all table names for the current database
  const { database } = knex.client.config.connection;
  const tablesResult = await knex.raw(
    "SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = ?",
    [database],
  );

  // Map using the correct column name from the result set
  const tableNames = tablesResult[0].map((row) => row.TABLE_NAME);

  // Truncate each table
  for (const table of tableNames) {
    await knex.raw(`TRUNCATE TABLE \`${table}\``);
  }

  // Re-enable foreign key checks
  await knex.raw("SET FOREIGN_KEY_CHECKS = 1");
};

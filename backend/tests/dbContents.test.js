//Prints table contents for debugging
//docker exec -it swole-backend npm test tests/dbContents.test.js


import request from "supertest";
import app from "../app";
import { response } from "express";
import db from "../db.js";

describe("Database Tables Snapshot", () => {
  test("Print all table names and their contents", async () => {
    const [tables] = await db.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = DATABASE();
    `);

    for (const { TABLE_NAME } of tables) {
      console.log(`\nContents of table: ${TABLE_NAME}`);

      try {
        const [rows] = await db.query(`SELECT * FROM \`${TABLE_NAME}\` LIMIT 100`);
        if (rows.length === 0) {
          console.log("Table is empty.");
        } else {
          console.table(rows);
        }
      } catch (err) {
        console.error(`Error reading table ${TABLE_NAME}:`, err);
      }
    }

    expect(tables.length).toBeGreaterThan(0);
  });
});

// Clean up MySQL connection pool
afterAll(() => {
  db.end();
});


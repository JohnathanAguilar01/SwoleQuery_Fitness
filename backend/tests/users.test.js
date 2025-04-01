import request from "supertest";
import app from "../app";
import db from "../db.js";

describe("Testing user/signup endpoint", () => {
  test("Testing happy path", async () => {
    const response = await request(app)
      .post("/user/signup")
      .send({
        first_name: "Clark",
        last_name: "Kent",
        username: "superman",
        email: "superman@gmail.com",
        password: "kyrpton1234",
        height: "191.5",
        weight: "195.4",
      })
      .set("Content-Type", "application/json")
      .expect(200);
    expect(response.body).toEqual({
      user_id: 3,
    });
  });

  test("Testing sad path due to incorrect email format", async () => {
    const response = await request(app)
      .post("/user/signup")
      .send({
        first_name: "Bruce",
        last_name: "Wayne",
        username: "batman",
        email: "batman_email",
        password: "imbatman1234",
      })
      .set("Content-Type", "application/json")
      .expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Invalid email format");
  });

  test("Testing sad path due to incorrect email format", async () => {
    const response = await request(app)
      .post("/user/signup")
      .send({
        first_name: "Bruce",
        last_name: "Wayne",
        username: "batman",
        email: "batman@gmail.com",
        password: "imbatman",
      })
      .set("Content-Type", "application/json")
      .expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe(
      "Password must be at least 8 characters and contain at least one letter and one number",
    );
  });

  test("Testing sad path due to email or username is already in use", async () => {
    const response = await request(app)
      .post("/user/signup")
      .send({
        first_name: "Clark",
        last_name: "Kent",
        username: "superman",
        email: "superman@gmail.com",
        password: "kyrpton1234",
        height: "191.5",
        weight: "195.4",
      })
      .set("Content-Type", "application/json")
      .expect(409);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Username or email already exists");
  });

  test("Testing sad path due to first name input error", async () => {
    const response = await request(app)
      .post("/user/signup")
      .send({
        last_name: "Wayne",
        username: "batman",
        email: "batman@gmail.com",
        password: "imbatman1234",
      })
      .set("Content-Type", "application/json")
      .expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Missing user input");
  });

  test("Testing sad path due to last name input error", async () => {
    const response = await request(app)
      .post("/user/signup")
      .send({
        first_name: "Bruce",
        username: "batman",
        email: "batman@gmail.com",
        password: "imbatman1234",
      })
      .set("Content-Type", "application/json")
      .expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Missing user input");
  });

  test("Testing sad path due to username input error", async () => {
    const response = await request(app)
      .post("/user/signup")
      .send({
        first_name: "Bruce",
        last_name: "Wayne",
        email: "batman@gmail.com",
        password: "imbatman1234",
      })
      .set("Content-Type", "application/json")
      .expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Missing user input");
  });

  test("Testing sad path due to email input error", async () => {
    const response = await request(app)
      .post("/user/signup")
      .send({
        first_name: "Bruce",
        last_name: "Wayne",
        username: "batman",
        password: "imbatman1234",
      })
      .set("Content-Type", "application/json")
      .expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Missing user input");
  });

  test("Testing sad path due to password input error", async () => {
    const response = await request(app)
      .post("/user/signup")
      .send({
        first_name: "Bruce",
        last_name: "Wayne",
        username: "batman",
        email: "batman@gmail.com",
      })
      .set("Content-Type", "application/json")
      .expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Missing user input");
  });
});

// Clean up MySQL connection pool
afterAll(() => {
  db.end();
});

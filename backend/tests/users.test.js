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

describe("Tests for the /user/login endpoint", () => {
  test("Test for the happy path for login", async () => {
    const response = await request(app)
      .post("/user/login")
      .send({
        username: "jondoe",
        password: "password1234",
      })
      .set("Content-Type", "application/json")
      .expect(200);

    expect(response.body).toEqual({
      first_name: "John",
      last_name: "Doe",
      username: "jondoe",
      email: "johndoe@gmail.com",
      height: "120.5",
      weight: "190.4",
    });
  });
  test("Testing sad path if a username or password is not passed", async () => {
    const response = await request(app)
      .post("user/login")
      .send("")
      .set("Content-Type", "application/json")
      .expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Missing user input");
  });

  describe("Test sad path if username or password is Wrong", () => {
    test("Test sad path if password is Wrong", async () => {
      const response = await request(app)
        .post("/user/login")
        .send({
          username: "jondoe",
          password: "pass1234",
        })
        .set("Content-Type", "application/json")
        .expect(401);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Invalid Username or Password");
    });

    test("Test sad path if username is Wrong", async () => {
      const response = await request(app)
        .post("/user/login")
        .send({
          username: "johndoe",
          password: "password1234",
        })
        .set("Content-Type", "application/json")
        .expect(401);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Invalid Username or Password");
    });
  });
});

// Clean up MySQL connection pool
afterAll(() => {
  db.end();
});

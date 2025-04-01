import request from "supertest";
import app from "../app";
import Test from "supertest/lib/test";

describe("Testing user/signup endpoint", () => {
  test("Testing happy path", async () => {
    const response = await request(app)
      .post("/user/signup")
      .send({
        first_name: "Clark",
        last_name: "Kent",
        username: "superman",
        email: "superman@gmail.com",
        password: "kyrpton",
        height: "191.5",
        weight: "195.4",
      })
      .set("Content-Type", "application/json")
      .expect(200);

    expect(response.body).toEqual([
      {
        user_id: 3,
      },
    ]);
  });

  test("Testing sad path due to first name input error", async () => {
    const response = await request(app)
      .post("/user/signup")
      .send({
        last_name: "Wayne",
        username: "batman",
        email: "batman@gmail.com",
        password: "imbatman",
      })
      .set("Content-Type", "application/json")
      .expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("first name not present");
  });

  test("Testing sad path due to last name input error", async () => {
    const response = await request(app)
      .post("/user/signup")
      .send({
        first_name: "Bruce",
        username: "batman",
        email: "batman@gmail.com",
        password: "imbatman",
      })
      .set("Content-Type", "application/json")
      .expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("last name not present");
  });

  test("Testing sad path due to username input error", async () => {
    const response = await request(app)
      .post("/user/signup")
      .send({
        first_name: "Bruce",
        last_name: "Wayne",
        email: "batman@gmail.com",
        password: "imbatman",
      })
      .set("Content-Type", "application/json")
      .expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("username not present");
  });

  test("Testing sad path due to email input error", async () => {
    const response = await request(app)
      .post("/user/signup")
      .send({
        first_name: "Bruce",
        last_name: "Wayne",
        username: "batman",
        password: "imbatman",
      })
      .set("Content-Type", "application/json")
      .expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("email not present");
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
    expect(response.body.error).toBe("password not present");
  });
});

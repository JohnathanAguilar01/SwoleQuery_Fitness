import request from "supertest";
import app from "../app";

describe("GET app.com/", () => {
  test('should return a message response with "Backend is running!"', async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Backend is running!");
  });
});

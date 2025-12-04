import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "..";
import resetDb from "./helpers/reset-db";
import prisma from "./helpers/prisma-test";
import bcrypt from "bcryptjs";
describe("[POST] /auth/login", async () => {
  beforeAll(async () => {
    await resetDb();
    await prisma.user.create({
      data: {
        username: "demoUser",
        password: await bcrypt.hash("password123", 10),
      },
    });
  });
  it("should login successfully and return 200", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      username: "demoUser",
      password: "password123",
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.data.token).toBeDefined();
  });
  it("should not return password inside user object", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ username: "demoUser", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body.data.user.password).toBeUndefined();
  });
  it("should return 400 if user does not exist", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ username: "unknownUser", password: "password123" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User not found");
  });
  it("should return 400 for invalid password", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ username: "demoUser", password: "wrongPassword" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid password");
  });
  it("should return 400 for missing username or password", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ username: "demoUser" });
    expect(response.status).toBe(400);
  });
});

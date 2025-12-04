import { beforeAll, afterAll, describe, expect, it, beforeEach } from "vitest";
import request from "supertest";
import { app } from "..";
import prisma from "./helpers/prisma-test";
import resetDb from "./helpers/reset-db";
import bcrypt from "bcryptjs";

describe("[POST] /watchlist", () => {
  let token: string;
  let userId: string;
  let contentId: string;

  beforeAll(async () => {
    await resetDb();

    const user = await prisma.user.upsert({
      where: { username: "demoUser" },
      update: {},
      create: {
        username: "demoUser",
        password: await bcrypt.hash("password123", 10),
      },
    });
    userId = user.id;

    const content = await prisma.content.create({
      data: {
        title: "Test Movie",
        description: "Test Movie Description",
        type: "MOVIE",
        movieDetail: {
          create: {
            director: "Test Director",
            releaseDate: new Date(),
          },
        },
      },
    });
    contentId = content.id;

    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      username: "demoUser",
      password: "password123",
    });

    token = loginResponse.body.data.token;
  });

  beforeEach(async () => {
    await prisma.watchList.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should add item to watchlist (201)", async () => {
    const response = await request(app)
      .post("/api/v1/watch-list")
      .set("Authorization", `Bearer ${token}`)
      .send({ contentId });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Item added to watch list");
    expect(response.body.data.item).toBeDefined();
    expect(response.body.data.item.contentId).toBe(contentId);

    const item = await prisma.watchList.findFirst({
      where: { contentId, userId },
    });
    expect(item).not.toBeNull();
  });

  it("should return 400 if content does not exist", async () => {
    const response = await request(app)
      .post("/api/v1/watch-list")
      .set("Authorization", `Bearer ${token}`)
      .send({ contentId: "invalid-content-id" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Content not found");
  });

  it("should return 400 if item already exists", async () => {
    await prisma.watchList.create({
      data: {
        userId,
        contentId,
      },
    });

    const response = await request(app)
      .post("/api/v1/watch-list")
      .set("Authorization", `Bearer ${token}`)
      .send({ contentId });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Item already exists");
  });

  it("should return 400 if contentId is missing", async () => {
    const response = await request(app)
      .post("/api/v1/watch-list")
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(response.status).toBe(400);
  });

  it("should return 401 when token is missing", async () => {
    const response = await request(app)
      .post("/api/v1/watchlist")
      .send({ contentId });

    expect(response.status).toBe(401);
  });
});

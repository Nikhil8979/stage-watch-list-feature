import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "..";
import prisma from "./helpers/prisma-test";
import resetDb from "./helpers/reset-db";
import bcrypt from "bcryptjs";

describe("[GET] /api/v1/watch-list", () => {
  let token: string;
  let userId: string;
  let contentIds: string[] = [];

  beforeAll(async () => {
    await resetDb();

    const user = await prisma.user.create({
      data: {
        username: "demoUser",
        password: await bcrypt.hash("password123", 10),
      },
    });
    userId = user.id;

    const contents = await prisma.content.createMany({
      data: [
        { title: "Movie 1", description: "Movie 1 Description", type: "MOVIE" },
        { title: "Movie 2", description: "Movie 2 Description", type: "MOVIE" },
        {
          title: "TV Show 1",
          description: "TV Show 1 Description",
          type: "TVSHOW",
        },
      ],
      skipDuplicates: true,
    });

    const allContents = await prisma.content.findMany({});
    contentIds = allContents.map((c) => c.id);

    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({ username: "demoUser", password: "password123" });

    token = loginResponse.body.data.token;
  });

  beforeEach(async () => {
    await prisma.watchList.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return empty watchlist if user has no items", async () => {
    const response = await request(app)
      .get("/api/v1/watch-list")
      .set("Authorization", `Bearer ${token}`)
      .query({ limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body.data.items).toBeInstanceOf(Array);
    expect(response.body.data.items.length).toBe(0);
  });

  it("should return watchlist items for user", async () => {
    await prisma.watchList.createMany({
      data: [
        { userId, contentId: contentIds[0] },
        { userId, contentId: contentIds[1] },
      ],
    });

    const response = await request(app)
      .get("/api/v1/watch-list")
      .set("Authorization", `Bearer ${token}`)
      .query({ limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body.data.items).toHaveLength(2);

    const item = response.body.data.items[0];
    expect(item).toHaveProperty("id");
    expect(item).toHaveProperty("user");
    expect(item.user).toHaveProperty("id", userId);
    expect(item.user).toHaveProperty("username", "demoUser");
    expect(item).toHaveProperty("content");
    expect(item.content).toHaveProperty("id");
    expect(item.content).toHaveProperty("title");
    if (item.content.movieDetail) {
      expect(item.content.movieDetail).toHaveProperty("director");
      expect(item.content.movieDetail).toHaveProperty("releaseDate");
    }
    if (item.content.tvShowDetail) {
      expect(item.content.tvShowDetail).toHaveProperty("totalEpisode");
      expect(item.content.tvShowDetail.episodes).toBeInstanceOf(Array);
    }
  });

  it("should apply limit and cursor for pagination", async () => {
    await prisma.watchList.createMany({
      data: [
        { userId, contentId: contentIds[0] },
        { userId, contentId: contentIds[1] },
        { userId, contentId: contentIds[2] },
      ],
    });

    const firstResponse = await request(app)
      .get("/api/v1/watch-list")
      .set("Authorization", `Bearer ${token}`)
      .query({ limit: 2 });

    expect(firstResponse.status).toBe(200);
    expect(firstResponse.body.data.items).toHaveLength(2);

    const lastItemId = firstResponse.body.data.items[1].id;

    const secondResponse = await request(app)
      .get("/api/v1/watch-list")
      .set("Authorization", `Bearer ${token}`)
      .query({ limit: 2, cursor: lastItemId });

    expect(secondResponse.status).toBe(200);
    expect(secondResponse.body.data.items.length).toBeGreaterThan(0);
    expect(secondResponse.body.data.items[0].id).not.toBe(lastItemId);
  });

  it("should return 401 if token is missing", async () => {
    const response = await request(app)
      .get("/api/v1/watch-list")
      .query({ limit: 10 });

    expect(response.status).toBe(401);
  });
});

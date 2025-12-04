import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seeding...");

  //  Seed user
  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.create({
    data: {
      username: "demoUser",
      password: passwordHash,
    },
  });

  console.log("User created:", user.username);

  // Seed Genres
  const genres = await prisma.genre.createMany({
    data: [
      { name: "Action" },
      { name: "Drama" },
      { name: "Sci-Fi" },
      { name: "Comedy" },
    ],
  });

  console.log("Genres created");

  // Get genres for connection
  const [action, drama] = await prisma.genre.findMany();

  // Seed Movie Content
  const movie = await prisma.content.create({
    data: {
      title: "Inception",
      description: "A mind-bending thriller",
      type: "MOVIE",
      genres: {
        create: [{ genreId: action.id }, { genreId: drama.id }],
      },
      movieDetail: {
        create: {
          director: "Christopher Nolan",
          releaseDate: new Date("2010-07-16"),
        },
      },
    },
    include: {
      movieDetail: true,
      genres: true,
    },
  });

  console.log("Movie created:", movie.title);

  // Seed TV Show Content
  const tvShow = await prisma.content.create({
    data: {
      title: "Breaking Bad",
      description: "A chemistry teacher becomes a drug lord",
      type: "TVSHOW",
      genres: {
        create: [{ genreId: drama.id }],
      },
      tvShowDetail: {
        create: {
          totalEpisode: 2,
        },
      },
    },
    include: {
      tvShowDetail: true,
    },
  });

  console.log("TV Show created:", tvShow.title);

  // Seed episodes
  await prisma.tVShowEpisode.createMany({
    data: [
      {
        tvShowId: tvShow.tvShowDetail!.id,
        episodeNumber: 1,
        seasonNumber: 1,
        releaseDate: new Date("2008-01-20"),
      },
      {
        tvShowId: tvShow.tvShowDetail!.id,
        episodeNumber: 2,
        seasonNumber: 1,
        releaseDate: new Date("2008-01-27"),
      },
    ],
  });

  console.log("TV Show episodes created");

  console.log("Seeding completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

import prisma from "./prisma-test";

export default async () => {
  await prisma.$transaction([
    prisma.watchList.deleteMany(),
    prisma.movieDetail.deleteMany(),
    prisma.tVShowEpisode.deleteMany(),
    prisma.tVShowDetail.deleteMany(),
    prisma.contentGenre.deleteMany(),
    prisma.genre.deleteMany(),
    prisma.content.deleteMany(),
    prisma.user.deleteMany(),
  ]);
};

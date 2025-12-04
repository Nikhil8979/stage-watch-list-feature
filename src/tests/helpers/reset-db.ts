import prisma from "./prisma-test";

export default async () => {
  await prisma.$transaction(async (tx) => {
    await tx.watchList.deleteMany();
    await tx.tVShowEpisode.deleteMany();
    await tx.movieDetail.deleteMany();
    await tx.tVShowDetail.deleteMany();
    await tx.contentGenre.deleteMany();
    await tx.genre.deleteMany();
    await tx.content.deleteMany();
    await tx.user.deleteMany();
  });
};

/*
  Warnings:

  - The primary key for the `WatchList` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,contentId]` on the table `WatchList` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `WatchList` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "WatchList" DROP CONSTRAINT "WatchList_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "WatchList_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "WatchList_userId_contentId_key" ON "WatchList"("userId", "contentId");

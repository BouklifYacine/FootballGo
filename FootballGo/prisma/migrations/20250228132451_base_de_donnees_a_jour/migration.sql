/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `MembreEquipe` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "MembreEquipe_userId_equipeId_key";

-- CreateIndex
CREATE UNIQUE INDEX "MembreEquipe_userId_key" ON "MembreEquipe"("userId");

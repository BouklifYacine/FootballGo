/*
  Warnings:

  - You are about to drop the column `corners` on the `StatistiqueEquipe` table. All the data in the column will be lost.
  - You are about to drop the column `possession` on the `StatistiqueEquipe` table. All the data in the column will be lost.
  - You are about to drop the column `minutesJouees` on the `StatistiqueJoueur` table. All the data in the column will be lost.
  - You are about to drop the column `passes` on the `StatistiqueJoueur` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StatistiqueEquipe" DROP COLUMN "corners",
DROP COLUMN "possession";

-- AlterTable
ALTER TABLE "StatistiqueJoueur" DROP COLUMN "minutesJouees",
DROP COLUMN "passes",
ADD COLUMN     "passesdécisive" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "note" SET DEFAULT 6.0;

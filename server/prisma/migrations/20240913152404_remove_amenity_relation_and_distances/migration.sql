/*
  Warnings:

  - You are about to drop the column `airportDistance` on the `Society` table. All the data in the column will be lost.
  - You are about to drop the column `mainRoadDistance` on the `Society` table. All the data in the column will be lost.
  - You are about to drop the `Amenity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Amenity" DROP CONSTRAINT "Amenity_societyId_fkey";

-- AlterTable
ALTER TABLE "Society" DROP COLUMN "airportDistance",
DROP COLUMN "mainRoadDistance";

-- DropTable
DROP TABLE "Amenity";

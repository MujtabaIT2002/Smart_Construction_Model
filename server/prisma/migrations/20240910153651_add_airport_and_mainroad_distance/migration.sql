/*
  Warnings:

  - A unique constraint covering the columns `[type,name,societyId]` on the table `Amenity` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `distance` to the `Amenity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Amenity` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Amenity_type_societyId_key";

-- AlterTable
ALTER TABLE "Amenity" ADD COLUMN     "distance" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Society" ADD COLUMN     "airportDistance" DOUBLE PRECISION,
ADD COLUMN     "mainRoadDistance" DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "Amenity_type_name_societyId_key" ON "Amenity"("type", "name", "societyId");

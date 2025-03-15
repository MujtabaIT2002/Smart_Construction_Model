/*
  Warnings:

  - Added the required column `societyName` to the `UserSearch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `UserSearch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserSearch" ADD COLUMN     "societyName" TEXT NOT NULL,
ADD COLUMN     "userName" TEXT NOT NULL;

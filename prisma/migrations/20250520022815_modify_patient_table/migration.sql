/*
  Warnings:

  - Added the required column `age` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `patients` ADD COLUMN `age` INTEGER NOT NULL;

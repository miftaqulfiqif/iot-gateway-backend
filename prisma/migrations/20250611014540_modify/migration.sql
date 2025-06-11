/*
  Warnings:

  - You are about to drop the column `weight` on the `patients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `patients` DROP COLUMN `weight`,
    ADD COLUMN `height` INTEGER NULL;

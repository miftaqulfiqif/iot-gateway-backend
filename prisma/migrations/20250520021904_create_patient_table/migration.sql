-- CreateTable
CREATE TABLE `patients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `gender` VARCHAR(255) NOT NULL,
    `address` VARCHAR(191) NULL,
    `place_of_birth` VARCHAR(191) NULL,
    `date_of_birth` VARCHAR(191) NOT NULL,
    `religion` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `work` VARCHAR(191) NULL,
    `last_education` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

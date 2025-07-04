-- CreateTable
CREATE TABLE `measurement_histories_digit_pro_bmi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `device_id` VARCHAR(191) NOT NULL,
    `weight` INTEGER NOT NULL,
    `age` INTEGER NOT NULL,
    `bmi` INTEGER NOT NULL,
    `bodyFat` INTEGER NOT NULL,
    `muscleMass` INTEGER NOT NULL,
    `water` INTEGER NOT NULL,
    `visceralFat` INTEGER NOT NULL,
    `boneMass` INTEGER NOT NULL,
    `metabolism` INTEGER NOT NULL,
    `protein` INTEGER NOT NULL,
    `obesity` INTEGER NOT NULL,
    `bodyAge` INTEGER NOT NULL,
    `lbm` INTEGER NOT NULL,
    `timestamp` VARCHAR(191) NOT NULL,
    `patient_handler_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `measurement_histories_digit_pro_bmi` ADD CONSTRAINT `measurement_histories_digit_pro_bmi_patient_handler_id_fkey` FOREIGN KEY (`patient_handler_id`) REFERENCES `patient_handlers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

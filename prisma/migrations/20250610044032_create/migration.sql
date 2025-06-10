-- CreateTable
CREATE TABLE `measurement_histories_digit_pro_ida` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `device_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `weight_mother` DOUBLE NOT NULL,
    `weight_child` DOUBLE NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `patient_handler_id` VARCHAR(191) NOT NULL,
    `baby_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `measurement_histories_digit_pro_ida` ADD CONSTRAINT `measurement_histories_digit_pro_ida_patient_handler_id_fkey` FOREIGN KEY (`patient_handler_id`) REFERENCES `patient_handlers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `measurement_histories_digit_pro_ida` ADD CONSTRAINT `measurement_histories_digit_pro_ida_baby_id_fkey` FOREIGN KEY (`baby_id`) REFERENCES `babies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

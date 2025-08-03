-- CreateTable
CREATE TABLE `roles` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `kode` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `roles_name_key`(`name`),
    UNIQUE INDEX `roles_kode_key`(`kode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hospitals` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `logo_path` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(50) NULL,
    `phone` VARCHAR(16) NULL,
    `token` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `role_id` VARCHAR(191) NOT NULL,
    `hospital_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `iot_gateways` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `hospital_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admins` (
    `name` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `doctors` (
    `nid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `place_of_birth` VARCHAR(255) NOT NULL,
    `date_of_birth` DATETIME NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    `address` LONGTEXT NOT NULL,
    `last_education` VARCHAR(255) NOT NULL,
    `experience_of_years` VARCHAR(10) NOT NULL,
    `specialty` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `admin_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `doctors_nid_key`(`nid`),
    UNIQUE INDEX `doctors_user_id_key`(`user_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nurses` (
    `nira` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `place_of_birth` VARCHAR(50) NOT NULL,
    `date_of_birth` DATETIME NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    `address` LONGTEXT NOT NULL,
    `last_education` VARCHAR(50) NOT NULL,
    `experience_of_years` VARCHAR(10) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `admin_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `nurses_nira_key`(`nira`),
    UNIQUE INDEX `nurses_user_id_key`(`user_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profile_pictures` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `profile_pictures_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `devices_connected` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `model` VARCHAR(100) NOT NULL,
    `device_function` VARCHAR(100) NOT NULL,
    `type` VARCHAR(100) NOT NULL,
    `connection` ENUM('bluetooth', 'tcp_ip', 'serial', 'other') NOT NULL,
    `is_connected` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `hospital_id` VARCHAR(191) NOT NULL,
    `gateway_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `devices_connection_detail` (
    `device_id` VARCHAR(191) NOT NULL,
    `mac_address` VARCHAR(191) NULL,
    `ip_address` VARCHAR(191) NULL,
    `serial_number` VARCHAR(191) NULL,

    UNIQUE INDEX `devices_connection_detail_mac_address_key`(`mac_address`),
    UNIQUE INDEX `devices_connection_detail_ip_address_key`(`ip_address`),
    UNIQUE INDEX `devices_connection_detail_serial_number_key`(`serial_number`),
    PRIMARY KEY (`device_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `patient_handlers` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `patient_id` VARCHAR(191) NOT NULL,
    `device_id` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `patients` (
    `id` VARCHAR(191) NOT NULL,
    `nik` VARCHAR(191) NOT NULL,
    `no_kk` VARCHAR(50) NULL,
    `ihs_number` VARCHAR(100) NULL,
    `barcode_img` LONGTEXT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    `phone` VARCHAR(16) NULL,
    `place_of_birth` VARCHAR(50) NULL,
    `date_of_birth` DATETIME NOT NULL,
    `height` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `address_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `patients_nik_key`(`nik`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `addresses` (
    `id` VARCHAR(191) NOT NULL,
    `use` VARCHAR(20) NOT NULL,
    `line` LONGTEXT NOT NULL,
    `rt` VARCHAR(10) NULL,
    `rw` VARCHAR(10) NULL,
    `postal_code` VARCHAR(10) NOT NULL,
    `country` VARCHAR(10) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `province_id` CHAR(2) NOT NULL,
    `regency_id` CHAR(4) NOT NULL,
    `district_id` CHAR(7) NOT NULL,
    `village_id` CHAR(10) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `provinces` (
    `id` CHAR(2) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `regencies` (
    `id` CHAR(4) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `province_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `districts` (
    `id` CHAR(7) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `regency_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `villages` (
    `id` CHAR(10) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `district_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `babies` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    `date_of_birth` DATETIME NOT NULL,
    `place_of_birth` VARCHAR(50) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `patient_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `patient_rooms` (
    `id` VARCHAR(191) NOT NULL,
    `bed_id` VARCHAR(191) NOT NULL,
    `room_id` VARCHAR(191) NOT NULL,
    `patient_id` VARCHAR(191) NOT NULL,
    `assigned_at` DATETIME NOT NULL,
    `discharged_at` DATETIME NULL,

    UNIQUE INDEX `patient_rooms_bed_id_key`(`bed_id`),
    UNIQUE INDEX `patient_rooms_patient_id_key`(`patient_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity_room_logs` (
    `id` VARCHAR(191) NOT NULL,
    `patient_room_id` VARCHAR(191) NOT NULL,
    `activity` LONGTEXT NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rooms` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `number` VARCHAR(6) NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `nurse_manager` VARCHAR(191) NULL,
    `doctor_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `beds` (
    `id` VARCHAR(191) NOT NULL,
    `bed_number` VARCHAR(10) NOT NULL,
    `status` VARCHAR(30) NOT NULL,
    `type` VARCHAR(30) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `room_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CentralMonitor` (
    `id` VARCHAR(191) NOT NULL,
    `patient_handler_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `measurement_histories_digit_pro_baby` (
    `id` VARCHAR(191) NOT NULL,
    `weight` FLOAT NOT NULL,
    `recorded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `patient_handler_id` VARCHAR(191) NOT NULL,
    `baby_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `measurement_histories_digit_pro_ida` (
    `id` VARCHAR(191) NOT NULL,
    `weight_mother` FLOAT NOT NULL,
    `weight_child` FLOAT NOT NULL,
    `recorded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `patient_handler_id` VARCHAR(191) NOT NULL,
    `baby_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `measurement-histories_doppler` (
    `id` VARCHAR(191) NOT NULL,
    `heart_rate` FLOAT NOT NULL,
    `recorded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `patient_handler_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `measurement_histories_digit_pro_bmi` (
    `id` VARCHAR(191) NOT NULL,
    `weight` FLOAT NOT NULL,
    `age` FLOAT NOT NULL,
    `bmi` FLOAT NOT NULL,
    `body_fat` FLOAT NOT NULL,
    `muscle_mass` FLOAT NOT NULL,
    `water` FLOAT NOT NULL,
    `visceral_fat` FLOAT NOT NULL,
    `bone_mass` FLOAT NOT NULL,
    `metabolism` FLOAT NOT NULL,
    `protein` FLOAT NOT NULL,
    `obesity` FLOAT NOT NULL,
    `body_age` FLOAT NOT NULL,
    `lbm` FLOAT NOT NULL,
    `recorded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `patient_handler_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `measurement_histories_pm9000` (
    `id` VARCHAR(191) NOT NULL,
    `ecg` FLOAT NOT NULL,
    `spo2` FLOAT NOT NULL,
    `resp` FLOAT NOT NULL,
    `temp1` FLOAT NOT NULL,
    `temp2` FLOAT NOT NULL,
    `delta_temp` FLOAT NOT NULL,
    `systolic` FLOAT NULL,
    `diastolic` FLOAT NULL,
    `mean` FLOAT NULL,
    `recorded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `patient_handler_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `measurement_histories_ds001` (
    `id` VARCHAR(191) NOT NULL,
    `temp` FLOAT NOT NULL,
    `spo2` FLOAT NOT NULL,
    `pulse_rate_spo2` FLOAT NOT NULL,
    `respiratory_rate` FLOAT NOT NULL,
    `systolic` FLOAT NULL,
    `diastolic` FLOAT NULL,
    `map` FLOAT NULL,
    `pulse_rate` FLOAT NULL,
    `recorded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `patient_handler_id` VARCHAR(191) NOT NULL,
    `measurement_histories_ds001_nibp` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ecg_1200g` (
    `id` VARCHAR(191) NOT NULL,
    `file_path` VARCHAR(191) NULL,
    `image_path` VARCHAR(191) NULL,
    `patient_handler_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ecg_1200g_patient_handler_id_key`(`patient_handler_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity_logs` (
    `id` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `target_table` VARCHAR(191) NOT NULL,
    `target_id` VARCHAR(191) NULL,
    `ip_address` VARCHAR(191) NULL,
    `user_agent` VARCHAR(191) NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_hospital_id_fkey` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `iot_gateways` ADD CONSTRAINT `iot_gateways_hospital_id_fkey` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admins` ADD CONSTRAINT `admins_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `doctors` ADD CONSTRAINT `doctors_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nurses` ADD CONSTRAINT `nurses_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile_pictures` ADD CONSTRAINT `profile_pictures_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `devices_connected` ADD CONSTRAINT `devices_connected_hospital_id_fkey` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `devices_connected` ADD CONSTRAINT `devices_connected_gateway_id_fkey` FOREIGN KEY (`gateway_id`) REFERENCES `iot_gateways`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `devices_connection_detail` ADD CONSTRAINT `devices_connection_detail_device_id_fkey` FOREIGN KEY (`device_id`) REFERENCES `devices_connected`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patient_handlers` ADD CONSTRAINT `patient_handlers_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patient_handlers` ADD CONSTRAINT `patient_handlers_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patients` ADD CONSTRAINT `patients_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `provinces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_regency_id_fkey` FOREIGN KEY (`regency_id`) REFERENCES `regencies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_district_id_fkey` FOREIGN KEY (`district_id`) REFERENCES `districts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_village_id_fkey` FOREIGN KEY (`village_id`) REFERENCES `villages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `regencies` ADD CONSTRAINT `regencies_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `provinces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `districts` ADD CONSTRAINT `districts_regency_id_fkey` FOREIGN KEY (`regency_id`) REFERENCES `regencies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `villages` ADD CONSTRAINT `villages_district_id_fkey` FOREIGN KEY (`district_id`) REFERENCES `districts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `babies` ADD CONSTRAINT `babies_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patient_rooms` ADD CONSTRAINT `patient_rooms_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patient_rooms` ADD CONSTRAINT `patient_rooms_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `patient_rooms` ADD CONSTRAINT `patient_rooms_bed_id_fkey` FOREIGN KEY (`bed_id`) REFERENCES `beds`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity_room_logs` ADD CONSTRAINT `activity_room_logs_patient_room_id_fkey` FOREIGN KEY (`patient_room_id`) REFERENCES `patient_rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rooms` ADD CONSTRAINT `rooms_nurse_manager_fkey` FOREIGN KEY (`nurse_manager`) REFERENCES `nurses`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rooms` ADD CONSTRAINT `rooms_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `doctors`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `beds` ADD CONSTRAINT `beds_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CentralMonitor` ADD CONSTRAINT `CentralMonitor_patient_handler_id_fkey` FOREIGN KEY (`patient_handler_id`) REFERENCES `patient_handlers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `measurement_histories_digit_pro_baby` ADD CONSTRAINT `measurement_histories_digit_pro_baby_patient_handler_id_fkey` FOREIGN KEY (`patient_handler_id`) REFERENCES `patient_handlers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `measurement_histories_digit_pro_baby` ADD CONSTRAINT `measurement_histories_digit_pro_baby_baby_id_fkey` FOREIGN KEY (`baby_id`) REFERENCES `babies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `measurement_histories_digit_pro_ida` ADD CONSTRAINT `measurement_histories_digit_pro_ida_patient_handler_id_fkey` FOREIGN KEY (`patient_handler_id`) REFERENCES `patient_handlers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `measurement_histories_digit_pro_ida` ADD CONSTRAINT `measurement_histories_digit_pro_ida_baby_id_fkey` FOREIGN KEY (`baby_id`) REFERENCES `babies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `measurement-histories_doppler` ADD CONSTRAINT `measurement-histories_doppler_patient_handler_id_fkey` FOREIGN KEY (`patient_handler_id`) REFERENCES `patient_handlers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `measurement_histories_digit_pro_bmi` ADD CONSTRAINT `measurement_histories_digit_pro_bmi_patient_handler_id_fkey` FOREIGN KEY (`patient_handler_id`) REFERENCES `patient_handlers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `measurement_histories_pm9000` ADD CONSTRAINT `measurement_histories_pm9000_patient_handler_id_fkey` FOREIGN KEY (`patient_handler_id`) REFERENCES `patient_handlers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `measurement_histories_ds001` ADD CONSTRAINT `measurement_histories_ds001_patient_handler_id_fkey` FOREIGN KEY (`patient_handler_id`) REFERENCES `patient_handlers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ecg_1200g` ADD CONSTRAINT `ecg_1200g_patient_handler_id_fkey` FOREIGN KEY (`patient_handler_id`) REFERENCES `patient_handlers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity_logs` ADD CONSTRAINT `activity_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

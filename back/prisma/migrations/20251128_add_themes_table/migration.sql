-- CreateTable
CREATE TABLE `themes` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `primaryColor` VARCHAR(20) NOT NULL,
    `secondaryColor` VARCHAR(20) NOT NULL,
    `backgroundColor` VARCHAR(20) NOT NULL,
    `favicon` VARCHAR(500) NULL,
    `icon` VARCHAR(500) NULL,
    `logo` VARCHAR(500) NULL,
    `siteName` VARCHAR(100) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `themes_slug_key`(`slug`),
    INDEX `themes_slug_idx`(`slug`),
    INDEX `themes_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

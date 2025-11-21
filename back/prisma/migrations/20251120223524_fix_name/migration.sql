/*
  Warnings:

  - You are about to drop the column `image` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.
  - Added the required column `pseudo` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `users_name_idx` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `image`,
    DROP COLUMN `name`,
    ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `lastLogin` DATETIME(3) NULL,
    ADD COLUMN `picture` VARCHAR(500) NULL,
    ADD COLUMN `pseudo` VARCHAR(50) NOT NULL,
    MODIFY `role` ENUM('ADMIN', 'STAFF', 'MEMBER') NOT NULL DEFAULT 'MEMBER';

-- CreateIndex
CREATE INDEX `users_pseudo_idx` ON `users`(`pseudo`);

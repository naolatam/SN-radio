/*
  Warnings:

  - You are about to drop the column `description` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `pseudo` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(0))`.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `users_pseudo_idx` ON `users`;

-- DropIndex
DROP INDEX `users_pseudo_key` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `description`,
    DROP COLUMN `lastLogin`,
    DROP COLUMN `password`,
    DROP COLUMN `picture`,
    DROP COLUMN `pseudo`,
    ADD COLUMN `image` VARCHAR(500) NULL,
    ADD COLUMN `name` VARCHAR(50) NOT NULL,
    MODIFY `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user';

-- CreateIndex
CREATE INDEX `users_name_idx` ON `users`(`name`);

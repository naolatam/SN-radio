/*
  Warnings:

  - You are about to drop the column `picture` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `pseudo` on the `users` table. All the data in the column will be lost.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `users_pseudo_idx` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `picture`,
    DROP COLUMN `pseudo`,
    ADD COLUMN `image` VARCHAR(500) NULL,
    ADD COLUMN `name` VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE INDEX `users_name_idx` ON `users`(`name`);

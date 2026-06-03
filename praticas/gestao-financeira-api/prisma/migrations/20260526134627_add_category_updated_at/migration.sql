-- AlterTable: add updatedAt with a default so existing rows are backfilled
ALTER TABLE `Category` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

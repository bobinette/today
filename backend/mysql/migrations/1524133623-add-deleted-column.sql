-- Migration: add-deleted-column
-- Created at: 2018-04-19 12:27:03
-- ====  UP  ====

BEGIN;

ALTER TABLE `logs`
    ADD COLUMN `deleted` BOOLEAN NOT NULL AFTER `content`,
    ADD INDEX `logs_deleted_idx` (`deleted`);

COMMIT;

-- ==== DOWN ====

BEGIN;

ALTER TABLE `logs`
    DROP COLUMN `deleted`;

COMMIT;

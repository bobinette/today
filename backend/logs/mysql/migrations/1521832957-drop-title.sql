-- Migration: drop-title
-- Created at: 2018-03-23 20:22:37
-- ====  UP  ====

BEGIN;

ALTER TABLE `logs`
    DROP COLUMN `title`;

COMMIT;

-- ==== DOWN ====

BEGIN;

ALTER TABLE `logs`
    ADD COLUMN `title` TEXT NOT NULL AFTER `uuid`;

COMMIT;

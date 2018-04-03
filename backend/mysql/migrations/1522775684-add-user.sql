-- Migration: add-user
-- Created at: 2018-04-03 19:14:44
-- ====  UP  ====

BEGIN;

ALTER TABLE `logs`
    ADD COLUMN `user` VARCHAR(512) NOT NULL AFTER `uuid`,
    ADD INDEX `logs_user_idx` (`user`);

COMMIT;

-- ==== DOWN ====

BEGIN;

ALTER TABLE `logs`
    DROP COLUMN `user`;

COMMIT;

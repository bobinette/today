-- Migration: create-events-table
-- Created at: 2018-02-11 15:36:24
-- ====  UP  ====

BEGIN;

CREATE TABLE `events` (
    `aggregateType` VARCHAR(256) NOT NULL,
    `uuid` VARCHAR(36) NOT NULL,
    `version` BIGINT NOT NULL,

    `eventType` VARCHAR(256) NOT NULL,
    `data` MEDIUMTEXT NOT NULL,

    `timestamp` TIMESTAMP NOT NULL,

    PRIMARY KEY (`aggregateType`, `uuid`, `version`)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;

-- ==== DOWN ====

BEGIN;

DROP TABLE `logs`;

COMMIT;

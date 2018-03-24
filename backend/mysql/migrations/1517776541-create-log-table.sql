-- Migration: create-log-table
-- Created at: 2018-02-04 20:35:41
-- ====  UP  ====

BEGIN;

CREATE TABLE `logs` (
    `uuid` VARCHAR(36) NOT NULL,

    `title` TEXT NOT NULL,
    `content` TEXT NOT NULL,

    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME NOT NULL,

    PRIMARY KEY (`uuid`)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;

-- ==== DOWN ====

BEGIN;

DROP TABLE `logs`;

COMMIT;

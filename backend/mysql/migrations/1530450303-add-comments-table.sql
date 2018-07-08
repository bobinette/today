-- Migration: add-comments-table
-- Created at: 2018-07-01 15:05:03
-- ====  UP  ====

BEGIN;

CREATE TABLE `comments` (
    `uuid` VARCHAR(36) NOT NULL,
    `log_uuid` VARCHAR(36) NOT NULL,
    `user` VARCHAR(512) NOT NULL,

    `content` TEXT NOT NULL,

    `deleted` BOOLEAN NOT NULL,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME NOT NULL,

    PRIMARY KEY (`uuid`),
    CONSTRAINT `fk_comments_logs` FOREIGN KEY (`log_uuid`) REFERENCES `logs` (`uuid`) ON DELETE CASCADE

)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;

-- ==== DOWN ====

BEGIN;

DROP TABLE `comments`;

COMMIT;

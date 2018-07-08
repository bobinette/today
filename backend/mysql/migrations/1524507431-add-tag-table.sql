-- Migration: add-tag-table
-- Created at: 2018-04-23 20:17:11
-- ====  UP  ====

BEGIN;

CREATE TABLE `tags` (
    `log_uuid` VARCHAR(36) NOT NULL,
    `tag` VARCHAR(600) NOT NULL,

    PRIMARY KEY (`log_uuid`, `tag`),
    CONSTRAINT `fk_tags_logs` FOREIGN KEY (`log_uuid`) REFERENCES `logs` (`uuid`) ON DELETE CASCADE

)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;

-- ==== DOWN ====

BEGIN;

DROP TABLE `tags`;

COMMIT;

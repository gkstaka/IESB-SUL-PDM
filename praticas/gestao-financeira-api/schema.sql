CREATE DATABASE IF NOT EXISTS gestao_financeira
  CHARACTER SET utf8mb4
  COLLATE       utf8mb4_unicode_ci;

USE gestao_financeira;

CREATE TABLE IF NOT EXISTS `User` (
  `id`        VARCHAR(191) NOT NULL,
  `email`     VARCHAR(191) NOT NULL,
  `password`  VARCHAR(191) NOT NULL,          -- bcrypt hash
  `name`      VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                                   ON UPDATE  CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE INDEX `User_email_key` (`email`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Category` (
  `id`          VARCHAR(191) NOT NULL,
  `name`        VARCHAR(191) NOT NULL,
  `displayName` VARCHAR(191) NOT NULL,
  `icon`        VARCHAR(191) NOT NULL,
  `background`  VARCHAR(191) NOT NULL,
  `isIncome`    BOOLEAN      NOT NULL DEFAULT FALSE,
  `isDefault`   BOOLEAN      NOT NULL DEFAULT FALSE,
  `userId`      VARCHAR(191)     NULL,        -- NULL = categoria global
  `createdAt`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                                   ON UPDATE  CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE INDEX `Category_name_userId_key` (`name`, `userId`),
  INDEX         `Category_userId_idx`     (`userId`),

  CONSTRAINT `Category_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `User` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Transaction` (
  `id`          VARCHAR(191)   NOT NULL,
  `description` VARCHAR(255)   NOT NULL,
  `value`       DECIMAL(12, 2) NOT NULL,
  `date`        DATETIME(3)    NOT NULL,
  `categoryId`  VARCHAR(191)   NOT NULL,
  `userId`      VARCHAR(191)       NULL,
  `createdAt`   DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`   DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                                     ON UPDATE  CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  INDEX `Transaction_categoryId_idx` (`categoryId`),
  INDEX `Transaction_userId_idx`     (`userId`),

  CONSTRAINT `Transaction_categoryId_fkey`
    FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  CONSTRAINT `Transaction_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `User` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- usuário padrão: admin@gestao.com / admin123
INSERT IGNORE INTO `User`
  (`id`, `email`, `password`, `name`, `createdAt`, `updatedAt`)
VALUES (
  'cmpmqj0q300003b8srci6wd0d',
  'admin@gestao.com',
  '$2b$10$X092H8BPXbzX.t9nF0ctt.xD4wN/EDxASrkQGddSoHmNLMmKcltiW',
  'Usuário Padrão',
  NOW(3),
  NOW(3)
);

-- categorias globais (isDefault TRUE = API bloqueia edição e exclusão)
INSERT IGNORE INTO `Category`
  (`id`, `name`, `displayName`, `icon`, `background`, `isIncome`, `isDefault`, `userId`, `createdAt`, `updatedAt`)
VALUES
  ('cmpmlxh030001bey5z28bz13c', 'income',    'Renda',       'work',                '#DE9AC3', TRUE,  TRUE, NULL, NOW(3), NOW(3)),
  ('cmpmlxh030002bey5z28bz13c', 'food',      'Alimentação', 'fastfood',            '#DEA17B', FALSE, TRUE, NULL, NOW(3), NOW(3)),
  ('cmpmlxh030003bey5z28bz13c', 'house',     'Casa',        'home',                '#E6E088', FALSE, TRUE, NULL, NOW(3), NOW(3)),
  ('cmpmlxh030004bey5z28bz13c', 'education', 'Educação',    'book',                '#AB8FBE', FALSE, TRUE, NULL, NOW(3), NOW(3)),
  ('cmpmlxh030005bey5z28bz13c', 'travel',    'Viagens',     'airplanemode-active', '#82C9DE', FALSE, TRUE, NULL, NOW(3), NOW(3));

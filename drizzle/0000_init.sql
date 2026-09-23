-- Skyra Realty initial schema (MySQL)
-- Prefer `npm run db:push` when DATABASE_URL is configured.

CREATE TABLE IF NOT EXISTS `admins` (
  `id` varchar(64) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `admins_id` PRIMARY KEY(`id`),
  CONSTRAINT `admins_email_unique` UNIQUE(`email`)
);

CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(128) NOT NULL,
  `admin_id` varchar(64) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
  CONSTRAINT `sessions_admin_id_admins_id_fk` FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE CASCADE
);

CREATE INDEX `sessions_admin_id_idx` ON `sessions` (`admin_id`);

CREATE TABLE IF NOT EXISTS `properties` (
  `id` varchar(64) NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` varchar(64) NOT NULL,
  `locality` varchar(128) NOT NULL,
  `address` text NOT NULL,
  `price` double NOT NULL,
  `area_sqft` double NOT NULL,
  `bedrooms` int NOT NULL DEFAULT 0,
  `bathrooms` int NOT NULL DEFAULT 0,
  `furnishing` varchar(64) NOT NULL,
  `possession_status` varchar(64) NOT NULL,
  `age_of_property` varchar(64) NOT NULL,
  `facing` varchar(32) NOT NULL,
  `floor_number` int NOT NULL DEFAULT 0,
  `total_floors` int NOT NULL DEFAULT 0,
  `amenities` json NOT NULL,
  `description` text NOT NULL,
  `images` json NOT NULL,
  `listed_date` varchar(32) NOT NULL,
  `owner_contact_name` varchar(128) NOT NULL,
  `owner_contact_phone` varchar(32) NOT NULL,
  `view_count` int NOT NULL DEFAULT 0,
  CONSTRAINT `properties_id` PRIMARY KEY(`id`)
);

CREATE INDEX `properties_listed_date_idx` ON `properties` (`listed_date`);
CREATE INDEX `properties_type_idx` ON `properties` (`type`);
CREATE INDEX `properties_locality_idx` ON `properties` (`locality`);

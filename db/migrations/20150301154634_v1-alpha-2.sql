
-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


DROP TABLE IF EXISTS `account`;

CREATE TABLE `account` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `company_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `creator_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `updater_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `created` datetime NOT NULL,
  `created_time_zone` int(11) DEFAULT NULL,
  `updated` datetime NOT NULL,
  `updated_time_zone` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_D48A8F7C61220AA3` (`updater_id`),
  KEY `FK_D48A2F7C61220AA3` (`creator_id`),
  KEY `FK_D48A2F7C61220AA4` (`company_id`),
  CONSTRAINT `FK_D48A8F7C61220AA3` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`),
  CONSTRAINT `FK_D48A2F7C61220AA3` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_D48A2F7C61220AA4` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `account` (`id`, `name`, `creator_id`, `updater_id`, `created`, `created_time_zone`, `updated`, `updated_time_zone`)
VALUES ('69b07036-c159-11e4-898f-10c37b247796', 'Some Account', '5fbec591-acc8-49fe-a44e-46c59cae99f9', '5fbec591-acc8-49fe-a44e-46c59cae99f9', '2015-03-02 20:10:10', '151', '2015-03-02 20:10:10', '151');

DROP TABLE IF EXISTS `location`;

CREATE TABLE `location` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `address` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `address1` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `city` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `zipcode` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `state_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `country_id` varchar(2) COLLATE utf8_unicode_ci DEFAULT NULL,
  `company_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `creator_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `updater_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `created` datetime NOT NULL,
  `created_time_zone` int(11) DEFAULT NULL,
  `updated` datetime NOT NULL,
  `updated_time_zone` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_D34AX4AD61220AA1` (`company_id`),
  KEY `FK_D34A04AD61220AA1` (`creator_id`),
  KEY `FK_D34A04AD61220AA2` (`updater_id`),
  CONSTRAINT `FK_D34AX4AD61220AA1` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`),
  CONSTRAINT `FK_D34A04AD61220AA1` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_D34A04AD61220AA2` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
INSERT INTO `location` (`id`, `name`, `address`, `creator_id`, `updater_id`, `created`, `updated`)
VALUES ('05284899-c15a-11e4-898f-10c37b247796', 'Some Address', '1124 sw 145 st miami, fl 33145', '5fbec591-acc8-49fe-a44e-46c59cae99f9', '5fbec591-acc8-49fe-a44e-46c59cae99f9', '2015-03-02 20:20:03', '2015-03-02 20:20:03');

DROP TABLE IF EXISTS `product`;

CREATE TABLE `product` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `manufacturer` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `category` int(11) NOT NULL,
  `purchasable` tinyint(1) DEFAULT NULL,
  `cost` double NOT NULL,
  `purchase_account_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `purchase_description` text COLLATE utf8_unicode_ci,
  `salable` tinyint(1) DEFAULT NULL,
  `price` double NOT NULL,
  `sale_account_id` varchar(26) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sale_description` text COLLATE utf8_unicode_ci,
  `is_taxable` tinyint(1) DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `company_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `updater_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `creator_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `updated` datetime NOT NULL,
  `updated_time_zone` int(11) DEFAULT NULL,
  `created` datetime NOT NULL,
  `created_time_zone` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_D34A04AD61228EA6` (`company_id`),
  KEY `IDX_D34A04AD61220EA6` (`creator_id`),
  KEY `IDX_D34A04ADE37ECFB0` (`updater_id`),
  KEY `FK_D34A04AD61220EA7` (`purchase_account_id`),
  KEY `FK_D34A04AD61220EA8` (`sale_account_id`),
  CONSTRAINT `FK_D34A04AD61228EA6` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`),
  CONSTRAINT `FK_D34A04AD61220EA7` FOREIGN KEY (`purchase_account_id`) REFERENCES `account` (`id`),
  CONSTRAINT `FK_D34A04AD61220EA8` FOREIGN KEY (`sale_account_id`) REFERENCES `account` (`id`),
  CONSTRAINT `FK_D34A04AD61220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_D34A04ADE37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `product` (`id`, `name`, `category`, `purchasable`, `cost`, `purchase_account_id`, `purchase_description`, `salable`, `price`, `sale_account_id`, `sale_description`, `is_taxable`, `updater_id`, `creator_id`, `updated`,`created`)
VALUES ('2fe51519-c15e-11e4-898f-10c37b247796', 'Michelin', '1', '1', '45.26', '69b07036-c159-11e4-898f-10c37b247796', 'some description', '1', '54.78', '69b07036-c159-11e4-898f-10c37b247796', 'some description', '1', '5fbec591-acc8-49fe-a44e-46c59cae99f9', '5fbec591-acc8-49fe-a44e-46c59cae99f9', '2015-03-02 20:10:10', '2015-03-02 20:10:10');

DROP TABLE IF EXISTS `product_variation`;

CREATE TABLE `product_variation` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `variation` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  `sku` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `serial` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `stock` int(11) NOT NULL,
  `alert_at` int(11) NOT NULL,
  `alert` tinyint(1) NOT NULL,
  `product_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `location_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `creator_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `updater_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `created` datetime NOT NULL,
  `created_time_zone` int(11) DEFAULT NULL,
  `updated` datetime NOT NULL,
  `updated_time_zone` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_product_variation_3_idx` (`location_id`),
  KEY `fk_product_variation_2_idx` (`creator_id`),
  KEY `fk_product_variation_1_idx` (`updater_id`),
  KEY `fk_product_variation_4_idx` (`location_id`),
  KEY `fk_product_variation_5_idx` (`creator_id`),
  KEY `fk_product_variation_6_idx` (`updater_id`),
  CONSTRAINT `fk_product_variation_1` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`),
  CONSTRAINT `fk_product_variation_2` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
  CONSTRAINT `fk_product_variation_3` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `product_variation` (`id`, `variation`, `sku`, `serial`, `stock`, `alert_at`, `alert`, `product_id`, `location_id`, `creator_id`, `updater_id`, `created`, `updated`, `updated_time_zone`)
VALUES ('75da7feb-c15f-11e4-898f-10c37b247796', '175/80/15 Radius', '45775', '4578AA', '50', '5', '1', '2fe51519-c15e-11e4-898f-10c37b247796', '05284899-c15a-11e4-898f-10c37b247796', '5fbec591-acc8-49fe-a44e-46c59cae99f9', '5fbec591-acc8-49fe-a44e-46c59cae99f9', '2015-03-02 20:20:03', '2015-03-02 20:20:03', null),
       ('d823ee4a-c15f-11e4-898f-10c37b247796', '155/60/14 Radius', '45775', '4578AA', '40', '10', '0', '2fe51519-c15e-11e4-898f-10c37b247796', '05284899-c15a-11e4-898f-10c37b247796', '5fbec591-acc8-49fe-a44e-46c59cae99f9', '5fbec591-acc8-49fe-a44e-46c59cae99f9', '2015-03-02 20:20:03', '2015-03-02 20:20:03', null);


DROP TABLE IF EXISTS `company_scope`;

CREATE TABLE IF NOT EXISTS `company_scope` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(80) COLLATE utf8_unicode_ci NOT NULL,
  `name_key` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `deleted` datetime DEFAULT NULL,
  `creator_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `updater_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created` datetime NOT NULL,
  `created_time_zone` int(11) DEFAULT NULL,
  `updated` datetime NOT NULL,
  `updated_time_zone` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_5373C96661220EA1` (`creator_id`),
  KEY `IDX_5373C966E37ECFB2` (`updater_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `company_scope` (`id`, `name`, `name_key`, `deleted`, `creator_id`, `updater_id`, `created`, `created_time_zone`, `updated`, `updated_time_zone`) VALUES
('8b16c42e-c1ea-11e4-b9a6-a088694cea32', 'Entire business', 'ENTIRE_BUSINESS', NULL, '5fbec591-acc8-49fe-a44e-46c59cae99f9', '5fbec591-acc8-49fe-a44e-46c59cae99f9', '2015-03-03 00:00:00', NULL, '2015-03-03 00:00:00', NULL),
('8b16c42e-c1ea-11e4-b9a6-a088694cea33', 'Some of my locations', 'SOME_LOCATIONS', NULL, '5fbec591-acc8-49fe-a44e-46c59cae99f9', '5fbec591-acc8-49fe-a44e-46c59cae99f9', '2015-03-03 00:00:00', NULL, '2015-03-03 00:00:00', NULL),
('8b16c42e-c1ea-11e4-b9a6-a088694cea34', 'All of my credit transactions', 'ALL_CREDIT', NULL, '5fbec591-acc8-49fe-a44e-46c59cae99f9', '5fbec591-acc8-49fe-a44e-46c59cae99f9', '2015-03-03 00:00:00', NULL, '2015-03-03 00:00:00', NULL),
('8b16c42e-c1ea-11e4-b9a6-a088694cea35', 'Some of my card transactions', 'SOME_CREDIT', NULL, '5fbec591-acc8-49fe-a44e-46c59cae99f9', '5fbec591-acc8-49fe-a44e-46c59cae99f9', '2015-03-03 00:00:00', NULL, '2015-03-03 00:00:00', NULL),
('8b16c42e-c1ea-11e4-b9a6-a088694cea36', 'As a backup processor', 'BACKUP', NULL, '5fbec591-acc8-49fe-a44e-46c59cae99f9', '5fbec591-acc8-49fe-a44e-46c59cae99f9', '2015-03-03 00:00:00', NULL, '2015-03-03 00:00:00', NULL),
('8b16c42e-c1ea-11e4-b9a6-a088694cea37', 'For events only', 'EVENTS', NULL, '5fbec591-acc8-49fe-a44e-46c59cae99f9', '5fbec591-acc8-49fe-a44e-46c59cae99f9', '2015-03-03 00:00:00', NULL, '2015-03-03 00:00:00', NULL);


ALTER TABLE `company_scope`
  ADD CONSTRAINT `FK_8D93D6495373C967` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_8D93D6495373C968` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`);

ALTER TABLE `user` ADD `company_scope_id` VARCHAR(36) NULL , ADD INDEX (`company_scope_id`);
ALTER TABLE `user` ADD CONSTRAINT `FK_8D93D649979B1AD8` FOREIGN KEY (`company_scope_id`) REFERENCES `company_scope` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `user` CHANGE `business` `business_name` VARCHAR( 255 ) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL ;
ALTER TABLE `user` DROP FOREIGN KEY `FK_8D93D64932C8A3DE` ;
ALTER TABLE `user` DROP `organization_id`;
ALTER TABLE `user` CHANGE `is_active` `is_active` TINYINT(1)  NOT NULL  DEFAULT '0';

ALTER TABLE `industry` CHANGE `deleted` `deleted` DATETIME NULL ;

ALTER TABLE `customer` DROP FOREIGN KEY `FK_81398E095373C966`;
ALTER TABLE `customer` DROP `country_id`;
ALTER TABLE `customer` DROP `email`;
ALTER TABLE `customer` ADD `company_name` VARCHAR(255) NULL AFTER `fax`;
ALTER TABLE `customer` ADD `web_site` VARCHAR(255) NULL AFTER `company_name`;
ALTER TABLE `customer` ADD `account_number` VARCHAR(255) NULL AFTER `web_site`;
ALTER TABLE `customer` CHANGE `address` `billing_address` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL;
ALTER TABLE `customer` ADD `billing_address1` VARCHAR(100) NOT NULL AFTER `billing_address`;
ALTER TABLE `customer` CHANGE `city` `billing_city` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL;
ALTER TABLE `customer` ADD `billing_zipcode` VARCHAR( 20 ) NOT NULL AFTER `billing_city` ;
ALTER TABLE `customer` CHANGE `state_id` `billing_state_id` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL;
ALTER TABLE `customer` ADD `shipping_address` VARCHAR(255) NULL AFTER `billing_city`;
ALTER TABLE `customer` ADD `shipping_address1` VARCHAR(100) NOT NULL AFTER `shipping_address`;
ALTER TABLE `customer` ADD `shipping_city` VARCHAR(100) NOT NULL AFTER `shipping_address1` ;
ALTER TABLE `customer` CHANGE `zipcode` `shipping_zipcode` VARCHAR(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL ;
ALTER TABLE `customer` ADD `shipping_state_id` VARCHAR(36) NOT NULL AFTER `shipping_zipcode`,ADD INDEX (`shipping_state_id`) ;
ALTER TABLE `customer` DROP FOREIGN KEY `FK_81398E0961220EA6`;
ALTER TABLE `customer` ADD CONSTRAINT `FK_81398E0961220EA0` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `customer` ADD `tax` FLOAT NULL AFTER `shipping_state_id`;
ALTER TABLE `customer` ADD `discount` FLOAT NULL AFTER `tax` ;
ALTER TABLE `customer` ADD `bank_account` VARCHAR(255) NOT NULL AFTER `discount`;
ALTER TABLE `customer` ADD `bank_account_name` VARCHAR(255) NOT NULL AFTER `bank_account`;
ALTER TABLE `customer` ADD `batch_payments_detailt` VARCHAR(255) NOT NULL AFTER `bank_account_name`;
ALTER TABLE `customer` CHANGE `name` `name` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `id`,
  CHANGE `phone` `phone` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `name`,
  CHANGE `mobile` `mobile` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `phone`,
  CHANGE `fax` `fax` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `mobile`,
  CHANGE `company_name` `company_name` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL AFTER `fax`,
  CHANGE `web_site` `web_site` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL AFTER `company_name`,
  CHANGE `account_number` `account_number` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL AFTER `web_site`,
  CHANGE `billing_address` `billing_address` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `account_number`,
  CHANGE `billing_address1` `billing_address1` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `billing_address`,
  CHANGE `billing_city` `billing_city` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `billing_address1`,
  CHANGE `billing_zipcode` `billing_zipcode` VARCHAR(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `billing_city`,
  CHANGE `billing_state_id` `billing_state_id` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL AFTER `billing_zipcode`,
  CHANGE `shipping_address` `shipping_address` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL AFTER `billing_state_id`,
  CHANGE `shipping_address1` `shipping_address1` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `shipping_address`,
  CHANGE `shipping_city` `shipping_city` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `shipping_address1`,
  CHANGE `shipping_zipcode` `shipping_zipcode` VARCHAR(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `shipping_city`,
  CHANGE `shipping_state_id` `shipping_state_id` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `shipping_zipcode`,
  CHANGE `tax` `tax` FLOAT NULL DEFAULT NULL AFTER `shipping_state_id`,
  CHANGE `discount` `discount` FLOAT NULL DEFAULT NULL AFTER `tax`,
  CHANGE `bank_account` `bank_account` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `discount`,
  CHANGE `bank_account_name` `bank_account_name` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `bank_account`,
  CHANGE `batch_payments_detailt` `batch_payments_detailt` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `bank_account_name`,
  CHANGE `deleted` `deleted` DATETIME NULL DEFAULT NULL AFTER `batch_payments_detailt`,
  CHANGE `creator_id` `creator_id` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL AFTER `deleted`,
  CHANGE `created` `created` DATETIME NOT NULL AFTER `creator_id`,
  CHANGE `created_time_zone` `created_time_zone` INT(11) NULL DEFAULT NULL AFTER `created`;
ALTER TABLE `customer` ADD `out_standing` DOUBLE NOT NULL AFTER `batch_payments_detailt` ;
ALTER TABLE `customer` ADD `over_due` DOUBLE NOT NULL AFTER `out_standing` ;
ALTER TABLE `customer` CHANGE `batch_payments_detailt` `batch_payments_details` VARCHAR( 255 ) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL ;
ALTER TABLE `customer` DROP FOREIGN KEY `FK_81398E09A393D2FB` ;
ALTER TABLE `customer` DROP `billing_address`, DROP `billing_address1`, DROP `billing_city`, DROP `billing_zipcode`, DROP `billing_state_id`, DROP `shipping_address`, DROP `shipping_address1`, DROP `shipping_city`, DROP `shipping_zipcode`, DROP `shipping_state_id`;
ALTER TABLE `customer` ADD `billing_location_id` VARCHAR(36) NULL DEFAULT NULL AFTER `account_number` ,ADD INDEX (`billing_location_id`);
ALTER TABLE `customer` ADD `shipping_location_id` VARCHAR(36) NULL DEFAULT NULL AFTER `billing_location_id` , ADD INDEX ( `shipping_location_id` );
ALTER TABLE `customer` ADD CONSTRAINT `FK_81398E0961220EA1` FOREIGN KEY (`billing_location_id`) REFERENCES `inventory`.`location` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `customer` ADD CONSTRAINT `FK_81398E0961220EA2` FOREIGN KEY (`shipping_location_id`) REFERENCES `inventory`.`location` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `customer` ADD `company_id` VARCHAR(36) NULL DEFAULT NULL AFTER `over_due` ,ADD INDEX (`company_id`);
ALTER TABLE `customer` ADD CONSTRAINT `81398E0961220EA3` FOREIGN KEY ( `company_id` ) REFERENCES `inventory`.`company` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;




ALTER TABLE `vendor` DROP `category` ;
ALTER TABLE `vendor` ADD `mobile` VARCHAR( 100 ) NOT NULL AFTER `phone`;
ALTER TABLE `vendor` DROP `email`;
ALTER TABLE `vendor` ADD `company_name` VARCHAR(100) NULL AFTER `fax`;
ALTER TABLE `vendor` ADD `web_site` VARCHAR(255) NULL AFTER `company_name`;
ALTER TABLE `vendor` ADD `account_number` VARCHAR(255) NULL AFTER `web_site`;
ALTER TABLE `vendor` ADD `address1` VARCHAR(100) NOT NULL AFTER `address`;
ALTER TABLE `vendor` DROP `notes`;
ALTER TABLE `vendor` ADD `track_transaction` BOOLEAN NOT NULL AFTER `zipcode`;
ALTER TABLE `vendor` ADD `tax_id` VARCHAR( 10 ) NOT NULL AFTER `track_transaction`;
ALTER TABLE `vendor` ADD `bank_account` VARCHAR(255) NOT NULL AFTER `tax_id`;
ALTER TABLE `vendor` ADD `bank_account_name` VARCHAR(255) NOT NULL AFTER `bank_account`;
ALTER TABLE `vendor` ADD `batch_payments_detailt` VARCHAR(255) NOT NULL AFTER `bank_account_name`;
ALTER TABLE `vendor` DROP FOREIGN KEY `FK_F52233F65373C966`;
ALTER TABLE `vendor` DROP `country_id`;

ALTER TABLE `vendor` CHANGE `name` `name` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `id`,
  CHANGE `phone` `phone` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `name`,
  CHANGE `mobile` `mobile` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `phone`,
  CHANGE `fax` `fax` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `mobile`,
  CHANGE `company_name` `company_name` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL AFTER `fax`,
  CHANGE `web_site` `web_site` VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL AFTER `company_name`,
  CHANGE `account_number` `account_number` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL AFTER `web_site`,
  CHANGE `address` `address` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `account_number`,
  CHANGE `address1` `address1` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `address`,
  CHANGE `city` `city` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `address1`,
  CHANGE `zipcode` `zipcode` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `city`,
  CHANGE `track_transaction` `track_transaction` TINYINT(1) NOT NULL AFTER `state_id`,
  CHANGE `tax_id` `tax_id` VARCHAR(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `track_transaction`,
  CHANGE `bank_account` `bank_account` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `tax_id`,
  CHANGE `bank_account_name` `bank_account_name` VARCHAR(255)   CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `bank_account`,
  CHANGE `batch_payments_detailt` `batch_payments_detailt` VARCHAR(255)   CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `bank_account_name`,
  CHANGE `deleted` `deleted` DATETIME NULL DEFAULT NULL AFTER `batch_payments_detailt`,
  CHANGE `created` `created` DATETIME NOT NULL AFTER `creator_id`,
  CHANGE `created_time_zone` `created_time_zone` INT(11) NULL DEFAULT NULL AFTER `created`;

ALTER TABLE `vendor` DROP FOREIGN KEY `FK_F52233F6A393D2FB` ;
ALTER TABLE `vendor` DROP `address`,  DROP `address1`,  DROP `city`,  DROP `zipcode`,  DROP `state_id`;
ALTER TABLE `vendor` ADD `location_id` VARCHAR(36) NULL DEFAULT NULL AFTER `account_number` ,ADD INDEX (`location_id`);
UPDATE `vendor` SET `location_id` = 'NULL';
ALTER TABLE `vendor` ADD CONSTRAINT `FK_F52233F661220EA4` FOREIGN KEY ( `location_id` ) REFERENCES `location` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `vendor` ADD `company_id` VARCHAR( 36 ) NOT NULL AFTER `batch_payments_detailt` , ADD INDEX ( `company_id` );
UPDATE `vendor` SET `company_id` = '242495b7-69f4-4107-a4d8-850540e6b834';
ALTER TABLE `vendor` ADD CONSTRAINT `FK_F52233F661220EA9` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;


ALTER TABLE `contact` DROP FOREIGN KEY `FK_4C62E638C33F7837` ;
ALTER TABLE `contact` DROP `document_id`;
ALTER TABLE `contact` DROP `notes`;
ALTER TABLE `contact` DROP `position`;
ALTER TABLE `contact` ADD `owner_id` VARCHAR(36) NOT NULL AFTER `owner`;
ALTER TABLE `contact` ADD `include_email` BOOLEAN NOT NULL DEFAULT FALSE AFTER `email`;
ALTER TABLE `contact` CHANGE `name` `name` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `id`,
  CHANGE `last_name` `last_name` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `name`,
  CHANGE `phone` `phone` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `last_name`,
  CHANGE `email` `email` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `phone`,
  CHANGE `include_email` `include_email` TINYINT(1)   NOT NULL DEFAULT '0' AFTER `email`,
  CHANGE `owner` `owner` VARCHAR(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `include_email`,
  CHANGE `owner_id` `owner_id` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `owner`,
  CHANGE `deleted` `deleted` DATETIME NULL DEFAULT NULL AFTER `owner_id`,
  CHANGE `created` `created` DATETIME NOT NULL AFTER `creator_id`,
  CHANGE `created_time_zone` `created_time_zone` INT(11)  NULL DEFAULT NULL AFTER `created`;


ALTER TABLE `company` DROP FOREIGN KEY `FK_4FBF094FA393D2FB` ;
ALTER TABLE `company` DROP FOREIGN KEY `FK_4FBF094F5373C966` ;
ALTER TABLE `company` DROP `address1`, DROP `address2`, DROP `city`, DROP `state_id`, DROP `zip_code`, DROP `country_id`;
ALTER TABLE `company` ADD `location_id` VARCHAR(36) NULL DEFAULT NULL AFTER `tax_id`,ADD INDEX ( `location_id` );
ALTER TABLE `company` ADD CONSTRAINT `FK_4FBF094FE37ECFB8` FOREIGN KEY ( `location_id` ) REFERENCES `inventory`.`location` (id`) ON DELETE RESTRICT ON UPDATE RESTRICT;


DROP TABLE IF EXISTS `organization`;

ALTER TABLE `inventory`.`product` CHANGE COLUMN `sale_account_id` `sale_account_id` VARCHAR(36) CHARACTER SET 'utf8' COLLATE 'utf8_unicode_ci' NULL DEFAULT NULL ;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


-- +goose Down
-- SQL section 'Down' is executed when this migration is rolled back

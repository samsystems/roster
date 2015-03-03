
-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied
DROP TABLE IF EXISTS `account`;

CREATE TABLE `account` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `creator_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `updater_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `created` datetime NOT NULL,
  `created_time_zone` int(11) DEFAULT NULL,
  `updated` datetime NOT NULL,
  `updated_time_zone` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_D48A2F7C61220AA3` (`updater_id`),
  KEY `FK_D48A2F7C61220AA4` (`creator_id`),
  CONSTRAINT `FK_D48A2F7C61220AA3` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_D48A2F7C61220AA4` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `db_default`.`account` (`id`, `name`, `creator_id`, `updater_id`, `created`, `created_time_zone`, `updated`, `updated_time_zone`)
VALUES ('69b07036-c159-11e4-898f-10c37b247796', 'Some Account', '5fbec591-acc8-49fe-a44e-46c59cae99f9', '5fbec591-acc8-49fe-a44e-46c59cae99f9', '2015-03-02 20:10:10', '151', '2015-03-02 20:10:10', '151');

DROP TABLE IF EXISTS `location`;

CREATE TABLE `location` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `creator_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `updater_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `created` datetime NOT NULL,
  `created_time_zone` int(11) DEFAULT NULL,
  `updated` datetime NOT NULL,
  `updated_time_zone` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_D34A04AD61220AA1` (`creator_id`),
  KEY `FK_D34A04AD61220AA2` (`updater_id`),
  CONSTRAINT `FK_D34A04AD61220AA1` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_D34A04AD61220AA2` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
INSERT INTO `db_default`.`location` (`id`, `name`, `address`, `creator_id`, `updater_id`, `created`, `updated`)
VALUES ('05284899-c15a-11e4-898f-10c37b247796', 'Some Address', '1124 sw 145 st miami, fl 33145', '5fbec591-acc8-49fe-a44e-46c59cae99f9', '5fbec591-acc8-49fe-a44e-46c59cae99f9', '2015-03-02 20:20:03', '2015-03-02 20:20:03');

DROP TABLE IF EXISTS `product`;

CREATE TABLE `product` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
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
  `updater_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `creator_id` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL,
  `updated` datetime NOT NULL,
  `updated_time_zone` int(11) DEFAULT NULL,
  `created` datetime NOT NULL,
  `created_time_zone` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_D34A04AD61220EA6` (`creator_id`),
  KEY `IDX_D34A04ADE37ECFB0` (`updater_id`),
  KEY `FK_D34A04AD61220EA7` (`purchase_account_id`),
  KEY `FK_D34A04AD61220EA8` (`sale_account_id`),
  CONSTRAINT `FK_D34A04AD61220EA7` FOREIGN KEY (`purchase_account_id`) REFERENCES `account` (`id`),
  CONSTRAINT `FK_D34A04AD61220EA8` FOREIGN KEY (`sale_account_id`) REFERENCES `account` (`id`),
  CONSTRAINT `FK_D34A04AD61220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_D34A04ADE37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `db_default`.`product` (`id`, `name`, `category`, `purchasable`, `cost`, `purchase_account_id`, `purchase_description`, `salable`, `price`, `sale_account_id`, `sale_description`, `is_taxable`, `updater_id`, `creator_id`, `updated`,`created`)
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

INSERT INTO `db_default`.`product_variation` (`id`, `variation`, `sku`, `serial`, `stock`, `alert_at`, `alert`, `product_id`, `location_id`, `creator_id`, `updater_id`, `created`, `updated`, `updated_time_zone`)
VALUES ('75da7feb-c15f-11e4-898f-10c37b247796', '175/80/15 Radius', '45775', '4578AA', '50', '5', '1', '2fe51519-c15e-11e4-898f-10c37b247796', '05284899-c15a-11e4-898f-10c37b247796', '5fbec591-acc8-49fe-a44e-46c59cae99f9', '5fbec591-acc8-49fe-a44e-46c59cae99f9', '2015-03-02 20:20:03', '2015-03-02 20:20:03', null),
       ('d823ee4a-c15f-11e4-898f-10c37b247796', '155/60/14 Radius', '45775', '4578AA', '40', '10', '0', '2fe51519-c15e-11e4-898f-10c37b247796', '05284899-c15a-11e4-898f-10c37b247796', '5fbec591-acc8-49fe-a44e-46c59cae99f9', '5fbec591-acc8-49fe-a44e-46c59cae99f9', '2015-03-02 20:20:03', '2015-03-02 20:20:03', null);


-- +goose Down
-- SQL section 'Down' is executed when this migration is rolled back


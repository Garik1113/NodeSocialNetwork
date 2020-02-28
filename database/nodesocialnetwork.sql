/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 50523
 Source Host           : localhost:3306
 Source Schema         : nodesocialnetwork

 Target Server Type    : MySQL
 Target Server Version : 50523
 File Encoding         : 65001

 Date: 28/02/2020 10:52:26
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for images
-- ----------------------------
DROP TABLE IF EXISTS `images`;
CREATE TABLE `images`  (
  `image_path` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `user_id` int(11) NOT NULL,
  INDEX `user_id`(`user_id`) USING BTREE,
  CONSTRAINT `images_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of images
-- ----------------------------
INSERT INTO `images` VALUES ('/uploads/regularImages/image-1582627493299.jpg', 6);
INSERT INTO `images` VALUES ('/uploads/regularImages/image-1582822741140.jpg', 7);
INSERT INTO `images` VALUES ('/uploads/regularImages/image-1582822746851.jpg', 7);
INSERT INTO `images` VALUES ('/uploads/regularImages/image-1582822753291.jpg', 7);
INSERT INTO `images` VALUES ('/uploads/regularImages/image-1582822782579.jpg', 7);
INSERT INTO `images` VALUES ('/uploads/regularImages/image-1582823692765.jpg', 7);
INSERT INTO `images` VALUES ('/uploads/regularImages/image-1582828598555.jpg', 3);
INSERT INTO `images` VALUES ('/uploads/regularImages/image-1582828604303.jpg', 3);

-- ----------------------------
-- Table structure for relationships
-- ----------------------------
DROP TABLE IF EXISTS `relationships`;
CREATE TABLE `relationships`  (
  `user_one_id` int(11) NOT NULL,
  `user_two_id` int(11) NOT NULL,
  INDEX `user_one_id`(`user_one_id`) USING BTREE,
  INDEX `user_two_id`(`user_two_id`) USING BTREE,
  CONSTRAINT `relationships_ibfk_1` FOREIGN KEY (`user_one_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `relationships_ibfk_2` FOREIGN KEY (`user_two_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of relationships
-- ----------------------------
INSERT INTO `relationships` VALUES (3, 6);
INSERT INTO `relationships` VALUES (6, 5);

-- ----------------------------
-- Table structure for requests
-- ----------------------------
DROP TABLE IF EXISTS `requests`;
CREATE TABLE `requests`  (
  `user_one_id` int(11) NOT NULL,
  `user_two_id` int(11) NOT NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of requests
-- ----------------------------
INSERT INTO `requests` VALUES (3, 7);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `surname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `age` int(11) NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `profile_image` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '/uploads/images/avatar.png',
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (3, 'Garik', 'Tsaturyan', 'a@mail.ru', 25, 'sha1$27a4cb97$1$57db582c12171b0c013ffa040456e4a3150a5e43', '/uploads/regularImages/image-1582828598555.jpg');
INSERT INTO `users` VALUES (4, 'Armen', 'Hakobyan', 'aa@mail.ru', 26, 'sha1$10fb4712$1$090affffaec0bb39fd223849b9d9abd686fb6ee3', '/uploads/images/avatar.png');
INSERT INTO `users` VALUES (5, 'Karine', 'Antonyan', 'aaa@mail.ru', 35, 'sha1$85da943a$1$81741356c09419ab8cecc742f1b23cd08c63885d', '/uploads/images/profilePhoto-1582829800904.jpg');
INSERT INTO `users` VALUES (6, 'Anna', 'Karapetyan', 'absd@mail.ru', 18, 'sha1$26a4def6$1$1baf0bb1e5be052b4d3e61b0fa4261aa4f898145', '/uploads/regularImages/image-1582627493299.jpg');
INSERT INTO `users` VALUES (7, 'Armine', 'Malxasyan', 'aasdasd@mail.ru', 27, 'sha1$e11bfe81$1$c9ce1e958ce019f8d507685624cfb009f4d3c367', '/uploads/regularImages/image-1582822782579.jpg');

SET FOREIGN_KEY_CHECKS = 1;

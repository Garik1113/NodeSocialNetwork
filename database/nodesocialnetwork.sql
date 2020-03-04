/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50523
Source Host           : localhost:3306
Source Database       : nodesocialnetwork

Target Server Type    : MYSQL
Target Server Version : 50523
File Encoding         : 65001

Date: 2020-03-04 11:15:15
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `comments`
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  `comment` text,
  PRIMARY KEY (`comment_id`) USING BTREE,
  KEY `user_id` (`user_id`) USING BTREE,
  KEY `status_id` (`status_id`) USING BTREE,
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `statuses` (`status_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of comments
-- ----------------------------
INSERT INTO `comments` VALUES ('26', '4', '1', 'Hello Garik This is Armen');
INSERT INTO `comments` VALUES ('27', '4', '1', 'Hello GArik this is Armen');
INSERT INTO `comments` VALUES ('28', '4', '1', 'asdasd');
INSERT INTO `comments` VALUES ('29', '4', '1', 'asdasd');
INSERT INTO `comments` VALUES ('30', '4', '1', 'asdasd');
INSERT INTO `comments` VALUES ('31', '4', '1', 'asda');
INSERT INTO `comments` VALUES ('32', '4', '1', 'asdasdasd');
INSERT INTO `comments` VALUES ('33', '4', '1', 'asadsasd');
INSERT INTO `comments` VALUES ('34', '4', '1', 'asdasd');
INSERT INTO `comments` VALUES ('35', '4', '1', 'asdasd');
INSERT INTO `comments` VALUES ('36', '4', '1', 'asdasd');
INSERT INTO `comments` VALUES ('38', '4', '1', 'asd');
INSERT INTO `comments` VALUES ('39', '4', '1', 'sdaasd');
INSERT INTO `comments` VALUES ('40', '4', '1', 'asdasd asdas mda adasdfasdfasasad adjkalsdf asdfja  ssdfajkasdf sadjf as jasdf asja ssdjasdgjsad  asdjf asdf  jsdf sadjfas  ');
INSERT INTO `comments` VALUES ('41', '4', '1', 'asdas asdajsd asdkjaf saas df');
INSERT INTO `comments` VALUES ('42', '4', '1', 'asdfasdf asdf ');
INSERT INTO `comments` VALUES ('43', '4', '3', 'asdh asdfhjas fasdfhjsadfasdf shdf  ');
INSERT INTO `comments` VALUES ('44', '4', '1', 'as sda sa asdf sadf sd fsafd as ');
INSERT INTO `comments` VALUES ('45', '4', '1', 'asdfasdf');
INSERT INTO `comments` VALUES ('46', '4', '1', 'sdf ');
INSERT INTO `comments` VALUES ('47', '4', '1', 'asdadasd');
INSERT INTO `comments` VALUES ('48', '4', '1', 'asdfafs');
INSERT INTO `comments` VALUES ('49', '4', '3', 'asdfasdf');
INSERT INTO `comments` VALUES ('50', '4', '3', 'asdfasdf');
INSERT INTO `comments` VALUES ('51', '4', '3', 'safsdf');
INSERT INTO `comments` VALUES ('52', '4', '6', 'asdasasd');
INSERT INTO `comments` VALUES ('53', '4', '6', 'asdasd');
INSERT INTO `comments` VALUES ('54', '4', '7', 'asdasdasd');
INSERT INTO `comments` VALUES ('55', '5', '1', 'dgssdfgsdfg');
INSERT INTO `comments` VALUES ('56', '5', '1', 'dfsgsdgf');
INSERT INTO `comments` VALUES ('57', '5', '1', 'sdfg');

-- ----------------------------
-- Table structure for `images`
-- ----------------------------
DROP TABLE IF EXISTS `images`;
CREATE TABLE `images` (
  `image_path` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  KEY `user_id` (`user_id`) USING BTREE,
  CONSTRAINT `images_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of images
-- ----------------------------
INSERT INTO `images` VALUES ('/uploads/regularImages/image-1582627493299.jpg', '6');
INSERT INTO `images` VALUES ('/uploads/regularImages/image-1582822741140.jpg', '7');
INSERT INTO `images` VALUES ('/uploads/regularImages/image-1582822746851.jpg', '7');
INSERT INTO `images` VALUES ('/uploads/regularImages/image-1582822753291.jpg', '7');
INSERT INTO `images` VALUES ('/uploads/regularImages/image-1582828598555.jpg', '3');
INSERT INTO `images` VALUES ('/uploads/regularImages/image-1582828604303.jpg', '3');
INSERT INTO `images` VALUES ('/uploads/regularImages/image-1583230793049.jpg', '4');
INSERT INTO `images` VALUES ('/uploads/regularImages/image-1583230798689.jpg', '4');

-- ----------------------------
-- Table structure for `likes`
-- ----------------------------
DROP TABLE IF EXISTS `likes`;
CREATE TABLE `likes` (
  `like_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  PRIMARY KEY (`like_id`) USING BTREE,
  KEY `user_id` (`user_id`) USING BTREE,
  KEY `status_id` (`status_id`) USING BTREE,
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `statuss` (`status_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of likes
-- ----------------------------

-- ----------------------------
-- Table structure for `messages`
-- ----------------------------
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `message_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_one_id` int(11) DEFAULT NULL,
  `user_two_id` int(11) DEFAULT NULL,
  `message` text NOT NULL,
  PRIMARY KEY (`message_id`),
  KEY `user_one_id` (`user_one_id`),
  KEY `user_two_id` (`user_two_id`),
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`user_two_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`user_one_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of messages
-- ----------------------------

-- ----------------------------
-- Table structure for `relationships`
-- ----------------------------
DROP TABLE IF EXISTS `relationships`;
CREATE TABLE `relationships` (
  `user_one_id` int(11) NOT NULL,
  `user_two_id` int(11) NOT NULL,
  KEY `user_one_id` (`user_one_id`) USING BTREE,
  KEY `user_two_id` (`user_two_id`) USING BTREE,
  CONSTRAINT `relationships_ibfk_1` FOREIGN KEY (`user_one_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `relationships_ibfk_2` FOREIGN KEY (`user_two_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of relationships
-- ----------------------------
INSERT INTO `relationships` VALUES ('3', '5');
INSERT INTO `relationships` VALUES ('3', '4');
INSERT INTO `relationships` VALUES ('3', '6');
INSERT INTO `relationships` VALUES ('5', '6');
INSERT INTO `relationships` VALUES ('5', '4');

-- ----------------------------
-- Table structure for `requests`
-- ----------------------------
DROP TABLE IF EXISTS `requests`;
CREATE TABLE `requests` (
  `user_one_id` int(11) NOT NULL,
  `user_two_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of requests
-- ----------------------------
INSERT INTO `requests` VALUES ('5', '7');
INSERT INTO `requests` VALUES ('4', '7');

-- ----------------------------
-- Table structure for `statuses`
-- ----------------------------
DROP TABLE IF EXISTS `statuses`;
CREATE TABLE `statuses` (
  `status_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `status` text,
  `status_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`status_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `statuses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of statuses
-- ----------------------------
INSERT INTO `statuses` VALUES ('1', '3', 'asdasd', '/uploads/statusImages/statusImage-1583211106149.jpg');
INSERT INTO `statuses` VALUES ('3', '3', 'asdasd', '/uploads/statusImages/statusImage-1583211730074.jpg');
INSERT INTO `statuses` VALUES ('4', '3', 'fdsdf', '/uploads/statusImages/statusImage.png');
INSERT INTO `statuses` VALUES ('5', '4', 'sadasdasd', '/uploads/statusImages/statusImage-1583230778157.jpg');
INSERT INTO `statuses` VALUES ('6', '4', 'Hello this is Armen', '/uploads/statusImages/statusImage.png');
INSERT INTO `statuses` VALUES ('7', '4', 'asdasdasdasd', '/uploads/statusImages/statusImage.png');
INSERT INTO `statuses` VALUES ('8', '4', 'asdasd', '/uploads/statusImages/statusImage.png');
INSERT INTO `statuses` VALUES ('9', '4', 'asdasd', '/uploads/statusImages/statusImage-1583239075269.jpg');
INSERT INTO `statuses` VALUES ('10', '4', '', '/uploads/statusImages/statusImage-1583239228469.jpg');
INSERT INTO `statuses` VALUES ('11', '4', '', '/uploads/statusImages/statusImage-1583239398998.jpg');
INSERT INTO `statuses` VALUES ('12', '4', '', '/uploads/statusImages/statusImage-1583239450694.jpg');
INSERT INTO `statuses` VALUES ('13', '4', '', '/uploads/statusImages/statusImage-1583239481573.jpg');
INSERT INTO `statuses` VALUES ('14', '4', '', '/uploads/statusImages/statusImage-1583239741254.jpg');
INSERT INTO `statuses` VALUES ('15', '4', 'sadasdasdasd', '/uploads/statusImages/statusImage-1583240234430.jpg');
INSERT INTO `statuses` VALUES ('16', '4', 'Hello ', '/uploads/statusImages/statusImage-1583240737692.jpg');

-- ----------------------------
-- Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `age` int(11) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_image` varchar(255) DEFAULT '/uploads/images/avatar.png',
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('3', 'Garik', 'Tsaturyan', 'a@mail.ru', '25', 'sha1$27a4cb97$1$57db582c12171b0c013ffa040456e4a3150a5e43', '/uploads/regularImages/image-1582828598555.jpg');
INSERT INTO `users` VALUES ('4', 'Armen', 'Hakobyan', 'aa@mail.ru', '26', 'sha1$10fb4712$1$090affffaec0bb39fd223849b9d9abd686fb6ee3', '/uploads/images/profilePhoto-1583304948205.jpg');
INSERT INTO `users` VALUES ('5', 'Karine', 'Antonyan', 'aaa@mail.ru', '35', 'sha1$85da943a$1$81741356c09419ab8cecc742f1b23cd08c63885d', '/uploads/images/profilePhoto-1582829800904.jpg');
INSERT INTO `users` VALUES ('6', 'Anna', 'Karapetyan', 'absd@mail.ru', '18', 'sha1$26a4def6$1$1baf0bb1e5be052b4d3e61b0fa4261aa4f898145', '/uploads/regularImages/image-1582627493299.jpg');
INSERT INTO `users` VALUES ('7', 'Armine', 'Malxasyan', 'aasdasd@mail.ru', '27', 'sha1$e11bfe81$1$c9ce1e958ce019f8d507685624cfb009f4d3c367', '/uploads/images/avatar.png');

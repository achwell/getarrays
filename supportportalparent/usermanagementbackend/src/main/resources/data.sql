INSERT INTO role VALUES (1, 'ROLE_USER');
INSERT INTO role VALUES (2, 'ROLE_MANAGER_AUTHORITIES');
INSERT INTO role VALUES (3, 'ROLE_ADMIN_AUTHORITIES');
INSERT INTO role VALUES (4, 'ROLE_SUPER_ADMIN_AUTHORITIES');
INSERT INTO privilege VALUES (1, 'user:read');
INSERT INTO privilege VALUES (2, 'user:update');
INSERT INTO privilege VALUES (3, 'user:create');
INSERT INTO privilege VALUES (4, 'user:delete');
INSERT INTO roles_privileges VALUES (1, 1);
INSERT INTO roles_privileges VALUES (2, 1);
INSERT INTO roles_privileges VALUES (2, 2);
INSERT INTO roles_privileges VALUES (3, 1);
INSERT INTO roles_privileges VALUES (3, 2);
INSERT INTO roles_privileges VALUES (3, 3);
INSERT INTO roles_privileges VALUES (4, 1);
INSERT INTO roles_privileges VALUES (4, 2);
INSERT INTO roles_privileges VALUES (4, 3);
INSERT INTO roles_privileges VALUES (4, 4);
INSERT INTO user VALUES (1, 'axelwulff@mac.com', 'Axel', 1, 1, '2021-03-30', NULL, NULL, 'Sæther', 'Wulff', '$2a$10$Ur5Hch5tPtFPSo2UfMbSyu0SsE7zOCUThKFSloaCAbUuIGOrEMjFy', '2549773849', 'axelwulff');
INSERT INTO users_roles (user_id, role_id) VALUES (1, 4);

INSERT INTO role (id, name) VALUES (1, 'ROLE_USER');
INSERT INTO role (id, name) VALUES (2, 'ROLE_MANAGER_AUTHORITIES');
INSERT INTO role (id, name) VALUES (3, 'ROLE_ADMIN_AUTHORITIES');
INSERT INTO role (id, name) VALUES (4, 'ROLE_SUPER_ADMIN_AUTHORITIES');
INSERT INTO privilege (id, name) VALUES (1, 'user:read');
INSERT INTO privilege (id, name) VALUES (2, 'user:update');
INSERT INTO privilege (id, name) VALUES (3, 'user:create');
INSERT INTO privilege (id, name) VALUES (4, 'user:delete');
INSERT INTO privilege (id, name) VALUES (5, 'user:seelogintime');
INSERT INTO privilege (id, name) VALUES (6, 'system:status');
INSERT INTO roles_privileges (role_id, privilege_id) VALUES (1, 1);
INSERT INTO roles_privileges (role_id, privilege_id) VALUES (2, 1);
INSERT INTO roles_privileges (role_id, privilege_id) VALUES (2, 2);
INSERT INTO roles_privileges (role_id, privilege_id) VALUES (3, 1);
INSERT INTO roles_privileges (role_id, privilege_id) VALUES (3, 2);
INSERT INTO roles_privileges (role_id, privilege_id) VALUES (3, 3);
INSERT INTO roles_privileges (role_id, privilege_id) VALUES (3, 5);
INSERT INTO roles_privileges (role_id, privilege_id) VALUES (3, 6);
INSERT INTO roles_privileges (role_id, privilege_id) VALUES (4, 1);
INSERT INTO roles_privileges (role_id, privilege_id) VALUES (4, 2);
INSERT INTO roles_privileges (role_id, privilege_id) VALUES (4, 3);
INSERT INTO roles_privileges (role_id, privilege_id) VALUES (4, 4);
INSERT INTO roles_privileges (role_id, privilege_id) VALUES (4, 5);
INSERT INTO roles_privileges (role_id, privilege_id) VALUES (4, 6);
INSERT INTO user VALUES (1, 'user@system.com', 'User', 1, 1, '2021-03-30', NULL, NULL, 'USER', 'With Role', '$2a$10$AMvbVVSFwFQdXsAjwbqZkOALmiI4dch0qiELccBkaii5gFkG2VDO2', 'roleuser', 1, '11111111');
INSERT INTO user VALUES (2, 'managerauthorities@system.com', 'User', 1, 1, '2021-04-11', NULL, NULL, 'MANAGER_AUTHORITIES', 'With Role', '$2a$10$AMvbVVSFwFQdXsAjwbqZkOALmiI4dch0qiELccBkaii5gFkG2VDO2', 'managerauthorities', 2, '11111111');
INSERT INTO user VALUES (3, 'adminauthorities@system.com', 'User', 1, 1, '2021-04-12', NULL, NULL, 'ADMIN_AUTHORITIES', 'With Role', '$2a$10$AMvbVVSFwFQdXsAjwbqZkOALmiI4dch0qiELccBkaii5gFkG2VDO2', 'adminauthorities', 3, '11111111');
INSERT INTO user VALUES (4, 'superadminauthorities@system.com', 'User', 1, 1, '2021-04-12', NULL, NULL, 'SUPER_ADMIN_AUTHORITIES', 'With Role', '$2a$10$AMvbVVSFwFQdXsAjwbqZkOALmiI4dch0qiELccBkaii5gFkG2VDO2', 'superadminauthorities', 4, '11111111');
INSERT INTO user VALUES (5, 'inactiveuser@system.com', 'Inactive', 0, 1, '2021-04-12', NULL, NULL, 'User', NULL, '$2a$10$AMvbVVSFwFQdXsAjwbqZkOALmiI4dch0qiELccBkaii5gFkG2VDO2', 'inactiveuser', 1, '11111111');
INSERT INTO user VALUES (6, 'lockeduser@system.com', 'Locked', 1, 0, '2021-04-10', NULL, NULL, 'User', NULL, '$2a$10$AMvbVVSFwFQdXsAjwbqZkOALmiI4dch0qiELccBkaii5gFkG2VDO2', 'lockeduser', 1, '11111111');
INSERT INTO user_seq VALUES (7);
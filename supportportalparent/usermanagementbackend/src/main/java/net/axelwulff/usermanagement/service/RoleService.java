package net.axelwulff.usermanagement.service;

import net.axelwulff.usermanagement.domain.Role;

import java.util.List;

public interface RoleService {
    Role findByName(String rolename);

    List<Role> getRoles();
}

package net.axelwulff.usermanagement.service.impl;

import net.axelwulff.usermanagement.domain.Role;
import net.axelwulff.usermanagement.repository.RoleRepository;
import net.axelwulff.usermanagement.service.RoleService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public Role findByName(String rolename) {
        return roleRepository.findByName(rolename);
    }

    @Override
    public List<Role> getRoles() {
        return roleRepository.findAll();
    }
}

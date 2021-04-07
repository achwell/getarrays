package net.axelwulff.usermanagement.resource;

import net.axelwulff.usermanagement.domain.Role;
import net.axelwulff.usermanagement.service.RoleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping(path = {"/role"})
public class RoleResource {

    private final RoleService roleService;

    public RoleResource(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> roles = roleService.getRoles();
        return new ResponseEntity<>(roles, OK);
    }

    @GetMapping("/{name}")
    public ResponseEntity<Role> getRole(@PathVariable("name") String name) {
        Role role = roleService.findByName(name);
        return new ResponseEntity<>(role, OK);
    }
}

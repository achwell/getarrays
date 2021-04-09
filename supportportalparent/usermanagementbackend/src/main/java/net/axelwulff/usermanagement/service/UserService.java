package net.axelwulff.usermanagement.service;

import net.axelwulff.usermanagement.domain.User;
import net.axelwulff.usermanagement.exception.*;

import java.util.List;

public interface UserService {

    User register(String firstName, String middleName, String lastName, String username, String email) throws UserNotFoundException, UsernameExistException, EmailExistException;

    List<User> getUsers();

    User findUserByUsername(String username);

    User findUserByEmail(String email);

    User addNewUser(String firstName, String middleName, String lastName, String username, String email, String phone, Long roleId, boolean isNonLocked, boolean isActive) throws UserNotFoundException, UsernameExistException, EmailExistException, RoleNotFoundException;

    User updateUser(String currentUsername, String newFirstName, String newMiddleName, String newLastName, String newUsername, String newEmail, String newPhone, Long roleId, boolean isNonLocked, boolean isActive) throws UserNotFoundException, UsernameExistException, EmailExistException, RoleNotFoundException;

    void deleteUser(String username);

    void resetPassword(String email) throws EmailNotFoundException;
}

package net.axelwulff.usermanagement.service;

import net.axelwulff.usermanagement.domain.User;
import net.axelwulff.usermanagement.exception.EmailExistException;
import net.axelwulff.usermanagement.exception.EmailNotFoundException;
import net.axelwulff.usermanagement.exception.UserNotFoundException;
import net.axelwulff.usermanagement.exception.UsernameExistException;

import java.util.Collection;
import java.util.List;

public interface UserService {

    User register(String firstName, String middleName, String lastName, String username, String email) throws UserNotFoundException, UsernameExistException, EmailExistException;

    List<User> getUsers();

    User findUserByUsername(String username);

    User findUserByEmail(String email);

    User addNewUser(String firstName, String middleName, String lastName, String username, String email, String role, boolean isNonLocked, boolean isActive) throws UserNotFoundException, UsernameExistException, EmailExistException;

    User updateUser(String currentUsername, String newFirstName, String newMiddleName, String newLastName, String newUsername, String newEmail, Collection<String> roles, boolean isNonLocked, boolean isActive) throws UserNotFoundException, UsernameExistException, EmailExistException;

    void deleteUser(String username);

    void resetPassword(String email) throws EmailNotFoundException;
}

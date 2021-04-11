package net.axelwulff.usermanagement.service;

import net.axelwulff.usermanagement.domain.User;
import net.axelwulff.usermanagement.exception.*;

import java.util.List;

public interface UserService {

    User register(String firstName, String middleName, String lastName, String username, String email, String phone) throws UserNotFoundException, UsernameExistException, EmailExistException;

    List<User> getUsers();

    User findUserByUsername(String username);

    User findUserByEmail(String email);

    User addNewUser(User user) throws UserNotFoundException, EmailExistException, UsernameExistException;

    User updateUser(String currentUsername, User user) throws UserNotFoundException, UsernameExistException, EmailExistException;

    void deleteUser(String username);

    void resetPassword(String email) throws EmailNotFoundException;
}

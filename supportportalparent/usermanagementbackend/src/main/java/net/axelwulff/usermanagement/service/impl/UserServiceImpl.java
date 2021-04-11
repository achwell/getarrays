package net.axelwulff.usermanagement.service.impl;

import net.axelwulff.usermanagement.domain.Role;
import net.axelwulff.usermanagement.domain.User;
import net.axelwulff.usermanagement.domain.UserPrincipal;
import net.axelwulff.usermanagement.exception.EmailExistException;
import net.axelwulff.usermanagement.exception.EmailNotFoundException;
import net.axelwulff.usermanagement.exception.UserNotFoundException;
import net.axelwulff.usermanagement.exception.UsernameExistException;
import net.axelwulff.usermanagement.repository.RoleRepository;
import net.axelwulff.usermanagement.repository.UserRepository;
import net.axelwulff.usermanagement.service.EmailService;
import net.axelwulff.usermanagement.service.LoginAttemptService;
import net.axelwulff.usermanagement.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

import static java.time.LocalDateTime.now;
import static net.axelwulff.usermanagement.constant.UserImplConstant.*;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

@Service
@Transactional
public class UserServiceImpl implements UserService, UserDetailsService {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final LoginAttemptService loginAttemptService;
    private final EmailService emailService;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, LoginAttemptService loginAttemptService, EmailService emailService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.loginAttemptService = loginAttemptService;
        this.emailService = emailService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findUserByUsername(username);
        if (user == null) {
            LOGGER.error(NO_USER_FOUND_BY_USERNAME + username);
            throw new UsernameNotFoundException(NO_USER_FOUND_BY_USERNAME + username);
        } else {
            validateLoginAttempt(user);
            user.setLastLoginDateDisplay(user.getLastLoginDate());
            user.setLastLoginDate(now());
            userRepository.save(user);
            UserDetails userPrincipal = new UserPrincipal(user);
            LOGGER.info(FOUND_USER_BY_USERNAME + username);
            return userPrincipal;
        }
    }

    @Override
    public User register(String firstName, String middleName, String lastName, String username, String email, String phone) throws UserNotFoundException, UsernameExistException, EmailExistException {
        validateUsernameAndEmail(EMPTY, username, email);
        User user = new User();
        String password = generatePassword();
        user.setFirstName(firstName);
        user.setMiddleName(middleName);
        user.setLastName(lastName);
        user.setUsername(username);
        user.setEmail(email);
        user.setPhone(phone);
        user.setJoinDate(LocalDate.now());
        user.setPassword(encodePassword(password));
        user.setActive(false);
        user.setNotLocked(true);
        Role role = roleRepository.findByName("ROLE_USER");
        user.setRole(role);
        userRepository.save(user);
        LOGGER.info("New user password: " + password);
        emailService.sendNewPasswordEmail(firstName, password, email);
        return user;
    }

    @Override
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Override
    public User findUserByUsername(String username) {
        return userRepository.findUserByUsername(username);
    }

    @Override
    public User findUserByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }

    @Override
    public User addNewUser(User user) throws UserNotFoundException, EmailExistException, UsernameExistException {
        validateUsernameAndEmail(EMPTY, user.getUsername(), user.getEmail());
        String password = generatePassword();
        user.setPassword(encodePassword(password));
        user.setJoinDate(LocalDate.now());
        userRepository.save(user);
        emailService.sendNewPasswordEmail(user.getFirstName(), password, user.getEmail());
        LOGGER.info("New user password: " + password);
        return user;
    }

    @Override
    public User updateUser(String currentUsername, User user) throws UsernameExistException, EmailExistException, UserNotFoundException {
        if (user == null) {
            return null;
        }
        validateUsernameAndEmail(currentUsername, user.getUsername(), user.getEmail());
        userRepository.save(user);
        return user;
    }

    @Override
    public void deleteUser(String username) {
        User user = userRepository.findUserByUsername(username);
        if(user != null) {
            userRepository.deleteById(user.getId());
        }
    }

    @Override
    public void resetPassword(String email) throws EmailNotFoundException {
        User user = userRepository.findUserByEmail(email);
        if (user == null) {
            throw new EmailNotFoundException(NO_USER_FOUND_BY_EMAIL + email);
        }
        String password = generatePassword();
        user.setPassword(encodePassword(password));
        userRepository.save(user);
        LOGGER.info("New user password: " + password);
        emailService.sendNewPasswordEmail(user.getFirstName(), password, user.getEmail());
    }

    private String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    private String generatePassword() {
        return randomAlphanumeric(10);
    }

    private void validateLoginAttempt(User user) {
        String username = user.getUsername();
        if (user.isNotLocked()) {
            user.setNotLocked(!loginAttemptService.hasExceededMaxAttempts(username));
        } else {
            loginAttemptService.evictUserFromLoginAttemptCache(username);
        }
    }

    private void validateUsernameAndEmail(String currentUsername, String newUsername, String newEmail) throws UserNotFoundException, UsernameExistException, EmailExistException {
        User userByNewUsername = findUserByUsername(newUsername);
        User userByNewEmail = findUserByEmail(newEmail);
        if (isNotBlank(currentUsername)) {
            User currentUser = findUserByUsername(currentUsername);
            if (currentUser == null) {
                throw new UserNotFoundException(NO_USER_FOUND_BY_USERNAME + currentUsername);
            }
            if (userByNewUsername != null && !Objects.equals(currentUser.getId(), userByNewUsername.getId())) {
                throw new UsernameExistException(USERNAME_ALREADY_EXISTS);
            }
            if (userByNewEmail != null && !Objects.equals(currentUser.getId(), userByNewEmail.getId())) {
                throw new EmailExistException(EMAIL_ALREADY_EXISTS);
            }
        } else {
            if (userByNewUsername != null) {
                throw new UsernameExistException(USERNAME_ALREADY_EXISTS);
            }
            if (userByNewEmail != null) {
                throw new EmailExistException(EMAIL_ALREADY_EXISTS);
            }
        }
    }
}

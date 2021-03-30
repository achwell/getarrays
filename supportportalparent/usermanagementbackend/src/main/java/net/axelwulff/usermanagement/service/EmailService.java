package net.axelwulff.usermanagement.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailService.class);

    public void sendNewPasswordEmail(String firstName, String password, String email) {
        String cmd = String.format("sh echo \"Hello %s, Your new account password is: %s\"| mail -s \"axelwulff.net - New Password\" %s", firstName, password, email);
        LOGGER.debug("Mail command: " + cmd);
        try {
            Runtime.getRuntime().exec(cmd);
        } catch (Exception e) {
            LOGGER.error("Error sending mail", e);
        }
    }

}

package net.axelwulff.usermanagement;

import net.axelwulff.usermanagement.configuration.AppProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import static java.util.Arrays.asList;
import static org.springframework.http.HttpHeaders.*;

@SpringBootApplication
public class UserManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserManagementApplication.class, args);
    }

    @Bean
    public PasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Autowired
    private AppProperties appProperties;

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setAllowedOrigins(appProperties.getCorsallowedorigins());
        corsConfiguration.setAllowedHeaders(asList(ORIGIN, ACCESS_CONTROL_ALLOW_ORIGIN, CONTENT_TYPE,
                ACCEPT, "Jwt-Token", AUTHORIZATION, "Origin, Accept", "X-Requested-With",
                ACCESS_CONTROL_REQUEST_METHOD, ACCESS_CONTROL_REQUEST_HEADERS));
        corsConfiguration.setExposedHeaders(asList(ORIGIN, CONTENT_TYPE, ACCEPT, "Jwt-Token", AUTHORIZATION,
                ACCESS_CONTROL_ALLOW_ORIGIN, ACCESS_CONTROL_ALLOW_CREDENTIALS));
        corsConfiguration.setAllowedMethods(asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
        return new CorsFilter(urlBasedCorsConfigurationSource);
    }
}

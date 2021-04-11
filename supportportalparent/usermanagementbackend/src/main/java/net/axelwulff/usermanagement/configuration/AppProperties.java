package net.axelwulff.usermanagement.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties(prefix="app")
public class AppProperties {

    private List<String> corsallowedorigins;

    public List<String> getCorsallowedorigins() {
        return corsallowedorigins;
    }

    public void setCorsallowedorigins(List<String> corsallowedorigins) {
        this.corsallowedorigins = corsallowedorigins;
    }
}

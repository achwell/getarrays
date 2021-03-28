package net.axelwulff.employeemanager.monitoring;

import org.springframework.boot.actuate.trace.http.HttpTraceRepository;
import org.springframework.boot.actuate.trace.http.InMemoryHttpTraceRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HttpTraceActuatorConfiguration {

    @Bean
    public HttpTraceRepository httpTraceRepository() {
        InMemoryHttpTraceRepository traceRepository = new InMemoryHttpTraceRepository();
        traceRepository.setCapacity(Integer.MAX_VALUE);
        return traceRepository;
    }
}

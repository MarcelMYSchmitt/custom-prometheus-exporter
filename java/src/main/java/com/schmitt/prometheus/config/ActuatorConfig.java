package com.schmitt.prometheus.config;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import com.schmitt.prometheus.meterbinder.CustomExporterStatsProbe;

@Component
public class ActuatorConfig {

    @Bean
    public CustomExporterStatsProbe dataSourceStatusProbe() {
        return new CustomExporterStatsProbe();
    }
}
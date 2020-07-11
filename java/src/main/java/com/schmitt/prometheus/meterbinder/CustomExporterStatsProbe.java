package com.schmitt.prometheus.meterbinder;

import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Component;

import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.binder.MeterBinder;

@Component
public class CustomExporterStatsProbe implements MeterBinder{
    
    private final AtomicLong endpointAvailability = new AtomicLong();

    @Override
    public void bindTo(MeterRegistry registry) {
        Gauge.builder("ENDPOINT_AVAILABILITY", this, value -> endpointAvailability.get())
                .description("Shows Availability of Endpoint.")
                .baseUnit("up")
                .register(registry);
    }
    
    public void setEndpointAvailability(int value) {
        this.endpointAvailability.set(value);
    }
    
    public long getEndpointAvailability() {
    	return this.endpointAvailability.get();
    }
}

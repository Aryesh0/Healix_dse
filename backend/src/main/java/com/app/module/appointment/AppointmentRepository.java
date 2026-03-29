package com.app.module.appointment;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;

public interface AppointmentRepository extends MongoRepository<Appointment, String> {
    long countByScheduledAtBetween(LocalDateTime start, LocalDateTime end);
}

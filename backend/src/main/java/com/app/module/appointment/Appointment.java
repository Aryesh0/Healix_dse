package com.app.module.appointment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "appointments")
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class Appointment {
    @Id
    private String id;
    private String appointmentId;
    private String patientId;
    private String doctorId;
    private LocalDateTime scheduledAt;
    private String status; // SCHEDULED, COMPLETED, CANCELLED
}

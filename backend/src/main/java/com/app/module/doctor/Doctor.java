package com.app.module.doctor;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

/** MongoDB document for a hospital doctor. */
@Document(collection = "doctors")
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class Doctor {

    @Id
    private String id;

    @Indexed(unique = true)
    private String doctorCode;     // e.g. DOC-0001

    private String fullName;
    private String email;
    private String phone;
    private String specialization; // e.g. Cardiology, Neurology
    private String department;     // for Tree hierarchy: Cardiology → Sub-specialties

    /**
     * Available time slots stored as strings for simplicity.
     * Format: "MONDAY 09:00-13:00"
     *
     * DSA: These are sorted so binary search can find available slots in O(log n).
     */
    private List<String> availableSlots;

    /** Linked system user account. */
    private String linkedUserId;

    private LocalDateTime registeredAt;
}

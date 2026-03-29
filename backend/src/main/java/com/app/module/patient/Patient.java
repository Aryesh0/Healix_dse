package com.app.module.patient;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/** MongoDB document for a hospital patient. */
@Document(collection = "patients")
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class Patient {

    @Id
    private String id;

    @Indexed(unique = true)
    private String patientCode;     // e.g. PAT-0001 – auto-generated

    private String fullName;
    private String email;
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;          // MALE | FEMALE | OTHER
    private String bloodGroup;
    private String address;

    /** Linked user account (the patient's login credentials). */
    private String linkedUserId;

    /** Simple list of diagnoses / notes – stored in Mongo as array. */
    private List<String> medicalHistory;

    private LocalDateTime registeredAt;
}

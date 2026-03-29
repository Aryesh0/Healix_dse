package com.app.module.user;

import com.app.common.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * MongoDB document representing a system user.
 * Every person who logs in (admin, doctor, receptionist, patient) has a User record.
 *
 * NOTE: passwordHash stores BCrypt-hashed password – NEVER the plain password.
 */
@Document(collection = "users")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;          // used for login

    @Indexed(unique = true)
    private String email;

    private String passwordHash;

    private Role role;                // ADMIN | DOCTOR | RECEPTIONIST | PATIENT

    /** For DOCTOR role – references the doctors collection. */
    private String linkedDoctorId;

    /** For PATIENT role – references the patients collection. */
    private String linkedPatientId;

    private LocalDateTime createdAt;
}

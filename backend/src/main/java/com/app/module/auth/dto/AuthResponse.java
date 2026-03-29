package com.app.module.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/** Response returned after successful login or registration. */
@Data
@AllArgsConstructor
public class AuthResponse {

    private String token;       // JWT – frontend stores this in localStorage
    private String username;
    private String role;
    private String linkedId;    // doctorId or patientId for quick profile lookup
}

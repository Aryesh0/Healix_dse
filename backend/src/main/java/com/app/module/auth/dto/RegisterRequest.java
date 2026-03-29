package com.app.module.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request body for POST /api/auth/register.
 *
 * role must be: "patient" or "doctor"
 * Admins and receptionists are created by existing admins only (not via this endpoint).
 */
@Data
public class RegisterRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 30, message = "Username must be 3-30 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Role is required")
    private String role;   // "patient" | "doctor" | "admin" (admin restricted in service)

    // Doctor-specific fields
    private String specialization;
    private String phone;

    // Patient-specific fields
    private String fullName;
    private String dateOfBirth;   // ISO format: yyyy-MM-dd
    private String gender;
    private String bloodGroup;
    private String address;
}

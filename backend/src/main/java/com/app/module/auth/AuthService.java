package com.app.module.auth;

import com.app.common.Role;
import com.app.common.exception.DuplicateResourceException;
import com.app.module.auth.dto.AuthResponse;
import com.app.module.auth.dto.LoginRequest;
import com.app.module.auth.dto.RegisterRequest;
import com.app.module.doctor.Doctor;
import com.app.module.doctor.DoctorRepository;
import com.app.module.patient.Patient;
import com.app.module.patient.PatientRepository;
import com.app.module.user.User;
import com.app.module.user.UserRepository;
import com.app.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username is already taken.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email is already in use.");
        }

        Role roleEnum;
        try {
            roleEnum = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role specified.");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(roleEnum)
                .createdAt(LocalDateTime.now())
                .build();

        user = userRepository.save(user);

        String linkedId = null;

        if (roleEnum == Role.PATIENT) {
            LocalDate dob = null;
            if (request.getDateOfBirth() != null && !request.getDateOfBirth().isEmpty()) {
                try {
                    dob = LocalDate.parse(request.getDateOfBirth());
                } catch (DateTimeParseException ignored) {}
            }
            
            String randomPatientCode = "PAT-" + (System.currentTimeMillis() % 100000);
            Patient patient = Patient.builder()
                    .patientCode(randomPatientCode)
                    .fullName(request.getFullName())
                    .email(request.getEmail())
                    .phone(request.getPhone())
                    .dateOfBirth(dob)
                    .gender(request.getGender())
                    .bloodGroup(request.getBloodGroup())
                    .address(request.getAddress())
                    .linkedUserId(user.getId())
                    .medicalHistory(new ArrayList<>())
                    .registeredAt(LocalDateTime.now())
                    .build();
            patient = patientRepository.save(patient);
            user.setLinkedPatientId(patient.getId());
            linkedId = patient.getId();
        } else if (roleEnum == Role.DOCTOR) {
            String randomDoctorCode = "DOC-" + (System.currentTimeMillis() % 100000);
            Doctor doctor = Doctor.builder()
                    .doctorCode(randomDoctorCode)
                    .fullName(request.getFullName() != null && !request.getFullName().isEmpty() ? request.getFullName() : request.getUsername())
                    .email(request.getEmail())
                    .phone(request.getPhone())
                    .specialization(request.getSpecialization())
                    .availableSlots(new ArrayList<>())
                    .linkedUserId(user.getId())
                    .registeredAt(LocalDateTime.now())
                    .build();
            doctor = doctorRepository.save(doctor);
            user.setLinkedDoctorId(doctor.getId());
            linkedId = doctor.getId();
        }

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, user.getUsername(), user.getRole().name(), linkedId);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found after successful auth"));

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        String linkedId = user.getRole() == Role.PATIENT ? user.getLinkedPatientId() :
                          (user.getRole() == Role.DOCTOR ? user.getLinkedDoctorId() : null);

        return new AuthResponse(token, user.getUsername(), user.getRole().name(), linkedId);
    }
}

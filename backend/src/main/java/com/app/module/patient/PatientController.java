package com.app.module.patient;

import com.app.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR')")
    public ResponseEntity<ApiResponse<List<Patient>>> getAllPatients() {
        return ResponseEntity.ok(ApiResponse.success("Patients fetched", patientService.getAllPatients()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR')")
    public ResponseEntity<ApiResponse<Patient>> getPatientById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Patient details", patientService.getPatientById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<ApiResponse<Patient>> createPatient(@RequestBody Patient patient) {
        // Note: For a complete system, Admin creation of patient should also create a User credential.
        return ResponseEntity.ok(ApiResponse.success("Patient created", patientService.createPatient(patient)));
    }
}

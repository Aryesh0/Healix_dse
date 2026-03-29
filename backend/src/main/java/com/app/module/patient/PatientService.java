package com.app.module.patient;

import com.app.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    // We would inject AuthService to create the User for admin-created patients,
    // but to avoid circular dependencies, we can inject UserRepository or just do basic saving here.

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient getPatientById(String id) {
        // DSA Concept: O(1) conceptually. MongoDB findById uses the _id index.
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + id));
    }

    public Patient createPatient(Patient patient) {
        patient.setPatientCode("PAT-" + (System.currentTimeMillis() % 100000));
        patient.setRegisteredAt(LocalDateTime.now());
        return patientRepository.save(patient);
    }
}

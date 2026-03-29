package com.app.module.patient;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PatientRepository extends MongoRepository<Patient, String> {
    Optional<Patient> findByPatientCode(String patientCode);
    Optional<Patient> findByLinkedUserId(String userId);
    Optional<Patient> findByEmail(String email);
    boolean existsByEmail(String email);
    long countBy();
}

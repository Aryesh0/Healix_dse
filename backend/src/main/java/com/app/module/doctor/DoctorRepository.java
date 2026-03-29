package com.app.module.doctor;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends MongoRepository<Doctor, String> {
    Optional<Doctor> findByDoctorCode(String doctorCode);
    Optional<Doctor> findByLinkedUserId(String userId);
    List<Doctor> findBySpecialization(String specialization);
    List<Doctor> findByDepartment(String department);
    boolean existsByEmail(String email);
    long countBy();
}

package com.app.module.ward;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface BedRepository extends MongoRepository<Bed, String> {
    long countByStatus(String status);
}

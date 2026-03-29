package com.app.module.billing;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface BillRepository extends MongoRepository<Bill, String> {
    long countByPaymentStatus(String paymentStatus);
}

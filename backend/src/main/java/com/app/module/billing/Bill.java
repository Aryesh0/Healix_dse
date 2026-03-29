package com.app.module.billing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "bills")
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class Bill {
    @Id
    private String id;
    private String billId;
    private String patientId;
    private Double totalAmount;
    private String paymentStatus; // PENDING, PAID, PARTIAL
    private LocalDateTime createdAt;
}

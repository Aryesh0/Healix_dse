package com.app.module.ward;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "beds")
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class Bed {
    @Id
    private String id;
    private String bedNumber;
    private String status; // AVAILABLE, OCCUPIED, MAINTENANCE
    private String wardId;
}

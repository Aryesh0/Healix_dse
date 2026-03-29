package com.app.module.queue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data @Builder @AllArgsConstructor
public class QueueItem {
    private String id;
    private String patient;
    private String doc;
    private String waitTime;
    private boolean emergency;
    private String priority; // HIGH, MEDIUM (for Priority queue)
}

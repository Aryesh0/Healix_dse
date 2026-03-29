package com.app.module.queue;

import com.app.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/queue")
@RequiredArgsConstructor
public class QueueController {

    private final QueueService queueService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, List<QueueItem>>>> getQueues() {
        return ResponseEntity.ok(ApiResponse.success("Queues fetched", queueService.getQueues()));
    }

    @PostMapping("/bump/{id}")
    public ResponseEntity<ApiResponse<QueueItem>> bumpToPriority(@PathVariable String id) {
        QueueItem item = queueService.bumpToPriority(id);
        if (item == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Item not found in standard queue"));
        }
        return ResponseEntity.ok(ApiResponse.success("Patient bumped to Priority Queue", item));
    }

    @PostMapping("/serve/standard")
    public ResponseEntity<ApiResponse<Void>> serveNextStandard() {
        queueService.serveNextStandard();
        return ResponseEntity.ok(ApiResponse.success("Next patient served from standard queue"));
    }

    @PostMapping("/serve/priority")
    public ResponseEntity<ApiResponse<Void>> serveNextPriority() {
        queueService.serveNextPriority();
        return ResponseEntity.ok(ApiResponse.success("Next patient served from priority queue"));
    }
}

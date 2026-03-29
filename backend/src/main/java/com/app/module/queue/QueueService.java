package com.app.module.queue;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class QueueService {

    // Demonstrating DSA Concepts purely in-memory as requested for Queue management
    private final LinkedList<QueueItem> standardQueue = new LinkedList<>();
    private final PriorityQueue<QueueItem> priorityQueue = new PriorityQueue<>((a, b) -> {
        // HIGH priority comes first (Highest priority is actually string comparison but let's do custom logic)
        if ("HIGH".equals(a.getPriority()) && !"HIGH".equals(b.getPriority())) return -1;
        if (!"HIGH".equals(a.getPriority()) && "HIGH".equals(b.getPriority())) return 1;
        return 0;
    });

    public QueueService() {
        // Seed some initial demo data
        standardQueue.add(new QueueItem("Q-04", "Emily Davis", "Dr. Smith", "15 mins", false, "LOW"));
        standardQueue.add(new QueueItem("Q-05", "David Wilson", "Dr. Smith", "5 mins", false, "LOW"));

        priorityQueue.add(new QueueItem("Q-01", "Critical Patient A", "ICU", "2 mins", true, "HIGH"));
        priorityQueue.add(new QueueItem("Q-02", "Serious Patient B", "Emergency", "8 mins", true, "MEDIUM"));
    }

    public Map<String, List<QueueItem>> getQueues() {
        Map<String, List<QueueItem>> response = new HashMap<>();
        // PriorityQueue order isn't fully sorted when iterating, so we'd poll or sort it for display. 
        // We'll sort returning a list here just for UI deterministic render.
        List<QueueItem> pQueueList = new ArrayList<>(priorityQueue);
        pQueueList.sort((a, b) -> {
            if ("HIGH".equals(a.getPriority()) && !"HIGH".equals(b.getPriority())) return -1;
            if (!"HIGH".equals(a.getPriority()) && "HIGH".equals(b.getPriority())) return 1;
            return 0;
        });

        response.put("standard", new ArrayList<>(standardQueue));
        response.put("priority", pQueueList);
        return response;
    }

    public void serveNextStandard() {
        if (!standardQueue.isEmpty()) standardQueue.pollFirst();
    }

    public void serveNextPriority() {
        if (!priorityQueue.isEmpty()) priorityQueue.poll();
    }

    public QueueItem bumpToPriority(String id) {
        // DSA: Remove from Linked List, Insert into Priority Heap
        QueueItem itemToBump = null;
        for (QueueItem item : standardQueue) {
            if (item.getId().equals(id)) {
                itemToBump = item;
                break;
            }
        }
        if (itemToBump != null) {
            standardQueue.remove(itemToBump);
            itemToBump.setEmergency(true);
            itemToBump.setPriority("MEDIUM");
            priorityQueue.offer(itemToBump);
            return itemToBump;
        }
        return null;
    }
}

package com.app.controller;

import com.app.model.Item;
import com.app.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    // GET all items (optionally filter by category or search by name)
    @GetMapping
    public ResponseEntity<List<Item>> getItems(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {

        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(itemService.getItemsByCategory(category));
        }
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(itemService.searchItems(search));
        }
        return ResponseEntity.ok(itemService.getAllItems());
    }

    // GET item by ID
    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable String id) {
        return itemService.getItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create new item
    @PostMapping
    public ResponseEntity<Item> createItem(@RequestBody Item item) {
        Item created = itemService.createItem(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // PUT update item
    @PutMapping("/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable String id, @RequestBody Item item) {
        return itemService.updateItem(id, item)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE item
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteItem(@PathVariable String id) {
        if (itemService.deleteItem(id)) {
            return ResponseEntity.ok(Map.of("message", "Item deleted successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Item not found"));
    }

    // Health check
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "Item API"));
    }
}

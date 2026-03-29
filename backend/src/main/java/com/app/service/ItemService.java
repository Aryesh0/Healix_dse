package com.app.service;

import com.app.model.Item;
import com.app.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Optional<Item> getItemById(String id) {
        return itemRepository.findById(id);
    }

    public List<Item> getItemsByCategory(String category) {
        return itemRepository.findByCategory(category);
    }

    public List<Item> searchItems(String name) {
        return itemRepository.findByNameContainingIgnoreCase(name);
    }

    public Item createItem(Item item) {
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());
        return itemRepository.save(item);
    }

    public Optional<Item> updateItem(String id, Item updatedItem) {
        return itemRepository.findById(id).map(existing -> {
            existing.setName(updatedItem.getName());
            existing.setDescription(updatedItem.getDescription());
            existing.setCategory(updatedItem.getCategory());
            existing.setPrice(updatedItem.getPrice());
            existing.setQuantity(updatedItem.getQuantity());
            existing.setUpdatedAt(LocalDateTime.now());
            return itemRepository.save(existing);
        });
    }

    public boolean deleteItem(String id) {
        if (itemRepository.existsById(id)) {
            itemRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

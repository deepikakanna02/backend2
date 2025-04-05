package com.Algonitefintech.fintech_security.util;

import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Component
public class AppCache {

    // Example in-memory cache using ConcurrentHashMap
    private final ConcurrentMap<String, Object> cache = new ConcurrentHashMap<>();

    // Method to add data to the cache
    public void put(String key, Object value) {
        cache.put(key, value);
    }

    // Method to retrieve data from the cache
    public Object get(String key) {
        return cache.get(key);
    }

    // Method to remove a specific item from the cache
    public void remove(String key) {
        cache.remove(key);
    }

    // Method to clear the entire cache
    public void init() {
        cache.clear();
        System.out.println("Application cache cleared.");
    }

    // Method to check if a key exists in the cache
    public boolean containsKey(String key) {
        return cache.containsKey(key);
    }
}

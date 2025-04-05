package com.Algonitefintech.fintech_security.controller;

import com.Algonitefintech.fintech_security.model.User;
import com.Algonitefintech.fintech_security.service.UserService;
import com.Algonitefintech.fintech_security.util.AppCache;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@Tag(name = "Admin APIs")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private AppCache appCache;

    @GetMapping("/all-users")
    public ResponseEntity<?> getAllUsers() {
        List<User> all = userService.getAll();
        if (all != null && !all.isEmpty()) {
            return ResponseEntity.ok(all);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No users found");
    }

    @PostMapping("/create-admin-user")
    public ResponseEntity<?> createUser(@Valid @RequestBody User user) {
        userService.saveAdmin(user);
        return ResponseEntity.status(HttpStatus.CREATED).body("Admin user created successfully");
    }

    @GetMapping("clear-app-cache")
    public ResponseEntity<?> clearAppCache(){
        appCache.init();
        return ResponseEntity.ok("Application cache cleared successfully");
    }
}


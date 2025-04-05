package com.Algonitefintech.fintech_security.controller;

import com.Algonitefintech.fintech_security.model.User;
import com.Algonitefintech.fintech_security.repository.UserRepository;
import com.Algonitefintech.fintech_security.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/user")
@Tag(name = "User APIs", description = "Read, update & Delete User")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;  // Added for secure password hashing

    @PutMapping
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<?> updateUser(@Valid @RequestBody User user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String authenticatedUserName = authentication.getName();

        User userInDb = userService.findByUserName(authenticatedUserName);
        if (userInDb == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        userInDb.setUserName(user.getUserName());
        userInDb.setPassword(passwordEncoder.encode(user.getPassword()));
        userInDb.setPhoneNumber(passwordEncoder.encode(user.getPhoneNumber()));
        userInDb.setBudget(user.getBudget());
        userInDb.setSavings(user.getSavings());

        userService.saveUser(userInDb);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    @DeleteMapping
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<?> deleteUserById() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<User> user = Optional.ofNullable(userRepository.findByUserName(username));
        if (user.isEmpty()) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        userRepository.delete(user.get());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

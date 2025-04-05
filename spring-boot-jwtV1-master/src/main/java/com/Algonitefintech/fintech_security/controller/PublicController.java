package com.Algonitefintech.fintech_security.controller;
import com.Algonitefintech.fintech_security.dto.UserDTO;
import com.Algonitefintech.fintech_security.model.User;
import com.Algonitefintech.fintech_security.service.UserDetailsServiceImpl;
import com.Algonitefintech.fintech_security.service.UserService;
import com.Algonitefintech.fintech_security.util.JwtUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public")
@Slf4j
@Tag(name = "Public APIs")
public class PublicController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/health-check")
    public String healthCheck() {
        log.info("Health is ok!");
        return "Ok";
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody UserDTO user) {
        
        User newUser = User.builder()
                .userName(user.getUserName())
                .password(user.getPassword())
                .phoneNumber(user.getPhoneNumber())
                .budget("0") 
                .savings("0")
                .savings(user.getSavings())
                .build();
        
        boolean saved = userService.saveNewUser(newUser);
        return saved ? new ResponseEntity<>(HttpStatus.CREATED)
                : new ResponseEntity<>("Error saving user", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUserName(), user.getPassword())
            );

            User userDetails = userService.findByUserName(user.getUserName());  // Load user with roles

            String jwt = jwtUtil.generateToken(userDetails.getUserName(), userDetails.getRoles());
            return new ResponseEntity<>(jwt, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Exception occurred while creating authentication token", e);
            return new ResponseEntity<>("Incorrect username or password", HttpStatus.BAD_REQUEST);
        }
    }

}


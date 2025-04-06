package com.Algonitefintech.fintech_security.service;

import com.Algonitefintech.fintech_security.model.User;
import com.Algonitefintech.fintech_security.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private boolean validateRequiredFields(User user) {
         if (user.getPhoneNumber().trim().isEmpty()) {
             log.error("Validation failed: phoneNumber is required.");
             return false;
         }
        // if (user.getBudget().trim().isEmpty()) {
        //     log.error("Validation failed: panCard is required.");
        //     return false;
        // }
        // if (user.getSavings().trim().isEmpty()) {
        //     log.error("Validation failed: dmatAccount is required.");
        //     return false;
        // }
        return true;
    }

    public boolean saveNewUser(User user) {
        if (!validateRequiredFields(user)) {
            return false;
        }
        try {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setPhoneNumber(passwordEncoder.encode(user.getPhoneNumber()));
            user.setBudget(user.getBudget());
            user.setSavings(user.getSavings());
            user.setRoles(List.of("USER"));
            
            
                userRepository.save(user);
           
            return true;
        } catch (Exception e) {
            log.error("There was an error saving the user: {}", e.getMessage());
            return false;
        }
    }

    public void saveAdmin(User user) {
        if (!validateRequiredFields(user)) {
            log.error("Admin user validation failed. User not saved.");
            return;
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setPhoneNumber(passwordEncoder.encode(user.getPhoneNumber()));
        user.setBudget(user.getBudget());
        user.setSavings(user.getSavings());
        user.setRoles(Arrays.asList("USER", "ADMIN"));
        userRepository.save(user);
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(ObjectId id) {
        return userRepository.findById(id);
    }

    public void deleteById(ObjectId id) {
        userRepository.deleteById(id);
    }

    public User findByUserName(String userName) {
        return userRepository.findByUserName(userName);
    }
}

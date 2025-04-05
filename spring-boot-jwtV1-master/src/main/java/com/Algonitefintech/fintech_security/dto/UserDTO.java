package com.Algonitefintech.fintech_security.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    @NotBlank
    private String userName;

    @NotBlank
    private String password;

    @NotBlank
    private String phoneNumber;

    
    private String budget;

    @NotBlank
    private String savings;

    
}

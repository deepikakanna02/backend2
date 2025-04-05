package com.Algonitefintech.fintech_security.model;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "finTechUsers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private ObjectId id;
    @Indexed(unique = true)
    @NonNull
    private String userName;
    
    private String password;

     @NonNull
    private String phoneNumber;
    
    @Builder.Default
    private String budget = "0";
    //@NonNull
    @Builder.Default
    private String savings = "0";

    private List<String> roles;

}


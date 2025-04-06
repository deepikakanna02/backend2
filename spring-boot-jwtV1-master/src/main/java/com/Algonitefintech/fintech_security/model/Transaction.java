package com.Algonitefintech.fintech_security.model;

import lombok.*;
import java.util.Date;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "usersTransactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    @Id
    private ObjectId id;

    @Builder.Default
    private String bankName = "dummy bank";
    @Builder.Default
    private String type = "no type"; // e.g., "credited" or "debited"
    @Builder.Default
    private Double amount = 0.0;

    @Builder.Default
    private Date dateCreated = new Date();

    private String category;
}

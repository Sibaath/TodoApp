package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Data
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 
    
    private Long userId; // New: To link the todo to a user
    
    private String title;
    private String description;
    private LocalDate dueDate; 
    private String priority;
    private String status; 
    private String category;
    private Instant createdAt;
    private Instant updatedAt;
    private Integer orderIndex;

    public Todo() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        this.status = "active";
        this.priority = "medium";
    }
}
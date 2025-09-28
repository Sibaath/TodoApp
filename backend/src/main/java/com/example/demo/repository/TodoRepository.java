package com.example.demo.repository;

import com.example.demo.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    
    // Existing methods:
    List<Todo> findByUserIdOrderByOrderIndexAsc(Long userId);
    long countByUserIdAndStatus(Long userId, String status);
    long countByUserIdAndPriority(Long userId, String priority);

    // CRITICAL FIX: Add the missing method signature:
    /** Counts all Todo items belonging to a specific user ID. */
    long countByUserId(Long userId); 
}
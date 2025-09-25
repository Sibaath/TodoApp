// package com.example.demo.repository;

// import com.example.demo.model.Todo;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;
// import java.util.List;

// @Repository
// public interface TodoRepository extends JpaRepository<Todo, Long> {
    
//     // Fetch all todos for a specific user, ordered by index
//     List<Todo> findByUserIdOrderByOrderIndexAsc(Long userId);

//     // Dashboard endpoint: Fetch counts for a specific user
//     long countByUserIdAndStatus(Long userId, String status);
//     long countByUserIdAndPriority(Long userId, String priority);
// }


package com.example.demo.repository;

import com.example.demo.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    
    // Used by TodoController.getAllTodos()
    List<Todo> findByUserIdOrderByOrderIndexAsc(Long userId);

    // Used to set initial orderIndex
    List<Todo> findByUserId(Long userId); 
    
    // Used by TodoController.getDashboardStats()
    long countByUserIdAndStatus(Long userId, String status);
    long countByUserIdAndPriority(Long userId, String priority);
    long countByUserId(Long userId);
}
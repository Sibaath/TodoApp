package com.example.demo.controller;

import com.example.demo.model.Todo;
import com.example.demo.repository.TodoRepository;
import com.example.demo.service.MockSessionService; // Correct dependency import
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    @Autowired private TodoRepository todoRepository;
    // REMOVED: @Autowired private AuthController authController;
    @Autowired private MockSessionService sessionService; // CORRECT INJECTION

    /** Helper method to get the current user ID from the global session service */
    private Long getCurrentUserId() {
        return sessionService.getCurrentUserId(); 
    }

    // ------------------------------------------------------------------
    // GET: /api/todos (Fetch all todos for the user)
    // ------------------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<Todo>> getAllTodos() {
        Long userId = getCurrentUserId();
        if (userId == null) return ResponseEntity.status(401).build();
        
        List<Todo> todos = todoRepository.findByUserIdOrderByOrderIndexAsc(userId);
        return ResponseEntity.ok(todos);
    }
    
    // ------------------------------------------------------------------
    // POST: /api/todos (Create a new todo)
    // ------------------------------------------------------------------
    @PostMapping
    public ResponseEntity<Todo> createTodo(@RequestBody Todo todo) {
        Long userId = getCurrentUserId();
        if (userId == null) return ResponseEntity.status(401).build();

        // Count existing todos for order index
        long currentTodoCount = todoRepository.countByUserId(userId);
        
        todo.setUserId(userId);
        todo.setOrderIndex((int) currentTodoCount); 
        return ResponseEntity.ok(todoRepository.save(todo));
    }

    // ------------------------------------------------------------------
    // PUT: /api/todos/{id} (Update a todo)
    // ------------------------------------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo todoDetails) {
        Long userId = getCurrentUserId();
        if (userId == null) return ResponseEntity.status(401).build();

        return todoRepository.findById(id)
            .filter(todo -> todo.getUserId().equals(userId)) 
            .map(todo -> {
                // Update fields
                if (todoDetails.getTitle() != null) todo.setTitle(todoDetails.getTitle());
                if (todoDetails.getStatus() != null) todo.setStatus(todoDetails.getStatus());
                if (todoDetails.getDueDate() != null) todo.setDueDate(todoDetails.getDueDate());
                if (todoDetails.getPriority() != null) todo.setPriority(todoDetails.getPriority());
                if (todoDetails.getCategory() != null) todo.setCategory(todoDetails.getCategory());
                if (todoDetails.getOrderIndex() != null) todo.setOrderIndex(todoDetails.getOrderIndex());
                
                todo.setUpdatedAt(Instant.now());
                Todo updatedTodo = todoRepository.save(todo);
                return ResponseEntity.ok(updatedTodo);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // ------------------------------------------------------------------
    // DELETE: /api/todos/{id} (Delete a todo)
    // ------------------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        if (userId == null) return ResponseEntity.status(401).build();

        return todoRepository.findById(id)
            .filter(todo -> todo.getUserId().equals(userId))
            .map(todo -> {
                todoRepository.delete(todo);
                return ResponseEntity.ok().build();
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // ------------------------------------------------------------------
    // GET: /api/todos/dashboard/stats (Dashboard Endpoint)
    // ------------------------------------------------------------------
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Long>> getDashboardStats() {
        Long userId = getCurrentUserId();
        if (userId == null) return ResponseEntity.status(401).build();

        long completed = todoRepository.countByUserIdAndStatus(userId, "completed");
        long active = todoRepository.countByUserId(userId) - completed;
        long high = todoRepository.countByUserIdAndPriority(userId, "high");
        
        return ResponseEntity.ok(Map.of(
            "completedCount", completed,
            "activeCount", active,
            "highPriorityCount", high
        ));
    }
}
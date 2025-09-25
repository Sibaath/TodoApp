// package com.example.demo.controller;

// import com.example.demo.model.Todo;
// import com.example.demo.repository.TodoRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import java.time.Instant;
// import java.util.List;
// import java.util.Map;

// @RestController
// @RequestMapping("/api/todos")
// public class TodoController {

//     @Autowired private TodoRepository todoRepository;
//     @Autowired private AuthController authController; // Access the mock session state

//     private Long getCurrentUserId() {
//         // In a real app, this would retrieve the user ID from the SecurityContext
//         return authController.currentUserId; 
//     }

//     @GetMapping
//     public ResponseEntity<List<Todo>> getAllTodos() {
//         Long userId = getCurrentUserId();
//         if (userId == null) return ResponseEntity.status(401).build();
        
//         List<Todo> todos = todoRepository.findByUserIdOrderByOrderIndexAsc(userId);
//         return ResponseEntity.ok(todos);
//     }
    
//     @PostMapping
//     public ResponseEntity<Todo> createTodo(@RequestBody Todo todo) {
//         Long userId = getCurrentUserId();
//         if (userId == null) return ResponseEntity.status(401).build();

//         todo.setUserId(userId);
//         return ResponseEntity.ok(todoRepository.save(todo));
//     }

//     @PutMapping("/{id}")
//     public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo todoDetails) {
//         Long userId = getCurrentUserId();
//         if (userId == null) return ResponseEntity.status(401).build();

//         return todoRepository.findById(id)
//             .filter(todo -> todo.getUserId().equals(userId)) // Ensure user owns the todo
//             .map(todo -> {
//                 // ... (update fields as in the previous example) ...
//                 if (todoDetails.getTitle() != null) todo.setTitle(todoDetails.getTitle());
//                 if (todoDetails.getStatus() != null) todo.setStatus(todoDetails.getStatus());
//                 // Add more update logic here for other fields...
                
//                 todo.setUpdatedAt(Instant.now());
//                 Todo updatedTodo = todoRepository.save(todo);
//                 return ResponseEntity.ok(updatedTodo);
//             })
//             .orElse(ResponseEntity.notFound().build());
//     }

//     @DeleteMapping("/{id}")
//     public ResponseEntity<?> deleteTodo(@PathVariable Long id) {
//         Long userId = getCurrentUserId();
//         if (userId == null) return ResponseEntity.status(401).build();

//         return todoRepository.findById(id)
//             .filter(todo -> todo.getUserId().equals(userId)) // Ensure user owns the todo
//             .map(todo -> {
//                 todoRepository.delete(todo);
//                 return ResponseEntity.ok().build();
//             })
//             .orElse(ResponseEntity.notFound().build());
//     }

//     @GetMapping("/dashboard/stats")
//     public ResponseEntity<Map<String, Long>> getDashboardStats() {
//         Long userId = getCurrentUserId();
//         if (userId == null) return ResponseEntity.status(401).build();

//         long completed = todoRepository.countByUserIdAndStatus(userId, "completed");
//         long active = todoRepository.countByUserIdAndStatus(userId, "active");
//         long high = todoRepository.countByUserIdAndPriority(userId, "high");
        
//         return ResponseEntity.ok(Map.of(
//             "completedCount", completed,
//             "activeCount", active,
//             "highPriorityCount", high
//         ));
//     }
// }


package com.example.demo.controller;

import com.example.demo.model.Todo;
import com.example.demo.repository.TodoRepository;
import com.example.demo.service.MockSessionService;
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
    @Autowired private MockSessionService sessionService; // Inject the session service

    /** Helper method to check session status */
    private Long getCurrentUserId() {
        return sessionService.getCurrentUserId(); 
    }

    // ------------------------------------------------------------------
    // GET: /api/todos (Fetch all todos for the logged-in user)
    // ------------------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<Todo>> getAllTodos() {
        Long userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }
        
        List<Todo> todos = todoRepository.findByUserIdOrderByOrderIndexAsc(userId);
        return ResponseEntity.ok(todos);
    }
    
    // ------------------------------------------------------------------
    // POST: /api/todos (Create a new todo)
    // ------------------------------------------------------------------
    @PostMapping
    public ResponseEntity<Todo> createTodo(@RequestBody Todo todo) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        todo.setUserId(userId);
        // If orderIndex is null, set it to the count of the user's current todos
        if (todo.getOrderIndex() == null) {
            todo.setOrderIndex(todoRepository.findByUserId(userId).size());
        }
        
        return ResponseEntity.ok(todoRepository.save(todo));
    }

    // ------------------------------------------------------------------
    // PUT: /api/todos/{id} (Update a todo)
    // ------------------------------------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo todoDetails) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        return todoRepository.findById(id)
            .filter(todo -> todo.getUserId().equals(userId)) // Security check: user owns the todo
            .map(todo -> {
                // Update only the fields provided in the request body
                if (todoDetails.getTitle() != null) todo.setTitle(todoDetails.getTitle());
                if (todoDetails.getDescription() != null) todo.setDescription(todoDetails.getDescription());
                if (todoDetails.getDueDate() != null) todo.setDueDate(todoDetails.getDueDate());
                if (todoDetails.getPriority() != null) todo.setPriority(todoDetails.getPriority());
                if (todoDetails.getStatus() != null) todo.setStatus(todoDetails.getStatus());
                if (todoDetails.getCategory() != null) todo.setCategory(todoDetails.getCategory());
                
                // orderIndex update is critical for reordering logic
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
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        return todoRepository.findById(id)
            .filter(todo -> todo.getUserId().equals(userId)) // Security check
            .map(todo -> {
                todoRepository.delete(todo);
                return ResponseEntity.ok().build();
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // ------------------------------------------------------------------
    // GET: /api/todos/dashboard/stats (Dashboard stats endpoint)
    // ------------------------------------------------------------------
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Long>> getDashboardStats() {
        Long userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        long total = todoRepository.countByUserId(userId);
        long completed = todoRepository.countByUserIdAndStatus(userId, "completed");
        long active = total - completed;
        long high = todoRepository.countByUserIdAndPriority(userId, "high");
        
        return ResponseEntity.ok(Map.of(
            "totalCount", total,
            "completedCount", completed,
            "activeCount", active,
            "highPriorityCount", high
        ));
    }
}
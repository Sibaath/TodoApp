package com.example.demo.repository;

import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Custom method: Spring Data JPA automatically generates the query
    // SELECT * FROM user WHERE username = ?
    Optional<User> findByUsername(String username);
}

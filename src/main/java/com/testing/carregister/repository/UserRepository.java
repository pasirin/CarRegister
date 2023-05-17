package com.testing.carregister.repository;

import com.testing.carregister.models.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);

  Boolean existsByUsername(String username);

  Boolean existsByEmail(String email);

  long deleteByUsername(String username);

  // Optional<User> findAll();

  long count();
}

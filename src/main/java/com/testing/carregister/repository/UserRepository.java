package com.testing.carregister.repository;

import com.testing.carregister.models.user.User;

import jakarta.validation.constraints.NotNull;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);

  Boolean existsByUsername(String username);

  Boolean existsByEmail(String email);

  long deleteByUsername(String username);

  @NotNull
  List<User> findAll();

  long count();
}

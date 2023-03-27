package com.testing.carregister.repository;

import com.testing.carregister.models.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Boolean existByUsername(String username);

    Boolean existsByEmail(String email);

    long deleteByUsername(String username);

    List<User> findAll();

    long count();
}

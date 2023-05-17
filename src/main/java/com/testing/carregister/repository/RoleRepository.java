package com.testing.carregister.repository;

import com.testing.carregister.models.user.ERole;
import com.testing.carregister.models.user.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}

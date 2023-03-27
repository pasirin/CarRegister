package com.testing.carregister.repository;

import com.testing.carregister.models.owner.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OwnerRepository extends JpaRepository<Owner, Long> {
    Optional<Owner> findByName(String name);

    long deleteByName(String name);

    List<Owner> findAll();

    long count();
}

package com.testing.carregister.repository;

import com.testing.carregister.models.user.ERegion;
import com.testing.carregister.models.user.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RegionRepository extends JpaRepository<Region, Long> {
  Optional<Region> findByName(ERegion region);
}

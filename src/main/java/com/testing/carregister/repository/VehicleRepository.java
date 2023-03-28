package com.testing.carregister.repository;

import com.testing.carregister.models.user.ERegion;
import com.testing.carregister.models.vehicle.EVehicle;
import com.testing.carregister.models.vehicle.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findByOwnerName(String ownerName);

    Optional<Vehicle> findByAge(Integer age);

    Optional<Vehicle> findByType(EVehicle type);

    Optional<Vehicle> findByLastRegion(ERegion region);

    Optional<Vehicle> findByPlateNumber(String plateNumber);

    long deleteById(Integer id);

    List<Vehicle> findAll();

    long count();
}

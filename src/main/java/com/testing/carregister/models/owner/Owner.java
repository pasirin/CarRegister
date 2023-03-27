package com.testing.carregister.models.owner;

import com.testing.carregister.models.vehicle.Vehicle;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "owners")
public class Owner {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank private String name;

  @NotBlank private String phoneNumber;

  @NotBlank @DateTimeFormat private Instant DoB;

  @OneToMany(fetch = FetchType.LAZY)
  @JoinTable(
      name = "owner_vehicles",
      joinColumns = @JoinColumn(name = "owner_id"),
      inverseJoinColumns = @JoinColumn(name = "vehicle_ownerId"))
  private Set<Vehicle> vehicles = new HashSet<>();

  public Owner() {}

  public Owner(Long id, String name, String phoneNumber, Instant DoB, Set<Vehicle> vehicles) {
    this.id = id;
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.DoB = DoB;
    this.vehicles = vehicles;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  public Instant getDoB() {
    return DoB;
  }

  public void setDoB(Instant doB) {
    DoB = doB;
  }

  public Set<Vehicle> getVehicles() {
    return vehicles;
  }

  public void setVehicles(Set<Vehicle> vehicles) {
    this.vehicles = vehicles;
  }
}

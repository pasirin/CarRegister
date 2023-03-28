package com.testing.carregister.models.vehicle;

import com.testing.carregister.models.user.ERegion;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.Instant;

@Entity
@Table(name = "vehicles")
public class Vehicle {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank private String plateNumber;

  @NotBlank @CreatedDate private Instant createdDate;

  @NotBlank @LastModifiedDate private Instant newestDate;

  @NotBlank private String ownerName;

  @NotBlank private EVehicle type;

  @NotBlank private Integer age;

  @NotBlank private ERegion lastRegion;

  public Vehicle() {}

  public Vehicle(
      Long id,
      String plateNumber,
      Instant createdDate,
      Instant newestDate,
      String ownerName,
      EVehicle type,
      Integer age,
      ERegion lastRegion) {
    this.id = id;
    this.plateNumber = plateNumber;
    this.createdDate = createdDate;
    this.newestDate = newestDate;
    this.ownerName = ownerName;
    this.type = type;
    this.age = age;
    this.lastRegion = lastRegion;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Instant getCreatedDate() {
    return createdDate;
  }

  public Instant getNewestDate() {
    return newestDate;
  }

  public void setNewestDate(Instant newestDate) {
    this.newestDate = newestDate;
  }

  public EVehicle getType() {
    return type;
  }

  public void setType(EVehicle type) {
    this.type = type;
  }

  public Integer getAge() {
    return age;
  }

  public void setAge(Integer age) {
    this.age = age;
  }

  public ERegion getLastRegion() {
    return lastRegion;
  }

  public void setLastRegion(ERegion lastRegion) {
    this.lastRegion = lastRegion;
  }

  public String getPlateNumber() {
    return plateNumber;
  }

  public void setPlateNumber(String plateNumber) {
    this.plateNumber = plateNumber;
  }

  public String getOwnerName() {
    return ownerName;
  }

  public void setOwnerName(String ownerName) {
    this.ownerName = ownerName;
  }
}

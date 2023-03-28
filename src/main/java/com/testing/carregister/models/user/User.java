package com.testing.carregister.models.user;

import com.testing.carregister.models.vehicle.Vehicle;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(
    name = "users",
    uniqueConstraints = {
      @UniqueConstraint(columnNames = "username"),
      @UniqueConstraint(columnNames = "email")
    })
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Size(max = 20)
  private String username;

  @NotBlank
  @Size(max = 50)
  @Email
  private String email;

  @NotBlank
  @Size(max = 200)
  private String password;

  @NotBlank private ERegion region;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
      name = "user_roles",
      joinColumns = @JoinColumn(name = "user_id"),
      inverseJoinColumns = @JoinColumn(name = "role_id"))
  private Set<Role> roles = new HashSet<>();

  @OneToOne(fetch = FetchType.LAZY)
  @JoinTable(
      name = "user_zone",
      joinColumns = @JoinColumn(name = "user_region"),
      inverseJoinColumns = @JoinColumn(name = "region_id"))
  private Region regions = new Region();

  @OneToMany(fetch = FetchType.LAZY)
  @JoinTable(
      name = "region_vehicle",
      joinColumns = @JoinColumn(name = "user_region"),
      inverseJoinColumns = @JoinColumn(name = "vehicle_lastRegion"))
  private Set<Vehicle> vehicles = new HashSet<>();

  public User() {}

  public User(Long id, String username, String email, String password, ERegion region) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.region = region;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public Set<Role> getRoles() {
    return roles;
  }

  public void setRoles(Set<Role> roles) {
    this.roles = roles;
  }

  public ERegion getRegion() {
    return region;
  }

  public void setRegion(ERegion region) {
    this.region = region;
  }

  public Region getRegions() {
    return regions;
  }

  public void setRegions(Region regions) {
    this.regions = regions;
  }

  public Set<Vehicle> getVehicles() {
    return vehicles;
  }

  public void setVehicles(Set<Vehicle> vehicles) {
    this.vehicles = vehicles;
  }
}

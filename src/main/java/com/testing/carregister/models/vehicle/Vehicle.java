package com.testing.carregister.models.vehicle;

import com.testing.carregister.models.user.Region;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.sql.Date;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "vehicles")
public class Vehicle {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  private String plateNumber;

  @CreatedDate
  private Date createdDate;

  @LastModifiedDate
  private Date newestDate;

  @NotBlank
  private String ownerName;

  private EVehicle type;

  private Long age;

  private Date nextCycle;

  @OneToOne
  @JoinColumn(name = "last_region")
  private Region lastRegion;

  private Boolean checked = false;

  public Vehicle() {
  }

  public Vehicle(String plateNumber, Date createdDate, String ownerName) {
    this.plateNumber = plateNumber;
    this.createdDate = createdDate;
    this.newestDate = createdDate;
    calculateAge();
    this.ownerName = ownerName;
  }

  public Vehicle(String plateNumber, Date createdDate, Date newestDate, String ownerName) {
    this.plateNumber = plateNumber;
    this.createdDate = createdDate;
    this.newestDate = newestDate;
    calculateAge();
    this.ownerName = ownerName;
  }

  private void calculateAge() {
    Date temp1 = new Date(this.createdDate.getTime());
    Date temp2 = new Date(this.newestDate.getTime());
    this.age = ChronoUnit.YEARS.between(temp1.toLocalDate(), temp2.toLocalDate());
  }

  private void addAge(Long age) {
    this.age += age;
  }

  public void predictNextCycle() {
    LocalDate temp1 = createdDate.toLocalDate();
    LocalDate temp2 = newestDate.toLocalDate();
    switch (type) {
      case TYPE_1 -> {
        if (temp1.equals(temp2)) {
          nextCycle = new Date(java.util.Date
              .from(temp1.plus(30, ChronoUnit.MONTHS).atStartOfDay(ZoneId.systemDefault()).toInstant()).getTime());
        } else if (age < 7) {
          nextCycle = new Date(java.util.Date
              .from(temp1.plus(18, ChronoUnit.MONTHS).atStartOfDay(ZoneId.systemDefault()).toInstant()).getTime());
        } else if (age < 12) {
          nextCycle = new Date(java.util.Date
              .from(temp1.plus(12, ChronoUnit.MONTHS).atStartOfDay(ZoneId.systemDefault()).toInstant()).getTime());
        } else {
          nextCycle = new Date(java.util.Date
              .from(temp1.plus(6, ChronoUnit.MONTHS).atStartOfDay(ZoneId.systemDefault()).toInstant()).getTime());
        }
      }
      case TYPE_2 -> {
        if (temp1.equals(temp2)) {
          nextCycle = new Date(java.util.Date
              .from(temp1.plus(18, ChronoUnit.MONTHS).atStartOfDay(ZoneId.systemDefault()).toInstant()).getTime());
        } else {
          nextCycle = new Date(java.util.Date
              .from(temp1.plus(6, ChronoUnit.MONTHS).atStartOfDay(ZoneId.systemDefault()).toInstant()).getTime());
        }
      }
      case TYPE_3 -> {
        if (temp1.equals(temp2)) {
          nextCycle = new Date(java.util.Date
              .from(temp1.plus(24, ChronoUnit.MONTHS).atStartOfDay(ZoneId.systemDefault()).toInstant()).getTime());
        } else {
          nextCycle = new Date(java.util.Date
              .from(temp1.plus(12, ChronoUnit.MONTHS).atStartOfDay(ZoneId.systemDefault()).toInstant()).getTime());
        }
      }
      default -> nextCycle = new Date(java.util.Date
          .from(temp1.plus(3, ChronoUnit.MONTHS).atStartOfDay(ZoneId.systemDefault()).toInstant()).getTime());
    }
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Date getCreatedDate() {
    return createdDate;
  }

  public Date getNewestDate() {
    return newestDate;
  }

  public void setNewestDate(Date newestDate) {
    this.newestDate = newestDate;
  }

  public EVehicle getType() {
    return type;
  }

  public void setType(EVehicle type) {
    this.type = type;
    if (type == EVehicle.TYPE_4) {
      addAge(15L);
    } else if (type == EVehicle.TYPE_5) {
      addAge(20L);
    }
  }

  public long getAge() {
    return age;
  }

  public void setAge(long age) {
    this.age = age;
  }

  public Region getLastRegion() {
    return lastRegion;
  }

  public void setLastRegion(Region lastRegion) {
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

  public Boolean getChecked() {
    return checked;
  }

  public void setChecked(Boolean checked) {
    this.checked = checked;
  }

  public Date getNextCycle() {
    return nextCycle;
  }
}

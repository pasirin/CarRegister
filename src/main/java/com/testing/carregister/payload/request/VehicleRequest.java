package com.testing.carregister.payload.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.sql.Date;

public class VehicleRequest {
  @NotBlank
  @Size(min = 8, max = 9)
  private String plateNumber;

  @JsonFormat(pattern = "yyyy-MM-dd", shape = JsonFormat.Shape.STRING)
  @JsonDeserialize(as = Date.class)
  private Date createdDate;

  @JsonFormat(pattern = "yyyy-MM-dd", shape = JsonFormat.Shape.STRING)
  @JsonDeserialize(as = Date.class)
  private Date newestDate;

  @NotBlank private String lastRegion;

  @NotBlank
  @Size(min = 5, max = 30)
  private String ownerName;

  @NotBlank private String type;

  public String getPlateNumber() {
    return plateNumber;
  }

  public void setPlateNumber(String plateNumber) {
    this.plateNumber = plateNumber;
  }

  public Date getCreatedDate() {
    return createdDate;
  }

  public void setCreatedDate(Date createdDate) {
    this.createdDate = createdDate;
  }

  public Date getNewestDate() {
    return newestDate;
  }

  public void setNewestDate(Date newestDate) {
    this.newestDate = newestDate;
  }

  public String getLastRegion() {
    return lastRegion;
  }

  public void setLastRegion(String lastRegion) {
    this.lastRegion = lastRegion;
  }

  public String getOwnerName() {
    return ownerName;
  }

  public void setOwnerName(String ownerName) {
    this.ownerName = ownerName;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }
}

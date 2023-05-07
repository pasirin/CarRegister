package com.testing.carregister.controllers;

import com.testing.carregister.models.user.ERegion;
import com.testing.carregister.models.user.Region;
import com.testing.carregister.models.vehicle.EVehicle;
import com.testing.carregister.models.vehicle.Vehicle;
import com.testing.carregister.payload.request.VehicleRequest;
import com.testing.carregister.payload.response.MessageResponse;
import com.testing.carregister.repository.RegionRepository;
import com.testing.carregister.repository.VehicleRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class VehicleController {
  @Autowired VehicleRepository vehicleRepository;

  @Autowired RegionRepository regionRepository;

  @EventListener
  public void initRegion(ApplicationReadyEvent event) {
    for (ERegion region : ERegion.values()) {
      if (regionRepository.findByName(region).isEmpty()) {
        Region temp = new Region(region);
        regionRepository.save(temp);
      }
    }
  }

  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  @GetMapping("/get/vehicle")
  public List<Vehicle> getAllVehicles() {
    return vehicleRepository.findAll();
  }

  @PreAuthorize("hasRole('ADMIN')")
  @DeleteMapping("/delete/vehicles")
  public ResponseEntity<?> deleteAll() {
    vehicleRepository.deleteAll();
    return ResponseEntity.ok(new MessageResponse("Toàn bộ dữ liệu phương tiện đã được xóa"));
  }

  @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
  @PostMapping("/check/vehicle")
  public ResponseEntity<?> checkVehicle(@Valid @RequestParam("plateNumber") String plateNumber) {
    Vehicle vehicle =
        vehicleRepository
            .findByPlateNumber(plateNumber)
            .orElseThrow(() -> new RuntimeException("Error: Không có xe nào với biển số này"));

    Date today = new Date(Calendar.getInstance().getTime().getTime());
    vehicle.setNewestDate(today);
    LocalDate createdAt = vehicle.getCreatedDate().toLocalDate();
    LocalDate now = LocalDate.now();
    long newAge = ChronoUnit.YEARS.between(createdAt, now);
    vehicle.setAge(newAge);
    vehicle.predictNextCycle();

    vehicleRepository.save(vehicle);

    return ResponseEntity.ok(new MessageResponse("Phương tiện được đăng kiểm thành công!"));
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/add/vehicles")
  public ResponseEntity<?> registerVehicles(@Valid @RequestBody List<VehicleRequest> vehicleList) {
    for (VehicleRequest vehicleRequest : vehicleList) {
      registerVehicle(vehicleRequest);
    }
    return ResponseEntity.ok(
        new MessageResponse("Toàn bộ các phương tiện hợp lệ đã được lưu vào cơ sở dữ liệu"));
  }

  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  @PostMapping("/add/vehicle")
  public ResponseEntity<?> registerVehicle(@Valid @RequestBody VehicleRequest vehicleRequest) {
    if (vehicleRepository.existsByPlateNumber(vehicleRequest.getPlateNumber())) {
      return ResponseEntity.badRequest()
          .body(new MessageResponse("Error: Đã có xe mang biển số đó"));
    }
    if (vehicleRequest.getNewestDate() != null) {
      int value = vehicleRequest.getCreatedDate().compareTo(vehicleRequest.getNewestDate());
      if (value > 0) {
        return ResponseEntity.badRequest()
            .body(new MessageResponse("Error: Lỗi thời gian được tạo và thời gian hiện tại"));
      }
    }
    Vehicle vehicle;
    if (vehicleRequest.getNewestDate() != null) {
      vehicle =
          new Vehicle(
              vehicleRequest.getPlateNumber(),
              vehicleRequest.getCreatedDate(),
              vehicleRequest.getNewestDate(),
              vehicleRequest.getOwnerName());
    } else {
      vehicle =
          new Vehicle(
              vehicleRequest.getPlateNumber(),
              vehicleRequest.getCreatedDate(),
              vehicleRequest.getOwnerName());
    }

    // Process lastRegion
    ERegion strRegion;
    try {
      strRegion = ERegion.valueOf(vehicleRequest.getLastRegion());
    } catch (Exception e) {
      throw new RuntimeException("Error: Không tìm thấy vùng. " + e);
    }
    Region region =
        regionRepository
            .findByName(strRegion)
            .orElseThrow(() -> new RuntimeException("Error: Không tìm thấy vùng."));
    vehicle.setLastRegion(region);

    // Process Type
    EVehicle strType;
    try {
      strType = EVehicle.valueOf(vehicleRequest.getType());
    } catch (Exception e) {
      throw new RuntimeException("Error: không tìm thấy loại xe. " + e);
    }
    vehicle.setType(strType);
    vehicle.predictNextCycle();
    vehicleRepository.save(vehicle);

    return ResponseEntity.ok(new MessageResponse("Lưu thông tin phương tiện thành công"));
  }
}

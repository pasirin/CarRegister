package com.testing.carregister.controllers;

import com.testing.carregister.models.user.*;
import com.testing.carregister.payload.request.LoginRequest;
import com.testing.carregister.payload.request.SignupRequest;
import com.testing.carregister.payload.response.JwtResponse;
import com.testing.carregister.payload.response.MessageResponse;
import com.testing.carregister.repository.RegionRepository;
import com.testing.carregister.repository.RoleRepository;
import com.testing.carregister.repository.UserRepository;
import com.testing.carregister.security.jwt.JwtUtils;
import com.testing.carregister.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  RegionRepository regionRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

  @EventListener
  public void initRoles(ApplicationReadyEvent event) {
    for (ERole role : ERole.values()) {
      if (roleRepository.findByName(role).isEmpty()) {
        Role temp = new Role(role);
        roleRepository.save(temp);
      }
    }

  }

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            loginRequest.getUsername(), loginRequest.getPassword()));
    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);

    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    List<String> roles = userDetails.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .collect(Collectors.toList());
    return ResponseEntity.ok(
        new JwtResponse(
            jwt,
            userDetails.getId(),
            userDetails.getUsername(),
            userDetails.getEmail(),
            roles,
            userDetails.getRegion().toString()));
  }

  @PostMapping("signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupUpRequest) {
    if (userRepository.existsByUsername(signupUpRequest.getUsername())) {
      return ResponseEntity.badRequest()
          .body(new MessageResponse("Error: Tên người dùng đã được sử dụng!"));
    }

    if (userRepository.existsByEmail(signupUpRequest.getEmail())) {
      return ResponseEntity.badRequest().body(new MessageResponse("Error: Email đã được sử dụng!"));
    }

    User user = new User(
        signupUpRequest.getUsername(),
        signupUpRequest.getEmail(),
        encoder.encode(signupUpRequest.getPassword()));

    // Process user roles
    Set<String> strRoles = signupUpRequest.getRole();
    Set<Role> roles = new HashSet<>();

    if (strRoles == null) {
      Role userRole = roleRepository.findByName(ERole.ROLE_USER)
          .orElseThrow(() -> new RuntimeException("Error: Vai trò người dùng không đươc tìm thấy."));
      roles.add(userRole);
    } else {
      strRoles.forEach(role -> {
        switch (role) {
          case "admin" -> {
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("Error: Vai trò người dùng không đươc tìm thấy."));
            roles.add(adminRole);
          }
          case "mod" -> {
            Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                .orElseThrow(() -> new RuntimeException("Error: Vai trò người dùng không đươc tìm thấy."));
            roles.add(modRole);
          }
          default -> {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Vai trò người dùng không đươc tìm thấy."));
            roles.add(userRole);
          }
        }
      });
    }
    user.setRoles(roles);

    // Process user Region
    ERegion strRegion;
    try {
      strRegion = ERegion.valueOf(signupUpRequest.getRegion());
    } catch (Exception e) {
      throw new RuntimeException("Error: Không tìm thấy vùng. " + e);
    }
    Region region = regionRepository.findByName(strRegion)
        .orElseThrow(() -> new RuntimeException("Error: Không tìm thấy vùng."));
    user.setRegion(region);
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("Đăng ký người dùng thành công"));
  }
}

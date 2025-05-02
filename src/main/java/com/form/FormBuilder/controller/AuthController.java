package com.form.FormBuilder.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

import com.form.FormBuilder.dto.AuthResponse;
import com.form.FormBuilder.dto.LoginRequest;
import com.form.FormBuilder.dto.RegisterRequest;
import com.form.FormBuilder.exception.UserAlreadyExistsException;
import com.form.FormBuilder.service.AuthService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    
    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            System.out.println("Received registration request for: " + registerRequest.getUsername());
            AuthResponse response = authService.register(registerRequest);
            System.out.println("Registration successful for: " + registerRequest.getUsername());
            
            Map<String, Object> userData = new HashMap<>();
            userData.put("name", registerRequest.getFirstName() + " " + registerRequest.getLastName());
            userData.put("userId", response.getId());
            userData.put("email", response.getEmail());
            userData.put("phoneNumber", response.getPhoneNumber());
            
            Map<String, Object> standardResponse = new HashMap<>();
            standardResponse.put("statusCode", HttpStatus.CREATED.value());
            standardResponse.put("statusMessage", "User registered successfully");
            standardResponse.put("data", userData);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(standardResponse);
        } catch (UserAlreadyExistsException e) {
            System.out.println("Registration failed - User already exists: " + e.getMessage());
            
            Map<String, Object> standardResponse = new HashMap<>();
            standardResponse.put("statusCode", HttpStatus.CONFLICT.value());
            standardResponse.put("statusMessage", e.getMessage());
            standardResponse.put("data", null);
            
            return ResponseEntity.status(HttpStatus.CONFLICT).body(standardResponse);
        } catch (Exception e) {
            System.out.println("Registration failed with exception: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> standardResponse = new HashMap<>();
            standardResponse.put("statusCode", HttpStatus.INTERNAL_SERVER_ERROR.value());
            standardResponse.put("statusMessage", "Registration failed: " + e.getMessage());
            standardResponse.put("data", null);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(standardResponse);
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Received login request for email: " + loginRequest.getEmail());
            AuthResponse response = authService.login(loginRequest);
            System.out.println("Login successful for email: " + loginRequest.getEmail());
            
            // Get user's first and last name from the database
            String fullName = authService.getUserFullName(loginRequest.getEmail());
            
            Map<String, Object> userData = new HashMap<>();
            userData.put("name", fullName);
            userData.put("userId", response.getId());
            userData.put("email", response.getEmail());
            userData.put("phoneNumber", response.getPhoneNumber());
            userData.put("token", response.getToken());
            
            Map<String, Object> standardResponse = new HashMap<>();
            standardResponse.put("statusCode", HttpStatus.OK.value());
            standardResponse.put("statusMessage", "Login successful");
            standardResponse.put("data", userData);
            
            return ResponseEntity.ok(standardResponse);
        } catch (Exception e) {
            System.out.println("Login failed with exception: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> standardResponse = new HashMap<>();
            standardResponse.put("statusCode", HttpStatus.UNAUTHORIZED.value());
            standardResponse.put("statusMessage", "Invalid email or password");
            standardResponse.put("data", null);
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(standardResponse);
        }
    }
}
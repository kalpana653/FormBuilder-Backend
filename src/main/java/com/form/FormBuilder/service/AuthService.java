package com.form.FormBuilder.service;

import java.time.LocalDateTime;
import java.util.Collections;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import com.form.FormBuilder.security.UserDetailsImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.form.FormBuilder.model.User;
import com.form.FormBuilder.repository.UserRepository;
import com.form.FormBuilder.security.JwtUtils;
import com.form.FormBuilder.dto.AuthResponse;
import com.form.FormBuilder.dto.LoginRequest;
import com.form.FormBuilder.dto.RegisterRequest;
import com.form.FormBuilder.exception.UserAlreadyExistsException;

import org.springframework.beans.factory.annotation.Autowired;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    
    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                      AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    public AuthResponse register(RegisterRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username is already taken");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email is already in use");
        }

        // Create new user
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(Collections.singletonList("USER"));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // No token generation for registration
        return new AuthResponse(null, savedUser.getId(), savedUser.getUsername(), savedUser.getEmail(), savedUser.getPhoneNumber(), savedUser.getRoles(), "User registered successfully");
    }

    public AuthResponse login(LoginRequest request) {
        // Find the user by email first to get the username
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getEmail()));
        
        // Authenticate using the username from the found user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        String token = jwtUtils.generateToken(user);

        // Using the constructor with message parameter
        return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail(), user.getPhoneNumber(), user.getRoles(), "Login successful");
    }
    
    /**
     * Get the full name of a user by email
     * 
     * @param email The email to look up
     * @return The full name (firstName + lastName) of the user
     */
    public String getUserFullName(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        return user.getFirstName() + " " + user.getLastName();
    }
}
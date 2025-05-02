package com.form.FormBuilder.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AuthResponse {
    @JsonProperty("token")
    private String token;
    
    @JsonProperty("id")
    private String id;
    
    @JsonProperty("username")
    private String username;
    
    @JsonProperty("email")
    private String email;
    
    @JsonProperty("phoneNumber")
    private String phoneNumber;
    
    @JsonProperty("roles")
    private List<String> roles;
    
    @JsonProperty("message")
    private String message;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
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
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    // New constructors with phoneNumber
    public AuthResponse(String id, String username, String email, String phoneNumber, List<String> roles) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.roles = roles;
        this.message = "Operation successful";
    }
    
    public AuthResponse(String token, String id, String username, String email, String phoneNumber, List<String> roles, String message) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.roles = roles;
        this.message = message;
    }
    
    // Legacy constructors for backward compatibility
    public AuthResponse(String id, String username, String email, List<String> roles) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
        this.message = "Operation successful";
    }

    // Replaced with phoneNumber version to avoid duplicate constructor signature

    
    public AuthResponse(String token, String id, String username, String email, List<String> roles, String message) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
        this.message = message;
    }
}
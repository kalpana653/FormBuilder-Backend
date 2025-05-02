package com.form.FormBuilder.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class LoginRequest {
    
    // Email is no longer required by default, as we now support username login
    @Email(message = "Please provide a valid email address")
    private String email;
    
    // Added username field to support login with username
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    // Remove validation annotations from getters/setters as they're already on the fields
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
package com.form.FormBuilder.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class BuilderController {

    @GetMapping("/builder")
    public String builder(@RequestParam(required = false) String id, Model model) {
        // Add any necessary model attributes
        model.addAttribute("isAdmin", true); // For demo purposes, everyone is an admin
        
        return "builder";
    }
}
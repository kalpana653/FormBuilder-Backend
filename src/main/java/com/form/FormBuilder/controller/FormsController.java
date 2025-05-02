package com.form.FormBuilder.controller;

import java.util.List;

import com.form.FormBuilder.service.FormService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.form.FormBuilder.model.Form;

@Controller
public class FormsController {

    @Autowired
    private FormService formService;
    
    @GetMapping("/forms")
    public String forms(Model model) {

        List<Form> forms = formService.getAllForms();
        model.addAttribute("forms", forms);
        model.addAttribute("isAdmin", true); // For demo purposes, everyone is an admin
        
        return "forms";
    }
}
package com.form.FormBuilder.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.form.FormBuilder.model.Form;
import com.form.FormBuilder.service.FormService;

@RestController
@RequestMapping("/api/forms")
public class FormApiController {

    @Autowired
    private FormService formService;
    
    @GetMapping
    public ResponseEntity<List<Form>> getAllForms() {
        List<Form> forms = formService.getAllForms();
        return ResponseEntity.ok(forms);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Form> getFormById(@PathVariable String id) {
        Form form = formService.getFormById(id);
        
        if (form != null) {
            return ResponseEntity.ok(form);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<Form> createForm(@RequestBody Form form) {
        // For demo purposes, set a default user
        form.setCreatedBy("user123");
        
        Form createdForm = formService.createForm(form);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdForm);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Form> updateForm(@PathVariable String id, @RequestBody Form form) {
        Form updatedForm = formService.updateForm(id, form);
        
        if (updatedForm != null) {
            return ResponseEntity.ok(updatedForm);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/publish")
    public ResponseEntity<Form> publishForm(@PathVariable String id) {
        Form publishedForm = formService.publishForm(id);
        
        if (publishedForm != null) {
            return ResponseEntity.ok(publishedForm);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/unpublish")
    public ResponseEntity<Form> unpublishForm(@PathVariable String id) {
        Form unpublishedForm = formService.unpublishForm(id);
        
        if (unpublishedForm != null) {
            return ResponseEntity.ok(unpublishedForm);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteForm(@PathVariable String id) {
        Form form = formService.getFormById(id);
        
        if (form != null) {
            formService.deleteForm(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
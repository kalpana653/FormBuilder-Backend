package com.form.FormBuilder.service;

import java.time.LocalDateTime;
import java.util.List;

import com.form.FormBuilder.repository.FormRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.form.FormBuilder.model.Form;

@Service
public class FormService {

    @Autowired
    private FormRepository formRepository;
    
    public List<Form> getAllForms() {
        return formRepository.findAll();
    }
    
    public List<Form> getFormsByUser(String userId) {
        return formRepository.findByCreatedBy(userId);
    }
    
    public List<Form> getPublishedForms() {
        return formRepository.findByPublishedTrue();
    }
    
    public List<Form> getPublishedFormsByUser(String userId) {
        return formRepository.findByCreatedByAndPublishedTrue(userId);
    }
    
    public Form getFormById(String id) {
        return formRepository.findById(id).orElse(null);
    }
    
    public Form createForm(Form form) {
        form.setCreatedAt(LocalDateTime.now());
        form.setUpdatedAt(LocalDateTime.now());
        return formRepository.save(form);
    }
    
    public Form updateForm(String id, Form form) {
        Form existingForm = getFormById(id);
        
        if (existingForm != null) {
            form.setId(id);
            form.setCreatedAt(existingForm.getCreatedAt());
            form.setCreatedBy(existingForm.getCreatedBy());
            form.setPublished(existingForm.isPublished());
            form.setUpdatedAt(LocalDateTime.now());
            
            return formRepository.save(form);
        }
        
        return null;
    }
    
    public Form publishForm(String id) {
        Form form = getFormById(id);
        
        if (form != null) {
            form.setPublished(true);
            form.setUpdatedAt(LocalDateTime.now());
            
            return formRepository.save(form);
        }
        
        return null;
    }
    
    public Form unpublishForm(String id) {
        Form form = getFormById(id);
        
        if (form != null) {
            form.setPublished(false);
            form.setUpdatedAt(LocalDateTime.now());
            
            return formRepository.save(form);
        }
        
        return null;
    }
    
    public void deleteForm(String id) {
        formRepository.deleteById(id);
    }
}
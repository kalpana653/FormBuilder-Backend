package com.form.FormBuilder.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.form.FormBuilder.model.Form;

@Repository
public interface FormRepository extends MongoRepository<Form, String> {
    
    List<Form> findByCreatedBy(String createdBy);
    
    List<Form> findByPublishedTrue();
    
    List<Form> findByCreatedByAndPublishedTrue(String createdBy);
}
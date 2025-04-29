package com.form.FormBuilder.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.form.FormBuilder.model.FormSubmission;

@Repository
public interface FormSubmissionRepository extends MongoRepository<FormSubmission, String> {
    
    List<FormSubmission> findByFormId(String formId);
    
    List<FormSubmission> findBySubmittedBy(String submittedBy);
    
    List<FormSubmission> findByStatus(String status);
    
    List<FormSubmission> findByFormIdAndStatus(String formId, String status);
    
    List<FormSubmission> findBySubmittedByAndStatus(String submittedBy, String status);
}
package com.form.FormBuilder.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.form.FormBuilder.model.FormSubmission;

@Repository
public interface FormSubmissionRepository extends MongoRepository<FormSubmission, String> {
    
    // Basic queries
    List<FormSubmission> findByFormId(String formId);
    
    Page<FormSubmission> findByFormId(String formId, Pageable pageable);
    
    List<FormSubmission> findBySubmittedBy(String submittedBy);
    
    Page<FormSubmission> findBySubmittedBy(String submittedBy, Pageable pageable);
    
    List<FormSubmission> findByStatus(String status);
    
    Page<FormSubmission> findByStatus(String status, Pageable pageable);
    
    List<FormSubmission> findByFormIdAndStatus(String formId, String status);
    
    Page<FormSubmission> findByFormIdAndStatus(String formId, String status, Pageable pageable);
    
    List<FormSubmission> findBySubmittedByAndStatus(String submittedBy, String status);
    
    Page<FormSubmission> findBySubmittedByAndStatus(String submittedBy, String status, Pageable pageable);
    
    // Count queries
    long countByFormId(String formId);
    
    long countByStatus(String status);
    
    long countByFormIdAndStatus(String formId, String status);
    
    // Advanced queries
    List<FormSubmission> findByAssignedTo(String assignedTo);
    
    Page<FormSubmission> findByAssignedTo(String assignedTo, Pageable pageable);
    
    List<FormSubmission> findByAssignedToAndStatus(String assignedTo, String status);
    
    List<FormSubmission> findByDueDateBefore(LocalDateTime dueDate);
    
    List<FormSubmission> findByDueDateAfter(LocalDateTime dueDate);
    
    List<FormSubmission> findByPriority(int priority);
    
    List<FormSubmission> findByPriorityGreaterThanEqual(int priority);
    
    List<FormSubmission> findBySubmittedAtBetween(LocalDateTime start, LocalDateTime end);
    
    // Search queries
    @Query("{'formData.?0': {$regex: ?1, $options: 'i'}}")
    List<FormSubmission> findByFormDataFieldContaining(String field, String value);
    
    @Query("{'formData.?0': ?1}")
    List<FormSubmission> findByFormDataFieldEquals(String field, Object value);
    
    @Query("{'metadata.?0': ?1}")
    List<FormSubmission> findByMetadataEquals(String key, Object value);
}
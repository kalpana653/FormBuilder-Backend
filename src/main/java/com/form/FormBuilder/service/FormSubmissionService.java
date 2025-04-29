package com.form.FormBuilder.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.form.FormBuilder.model.Form;
import com.form.FormBuilder.model.FormSubmission;
import com.form.FormBuilder.repository.FormSubmissionRepository;

@Service
public class FormSubmissionService {

    @Autowired
    private FormSubmissionRepository submissionRepository;
    
    @Autowired
    private FormService formService;
    
    public List<FormSubmission> getAllSubmissions() {
        return submissionRepository.findAll();
    }
    
    public List<FormSubmission> getSubmissionsByForm(String formId) {
        return submissionRepository.findByFormId(formId);
    }
    
    public List<FormSubmission> getSubmissionsByUser(String userId) {
        return submissionRepository.findBySubmittedBy(userId);
    }
    
    public List<FormSubmission> getSubmissionsByStatus(String status) {
        return submissionRepository.findByStatus(status);
    }
    
    public List<FormSubmission> getSubmissionsByFormAndStatus(String formId, String status) {
        return submissionRepository.findByFormIdAndStatus(formId, status);
    }
    
    public List<FormSubmission> getSubmissionsByUserAndStatus(String userId, String status) {
        return submissionRepository.findBySubmittedByAndStatus(userId, status);
    }
    
    public FormSubmission getSubmissionById(String id) {
        return submissionRepository.findById(id).orElse(null);
    }
    
    public FormSubmission createSubmission(FormSubmission submission) {
        // Get the form to set the title
        Form form = formService.getFormById(submission.getFormId());
        
        if (form != null) {
            submission.setFormTitle(form.getTitle());
            submission.setSubmittedAt(LocalDateTime.now());
            submission.setStatus("SUBMITTED");
            
            return submissionRepository.save(submission);
        }
        
        return null;
    }
    
    public FormSubmission updateSubmissionStatus(String id, String status) {
        FormSubmission submission = getSubmissionById(id);
        
        if (submission != null) {
            submission.setStatus(status);
            
            return submissionRepository.save(submission);
        }
        
        return null;
    }
    
    public void deleteSubmission(String id) {
        submissionRepository.deleteById(id);
    }
}
package com.form.FormBuilder.controller;
import java.util.List;
import com.form.FormBuilder.service.FormSubmissionService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.form.FormBuilder.model.FormSubmission;
@RestController
@RequestMapping("/api/submissions")
public class FormSubmissionApiController {

    @Autowired
    private FormSubmissionService submissionService;
    
    @GetMapping
    public ResponseEntity<List<FormSubmission>> getAllSubmissions() {
        List<FormSubmission> submissions = submissionService.getAllSubmissions();
        return ResponseEntity.ok(submissions);
    }
    
    @GetMapping("/form/{formId}")
    public ResponseEntity<List<FormSubmission>> getSubmissionsByForm(@PathVariable String formId) {
        List<FormSubmission> submissions = submissionService.getSubmissionsByForm(formId);
        return ResponseEntity.ok(submissions);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<FormSubmission>> getSubmissionsByStatus(@PathVariable String status) {
        List<FormSubmission> submissions = submissionService.getSubmissionsByStatus(status);
        return ResponseEntity.ok(submissions);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<FormSubmission> getSubmissionById(@PathVariable String id) {
        FormSubmission submission = submissionService.getSubmissionById(id);
        
        if (submission != null) {
            return ResponseEntity.ok(submission);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<FormSubmission> createSubmission(@RequestBody FormSubmission submission) {

        submission.setSubmittedBy(submission.getUserAgent());
        submission.setSubmitterName(submission.getSubmitterName());
        submission.setSubmitterEmail(submission.getSubmitterEmail());
        
        FormSubmission createdSubmission = submissionService.createSubmission(submission);
        
        if (createdSubmission != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(createdSubmission);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<FormSubmission> updateSubmissionStatus(
            @PathVariable String id, 
            @RequestParam String status) {
        
        FormSubmission updatedSubmission = submissionService.updateSubmissionStatus(id, status);
        
        if (updatedSubmission != null) {
            return ResponseEntity.ok(updatedSubmission);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubmission(@PathVariable String id) {
        FormSubmission submission = submissionService.getSubmissionById(id);
        
        if (submission != null) {
            submissionService.deleteSubmission(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
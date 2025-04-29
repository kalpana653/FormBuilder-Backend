package com.form.FormBuilder.controller;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import com.form.FormBuilder.service.FormSubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
@CrossOrigin(origins = "*") // Allow cross-origin requests for frontend integration
public class FormSubmissionApiController {

    @Autowired
    private final FormSubmissionService submissionService;
    
    public FormSubmissionApiController(FormSubmissionService submissionService) {
        this.submissionService = submissionService;
    }
    
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
        // Set submitter information
        submission.setSubmittedBy(submission.getUserAgent());
        submission.setSubmitterName(submission.getSubmitterName());
        submission.setSubmitterEmail(submission.getSubmitterEmail());
        
        // Set default values if not provided
        if (submission.getSubmittedBy() == null) {
            submission.setSubmittedBy("anonymous");
        }
        
        // Set form version if available
        if (submission.getFormVersion() == null) {
            submission.setFormVersion("1.0");
        }
        
        // Set submission metadata
        submission.setUpdatedAt(LocalDateTime.now());
        
        FormSubmission createdSubmission = submissionService.createSubmission(submission);
        
        if (createdSubmission != null) {
            // Create submission history entry for creation
            FormSubmission.FormSubmissionHistory history = new FormSubmission.FormSubmissionHistory();
            history.setId(UUID.randomUUID().toString());
            history.setAction("CREATED");
            history.setPerformedBy(submission.getSubmittedBy());
            
            if (createdSubmission.getHistory() == null) {
                createdSubmission.setHistory(new ArrayList<>());
            }
            createdSubmission.getHistory().add(history);
            
            // Save the updated submission with history
            createdSubmission = submissionService.updateSubmission(createdSubmission);
            
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
    
    @PostMapping("/{id}/notes")
    public ResponseEntity<FormSubmission> addSubmissionNote(
            @PathVariable String id,
            @RequestParam String text,
            @RequestParam(required = false, defaultValue = "system") String createdBy,
            @RequestParam(required = false, defaultValue = "false") boolean isPrivate) {
        
        FormSubmission updatedSubmission = submissionService.addSubmissionNote(id, text, createdBy, isPrivate);
        
        if (updatedSubmission != null) {
            return ResponseEntity.ok(updatedSubmission);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/assign")
    public ResponseEntity<FormSubmission> assignSubmission(
            @PathVariable String id,
            @RequestParam String assignedTo) {
        
        FormSubmission updatedSubmission = submissionService.assignSubmission(id, assignedTo);
        
        if (updatedSubmission != null) {
            return ResponseEntity.ok(updatedSubmission);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/priority")
    public ResponseEntity<FormSubmission> setPriority(
            @PathVariable String id,
            @RequestParam int priority) {
        
        FormSubmission updatedSubmission = submissionService.setPriority(id, priority);
        
        if (updatedSubmission != null) {
            return ResponseEntity.ok(updatedSubmission);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/due-date")
    public ResponseEntity<FormSubmission> setDueDate(
            @PathVariable String id,
            @RequestParam String dueDate) {
        
        LocalDateTime parsedDueDate = LocalDateTime.parse(dueDate);
        FormSubmission updatedSubmission = submissionService.setDueDate(id, parsedDueDate);
        
        if (updatedSubmission != null) {
            return ResponseEntity.ok(updatedSubmission);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/metadata")
    public ResponseEntity<FormSubmission> updateSubmissionMetadata(
            @PathVariable String id,
            @RequestBody Map<String, Object> metadata) {
        
        FormSubmission updatedSubmission = submissionService.updateSubmissionMetadata(id, metadata);
        
        if (updatedSubmission != null) {
            return ResponseEntity.ok(updatedSubmission);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/paginated")
    public ResponseEntity<Page<FormSubmission>> getAllSubmissionsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "submittedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Page<FormSubmission> submissions = submissionService.getAllSubmissionsPaginated(page, size, sortBy, direction);
        return ResponseEntity.ok(submissions);
    }
    
    @GetMapping("/form/{formId}/paginated")
    public ResponseEntity<Page<FormSubmission>> getSubmissionsByFormPaginated(
            @PathVariable String formId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "submittedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Page<FormSubmission> submissions = submissionService.getSubmissionsByFormPaginated(formId, page, size, sortBy, direction);
        return ResponseEntity.ok(submissions);
    }
    
    @GetMapping("/count/form/{formId}")
    public ResponseEntity<Long> countSubmissionsByForm(@PathVariable String formId) {
        long count = submissionService.countSubmissionsByForm(formId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/count/status/{status}")
    public ResponseEntity<Long> countSubmissionsByStatus(@PathVariable String status) {
        long count = submissionService.countSubmissionsByStatus(status);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/count/form/{formId}/status/{status}")
    public ResponseEntity<Long> countSubmissionsByFormAndStatus(
            @PathVariable String formId,
            @PathVariable String status) {
        
        long count = submissionService.countSubmissionsByFormAndStatus(formId, status);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/assigned/{assignedTo}")
    public ResponseEntity<List<FormSubmission>> getSubmissionsByAssignee(@PathVariable String assignedTo) {
        List<FormSubmission> submissions = submissionService.findByAssignedTo(assignedTo);
        return ResponseEntity.ok(submissions);
    }
    
    @GetMapping("/due-before")
    public ResponseEntity<List<FormSubmission>> getSubmissionsDueBefore(@RequestParam String date) {
        LocalDateTime parsedDate = LocalDateTime.parse(date);
        List<FormSubmission> submissions = submissionService.findByDueDateBefore(parsedDate);
        return ResponseEntity.ok(submissions);
    }
    
    @GetMapping("/due-after")
    public ResponseEntity<List<FormSubmission>> getSubmissionsDueAfter(@RequestParam String date) {
        LocalDateTime parsedDate = LocalDateTime.parse(date);
        List<FormSubmission> submissions = submissionService.findByDueDateAfter(parsedDate);
        return ResponseEntity.ok(submissions);
    }
    
    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<FormSubmission>> getSubmissionsByPriority(@PathVariable int priority) {
        List<FormSubmission> submissions = submissionService.findByPriority(priority);
        return ResponseEntity.ok(submissions);
    }
    
    @GetMapping("/search/field")
    public ResponseEntity<List<FormSubmission>> searchByFormDataField(
            @RequestParam String field,
            @RequestParam String value) {
        
        List<FormSubmission> submissions = submissionService.findByFormDataFieldContaining(field, value);
        return ResponseEntity.ok(submissions);
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
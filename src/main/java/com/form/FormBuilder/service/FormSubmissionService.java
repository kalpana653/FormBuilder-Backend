package com.form.FormBuilder.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    
    public Page<FormSubmission> getAllSubmissionsPaginated(int page, int size, String sortBy, String direction) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        return submissionRepository.findAll(pageable);
    }
    
    public List<FormSubmission> getSubmissionsByForm(String formId) {
        return submissionRepository.findByFormId(formId);
    }
    
    public Page<FormSubmission> getSubmissionsByFormPaginated(String formId, int page, int size, String sortBy, String direction) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        return submissionRepository.findByFormId(formId, pageable);
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
            submission.setUpdatedAt(LocalDateTime.now());
            
            // Set default status if not provided
            if (submission.getStatus() == null || submission.getStatus().isEmpty()) {
                submission.setStatus("SUBMITTED");
            }
            
            // Initialize collections if null
            if (submission.getMetadata() == null) {
                submission.setMetadata(new HashMap<>());
            }
            
            if (submission.getNotes() == null) {
                submission.setNotes(new ArrayList<>());
            }
            
            if (submission.getHistory() == null) {
                submission.setHistory(new ArrayList<>());
            }
            
            return submissionRepository.save(submission);
        }
        
        return null;
    }
    
    public FormSubmission updateSubmission(FormSubmission submission) {
        submission.setUpdatedAt(LocalDateTime.now());
        return submissionRepository.save(submission);
    }
    
    public FormSubmission updateSubmissionStatus(String id, String status) {
        FormSubmission submission = getSubmissionById(id);
        
        if (submission != null) {
            String oldStatus = submission.getStatus();
            submission.setStatus(status);
            submission.setUpdatedAt(LocalDateTime.now());
            
            // Add history entry for status change
            FormSubmission.FormSubmissionHistory history = new FormSubmission.FormSubmissionHistory();
            history.setId(UUID.randomUUID().toString());
            history.setAction("STATUS_CHANGED");
            history.setPerformedBy("system"); // This should be replaced with actual user
            
            Map<String, Object> changes = new HashMap<>();
            changes.put("oldStatus", oldStatus);
            changes.put("newStatus", status);
            history.setChanges(changes);
            
            if (submission.getHistory() == null) {
                submission.setHistory(new ArrayList<>());
            }
            submission.getHistory().add(history);
            
            return submissionRepository.save(submission);
        }
        
        return null;
    }
    
    public FormSubmission addSubmissionNote(String id, String text, String createdBy, boolean isPrivate) {
        FormSubmission submission = getSubmissionById(id);
        
        if (submission != null) {
            FormSubmission.FormSubmissionNote note = new FormSubmission.FormSubmissionNote();
            note.setId(UUID.randomUUID().toString());
            note.setText(text);
            note.setCreatedBy(createdBy);
            note.setCreatedAt(LocalDateTime.now());
            note.setPrivate(isPrivate);
            
            if (submission.getNotes() == null) {
                submission.setNotes(new ArrayList<>());
            }
            submission.getNotes().add(note);
            submission.setUpdatedAt(LocalDateTime.now());
            
            return submissionRepository.save(submission);
        }
        
        return null;
    }
    
    public FormSubmission assignSubmission(String id, String assignedTo) {
        FormSubmission submission = getSubmissionById(id);
        
        if (submission != null) {
            String previousAssignee = submission.getAssignedTo();
            submission.setAssignedTo(assignedTo);
            submission.setUpdatedAt(LocalDateTime.now());
            
            // Add history entry for assignment
            FormSubmission.FormSubmissionHistory history = new FormSubmission.FormSubmissionHistory();
            history.setId(UUID.randomUUID().toString());
            history.setAction("ASSIGNED");
            history.setPerformedBy("system"); // This should be replaced with actual user
            
            Map<String, Object> changes = new HashMap<>();
            changes.put("previousAssignee", previousAssignee);
            changes.put("newAssignee", assignedTo);
            history.setChanges(changes);
            
            if (submission.getHistory() == null) {
                submission.setHistory(new ArrayList<>());
            }
            submission.getHistory().add(history);
            
            return submissionRepository.save(submission);
        }
        
        return null;
    }
    
    public FormSubmission setPriority(String id, int priority) {
        FormSubmission submission = getSubmissionById(id);
        
        if (submission != null) {
            int oldPriority = submission.getPriority();
            submission.setPriority(priority);
            submission.setUpdatedAt(LocalDateTime.now());
            
            // Add history entry for priority change
            FormSubmission.FormSubmissionHistory history = new FormSubmission.FormSubmissionHistory();
            history.setId(UUID.randomUUID().toString());
            history.setAction("PRIORITY_CHANGED");
            history.setPerformedBy("system"); // This should be replaced with actual user
            
            Map<String, Object> changes = new HashMap<>();
            changes.put("oldPriority", oldPriority);
            changes.put("newPriority", priority);
            history.setChanges(changes);
            
            if (submission.getHistory() == null) {
                submission.setHistory(new ArrayList<>());
            }
            submission.getHistory().add(history);
            
            return submissionRepository.save(submission);
        }
        
        return null;
    }
    
    public FormSubmission setDueDate(String id, LocalDateTime dueDate) {
        FormSubmission submission = getSubmissionById(id);
        
        if (submission != null) {
            LocalDateTime oldDueDate = submission.getDueDate();
            submission.setDueDate(dueDate);
            submission.setUpdatedAt(LocalDateTime.now());
            
            // Add history entry for due date change
            FormSubmission.FormSubmissionHistory history = new FormSubmission.FormSubmissionHistory();
            history.setId(UUID.randomUUID().toString());
            history.setAction("DUE_DATE_CHANGED");
            history.setPerformedBy("system"); // This should be replaced with actual user
            
            Map<String, Object> changes = new HashMap<>();
            changes.put("oldDueDate", oldDueDate);
            changes.put("newDueDate", dueDate);
            history.setChanges(changes);
            
            if (submission.getHistory() == null) {
                submission.setHistory(new ArrayList<>());
            }
            submission.getHistory().add(history);
            
            return submissionRepository.save(submission);
        }
        
        return null;
    }
    
    public FormSubmission updateSubmissionMetadata(String id, Map<String, Object> metadata) {
        FormSubmission submission = getSubmissionById(id);
        
        if (submission != null) {
            // Merge existing metadata with new metadata
            Map<String, Object> updatedMetadata = new HashMap<>();
            if (submission.getMetadata() != null) {
                updatedMetadata.putAll(submission.getMetadata());
            }
            updatedMetadata.putAll(metadata);
            
            submission.setMetadata(updatedMetadata);
            submission.setUpdatedAt(LocalDateTime.now());
            
            return submissionRepository.save(submission);
        }
        
        return null;
    }
    
    public void deleteSubmission(String id) {
        submissionRepository.deleteById(id);
    }
    
    public long countSubmissionsByForm(String formId) {
        return submissionRepository.countByFormId(formId);
    }
    
    public long countSubmissionsByStatus(String status) {
        return submissionRepository.countByStatus(status);
    }
    
    public long countSubmissionsByFormAndStatus(String formId, String status) {
        return submissionRepository.countByFormIdAndStatus(formId, status);
    }
    
    public List<FormSubmission> findByAssignedTo(String assignedTo) {
        return submissionRepository.findByAssignedTo(assignedTo);
    }
    
    public List<FormSubmission> findByDueDateBefore(LocalDateTime dueDate) {
        return submissionRepository.findByDueDateBefore(dueDate);
    }
    
    public List<FormSubmission> findByDueDateAfter(LocalDateTime dueDate) {
        return submissionRepository.findByDueDateAfter(dueDate);
    }
    
    public List<FormSubmission> findByPriority(int priority) {
        return submissionRepository.findByPriority(priority);
    }
    
    public List<FormSubmission> findByFormDataFieldContaining(String field, String value) {
        return submissionRepository.findByFormDataFieldContaining(field, value);
    }
}
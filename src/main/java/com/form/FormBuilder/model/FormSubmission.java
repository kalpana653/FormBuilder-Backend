package com.form.FormBuilder.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "form_submissions")
public class FormSubmission {

    @Id
    private String id;
    
    private String formId;
    private String formTitle;
    private String formVersion;
    private String submittedBy;
    private String submitterName;
    private String submitterEmail;
    private String submitterPhone;
    private Map<String, Object> formData = new HashMap<>();
    private Map<String, List<String>> fileUploads = new HashMap<>();
    private Map<String, Object> metadata = new HashMap<>();
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
    private String status;
    private String ipAddress;
    private String userAgent;
    private String referrer;
    private String language;
    private String source;
    private String medium;
    private String campaign;
    private String term;
    private String content;
    private String device;
    private String browser;
    private String os;
    private String country;
    private String region;
    private String city;
    private List<FormSubmissionNote> notes = new ArrayList<>();
    private List<FormSubmissionHistory> history = new ArrayList<>();
    private boolean isTest = false;
    private boolean isSpam = false;
    private int completionTime; // in seconds
    private int score; // for scoring/grading forms
    private String assignedTo;
    private LocalDateTime dueDate;
    private int priority = 0; // 0=normal, 1=high, -1=low
    
    public FormSubmission() {
        this.submittedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = "SUBMITTED";
    }
    
    @Data
    public static class FormSubmissionNote {
        private String id;
        private String text;
        private String createdBy;
        private LocalDateTime createdAt;
        private boolean isPrivate;
        
        public FormSubmissionNote() {
            this.createdAt = LocalDateTime.now();
        }
    }
    
    @Data
    public static class FormSubmissionHistory {
        private String id;
        private String action;
        private String performedBy;
        private LocalDateTime performedAt;
        private Map<String, Object> changes = new HashMap<>();
        
        public FormSubmissionHistory() {
            this.performedAt = LocalDateTime.now();
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFormId() {
        return formId;
    }

    public void setFormId(String formId) {
        this.formId = formId;
    }

    public String getFormTitle() {
        return formTitle;
    }

    public void setFormTitle(String formTitle) {
        this.formTitle = formTitle;
    }

    public String getSubmittedBy() {
        return submittedBy;
    }

    public void setSubmittedBy(String submittedBy) {
        this.submittedBy = submittedBy;
    }

    public String getSubmitterName() {
        return submitterName;
    }

    public void setSubmitterName(String submitterName) {
        this.submitterName = submitterName;
    }

    public String getSubmitterEmail() {
        return submitterEmail;
    }

    public void setSubmitterEmail(String submitterEmail) {
        this.submitterEmail = submitterEmail;
    }

    public Map<String, Object> getFormData() {
        return formData;
    }

    public void setFormData(Map<String, Object> formData) {
        this.formData = formData;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
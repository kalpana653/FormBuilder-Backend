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
@Document(collection = "forms")
public class Form {

    @Id
    private String id;
    
    private String title;
    private String description;
    private String successMessage;
    private List<FormElement> elements = new ArrayList<>();
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean published;
    
    // Advanced settings
    private FormSettings settings = new FormSettings();
    private FormTheme theme = new FormTheme();
    private Map<String, Object> metadata = new HashMap<>();
    private List<FormLogic> logic = new ArrayList<>();
    private List<String> tags = new ArrayList<>();
    private String version = "1.0";
    private String language = "en";
    private boolean multiPage = false;
    private List<FormPage> pages = new ArrayList<>();
    
    public Form() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.published = false;
    }
    
    @Data
    public static class FormSettings {
        private boolean storeSubmissions = true;
        private boolean sendEmailNotifications = false;
        private String notificationEmail;
        private boolean requireAuthentication = false;
        private boolean allowMultipleSubmissions = true;
        private boolean showProgressBar = true;
        private boolean showPageTitles = true;
        private boolean showPageNumbers = true;
        private int submissionLimit = 0; // 0 means unlimited
        private String submitButtonText = "Submit";
        private String previousButtonText = "Previous";
        private String nextButtonText = "Next";
        private boolean enableSaveAndContinue = false;
        private boolean enablePrefill = false;
        private boolean enableAnalytics = false;
        private boolean enableCaptcha = false;
        private String captchaType = "recaptcha";
        private String captchaSiteKey;
    }
    
    @Data
    public static class FormTheme {
        private String primaryColor = "#3B82F6";
        private String secondaryColor = "#1E40AF";
        private String backgroundColor = "#FFFFFF";
        private String textColor = "#111827";
        private String successColor = "#10B981";
        private String errorColor = "#EF4444";
        private String warningColor = "#F59E0B";
        private String infoColor = "#3B82F6";
        private String fontFamily = "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
        private String fontSize = "16px";
        private String borderRadius = "4px";
        private String customCss;
        private String customHeaderHtml;
        private String customFooterHtml;
        private String logoUrl;
    }
    
    @Data
    public static class FormLogic {
        private String id;
        private String triggerElementId;
        private String triggerType; // equals, notEquals, contains, greaterThan, lessThan, etc.
        private Object triggerValue;
        private List<FormLogicAction> actions = new ArrayList<>();
    }
    
    @Data
    public static class FormLogicAction {
        private String targetElementId;
        private String actionType; // show, hide, require, disable, setValue, etc.
        private Object actionValue;
    }
    
    @Data
    public static class FormPage {
        private String id;
        private String title;
        private String description;
        private List<String> elementIds = new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSuccessMessage() {
        return successMessage;
    }

    public void setSuccessMessage(String successMessage) {
        this.successMessage = successMessage;
    }

    public List<FormElement> getElements() {
        return elements;
    }

    public void setElements(List<FormElement> elements) {
        this.elements = elements;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isPublished() {
        return published;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }
}
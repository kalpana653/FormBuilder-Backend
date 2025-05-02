package com.form.FormBuilder.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class FormElement {

    private String id;
    private String type;
    private String label;
    private String name;
    private String placeholder;
    private String defaultValue;
    private String helpText;
    private boolean required;
    private boolean hidden;
    private boolean disabled;
    private boolean readOnly;
    private List<FormElementOption> options = new ArrayList<>();
    private FormElementValidation validation = new FormElementValidation();
    private FormElementAppearance appearance = new FormElementAppearance();
    private Map<String, Object> properties = new HashMap<>();
    private Map<String, Object> metadata = new HashMap<>();
    private int displayOrder;
    private String parentId; // For nested elements
    private String groupId; // For grouped elements
    private String pageId; // For multi-page forms
    private String sectionId; // For sections
    
    public FormElement() {
    }
    
    @Data
    public static class FormElementValidation {
        private String pattern;
        private String patternErrorMessage;
        private Integer minLength;
        private Integer maxLength;
        private Double min;
        private Double max;
        private String minErrorMessage;
        private String maxErrorMessage;
        private String requiredErrorMessage;
        private List<String> acceptedFileTypes = new ArrayList<>();
        private Long maxFileSize; // in bytes
        private Integer maxFiles;
        private boolean validateOnChange = true;
        private boolean validateOnBlur = true;
        private String customValidation; // JavaScript function as string
    }
    
    @Data
    public static class FormElementAppearance {
        private String width = "100%";
        private String labelPosition = "top"; // top, left, right, bottom, hidden
        private String size = "medium"; // small, medium, large
        private String variant = "outlined"; // outlined, filled, standard
        private String alignment = "left"; // left, center, right
        private boolean showCharacterCount = false;
        private String customClass;
        private String customStyle;
        private String customIcon;
        private String customIconPosition = "left"; // left, right
        private boolean hideLabel = false;
        private boolean hideAsterisk = false;
        private boolean hideHelpText = false;
        private boolean hideErrorMessage = false;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPlaceholder() {
        return placeholder;
    }

    public void setPlaceholder(String placeholder) {
        this.placeholder = placeholder;
    }

    public String getDefaultValue() {
        return defaultValue;
    }

    public void setDefaultValue(String defaultValue) {
        this.defaultValue = defaultValue;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public List<FormElementOption> getOptions() {
        return options;
    }

    public void setOptions(List<FormElementOption> options) {
        this.options = options;
    }
}
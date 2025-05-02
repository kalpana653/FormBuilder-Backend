package com.form.FormBuilder.model;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class FormElementOption {

    private String id;
    private String value;
    private String label;
    private String description;
    private String icon;
    private String imageUrl;
    private boolean disabled;
    private boolean selected;
    private int displayOrder;
    private Map<String, Object> metadata = new HashMap<>();
    
    public FormElementOption() {
    }
    
    public FormElementOption(String value, String label) {
        this.value = value;
        this.label = label;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }
}
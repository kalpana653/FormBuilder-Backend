/**
 * Form Builder JavaScript
 * Handles the drag and drop form building functionality
 */

// Global variables
let formData = {
    title: '',
    description: '',
    successMessage: 'Thank you for your submission!',
    elements: []
};

let selectedElement = null;
let nextElementId = 1;

// DOM Ready
$(document).ready(function() {
    // Initialize the form builder
    initFormBuilder();
    
    // Load form data if editing an existing form
    const formId = getUrlParameter('id');
    if (formId) {
        loadForm(formId);
    }
});

/**
 * Initialize the form builder
 */
function initFormBuilder() {
    // Initialize drag and drop
    initDragAndDrop();
    
    // Initialize form settings
    initFormSettings();
    
    // Initialize form actions
    initFormActions();
    
    // Initialize modal
    initModal();
}

/**
 * Initialize drag and drop functionality
 */
function initDragAndDrop() {
    // Make field types draggable
    $('.field-type').draggable({
        helper: 'clone',
        cursor: 'move',
        revert: 'invalid',
        start: function(event, ui) {
            $(this).addClass('dragging');
        },
        stop: function(event, ui) {
            $(this).removeClass('dragging');
        }
    });
    
    // Make form canvas droppable
    $('#form-elements').droppable({
        accept: '.field-type',
        hoverClass: 'drag-over',
        drop: function(event, ui) {
            // Hide empty canvas message
            $('.empty-canvas').hide();
            
            // Get field type
            const fieldType = $(ui.draggable).data('type');
            
            // Add field to canvas
            addFieldToCanvas(fieldType);
        }
    });
    
    // Make form elements sortable
    $('#form-elements').sortable({
        items: '.form-element',
        cursor: 'move',
        update: function(event, ui) {
            updateFormData();
        }
    });
    
    // Clear canvas button
    $('#clear-canvas').click(function() {
        if (confirm('Are you sure you want to clear the form? This will remove all fields.')) {
            $('#form-elements').html('<div class="empty-canvas"><p><i class="fas fa-arrow-left"></i> Drag and drop fields here to build your form</p></div>');
            formData.elements = [];
            selectedElement = null;
            nextElementId = 1;
            $('#field-properties-form').hide();
            $('#no-field-selected').show();
        }
    });
}

/**
 * Initialize form settings
 */
function initFormSettings() {
    // Form title
    $('#form-title').on('input', function() {
        formData.title = $(this).val();
    });
    
    // Form description
    $('#form-description').on('input', function() {
        formData.description = $(this).val();
    });
    
    // Success message
    $('#form-success-message').on('input', function() {
        formData.successMessage = $(this).val();
    });
}

/**
 * Initialize form actions
 */
function initFormActions() {
    // Save form
    $('#save-form').click(function() {
        saveForm();
    });
    
    // Preview form
    $('#preview-form').click(function() {
        previewForm();
    });
    
    // Publish form
    $('#publish-form').click(function() {
        publishForm();
    });
}

/**
 * Initialize modal
 */
function initModal() {
    // Close modal when clicking the close button
    $('.close, #close-preview').click(function() {
        $('#preview-modal').hide();
    });
    
    // Close modal when clicking outside the modal content
    $(window).click(function(event) {
        if ($(event.target).is('#preview-modal')) {
            $('#preview-modal').hide();
        }
    });
}

/**
 * Add a field to the canvas
 */
function addFieldToCanvas(fieldType) {
    // Create a unique ID for the element
    const elementId = 'element-' + nextElementId++;
    
    // Create default element data
    const elementData = createDefaultElementData(fieldType, elementId);
    
    // Add element to form data
    formData.elements.push(elementData);
    
    // Create element HTML
    const elementHtml = createElementHtml(elementData);
    
    // Add element to canvas
    $('#form-elements').append(elementHtml);
    
    // Select the new element
    selectElement(elementId);
    
    // Add event listeners to the new element
    addElementEventListeners(elementId);
}

/**
 * Create default element data based on field type
 */
function createDefaultElementData(fieldType, elementId) {
    const elementData = {
        id: elementId,
        type: fieldType,
        label: getDefaultLabel(fieldType),
        name: getDefaultName(fieldType),
        placeholder: '',
        defaultValue: '',
        required: false
    };
    
    // Add options for select, radio, and checkbox fields
    if (fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox') {
        elementData.options = [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' }
        ];
    }
    
    return elementData;
}

/**
 * Get default label for a field type
 */
function getDefaultLabel(fieldType) {
    switch (fieldType) {
        case 'text': return 'Text Field';
        case 'textarea': return 'Text Area';
        case 'number': return 'Number';
        case 'email': return 'Email';
        case 'date': return 'Date';
        case 'select': return 'Dropdown';
        case 'radio': return 'Radio Buttons';
        case 'checkbox': return 'Checkboxes';
        case 'file': return 'File Upload';
        case 'section': return 'Section Break';
        default: return 'Field';
    }
}

/**
 * Get default name for a field type
 */
function getDefaultName(fieldType) {
    switch (fieldType) {
        case 'text': return 'text_field';
        case 'textarea': return 'text_area';
        case 'number': return 'number';
        case 'email': return 'email';
        case 'date': return 'date';
        case 'select': return 'dropdown';
        case 'radio': return 'radio_buttons';
        case 'checkbox': return 'checkboxes';
        case 'file': return 'file_upload';
        case 'section': return 'section_break';
        default: return 'field';
    }
}

/**
 * Create HTML for a form element
 */
function createElementHtml(elementData) {
    let html = `
        <div id="${elementData.id}" class="form-element" data-type="${elementData.type}">
            <div class="element-actions">
                <button class="duplicate-element" title="Duplicate"><i class="fas fa-copy"></i></button>
                <button class="delete-element" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
    `;
    
    if (elementData.type === 'section') {
        html += `<h3>${elementData.label}</h3>`;
        if (elementData.defaultValue) {
            html += `<p>${elementData.defaultValue}</p>`;
        }
    } else {
        html += `<label class="element-label">${elementData.label}${elementData.required ? '<span class="element-required">*</span>' : ''}</label>`;
        
        switch (elementData.type) {
            case 'text':
            case 'email':
            case 'number':
            case 'date':
                html += `<input type="${elementData.type}" placeholder="${elementData.placeholder}" ${elementData.required ? 'required' : ''} disabled>`;
                break;
            case 'textarea':
                html += `<textarea placeholder="${elementData.placeholder}" ${elementData.required ? 'required' : ''} disabled></textarea>`;
                break;
            case 'select':
                html += `<select ${elementData.required ? 'required' : ''} disabled>`;
                if (elementData.placeholder) {
                    html += `<option value="">${elementData.placeholder}</option>`;
                }
                elementData.options.forEach(option => {
                    html += `<option value="${option.value}">${option.label}</option>`;
                });
                html += `</select>`;
                break;
            case 'radio':
                elementData.options.forEach(option => {
                    html += `
                        <div class="radio-option">
                            <input type="radio" name="${elementData.name}" value="${option.value}" ${elementData.required ? 'required' : ''} disabled>
                            <label>${option.label}</label>
                        </div>
                    `;
                });
                break;
            case 'checkbox':
                elementData.options.forEach(option => {
                    html += `
                        <div class="checkbox-option">
                            <input type="checkbox" name="${elementData.name}" value="${option.value}" disabled>
                            <label>${option.label}</label>
                        </div>
                    `;
                });
                break;
            case 'file':
                html += `<input type="file" ${elementData.required ? 'required' : ''} disabled>`;
                break;
        }
    }
    
    html += `</div>`;
    
    return html;
}

/**
 * Add event listeners to a form element
 */
function addElementEventListeners(elementId) {
    // Select element when clicked
    $(`#${elementId}`).click(function(e) {
        // Prevent event bubbling
        e.stopPropagation();
        
        // Don't select if clicking on action buttons
        if ($(e.target).closest('.element-actions').length === 0) {
            selectElement(elementId);
        }
    });
    
    // Delete element
    $(`#${elementId} .delete-element`).click(function(e) {
        e.stopPropagation();
        deleteElement(elementId);
    });
    
    // Duplicate element
    $(`#${elementId} .duplicate-element`).click(function(e) {
        e.stopPropagation();
        duplicateElement(elementId);
    });
}

/**
 * Select a form element
 */
function selectElement(elementId) {
    // Deselect previously selected element
    $('.form-element').removeClass('selected');
    
    // Select the new element
    $(`#${elementId}`).addClass('selected');
    
    // Set the selected element
    selectedElement = elementId;
    
    // Show field properties
    showFieldProperties(elementId);
}

/**
 * Show field properties for the selected element
 */
function showFieldProperties(elementId) {
    // Find the element data
    const elementData = formData.elements.find(element => element.id === elementId);
    
    if (!elementData) {
        return;
    }
    
    // Show field properties form
    $('#no-field-selected').hide();
    $('#field-properties-form').show();
    
    // Set field properties
    $('#field-label').val(elementData.label);
    $('#field-name').val(elementData.name);
    $('#field-placeholder').val(elementData.placeholder || '');
    $('#field-default').val(elementData.defaultValue || '');
    $('#field-required').prop('checked', elementData.required);
    
    // Show/hide options container
    if (elementData.type === 'select' || elementData.type === 'radio' || elementData.type === 'checkbox') {
        $('#field-options-container').show();
        
        // Clear options
        $('#field-options').empty();
        
        // Add options
        elementData.options.forEach((option, index) => {
            addOptionToProperties(option.value, option.label, index);
        });
    } else {
        $('#field-options-container').hide();
    }
    
    // Add event listeners to field properties
    addFieldPropertiesEventListeners(elementId);
}

/**
 * Add event listeners to field properties
 */
function addFieldPropertiesEventListeners(elementId) {
    // Remove existing event listeners
    $('#field-label, #field-name, #field-placeholder, #field-default, #field-required').off('input change');
    $('#add-option').off('click');
    
    // Add new event listeners
    $('#field-label').on('input', function() {
        updateElementProperty(elementId, 'label', $(this).val());
    });
    
    $('#field-name').on('input', function() {
        updateElementProperty(elementId, 'name', $(this).val());
    });
    
    $('#field-placeholder').on('input', function() {
        updateElementProperty(elementId, 'placeholder', $(this).val());
    });
    
    $('#field-default').on('input', function() {
        updateElementProperty(elementId, 'defaultValue', $(this).val());
    });
    
    $('#field-required').on('change', function() {
        updateElementProperty(elementId, 'required', $(this).prop('checked'));
    });
    
    // Add option button
    $('#add-option').click(function() {
        const elementData = formData.elements.find(element => element.id === elementId);
        
        if (elementData) {
            // Add new option to element data
            const newOption = {
                value: `option${elementData.options.length + 1}`,
                label: `Option ${elementData.options.length + 1}`
            };
            
            elementData.options.push(newOption);
            
            // Add option to properties
            addOptionToProperties(newOption.value, newOption.label, elementData.options.length - 1);
            
            // Update element HTML
            updateElementHtml(elementId);
        }
    });
}

/**
 * Add an option to the field properties
 */
function addOptionToProperties(value, label, index) {
    const optionHtml = `
        <div class="option-item" data-index="${index}">
            <input type="text" class="option-label" value="${label}" placeholder="Option label">
            <input type="text" class="option-value" value="${value}" placeholder="Option value">
            <button class="remove-option"><i class="fas fa-times"></i></button>
        </div>
    `;
    
    $('#field-options').append(optionHtml);
    
    // Add event listeners to the new option
    const $newOption = $('#field-options .option-item').last();
    
    $newOption.find('.option-label').on('input', function() {
        updateOptionProperty(selectedElement, index, 'label', $(this).val());
    });
    
    $newOption.find('.option-value').on('input', function() {
        updateOptionProperty(selectedElement, index, 'value', $(this).val());
    });
    
    $newOption.find('.remove-option').click(function() {
        removeOption(selectedElement, index);
    });
}

/**
 * Update a property of an element
 */
function updateElementProperty(elementId, property, value) {
    // Find the element data
    const elementData = formData.elements.find(element => element.id === elementId);
    
    if (elementData) {
        // Update the property
        elementData[property] = value;
        
        // Update the element HTML
        updateElementHtml(elementId);
    }
}

/**
 * Update a property of an option
 */
function updateOptionProperty(elementId, optionIndex, property, value) {
    // Find the element data
    const elementData = formData.elements.find(element => element.id === elementId);
    
    if (elementData && elementData.options && elementData.options[optionIndex]) {
        // Update the property
        elementData.options[optionIndex][property] = value;
        
        // Update the element HTML
        updateElementHtml(elementId);
    }
}

/**
 * Remove an option
 */
function removeOption(elementId, optionIndex) {
    // Find the element data
    const elementData = formData.elements.find(element => element.id === elementId);
    
    if (elementData && elementData.options && elementData.options.length > 1) {
        // Remove the option
        elementData.options.splice(optionIndex, 1);
        
        // Update the element HTML
        updateElementHtml(elementId);
        
        // Update field properties
        showFieldProperties(elementId);
    } else {
        alert('You must have at least one option.');
    }
}

/**
 * Update the HTML of an element
 */
function updateElementHtml(elementId) {
    // Find the element data
    const elementData = formData.elements.find(element => element.id === elementId);
    
    if (elementData) {
        // Create new element HTML
        const elementHtml = createElementHtml(elementData);
        
        // Replace the old element HTML
        $(`#${elementId}`).replaceWith(elementHtml);
        
        // Add event listeners to the new element
        addElementEventListeners(elementId);
        
        // Re-select the element
        selectElement(elementId);
    }
}

/**
 * Delete an element
 */
function deleteElement(elementId) {
    if (confirm('Are you sure you want to delete this field?')) {
        // Remove the element from the form data
        formData.elements = formData.elements.filter(element => element.id !== elementId);
        
        // Remove the element from the canvas
        $(`#${elementId}`).remove();
        
        // Deselect the element
        selectedElement = null;
        
        // Hide field properties
        $('#field-properties-form').hide();
        $('#no-field-selected').show();
        
        // Show empty canvas message if no elements left
        if (formData.elements.length === 0) {
            $('.empty-canvas').show();
        }
    }
}

/**
 * Duplicate an element
 */
function duplicateElement(elementId) {
    // Find the element data
    const elementData = formData.elements.find(element => element.id === elementId);
    
    if (elementData) {
        // Create a copy of the element data
        const newElementData = JSON.parse(JSON.stringify(elementData));
        
        // Update the ID
        newElementData.id = 'element-' + nextElementId++;
        
        // Add the new element to the form data
        formData.elements.push(newElementData);
        
        // Create element HTML
        const elementHtml = createElementHtml(newElementData);
        
        // Add element to canvas
        $(`#${elementId}`).after(elementHtml);
        
        // Add event listeners to the new element
        addElementEventListeners(newElementData.id);
        
        // Select the new element
        selectElement(newElementData.id);
    }
}

/**
 * Update form data based on the current state of the form
 */
function updateFormData() {
    // Update elements order
    const newElements = [];
    
    $('#form-elements .form-element').each(function() {
        const elementId = $(this).attr('id');
        const elementData = formData.elements.find(element => element.id === elementId);
        
        if (elementData) {
            newElements.push(elementData);
        }
    });
    
    formData.elements = newElements;
}

/**
 * Save the form
 */
function saveForm() {
    // Validate form data
    if (!validateFormData()) {
        return;
    }
    
    // Update form data
    updateFormData();
    
    // Show loading message
    showAlert('Saving form...', 'info');
    
    // Get form ID if editing an existing form
    const formId = getUrlParameter('id');
    
    // API endpoint and method
    const endpoint = formId ? `/api/forms/${formId}` : '/api/forms';
    const method = formId ? 'PUT' : 'POST';
    
    // Save form data
    fetch(endpoint, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(savedForm => {
        console.log('Form saved:', savedForm);
        
        // Show success message
        showAlert('Form saved successfully!', 'success');
        
        // Redirect to edit page if new form
        if (!formId) {
            setTimeout(() => {
                window.location.href = `/builder?id=${savedForm.id}`;
            }, 1000);
        }
    })
    .catch(error => {
        console.error('Error saving form:', error);
        showAlert('Error saving form. Please try again.', 'danger');
    });
}

/**
 * Preview the form
 */
function previewForm() {
    // Validate form data
    if (!validateFormData()) {
        return;
    }
    
    // Update form data
    updateFormData();
    
    // Generate preview HTML
    let previewHtml = `
        <div class="preview-form">
            <h2>${formData.title || 'Untitled Form'}</h2>
            ${formData.description ? `<p>${formData.description}</p>` : ''}
    `;
    
    // Add form elements
    formData.elements.forEach(element => {
        if (element.type === 'section') {
            previewHtml += `
                <div class="form-section">
                    <h3>${element.label}</h3>
                    ${element.defaultValue ? `<p>${element.defaultValue}</p>` : ''}
                </div>
            `;
        } else {
            previewHtml += `
                <div class="form-group">
                    <label for="preview-${element.id}">${element.label}${element.required ? '<span class="element-required">*</span>' : ''}</label>
            `;
            
            switch (element.type) {
                case 'text':
                case 'email':
                case 'number':
                case 'date':
                    previewHtml += `
                        <input type="${element.type}" id="preview-${element.id}" name="${element.name}" 
                               placeholder="${element.placeholder}" value="${element.defaultValue}"
                               ${element.required ? 'required' : ''}>
                    `;
                    break;
                case 'textarea':
                    previewHtml += `
                        <textarea id="preview-${element.id}" name="${element.name}" 
                                  placeholder="${element.placeholder}" ${element.required ? 'required' : ''}>${element.defaultValue}</textarea>
                    `;
                    break;
                case 'select':
                    previewHtml += `
                        <select id="preview-${element.id}" name="${element.name}" ${element.required ? 'required' : ''}>
                    `;
                    
                    if (element.placeholder) {
                        previewHtml += `<option value="">${element.placeholder}</option>`;
                    }
                    
                    element.options.forEach(option => {
                        previewHtml += `
                            <option value="${option.value}" ${element.defaultValue === option.value ? 'selected' : ''}>${option.label}</option>
                        `;
                    });
                    
                    previewHtml += `</select>`;
                    break;
                case 'radio':
                    element.options.forEach(option => {
                        previewHtml += `
                            <div class="radio-option">
                                <input type="radio" id="preview-${element.id}-${option.value}" name="${element.name}" 
                                       value="${option.value}" ${element.defaultValue === option.value ? 'checked' : ''}
                                       ${element.required ? 'required' : ''}>
                                <label for="preview-${element.id}-${option.value}">${option.label}</label>
                            </div>
                        `;
                    });
                    break;
                case 'checkbox':
                    element.options.forEach(option => {
                        const isChecked = Array.isArray(element.defaultValue) && element.defaultValue.includes(option.value);
                        
                        previewHtml += `
                            <div class="checkbox-option">
                                <input type="checkbox" id="preview-${element.id}-${option.value}" name="${element.name}" 
                                       value="${option.value}" ${isChecked ? 'checked' : ''}>
                                <label for="preview-${element.id}-${option.value}">${option.label}</label>
                            </div>
                        `;
                    });
                    break;
                case 'file':
                    previewHtml += `
                        <input type="file" id="preview-${element.id}" name="${element.name}" ${element.required ? 'required' : ''}>
                    `;
                    break;
            }
            
            previewHtml += `</div>`;
        }
    });
    
    // Add submit button
    previewHtml += `
            <div class="form-group">
                <button type="submit" class="btn btn-primary">Submit</button>
            </div>
        </div>
    `;
    
    // Show preview
    $('#form-preview').html(previewHtml);
    $('#preview-modal').show();
}

/**
 * Publish the form
 */
function publishForm() {
    // Validate form data
    if (!validateFormData()) {
        return;
    }
    
    // Update form data
    updateFormData();
    
    // Get form ID
    const formId = getUrlParameter('id');
    
    if (!formId) {
        showAlert('Please save the form before publishing.', 'warning');
        return;
    }
    
    // Show loading message
    showAlert('Publishing form...', 'info');
    
    // Publish form
    fetch(`/api/forms/${formId}/publish`, {
        method: 'PUT'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(publishedForm => {
        console.log('Form published:', publishedForm);
        
        // Show success message
        showAlert('Form published successfully!', 'success');
    })
    .catch(error => {
        console.error('Error publishing form:', error);
        showAlert('Error publishing form. Please try again.', 'danger');
    });
}

/**
 * Load a form for editing
 */
function loadForm(formId) {
    // Show loading message
    showAlert('Loading form...', 'info');
    
    // Load form data
    fetch(`/api/forms/${formId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(loadedForm => {
        console.log('Form loaded:', loadedForm);
        
        // Set form data
        formData = loadedForm;
        
        // Set form settings
        $('#form-title').val(formData.title || '');
        $('#form-description').val(formData.description || '');
        $('#form-success-message').val(formData.successMessage || 'Thank you for your submission!');
        
        // Clear canvas
        $('#form-elements').empty();
        
        // Add elements to canvas
        if (formData.elements && formData.elements.length > 0) {
            // Hide empty canvas message
            $('.empty-canvas').hide();
            
            // Add elements
            formData.elements.forEach(element => {
                // Create element HTML
                const elementHtml = createElementHtml(element);
                
                // Add element to canvas
                $('#form-elements').append(elementHtml);
                
                // Add event listeners to the element
                addElementEventListeners(element.id);
                
                // Update next element ID
                const idNumber = parseInt(element.id.replace('element-', ''));
                if (idNumber >= nextElementId) {
                    nextElementId = idNumber + 1;
                }
            });
        } else {
            // Show empty canvas message
            $('#form-elements').html('<div class="empty-canvas"><p><i class="fas fa-arrow-left"></i> Drag and drop fields here to build your form</p></div>');
        }
        
        // Show success message
        showAlert('Form loaded successfully!', 'success');
    })
    .catch(error => {
        console.error('Error loading form:', error);
        showAlert('Error loading form. Please try again.', 'danger');
    });
}

/**
 * Validate form data
 */
function validateFormData() {
    // Check if form has a title
    if (!formData.title) {
        showAlert('Please enter a form title.', 'warning');
        $('#form-title').focus();
        return false;
    }
    
    // Check if form has at least one element
    if (formData.elements.length === 0) {
        showAlert('Please add at least one field to the form.', 'warning');
        return false;
    }
    
    // Check if all elements have labels
    for (const element of formData.elements) {
        if (!element.label) {
            showAlert('All fields must have a label.', 'warning');
            selectElement(element.id);
            $('#field-label').focus();
            return false;
        }
    }
    
    return true;
}

/**
 * Show an alert message
 */
function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) {
        return;
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = message;
    
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alert);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 5000);
}

/**
 * Get URL parameter
 */
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
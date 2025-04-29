/**
 * FormBuilder JavaScript
 * Handles form creation, validation, and submission
 */

// Global variables
let currentFormTemplate = null;
let currentApplicationForm = null;
let currentSectionIndex = 0;

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the form builder
    initFormBuilder();
    
    // Add event listeners
    addEventListeners();
});

/**
 * Initialize the form builder
 */
function initFormBuilder() {
    console.log('Initializing form builder...');
    
    // Load form templates if on the templates page
    if (document.getElementById('form-templates-list')) {
        console.log('Templates page detected, loading templates...');
        loadFormTemplates();
    }
    
    // Load application form if on the form page
    const formId = getUrlParameter('formId');
    if (formId && document.getElementById('application-form')) {
        console.log('Form page detected with ID:', formId);
        loadApplicationForm(formId);
    }
    
    // Add event listener for the "Get Started" button on the home page
    const getStartedBtn = document.querySelector('.hero .btn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/templates';
        });
    }
}

/**
 * Add event listeners
 */
function addEventListeners() {
    // Form navigation buttons
    const prevButton = document.getElementById('prev-section');
    const nextButton = document.getElementById('next-section');
    
    if (prevButton) {
        prevButton.addEventListener('click', navigateToPreviousSection);
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', navigateToNextSection);
    }
    
    // Form submission
    const submitFormButton = document.getElementById('submit-form');
    if (submitFormButton) {
        submitFormButton.addEventListener('click', submitForm);
    }
    
    // Add repeatable section
    const addSectionButtons = document.querySelectorAll('.add-section-btn');
    addSectionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section-id');
            addRepeatableSection(sectionId);
        });
    });
}

/**
 * Load form templates
 */
function loadFormTemplates() {
    console.log('Loading form templates...');
    
    // Show loading state
    const templatesList = document.getElementById('form-templates-list');
    templatesList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading forms...</div>';
    
    // First, check if we have a demo template, if not create one
    fetch('/api/form-templates/published')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(templates => {
            console.log('Templates loaded:', templates);
            
            if (!templates || templates.length === 0) {
                // No templates found, create a demo template automatically
                console.log('No templates found, creating demo template...');
                return createDemoTemplateAndReturn();
            }
            
            return templates;
        })
        .then(templates => {
            // Display the templates
            templatesList.innerHTML = '';
            
            if (!templates || templates.length === 0) {
                templatesList.innerHTML = `
                    <div class="error-message">
                        <p>No forms available. Please try again later or contact the administrator.</p>
                    </div>
                `;
                return;
            }
            
            templates.forEach(template => {
                const templateItem = document.createElement('div');
                templateItem.className = 'form-template-item';
                templateItem.innerHTML = `
                    <h3>${template.name}</h3>
                    <p>${template.description}</p>
                    <button class="btn" onclick="createApplicationForm('${template.id}')">Fill Out Form</button>
                `;
                templatesList.appendChild(templateItem);
            });
        })
        .catch(error => {
            console.error('Error loading forms:', error);
            templatesList.innerHTML = `
                <div class="error-message">
                    <p>Error loading forms. This could be because:</p>
                    <ul>
                        <li>MongoDB is not running</li>
                        <li>There was a server error</li>
                    </ul>
                    <p>Please try again later or contact the administrator.</p>
                </div>
            `;
            showAlert('Error loading forms. Please make sure MongoDB is running.', 'warning');
        });
}

/**
 * Create a demo template and return it
 */
function createDemoTemplateAndReturn() {
    console.log('Creating demo template automatically...');
    
    const demoTemplate = {
        name: "Job Application Form",
        description: "Complete application form for job seekers",
        version: "1.0",
        sections: [
            {
                title: "Basic Information",
                description: "Personal details of the applicant",
                displayOrder: 1,
                required: true,
                repeatable: false,
                fields: [
                    {
                        name: "firstName",
                        label: "First Name",
                        placeholder: "Enter your first name",
                        type: "TEXT",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 1
                    },
                    {
                        name: "lastName",
                        label: "Last Name",
                        placeholder: "Enter your last name",
                        type: "TEXT",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 2
                    },
                    {
                        name: "email",
                        label: "Email Address",
                        placeholder: "Enter your email",
                        type: "EMAIL",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 3
                    },
                    {
                        name: "phone",
                        label: "Phone Number",
                        placeholder: "Enter your phone number",
                        type: "TEXT",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 4
                    }
                ]
            },
            {
                title: "Educational Information",
                description: "Details about your education",
                displayOrder: 2,
                required: true,
                repeatable: true,
                fields: [
                    {
                        name: "institutionName",
                        label: "Institution Name",
                        placeholder: "Enter institution name",
                        type: "TEXT",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 1
                    },
                    {
                        name: "degree",
                        label: "Degree",
                        placeholder: "Enter degree obtained",
                        type: "TEXT",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 2
                    },
                    {
                        name: "fieldOfStudy",
                        label: "Field of Study",
                        placeholder: "Enter your field of study",
                        type: "TEXT",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 3
                    },
                    {
                        name: "startDate",
                        label: "Start Date",
                        type: "DATE",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 4
                    },
                    {
                        name: "endDate",
                        label: "End Date",
                        type: "DATE",
                        required: false,
                        enabled: true,
                        visible: true,
                        displayOrder: 5
                    }
                ]
            },
            {
                title: "Work Experience",
                description: "Details about your previous work experience",
                displayOrder: 3,
                required: false,
                repeatable: true,
                fields: [
                    {
                        name: "companyName",
                        label: "Company Name",
                        placeholder: "Enter company name",
                        type: "TEXT",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 1
                    },
                    {
                        name: "position",
                        label: "Position",
                        placeholder: "Enter your job title",
                        type: "TEXT",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 2
                    },
                    {
                        name: "startDate",
                        label: "Start Date",
                        type: "DATE",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 3
                    },
                    {
                        name: "endDate",
                        label: "End Date",
                        type: "DATE",
                        required: false,
                        enabled: true,
                        visible: true,
                        displayOrder: 4
                    },
                    {
                        name: "description",
                        label: "Job Description",
                        placeholder: "Describe your responsibilities",
                        type: "TEXTAREA",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 6
                    }
                ]
            }
        ]
    };
    
    // Create the template
    return fetch('/api/form-templates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(demoTemplate)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(createdTemplate => {
        console.log('Demo template created:', createdTemplate);
        
        // Publish the template
        return fetch(`/api/form-templates/${createdTemplate.id}/publish`, {
            method: 'PUT'
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(publishedTemplate => {
        console.log('Demo template published:', publishedTemplate);
        return [publishedTemplate]; // Return as an array to match the expected format
    })
    .catch(error => {
        console.error('Error creating demo template:', error);
        return []; // Return empty array on error
    });
}

/**
 * Create a new application form
 */
function createApplicationForm(templateId) {
    console.log('Creating application form for template:', templateId);
    showAlert('Creating your form...', 'info');
    
    // In a real application, you would get these values from the user profile or login
    // For now, we'll use default values
    const applicantId = 'user' + Math.floor(Math.random() * 10000); // Generate a random user ID
    const applicantName = 'John Doe';
    const applicantEmail = 'john.doe@example.com';
    
    fetch(`/api/application-forms?formTemplateId=${templateId}&applicantId=${applicantId}&applicantName=${applicantName}&applicantEmail=${applicantEmail}`, {
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(form => {
        console.log('Application form created:', form);
        
        // Redirect to the form page
        window.location.href = `/form.html?formId=${form.id}`;
    })
    .catch(error => {
        console.error('Error creating application form:', error);
        showAlert('Error creating application form. Please try again later.', 'danger');
    });
}

/**
 * Load an application form
 */
function loadApplicationForm(formId) {
    console.log('Loading application form:', formId);
    
    // Check if we're in readonly mode (for admin viewing)
    const readonly = getUrlParameter('readonly') === 'true';
    
    fetch(`/api/application-forms/${formId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(form => {
            console.log('Application form loaded:', form);
            currentApplicationForm = form;
            
            // Load the form template
            return fetch(`/api/form-templates/${form.formTemplateId}`);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(template => {
            console.log('Form template loaded:', template);
            currentFormTemplate = template;
            
            // Render the form
            renderForm(readonly);
            
            // Update progress
            updateFormProgress(readonly);
        })
        .catch(error => {
            console.error('Error loading application form:', error);
            showAlert('Error loading application form. Please try again later.', 'danger');
            
            // Show error in the form container
            const formContainer = document.getElementById('application-form');
            if (formContainer) {
                formContainer.innerHTML = `
                    <div class="error-message">
                        <h3>Error Loading Form</h3>
                        <p>There was an error loading the form. This could be because:</p>
                        <ul>
                            <li>The form ID is invalid</li>
                            <li>MongoDB is not running</li>
                            <li>There was a server error</li>
                        </ul>
                        <p>Please try again later or contact the administrator.</p>
                        <a href="/templates" class="btn">Back to Forms</a>
                    </div>
                `;
            }
        });
}

/**
 * Render the form
 */
function renderForm(readonly = false) {
    const formContainer = document.getElementById('application-form');
    formContainer.innerHTML = '';
    
    // Render form title and description
    const formHeader = document.createElement('div');
    formHeader.className = 'form-header';
    
    // Add status badge if in readonly mode
    let statusBadge = '';
    if (readonly && currentApplicationForm.status) {
        const statusClass = currentApplicationForm.status === 'APPROVED' ? 'success' : 
                           (currentApplicationForm.status === 'REJECTED' ? 'danger' : 'info');
        statusBadge = `<span class="status-badge status-${statusClass}">${currentApplicationForm.status}</span>`;
    }
    
    formHeader.innerHTML = `
        <h2>${currentFormTemplate.name} ${statusBadge}</h2>
        <p>${currentFormTemplate.description}</p>
        ${readonly ? `<div class="applicant-info">
            <p><strong>Applicant:</strong> ${currentApplicationForm.applicantName} (${currentApplicationForm.applicantEmail})</p>
            <p><strong>Submitted:</strong> ${new Date(currentApplicationForm.updatedAt).toLocaleString()}</p>
        </div>` : ''}
    `;
    formContainer.appendChild(formHeader);
    
    // Render form progress
    const formProgress = document.createElement('div');
    formProgress.className = 'form-progress';
    formProgress.innerHTML = `
        <div class="progress-steps" id="progress-steps"></div>
    `;
    formContainer.appendChild(formProgress);
    
    // Render form sections
    const formSections = document.createElement('div');
    formSections.className = 'form-sections';
    formSections.id = 'form-sections';
    formContainer.appendChild(formSections);
    
    // Render form navigation
    const formNav = document.createElement('div');
    formNav.className = 'form-nav';
    
    if (readonly) {
        // In readonly mode, just show navigation buttons
        formNav.innerHTML = `
            <button class="btn btn-secondary" id="prev-section">Previous</button>
            <button class="btn" id="next-section">Next</button>
            <a href="/admin" class="btn btn-primary">Back to Admin</a>
        `;
    } else {
        // In edit mode, show navigation and submit buttons
        formNav.innerHTML = `
            <button class="btn btn-secondary" id="prev-section">Previous</button>
            <button class="btn" id="next-section">Next</button>
            <button class="btn btn-success" id="submit-form" style="display: none;">Submit Application</button>
        `;
    }
    
    formContainer.appendChild(formNav);
    
    // Render the current section
    renderSection(currentSectionIndex, readonly);
    
    // Update progress steps
    updateProgressSteps();
    
    // Add event listeners
    addEventListeners();
}

/**
 * Render a form section
 */
function renderSection(index, readonly = false) {
    const formSections = document.getElementById('form-sections');
    formSections.innerHTML = '';
    
    if (index < 0 || index >= currentFormTemplate.sections.length) {
        return;
    }
    
    const section = currentFormTemplate.sections[index];
    const sectionData = currentApplicationForm.sectionData[section.id] || { fieldValues: {} };
    
    const sectionElement = document.createElement('div');
    sectionElement.className = 'form-section';
    sectionElement.innerHTML = `
        <h3>${section.title}</h3>
        <p>${section.description}</p>
    `;
    
    // Render fields
    const fieldsContainer = document.createElement('div');
    fieldsContainer.className = 'fields-container';
    
    section.fields.forEach(field => {
        const fieldValue = sectionData.fieldValues[field.name] || field.defaultValue || '';
        const fieldElement = document.createElement('div');
        fieldElement.className = 'form-group';
        
        let fieldHtml = `<label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>`;
        
        if (readonly) {
            // In readonly mode, just show the value
            let displayValue = fieldValue;
            
            // Format the value based on field type
            if (field.type === 'DATE' && fieldValue) {
                displayValue = new Date(fieldValue).toLocaleDateString();
            } else if (field.type === 'CHECKBOX' && Array.isArray(fieldValue)) {
                displayValue = fieldValue.join(', ');
            } else if (field.type === 'SELECT' || field.type === 'RADIO') {
                // Find the label for the selected value
                const option = field.options ? field.options.find(opt => opt.value === fieldValue) : null;
                displayValue = option ? option.label : fieldValue;
            }
            
            fieldHtml += `<div class="field-value">${displayValue || '<em>Not provided</em>'}</div>`;
        } else {
            // In edit mode, show the input field
            switch (field.type) {
                case 'TEXT':
                case 'EMAIL':
                case 'NUMBER':
                case 'DATE':
                    fieldHtml += `
                        <input type="${field.type.toLowerCase()}" 
                               id="${field.name}" 
                               name="${field.name}" 
                               value="${fieldValue}"
                               placeholder="${field.placeholder || ''}"
                               ${field.required ? 'required' : ''}
                               ${!field.enabled ? 'disabled' : ''}>
                    `;
                    break;
                case 'TEXTAREA':
                    fieldHtml += `
                        <textarea id="${field.name}" 
                                  name="${field.name}"
                                  placeholder="${field.placeholder || ''}"
                                  ${field.required ? 'required' : ''}
                                  ${!field.enabled ? 'disabled' : ''}>${fieldValue}</textarea>
                    `;
                    break;
                case 'SELECT':
                    fieldHtml += `
                        <select id="${field.name}" 
                                name="${field.name}"
                                ${field.required ? 'required' : ''}
                                ${!field.enabled ? 'disabled' : ''}>
                            <option value="">Select an option</option>
                            ${field.options.map(option => `
                                <option value="${option.value}" ${fieldValue === option.value ? 'selected' : ''}>
                                    ${option.label}
                                </option>
                            `).join('')}
                        </select>
                    `;
                    break;
                case 'RADIO':
                    fieldHtml += `
                        <div class="radio-group">
                            ${field.options.map(option => `
                                <div class="radio-option">
                                    <input type="radio" 
                                           id="${field.name}_${option.value}" 
                                           name="${field.name}" 
                                           value="${option.value}"
                                           ${fieldValue === option.value ? 'checked' : ''}
                                           ${field.required ? 'required' : ''}
                                           ${!field.enabled ? 'disabled' : ''}>
                                    <label for="${field.name}_${option.value}">${option.label}</label>
                                </div>
                            `).join('')}
                        </div>
                    `;
                    break;
                case 'CHECKBOX':
                    const checkboxValues = Array.isArray(fieldValue) ? fieldValue : (fieldValue ? [fieldValue] : []);
                    fieldHtml += `
                        <div class="checkbox-group">
                            ${field.options.map(option => `
                                <div class="checkbox-option">
                                    <input type="checkbox" 
                                           id="${field.name}_${option.value}" 
                                           name="${field.name}" 
                                           value="${option.value}"
                                           ${checkboxValues.includes(option.value) ? 'checked' : ''}
                                           ${!field.enabled ? 'disabled' : ''}>
                                    <label for="${field.name}_${option.value}">${option.label}</label>
                                </div>
                            `).join('')}
                        </div>
                    `;
                    break;
            }
        }
        
        if (field.helpText && !readonly) {
            fieldHtml += `<small class="help-text">${field.helpText}</small>`;
        }
        
        fieldElement.innerHTML = fieldHtml;
        fieldsContainer.appendChild(fieldElement);
    });
    
    sectionElement.appendChild(fieldsContainer);
    
    // Render repeatable sections
    if (section.repeatable) {
        const repeatableSections = document.createElement('div');
        repeatableSections.className = 'repeatable-sections';
        repeatableSections.id = `repeatable-sections-${section.id}`;
        
        // Render existing repeated sections
        if (sectionData.repeatedSections && sectionData.repeatedSections.length > 0) {
            sectionData.repeatedSections.forEach((repeatedSection, idx) => {
                const repeatedSectionElement = createRepeatableSectionElement(section, repeatedSection, idx, readonly);
                repeatableSections.appendChild(repeatedSectionElement);
            });
        }
        
        // Add button to add more sections (only in edit mode)
        if (!readonly) {
            const addButton = document.createElement('div');
            addButton.className = 'add-section-btn';
            addButton.setAttribute('data-section-id', section.id);
            addButton.innerHTML = `<i class="fas fa-plus"></i> Add Another ${section.title}`;
            sectionElement.appendChild(repeatableSections);
            sectionElement.appendChild(addButton);
        } else {
            sectionElement.appendChild(repeatableSections);
        }
    }
    
    formSections.appendChild(sectionElement);
}

/**
 * Create a repeatable section element
 */
function createRepeatableSectionElement(section, data, index, readonly = false) {
    const element = document.createElement('div');
    element.className = 'repeatable-section';
    element.setAttribute('data-index', index);
    
    // Add remove button (only in edit mode)
    if (!readonly) {
        const removeButton = document.createElement('button');
        removeButton.className = 'remove-btn';
        removeButton.innerHTML = '&times;';
        removeButton.addEventListener('click', function() {
            removeRepeatableSection(section.id, index);
        });
        
        element.appendChild(removeButton);
    }
    
    // Add fields
    const fieldsContainer = document.createElement('div');
    fieldsContainer.className = 'fields-container';
    
    section.fields.forEach(field => {
        const fieldValue = data[field.name] || field.defaultValue || '';
        const fieldElement = document.createElement('div');
        fieldElement.className = 'form-group';
        
        let fieldHtml = `<label for="${field.name}_${index}">${field.label}${field.required ? ' *' : ''}</label>`;
        
        if (readonly) {
            // In readonly mode, just show the value
            let displayValue = fieldValue;
            
            // Format the value based on field type
            if (field.type === 'DATE' && fieldValue) {
                displayValue = new Date(fieldValue).toLocaleDateString();
            }
            
            fieldHtml += `<div class="field-value">${displayValue || '<em>Not provided</em>'}</div>`;
        } else {
            // In edit mode, show the input field
            switch (field.type) {
                case 'TEXT':
                case 'EMAIL':
                case 'NUMBER':
                case 'DATE':
                    fieldHtml += `
                        <input type="${field.type.toLowerCase()}" 
                               id="${field.name}_${index}" 
                               name="${field.name}_${index}" 
                               value="${fieldValue}"
                               placeholder="${field.placeholder || ''}"
                               ${field.required ? 'required' : ''}
                               ${!field.enabled ? 'disabled' : ''}>
                    `;
                    break;
                case 'TEXTAREA':
                    fieldHtml += `
                        <textarea id="${field.name}_${index}" 
                                  name="${field.name}_${index}"
                                  placeholder="${field.placeholder || ''}"
                                  ${field.required ? 'required' : ''}
                                  ${!field.enabled ? 'disabled' : ''}>${fieldValue}</textarea>
                    `;
                    break;
                case 'SELECT':
                    fieldHtml += `
                        <select id="${field.name}_${index}" 
                                name="${field.name}_${index}"
                                ${field.required ? 'required' : ''}
                                ${!field.enabled ? 'disabled' : ''}>
                            <option value="">Select an option</option>
                            ${field.options.map(option => `
                                <option value="${option.value}" ${fieldValue === option.value ? 'selected' : ''}>
                                    ${option.label}
                                </option>
                            `).join('')}
                        </select>
                    `;
                    break;
                // Add other field types as needed
            }
        }
        
        if (field.helpText && !readonly) {
            fieldHtml += `<small class="help-text">${field.helpText}</small>`;
        }
        
        fieldElement.innerHTML = fieldHtml;
        fieldsContainer.appendChild(fieldElement);
    });
    
    element.appendChild(fieldsContainer);
    return element;
}

/**
 * Navigate to the previous section
 */
function navigateToPreviousSection() {
    // Save current section data
    saveCurrentSectionData();
    
    // Navigate to previous section
    if (currentSectionIndex > 0) {
        currentSectionIndex--;
        renderSection(currentSectionIndex);
        updateFormProgress();
    }
}

/**
 * Navigate to the next section
 */
function navigateToNextSection() {
    // Validate current section
    if (!validateCurrentSection()) {
        return;
    }
    
    // Save current section data
    saveCurrentSectionData();
    
    // Navigate to next section
    if (currentSectionIndex < currentFormTemplate.sections.length - 1) {
        currentSectionIndex++;
        renderSection(currentSectionIndex);
        updateFormProgress();
    }
}

/**
 * Validate the current section
 */
function validateCurrentSection() {
    const section = currentFormTemplate.sections[currentSectionIndex];
    let isValid = true;
    
    // Check required fields
    section.fields.forEach(field => {
        if (field.required) {
            const fieldElement = document.getElementById(field.name);
            if (!fieldElement.value) {
                fieldElement.classList.add('invalid');
                isValid = false;
            } else {
                fieldElement.classList.remove('invalid');
            }
        }
    });
    
    if (!isValid) {
        showAlert('Please fill in all required fields.', 'warning');
    }
    
    return isValid;
}

/**
 * Save the current section data
 */
function saveCurrentSectionData() {
    const section = currentFormTemplate.sections[currentSectionIndex];
    const fieldValues = {};
    
    // Get field values
    section.fields.forEach(field => {
        const fieldElement = document.getElementById(field.name);
        if (fieldElement) {
            if (field.type === 'CHECKBOX') {
                // Handle checkbox groups
                const checkboxes = document.querySelectorAll(`input[name="${field.name}"]:checked`);
                const values = Array.from(checkboxes).map(cb => cb.value);
                fieldValues[field.name] = values;
            } else {
                fieldValues[field.name] = fieldElement.value;
            }
        }
    });
    
    // Get repeatable sections if applicable
    if (section.repeatable) {
        const repeatableSections = [];
        const repeatableSectionElements = document.querySelectorAll(`#repeatable-sections-${section.id} .repeatable-section`);
        
        repeatableSectionElements.forEach((element, index) => {
            const sectionData = {};
            
            section.fields.forEach(field => {
                const fieldElement = document.getElementById(`${field.name}_${index}`);
                if (fieldElement) {
                    sectionData[field.name] = fieldElement.value;
                }
            });
            
            repeatableSections.push(sectionData);
        });
        
        // Update the application form
        if (!currentApplicationForm.sectionData[section.id]) {
            currentApplicationForm.sectionData[section.id] = {};
        }
        
        currentApplicationForm.sectionData[section.id].repeatedSections = repeatableSections;
    }
    
    // Update the application form
    if (!currentApplicationForm.sectionData[section.id]) {
        currentApplicationForm.sectionData[section.id] = {
            sectionId: section.id,
            sectionTitle: section.title,
            fieldValues: {},
            completed: false
        };
    }
    
    currentApplicationForm.sectionData[section.id].fieldValues = fieldValues;
    currentApplicationForm.sectionData[section.id].completed = true;
    
    // Save to server
    updateSectionData(section.id, fieldValues);
}

/**
 * Update section data on the server
 */
function updateSectionData(sectionId, fieldValues) {
    fetch(`/api/application-forms/${currentApplicationForm.id}/sections/${sectionId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fieldValues)
    })
        .then(response => response.json())
        .then(updatedForm => {
            currentApplicationForm = updatedForm;
        })
        .catch(error => {
            console.error('Error updating section data:', error);
            showAlert('Error saving section data. Please try again.', 'danger');
        });
}

/**
 * Add a repeatable section
 */
function addRepeatableSection(sectionId) {
    const section = currentFormTemplate.sections.find(s => s.id === sectionId);
    if (!section || !section.repeatable) {
        return;
    }
    
    // Create empty section data
    const sectionData = {};
    section.fields.forEach(field => {
        sectionData[field.name] = field.defaultValue || '';
    });
    
    // Add to the UI
    const repeatableSections = document.getElementById(`repeatable-sections-${sectionId}`);
    const index = repeatableSections.children.length;
    const element = createRepeatableSectionElement(section, sectionData, index);
    repeatableSections.appendChild(element);
    
    // Update the application form
    if (!currentApplicationForm.sectionData[sectionId]) {
        currentApplicationForm.sectionData[sectionId] = {
            sectionId: sectionId,
            sectionTitle: section.title,
            fieldValues: {},
            completed: false,
            repeatedSections: []
        };
    }
    
    if (!currentApplicationForm.sectionData[sectionId].repeatedSections) {
        currentApplicationForm.sectionData[sectionId].repeatedSections = [];
    }
    
    currentApplicationForm.sectionData[sectionId].repeatedSections.push(sectionData);
    
    // Save to server
    fetch(`/api/application-forms/${currentApplicationForm.id}/sections/${sectionId}/repeated`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sectionData)
    })
        .then(response => response.json())
        .then(updatedForm => {
            currentApplicationForm = updatedForm;
        })
        .catch(error => {
            console.error('Error adding repeatable section:', error);
            showAlert('Error adding section. Please try again.', 'danger');
        });
}

/**
 * Remove a repeatable section
 */
function removeRepeatableSection(sectionId, index) {
    // Remove from the UI
    const repeatableSections = document.getElementById(`repeatable-sections-${sectionId}`);
    const sectionElement = repeatableSections.querySelector(`.repeatable-section[data-index="${index}"]`);
    
    if (sectionElement) {
        repeatableSections.removeChild(sectionElement);
    }
    
    // Update the application form
    if (currentApplicationForm.sectionData[sectionId] && 
        currentApplicationForm.sectionData[sectionId].repeatedSections) {
        
        // Save to server
        fetch(`/api/application-forms/${currentApplicationForm.id}/sections/${sectionId}/repeated/${index}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(updatedForm => {
                currentApplicationForm = updatedForm;
                
                // Reindex the remaining sections in the UI
                const remainingSections = repeatableSections.querySelectorAll('.repeatable-section');
                remainingSections.forEach((element, idx) => {
                    element.setAttribute('data-index', idx);
                });
            })
            .catch(error => {
                console.error('Error removing repeatable section:', error);
                showAlert('Error removing section. Please try again.', 'danger');
            });
    }
}

/**
 * Update form progress
 */
function updateFormProgress(readonly = false) {
    const prevButton = document.getElementById('prev-section');
    const nextButton = document.getElementById('next-section');
    const submitButton = document.getElementById('submit-form');
    
    // Update button visibility
    if (currentSectionIndex === 0) {
        prevButton.style.visibility = 'hidden';
    } else {
        prevButton.style.visibility = 'visible';
    }
    
    if (currentSectionIndex === currentFormTemplate.sections.length - 1) {
        nextButton.style.display = 'none';
        if (submitButton && !readonly) {
            submitButton.style.display = 'block';
        }
    } else {
        nextButton.style.display = 'block';
        if (submitButton) {
            submitButton.style.display = 'none';
        }
    }
    
    // Update progress steps
    updateProgressSteps();
}

/**
 * Update progress steps
 */
function updateProgressSteps() {
    const progressSteps = document.getElementById('progress-steps');
    progressSteps.innerHTML = '';
    
    currentFormTemplate.sections.forEach((section, index) => {
        const step = document.createElement('div');
        step.className = 'step';
        
        if (index < currentSectionIndex) {
            step.classList.add('completed');
        } else if (index === currentSectionIndex) {
            step.classList.add('active');
        }
        
        step.innerHTML = index + 1;
        progressSteps.appendChild(step);
    });
}

/**
 * Submit the form
 */
function submitForm() {
    // Validate current section
    if (!validateCurrentSection()) {
        return;
    }
    
    // Save current section data
    saveCurrentSectionData();
    
    // Check if all required sections are completed
    const allSectionsCompleted = currentFormTemplate.sections.every(section => {
        if (section.required) {
            return currentApplicationForm.sectionData[section.id] && 
                   currentApplicationForm.sectionData[section.id].completed;
        }
        return true;
    });
    
    if (!allSectionsCompleted) {
        showAlert('Please complete all required sections before submitting.', 'warning');
        return;
    }
    
    // Submit the form
    console.log('Submitting form with ID:', currentApplicationForm.id);
    showAlert('Submitting your application...', 'info');
    
    fetch(`/api/application-forms/${currentApplicationForm.id}/submit`, {
        method: 'PUT'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(submittedForm => {
        console.log('Form submitted successfully:', submittedForm);
        showAlert('Your application has been submitted successfully!', 'success');
        
        // Redirect to the confirmation page
        setTimeout(() => {
            window.location.href = `/confirmation.html?formId=${submittedForm.id}`;
        }, 2000);
    })
    .catch(error => {
        console.error('Error submitting form:', error);
        showAlert('Error submitting form. Please try again.', 'danger');
    });
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

/**
 * Create a demo template for testing
 */
function createDemoTemplate() {
    console.log('Creating demo template...');
    showAlert('Creating demo template...', 'info');
    
    const demoTemplate = {
        name: "Job Application Form",
        description: "Complete application form for job seekers",
        version: "1.0",
        sections: [
            {
                title: "Basic Information",
                description: "Personal details of the applicant",
                displayOrder: 1,
                required: true,
                repeatable: false,
                fields: [
                    {
                        name: "firstName",
                        label: "First Name",
                        placeholder: "Enter your first name",
                        type: "TEXT",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 1
                    },
                    {
                        name: "lastName",
                        label: "Last Name",
                        placeholder: "Enter your last name",
                        type: "TEXT",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 2
                    },
                    {
                        name: "email",
                        label: "Email Address",
                        placeholder: "Enter your email",
                        type: "EMAIL",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 3
                    },
                    {
                        name: "phone",
                        label: "Phone Number",
                        placeholder: "Enter your phone number",
                        type: "TEXT",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 4
                    }
                ]
            },
            {
                title: "Educational Information",
                description: "Details about your education",
                displayOrder: 2,
                required: true,
                repeatable: true,
                fields: [
                    {
                        name: "institutionName",
                        label: "Institution Name",
                        placeholder: "Enter institution name",
                        type: "TEXT",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 1
                    },
                    {
                        name: "degree",
                        label: "Degree",
                        placeholder: "Enter degree obtained",
                        type: "TEXT",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 2
                    },
                    {
                        name: "fieldOfStudy",
                        label: "Field of Study",
                        placeholder: "Enter your field of study",
                        type: "TEXT",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 3
                    },
                    {
                        name: "startDate",
                        label: "Start Date",
                        type: "DATE",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 4
                    },
                    {
                        name: "endDate",
                        label: "End Date",
                        type: "DATE",
                        required: false,
                        enabled: true,
                        visible: true,
                        displayOrder: 5
                    }
                ]
            },
            {
                title: "Work Experience",
                description: "Details about your previous work experience",
                displayOrder: 3,
                required: false,
                repeatable: true,
                fields: [
                    {
                        name: "companyName",
                        label: "Company Name",
                        placeholder: "Enter company name",
                        type: "TEXT",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 1
                    },
                    {
                        name: "position",
                        label: "Position",
                        placeholder: "Enter your job title",
                        type: "TEXT",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 2
                    },
                    {
                        name: "startDate",
                        label: "Start Date",
                        type: "DATE",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 3
                    },
                    {
                        name: "endDate",
                        label: "End Date",
                        type: "DATE",
                        required: false,
                        enabled: true,
                        visible: true,
                        displayOrder: 4
                    },
                    {
                        name: "description",
                        label: "Job Description",
                        placeholder: "Describe your responsibilities",
                        type: "TEXTAREA",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 6
                    }
                ]
            },
            {
                title: "Courses Completed",
                description: "Details about courses or certifications you've completed",
                displayOrder: 4,
                required: false,
                repeatable: true,
                fields: [
                    {
                        name: "courseName",
                        label: "Course Name",
                        placeholder: "Enter course name",
                        type: "TEXT",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 1
                    },
                    {
                        name: "provider",
                        label: "Provider",
                        placeholder: "Enter course provider",
                        type: "TEXT",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 2
                    },
                    {
                        name: "completionDate",
                        label: "Completion Date",
                        type: "DATE",
                        required: true,
                        enabled: true,
                        visible: true,
                        displayOrder: 3
                    },
                    {
                        name: "certificateNumber",
                        label: "Certificate Number",
                        placeholder: "Enter certificate number if available",
                        type: "TEXT",
                        required: false,
                        enabled: true,
                        visible: true,
                        displayOrder: 4
                    }
                ]
            }
        ]
    };
    
    // Create the template
    fetch('/api/form-templates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(demoTemplate)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(createdTemplate => {
        console.log('Demo template created:', createdTemplate);
        
        // Publish the template
        return fetch(`/api/form-templates/${createdTemplate.id}/publish`, {
            method: 'PUT'
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(publishedTemplate => {
        console.log('Demo template published:', publishedTemplate);
        showAlert('Demo template created and published successfully!', 'success');
        
        // Reload the templates
        setTimeout(() => {
            loadFormTemplates();
        }, 1000);
    })
    .catch(error => {
        console.error('Error creating demo template:', error);
        showAlert('Error creating demo template. Make sure MongoDB is running.', 'danger');
    });
}
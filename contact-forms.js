// Contact Forms Integration with Supabase for Mr Quickie Website
import { mrQuickieDB, handleSupabaseError } from './supabase-config.js';

// Contact form handler
class ContactFormHandler {
  constructor() {
    this.forms = new Map();
    this.init();
  }

  // Initialize all contact forms
  init() {
    // Find all contact forms
    const contactForms = document.querySelectorAll('[data-contact-form]');
    contactForms.forEach(form => this.setupForm(form));

    // Create dynamic contact form if none exists
    if (contactForms.length === 0) {
      this.createContactSection();
    }
  }

  // Setup individual form
  setupForm(form) {
    const formType = form.getAttribute('data-contact-form') || 'general';
    this.forms.set(formType, form);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit(form, formType);
    });

    // Add real-time validation
    this.addValidation(form);
  }

  // Create contact section if it doesn't exist
  createContactSection() {
    const contactHTML = `
      <section id="contact-section" class="contact-section">
        <div class="container">
          <div class="row">
            <div class="col-md-8">
              <div class="contact-form-wrapper">
                <h2>Get In Touch</h2>
                <p>Have questions about our services? Need a quote? We're here to help!</p>
                
                <form id="main-contact-form" data-contact-form="general" class="contact-form">
                  <div class="form-row">
                    <div class="form-group col-md-6">
                      <label for="contact-name">Full Name *</label>
                      <input type="text" id="contact-name" name="name" class="form-control" required>
                      <div class="invalid-feedback"></div>
                    </div>
                    <div class="form-group col-md-6">
                      <label for="contact-email">Email Address *</label>
                      <input type="email" id="contact-email" name="email" class="form-control" required>
                      <div class="invalid-feedback"></div>
                    </div>
                  </div>
                  
                  <div class="form-row">
                    <div class="form-group col-md-6">
                      <label for="contact-phone">Phone Number</label>
                      <input type="tel" id="contact-phone" name="phone" class="form-control">
                      <div class="invalid-feedback"></div>
                    </div>
                    <div class="form-group col-md-6">
                      <label for="contact-subject">Subject</label>
                      <select id="contact-subject" name="subject" class="form-control">
                        <option value="">Select a subject</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Service Request">Service Request</option>
                        <option value="Quote Request">Quote Request</option>
                        <option value="Complaint">Complaint</option>
                        <option value="Compliment">Compliment</option>
                        <option value="Partnership">Partnership Inquiry</option>
                      </select>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label for="contact-message">Message *</label>
                    <textarea id="contact-message" name="message" class="form-control" rows="5" required 
                              placeholder="Please describe your inquiry or request..."></textarea>
                    <div class="invalid-feedback"></div>
                  </div>
                  
                  <div class="form-group">
                    <div class="form-check">
                      <input type="checkbox" id="contact-privacy" name="privacy" class="form-check-input" required>
                      <label for="contact-privacy" class="form-check-label">
                        I agree to the <a href="/privacy-policy" target="_blank">Privacy Policy</a> and 
                        consent to being contacted by Mr Quickie *
                      </label>
                    </div>
                  </div>
                  
                  <button type="submit" class="btn btn-primary btn-submit">
                    <span class="submit-text">Send Message</span>
                    <span class="submit-loading" style="display: none;">
                      <i class="fas fa-spinner fa-spin"></i> Sending...
                    </span>
                  </button>
                </form>
              </div>
            </div>
            
            <div class="col-md-4">
              <div class="contact-info">
                <h3>Contact Information</h3>
                
                <div class="contact-item">
                  <i class="fas fa-phone"></i>
                  <div>
                    <h4>Phone Numbers</h4>
                    <p>Globe: +63917-88-78425 (QUICK)</p>
                    <p>Smart: +63949-99-78425 (QUICK)</p>
                    <p>Sun: +63925-88-78425 (QUICK)</p>
                  </div>
                </div>
                
                <div class="contact-item">
                  <i class="fas fa-envelope"></i>
                  <div>
                    <h4>Email</h4>
                    <p>marketing@mrquickie.com</p>
                  </div>
                </div>
                
                <div class="contact-item">
                  <i class="fas fa-map-marker-alt"></i>
                  <div>
                    <h4>Main Office</h4>
                    <p>Metro Manila, Philippines</p>
                  </div>
                </div>
                
                <div class="contact-item">
                  <i class="fas fa-clock"></i>
                  <div>
                    <h4>Business Hours</h4>
                    <p>Monday - Sunday: 10:00 AM - 9:00 PM</p>
                  </div>
                </div>
              </div>
              
              <!-- Quick Service Request -->
              <div class="quick-service-request">
                <h3>Quick Service Request</h3>
                <p>Need immediate service? Use our quick request form:</p>
                <button class="btn btn-outline-primary" data-toggle="modal" data-target="#service-request-modal">
                  Request Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Service Request Modal -->
      <div class="modal fade" id="service-request-modal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Service Request</h5>
              <button type="button" class="close" data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form id="service-request-form" data-contact-form="service-request" class="contact-form">
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="service-name">Full Name *</label>
                    <input type="text" id="service-name" name="name" class="form-control" required>
                  </div>
                  <div class="form-group col-md-6">
                    <label for="service-email">Email Address *</label>
                    <input type="email" id="service-email" name="email" class="form-control" required>
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="service-phone">Phone Number *</label>
                    <input type="tel" id="service-phone" name="phone" class="form-control" required>
                  </div>
                  <div class="form-group col-md-6">
                    <label for="service-type">Service Type *</label>
                    <select id="service-type" name="serviceType" class="form-control" required>
                      <option value="">Select service</option>
                      <option value="Shoe Repair">Shoe Repair</option>
                      <option value="Bag Repair">Bag Repair</option>
                      <option value="Key Services">Key Services</option>
                      <option value="Alterations">Alterations</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="service-description">Service Description *</label>
                  <textarea id="service-description" name="description" class="form-control" rows="4" required
                            placeholder="Please describe what you need help with..."></textarea>
                </div>
                
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="service-date">Preferred Date</label>
                    <input type="date" id="service-date" name="preferredDate" class="form-control">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="service-urgency">Urgency</label>
                    <select id="service-urgency" name="urgency" class="form-control">
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                
                <button type="submit" class="btn btn-primary btn-submit">
                  <span class="submit-text">Submit Request</span>
                  <span class="submit-loading" style="display: none;">
                    <i class="fas fa-spinner fa-spin"></i> Submitting...
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

    // Insert contact section into page
    const main = document.querySelector('main') || document.querySelector('#Content');
    if (main) {
      main.insertAdjacentHTML('beforeend', contactHTML);
      
      // Re-initialize forms
      const newForms = document.querySelectorAll('[data-contact-form]');
      newForms.forEach(form => this.setupForm(form));
    }
  }

  // Handle form submission
  async handleSubmit(form, formType) {
    try {
      this.setLoading(form, true);
      this.clearErrors(form);

      // Get form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Validate required fields
      const validation = this.validateForm(form, data);
      if (!validation.isValid) {
        this.showErrors(form, validation.errors);
        this.setLoading(form, false);
        return;
      }

      // Submit based on form type
      let result;
      if (formType === 'service-request') {
        result = await this.submitServiceRequest(data);
      } else {
        result = await this.submitContactMessage(data);
      }

      // Show success message
      this.showSuccess(form, 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
      
      // Reset form
      form.reset();
      
      // Close modal if it's a modal form
      const modal = form.closest('.modal');
      if (modal) {
        this.closeModal(modal);
      }

    } catch (error) {
      console.error('Form submission error:', error);
      this.showError(form, handleSupabaseError(error));
    } finally {
      this.setLoading(form, false);
    }
  }

  // Submit contact message to Supabase
  async submitContactMessage(data) {
    const messageData = {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject || 'General Inquiry',
      message: data.message,
      type: 'general'
    };

    return await mrQuickieDB.submitContactMessage(messageData);
  }

  // Submit service request to Supabase
  async submitServiceRequest(data) {
    const serviceData = {
      customer_name: data.name,
      customer_email: data.email,
      customer_phone: data.phone,
      service_type: data.serviceType,
      description: data.description,
      preferred_date: data.preferredDate || null,
      urgency: data.urgency || 'normal'
    };

    const { data: result, error } = await supabase
      .from('service_requests')
      .insert(serviceData);

    if (error) throw error;
    return result;
  }

  // Form validation
  validateForm(form, data) {
    const errors = {};
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      const name = field.name;
      const value = data[name];

      if (!value || value.trim() === '') {
        errors[name] = 'This field is required';
      } else {
        // Specific validations
        if (field.type === 'email' && !this.isValidEmail(value)) {
          errors[name] = 'Please enter a valid email address';
        }
        
        if (field.type === 'tel' && value && !this.isValidPhone(value)) {
          errors[name] = 'Please enter a valid phone number';
        }
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Email validation
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Phone validation
  isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  // Add real-time validation
  addValidation(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });

      input.addEventListener('input', () => {
        // Clear error on input
        this.clearFieldError(input);
      });
    });
  }

  // Validate individual field
  validateField(field) {
    const value = field.value.trim();
    let error = '';

    if (field.hasAttribute('required') && !value) {
      error = 'This field is required';
    } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
      error = 'Please enter a valid email address';
    } else if (field.type === 'tel' && value && !this.isValidPhone(value)) {
      error = 'Please enter a valid phone number';
    }

    if (error) {
      this.showFieldError(field, error);
    } else {
      this.clearFieldError(field);
    }
  }

  // Show field error
  showFieldError(field, message) {
    field.classList.add('is-invalid');
    const feedback = field.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
      feedback.textContent = message;
    }
  }

  // Clear field error
  clearFieldError(field) {
    field.classList.remove('is-invalid');
    const feedback = field.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
      feedback.textContent = '';
    }
  }

  // Show multiple errors
  showErrors(form, errors) {
    Object.entries(errors).forEach(([fieldName, message]) => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (field) {
        this.showFieldError(field, message);
      }
    });
  }

  // Clear all errors
  clearErrors(form) {
    const invalidFields = form.querySelectorAll('.is-invalid');
    invalidFields.forEach(field => {
      this.clearFieldError(field);
    });
  }

  // Set loading state
  setLoading(form, isLoading) {
    const submitBtn = form.querySelector('.btn-submit');
    const submitText = submitBtn.querySelector('.submit-text');
    const submitLoading = submitBtn.querySelector('.submit-loading');

    if (isLoading) {
      submitBtn.disabled = true;
      submitText.style.display = 'none';
      submitLoading.style.display = 'inline';
    } else {
      submitBtn.disabled = false;
      submitText.style.display = 'inline';
      submitLoading.style.display = 'none';
    }
  }

  // Show success message
  showSuccess(form, message) {
    this.showMessage(message, 'success');
  }

  // Show error message
  showError(form, message) {
    this.showMessage(message, 'error');
  }

  // Show message
  showMessage(message, type = 'info') {
    // Create or update message element
    let messageEl = document.getElementById('form-message');
    if (!messageEl) {
      messageEl = document.createElement('div');
      messageEl.id = 'form-message';
      messageEl.className = 'form-message';
      document.body.appendChild(messageEl);
    }

    messageEl.textContent = message;
    messageEl.className = `form-message form-message-${type}`;
    messageEl.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (messageEl) {
        messageEl.style.display = 'none';
      }
    }, 5000);
  }

  // Close modal
  closeModal(modal) {
    if (modal.classList.contains('fade')) {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 150);
    } else {
      modal.style.display = 'none';
    }
  }
}

// Initialize contact forms when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ContactFormHandler();
});

// Export for use in other modules
export default ContactFormHandler;

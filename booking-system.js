// Service Booking System for Mr Quickie Website
import { mrQuickieDB, supabase, handleSupabaseError } from './supabase-config.js';
import { authState } from './auth.js';

// Booking system manager
class BookingSystem {
  constructor() {
    this.services = [];
    this.branches = [];
    this.selectedService = null;
    this.selectedBranch = null;
    this.init();
  }

  // Initialize booking system
  async init() {
    try {
      await this.loadServices();
      await this.loadBranches();
      this.createBookingInterface();
      this.setupEventListeners();
    } catch (error) {
      console.error('Error initializing booking system:', error);
    }
  }

  // Load services from Supabase
  async loadServices() {
    try {
      this.services = await mrQuickieDB.getServices();
    } catch (error) {
      console.error('Error loading services:', error);
      this.services = [];
    }
  }

  // Load branches from Supabase
  async loadBranches() {
    try {
      this.branches = await mrQuickieDB.getBranches();
    } catch (error) {
      console.error('Error loading branches:', error);
      this.branches = [];
    }
  }

  // Create booking interface
  createBookingInterface() {
    const existingBooking = document.getElementById('booking-section');
    if (existingBooking) {
      return;
    }

    const bookingHTML = `
      <section id="booking-section" class="booking-section">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <div class="booking-header">
                <h2>Book a Service</h2>
                <p>Schedule your appointment with Mr Quickie today!</p>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-8">
              <div class="booking-form-wrapper">
                <form id="booking-form" class="booking-form">
                  <!-- Step 1: Service Selection -->
                  <div class="booking-step" data-step="1">
                    <h3>Step 1: Choose Your Service</h3>
                    <div class="services-grid">
                      ${this.renderServices()}
                    </div>
                  </div>

                  <!-- Step 2: Branch Selection -->
                  <div class="booking-step" data-step="2" style="display: none;">
                    <h3>Step 2: Choose Location</h3>
                    <div class="branches-grid">
                      ${this.renderBranches()}
                    </div>
                  </div>

                  <!-- Step 3: Date & Time -->
                  <div class="booking-step" data-step="3" style="display: none;">
                    <h3>Step 3: Select Date & Time</h3>
                    <div class="datetime-selection">
                      <div class="form-row">
                        <div class="form-group col-md-6">
                          <label for="booking-date">Preferred Date</label>
                          <input type="date" id="booking-date" name="date" class="form-control" required>
                        </div>
                        <div class="form-group col-md-6">
                          <label for="booking-time">Preferred Time</label>
                          <select id="booking-time" name="time" class="form-control" required>
                            <option value="">Select time</option>
                            <option value="09:00">9:00 AM</option>
                            <option value="09:30">9:30 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="10:30">10:30 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="11:30">11:30 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="12:30">12:30 PM</option>
                            <option value="13:00">1:00 PM</option>
                            <option value="13:30">1:30 PM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="14:30">2:30 PM</option>
                            <option value="15:00">3:00 PM</option>
                            <option value="15:30">3:30 PM</option>
                            <option value="16:00">4:00 PM</option>
                            <option value="16:30">4:30 PM</option>
                            <option value="17:00">5:00 PM</option>
                            <option value="17:30">5:30 PM</option>
                            <option value="18:00">6:00 PM</option>
                          </select>
                        </div>
                      </div>
                      
                      <div id="availability-display" class="availability-display">
                        <!-- Available slots will be shown here -->
                      </div>
                    </div>
                  </div>

                  <!-- Step 4: Customer Information -->
                  <div class="booking-step" data-step="4" style="display: none;">
                    <h3>Step 4: Your Information</h3>
                    <div class="customer-info">
                      <div class="form-row">
                        <div class="form-group col-md-6">
                          <label for="customer-name">Full Name *</label>
                          <input type="text" id="customer-name" name="customerName" class="form-control" required>
                        </div>
                        <div class="form-group col-md-6">
                          <label for="customer-email">Email Address *</label>
                          <input type="email" id="customer-email" name="customerEmail" class="form-control" required>
                        </div>
                      </div>

                      <div class="form-row">
                        <div class="form-group col-md-6">
                          <label for="customer-phone">Phone Number *</label>
                          <input type="tel" id="customer-phone" name="customerPhone" class="form-control" required>
                        </div>
                        <div class="form-group col-md-6">
                          <label for="booking-notes">Special Instructions</label>
                          <textarea id="booking-notes" name="notes" class="form-control" rows="3" 
                                    placeholder="Any special requests or notes..."></textarea>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="form-check">
                          <input type="checkbox" id="booking-terms" name="terms" class="form-check-input" required>
                          <label for="booking-terms" class="form-check-label">
                            I agree to the <a href="/terms" target="_blank">Terms & Conditions</a> 
                            and understand the cancellation policy *
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Step 5: Confirmation -->
                  <div class="booking-step" data-step="5" style="display: none;">
                    <h3>Step 5: Confirm Your Booking</h3>
                    <div id="booking-summary" class="booking-summary">
                      <!-- Booking summary will be displayed here -->
                    </div>
                  </div>

                  <!-- Navigation Buttons -->
                  <div class="booking-navigation">
                    <button type="button" id="btn-prev" class="btn btn-secondary" style="display: none;">
                      <i class="fas fa-arrow-left"></i> Previous
                    </button>
                    <button type="button" id="btn-next" class="btn btn-primary" style="display: none;">
                      Next <i class="fas fa-arrow-right"></i>
                    </button>
                    <button type="submit" id="btn-submit" class="btn btn-success" style="display: none;">
                      <i class="fas fa-check"></i> Confirm Booking
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div class="col-lg-4">
              <div class="booking-sidebar">
                <!-- Booking Summary -->
                <div class="booking-summary-card">
                  <h4>Booking Summary</h4>
                  <div id="sidebar-summary">
                    <p class="text-muted">Select a service to start booking</p>
                  </div>
                </div>

                <!-- Contact Info -->
                <div class="contact-card">
                  <h4>Need Help?</h4>
                  <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span>Call us: +63917-88-78425</span>
                  </div>
                  <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>Email: booking@mrquickie.com</span>
                  </div>
                  <div class="contact-item">
                    <i class="fas fa-clock"></i>
                    <span>Mon-Sun: 10:00 AM - 9:00 PM</span>
                  </div>
                </div>

                <!-- Emergency Service -->
                <div class="emergency-card">
                  <h4>Emergency Service</h4>
                  <p>Need urgent repairs? Contact us for same-day service availability.</p>
                  <a href="tel:+639178878425" class="btn btn-outline-danger">
                    <i class="fas fa-exclamation-triangle"></i> Emergency Contact
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Success Modal -->
      <div class="modal fade" id="booking-success-modal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Booking Confirmed!</h5>
            </div>
            <div class="modal-body">
              <div class="text-center">
                <i class="fas fa-check-circle success-icon"></i>
                <h3>Your booking has been confirmed!</h3>
                <p>We've sent a confirmation email with all the details.</p>
                <div id="confirmation-details" class="confirmation-details">
                  <!-- Booking details will be shown here -->
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
              <a href="/my-bookings" class="btn btn-outline-primary">View My Bookings</a>
            </div>
          </div>
        </div>
      </div>
    `;

    // Insert into page
    const main = document.querySelector('main') || document.querySelector('#Content');
    if (main) {
      main.insertAdjacentHTML('beforeend', bookingHTML);
    }
  }

  // Render services
  renderServices() {
    if (!this.services || this.services.length === 0) {
      return '<p class="text-muted">No services available at the moment.</p>';
    }

    return this.services.map(service => `
      <div class="service-card" data-service-id="${service.id}">
        <div class="service-image">
          <img src="${service.image_url || '/images/placeholder-service.png'}" 
               alt="${service.name}" loading="lazy">
        </div>
        <div class="service-info">
          <h4>${service.name}</h4>
          <p>${service.short_description || service.description?.substring(0, 100) + '...'}</p>
          <div class="service-details">
            <div class="price-range">
              ${service.price_from && service.price_to ? 
                `₱${service.price_from} - ₱${service.price_to}` : 
                service.price_from ? `From ₱${service.price_from}` : 'Price on request'
              }
            </div>
            <div class="duration">
              <i class="fas fa-clock"></i>
              ${service.duration_minutes ? `${service.duration_minutes} minutes` : 'Duration varies'}
            </div>
          </div>
        </div>
        <div class="service-actions">
          <button class="btn btn-primary select-service" data-service-id="${service.id}">
            Select This Service
          </button>
        </div>
      </div>
    `).join('');
  }

  // Render branches
  renderBranches() {
    if (!this.branches || this.branches.length === 0) {
      return '<p class="text-muted">No branches available at the moment.</p>';
    }

    return this.branches.map(branch => `
      <div class="branch-card" data-branch-id="${branch.id}">
        <div class="branch-info">
          <h4>${branch.name}</h4>
          <div class="branch-address">
            <i class="fas fa-map-marker-alt"></i>
            <span>${branch.address}, ${branch.city}</span>
          </div>
          <div class="branch-contact">
            <div class="phone">
              <i class="fas fa-phone"></i>
              <span>${branch.phone}</span>
            </div>
            ${branch.email ? `
              <div class="email">
                <i class="fas fa-envelope"></i>
                <span>${branch.email}</span>
              </div>
            ` : ''}
          </div>
          ${branch.opening_hours ? `
            <div class="opening-hours">
              <i class="fas fa-clock"></i>
              <span>Open daily: ${this.formatOpeningHours(branch.opening_hours)}</span>
            </div>
          ` : ''}
        </div>
        <div class="branch-actions">
          <button class="btn btn-primary select-branch" data-branch-id="${branch.id}">
            Select This Location
          </button>
          ${branch.latitude && branch.longitude ? `
            <button class="btn btn-outline-secondary view-map" 
                    data-lat="${branch.latitude}" data-lng="${branch.longitude}">
              <i class="fas fa-map"></i> View Map
            </button>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  // Setup event listeners
  setupEventListeners() {
    // Service selection
    document.addEventListener('click', (e) => {
      if (e.target.matches('.select-service, .select-service *')) {
        const btn = e.target.closest('.select-service');
        const serviceId = btn.getAttribute('data-service-id');
        this.selectService(serviceId);
      }

      if (e.target.matches('.select-branch, .select-branch *')) {
        const btn = e.target.closest('.select-branch');
        const branchId = btn.getAttribute('data-branch-id');
        this.selectBranch(branchId);
      }
    });

    // Navigation buttons
    document.getElementById('btn-prev')?.addEventListener('click', () => {
      this.previousStep();
    });

    document.getElementById('btn-next')?.addEventListener('click', () => {
      this.nextStep();
    });

    // Form submission
    document.getElementById('booking-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitBooking();
    });

    // Date change - check availability
    document.getElementById('booking-date')?.addEventListener('change', (e) => {
      this.checkAvailability(e.target.value);
    });

    // Auto-fill user info if logged in
    const currentUser = authState.getCurrentUser();
    if (currentUser) {
      this.fillUserInfo(currentUser);
    }
  }

  // Select service
  selectService(serviceId) {
    this.selectedService = this.services.find(s => s.id === serviceId);
    
    // Update UI
    document.querySelectorAll('.service-card').forEach(card => {
      card.classList.remove('selected');
    });
    document.querySelector(`[data-service-id="${serviceId}"]`).classList.add('selected');

    // Update summary
    this.updateSummary();
    
    // Show next button
    this.showStep(2);
  }

  // Select branch
  selectBranch(branchId) {
    this.selectedBranch = this.branches.find(b => b.id === branchId);
    
    // Update UI
    document.querySelectorAll('.branch-card').forEach(card => {
      card.classList.remove('selected');
    });
    document.querySelector(`[data-branch-id="${branchId}"]`).classList.add('selected');

    // Update summary
    this.updateSummary();
    
    // Show next step
    this.showStep(3);
  }

  // Show specific step
  showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.booking-step').forEach(step => {
      step.style.display = 'none';
    });

    // Show current step
    const currentStep = document.querySelector(`[data-step="${stepNumber}"]`);
    if (currentStep) {
      currentStep.style.display = 'block';
    }

    // Update navigation buttons
    this.updateNavigation(stepNumber);

    // Set minimum date for date picker
    if (stepNumber === 3) {
      const dateInput = document.getElementById('booking-date');
      if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
      }
    }
  }

  // Update navigation buttons
  updateNavigation(stepNumber) {
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    const submitBtn = document.getElementById('btn-submit');

    // Hide all buttons first
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'none';

    if (stepNumber > 1) {
      prevBtn.style.display = 'inline-block';
    }

    if (stepNumber < 5) {
      if (stepNumber === 1 && this.selectedService) {
        nextBtn.style.display = 'inline-block';
      } else if (stepNumber === 2 && this.selectedBranch) {
        nextBtn.style.display = 'inline-block';
      } else if (stepNumber >= 3) {
        nextBtn.style.display = 'inline-block';
      }
    }

    if (stepNumber === 5) {
      submitBtn.style.display = 'inline-block';
    }
  }

  // Next step
  nextStep() {
    const currentStep = this.getCurrentStep();
    if (this.validateStep(currentStep)) {
      this.showStep(currentStep + 1);
    }
  }

  // Previous step
  previousStep() {
    const currentStep = this.getCurrentStep();
    if (currentStep > 1) {
      this.showStep(currentStep - 1);
    }
  }

  // Get current step number
  getCurrentStep() {
    const visibleStep = document.querySelector('.booking-step[style*="block"]');
    return visibleStep ? parseInt(visibleStep.getAttribute('data-step')) : 1;
  }

  // Validate current step
  validateStep(stepNumber) {
    switch (stepNumber) {
      case 1:
        if (!this.selectedService) {
          this.showMessage('Please select a service', 'warning');
          return false;
        }
        break;
      case 2:
        if (!this.selectedBranch) {
          this.showMessage('Please select a branch', 'warning');
          return false;
        }
        break;
      case 3:
        const date = document.getElementById('booking-date').value;
        const time = document.getElementById('booking-time').value;
        if (!date || !time) {
          this.showMessage('Please select both date and time', 'warning');
          return false;
        }
        break;
      case 4:
        const form = document.getElementById('booking-form');
        const formData = new FormData(form);
        const requiredFields = ['customerName', 'customerEmail', 'customerPhone'];
        
        for (const field of requiredFields) {
          if (!formData.get(field) || formData.get(field).trim() === '') {
            this.showMessage(`Please fill in all required fields`, 'warning');
            return false;
          }
        }
        
        if (!formData.get('terms')) {
          this.showMessage('Please accept the terms and conditions', 'warning');
          return false;
        }
        break;
    }
    return true;
  }

  // Update booking summary
  updateSummary() {
    const sidebarSummary = document.getElementById('sidebar-summary');
    const bookingSummary = document.getElementById('booking-summary');
    
    let summaryHTML = '';
    
    if (this.selectedService) {
      summaryHTML += `
        <div class="summary-item">
          <strong>Service:</strong> ${this.selectedService.name}
          <div class="summary-details">
            Price: ${this.selectedService.price_from && this.selectedService.price_to ? 
              `₱${this.selectedService.price_from} - ₱${this.selectedService.price_to}` : 
              this.selectedService.price_from ? `From ₱${this.selectedService.price_from}` : 'Price on request'
            }
          </div>
        </div>
      `;
    }
    
    if (this.selectedBranch) {
      summaryHTML += `
        <div class="summary-item">
          <strong>Location:</strong> ${this.selectedBranch.name}
          <div class="summary-details">${this.selectedBranch.address}</div>
        </div>
      `;
    }
    
    if (summaryHTML === '') {
      summaryHTML = '<p class="text-muted">Select a service to start booking</p>';
    }
    
    if (sidebarSummary) {
      sidebarSummary.innerHTML = summaryHTML;
    }
    
    if (bookingSummary) {
      // Add date/time info for final summary
      const date = document.getElementById('booking-date')?.value;
      const time = document.getElementById('booking-time')?.value;
      
      if (date && time) {
        summaryHTML += `
          <div class="summary-item">
            <strong>Date & Time:</strong> ${this.formatDate(date)} at ${this.formatTime(time)}
          </div>
        `;
      }
      
      bookingSummary.innerHTML = summaryHTML;
    }
  }

  // Check availability for selected date
  async checkAvailability(date) {
    if (!this.selectedService || !this.selectedBranch || !date) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('preferred_time')
        .eq('service_id', this.selectedService.id)
        .eq('branch_id', this.selectedBranch.id)
        .eq('preferred_date', date)
        .in('status', ['pending', 'confirmed', 'in_progress']);

      if (error) throw error;

      const bookedTimes = data.map(booking => booking.preferred_time);
      this.updateTimeSlots(bookedTimes);

    } catch (error) {
      console.error('Error checking availability:', error);
    }
  }

  // Update available time slots
  updateTimeSlots(bookedTimes) {
    const timeSelect = document.getElementById('booking-time');
    const options = timeSelect.querySelectorAll('option');

    options.forEach(option => {
      if (option.value && bookedTimes.includes(option.value)) {
        option.disabled = true;
        option.textContent = option.textContent.replace(' (Booked)', '') + ' (Booked)';
      } else {
        option.disabled = false;
        option.textContent = option.textContent.replace(' (Booked)', '');
      }
    });
  }

  // Fill user info if logged in
  fillUserInfo(user) {
    const nameField = document.getElementById('customer-name');
    const emailField = document.getElementById('customer-email');
    const phoneField = document.getElementById('customer-phone');

    if (nameField && user.user_metadata?.full_name) {
      nameField.value = user.user_metadata.full_name;
    }

    if (emailField && user.email) {
      emailField.value = user.email;
    }

    if (phoneField && user.user_metadata?.phone) {
      phoneField.value = user.user_metadata.phone;
    }
  }

  // Submit booking
  async submitBooking() {
    try {
      this.setLoading(true);

      const form = document.getElementById('booking-form');
      const formData = new FormData(form);

      const bookingData = {
        serviceId: this.selectedService.id,
        branchId: this.selectedBranch.id,
        customerName: formData.get('customerName'),
        customerEmail: formData.get('customerEmail'),
        customerPhone: formData.get('customerPhone'),
        preferredDate: formData.get('date'),
        preferredTime: formData.get('time'),
        notes: formData.get('notes') || null
      };

      const result = await mrQuickieDB.createBooking(bookingData);
      
      this.showSuccessModal(bookingData);
      this.resetForm();

    } catch (error) {
      console.error('Error submitting booking:', error);
      this.showMessage(handleSupabaseError(error), 'error');
    } finally {
      this.setLoading(false);
    }
  }

  // Show success modal
  showSuccessModal(bookingData) {
    const modal = document.getElementById('booking-success-modal');
    const detailsEl = document.getElementById('confirmation-details');

    detailsEl.innerHTML = `
      <div class="confirmation-item">
        <strong>Service:</strong> ${this.selectedService.name}
      </div>
      <div class="confirmation-item">
        <strong>Location:</strong> ${this.selectedBranch.name}
      </div>
      <div class="confirmation-item">
        <strong>Date:</strong> ${this.formatDate(bookingData.preferredDate)}
      </div>
      <div class="confirmation-item">
        <strong>Time:</strong> ${this.formatTime(bookingData.preferredTime)}
      </div>
      <div class="confirmation-item">
        <strong>Customer:</strong> ${bookingData.customerName}
      </div>
    `;

    modal.classList.add('show');
    modal.style.display = 'block';
  }

  // Reset form
  resetForm() {
    this.selectedService = null;
    this.selectedBranch = null;
    document.getElementById('booking-form').reset();
    document.querySelectorAll('.service-card, .branch-card').forEach(card => {
      card.classList.remove('selected');
    });
    this.showStep(1);
    this.updateSummary();
  }

  // Set loading state
  setLoading(isLoading) {
    const submitBtn = document.getElementById('btn-submit');
    if (submitBtn) {
      submitBtn.disabled = isLoading;
      submitBtn.innerHTML = isLoading ? 
        '<i class="fas fa-spinner fa-spin"></i> Processing...' :
        '<i class="fas fa-check"></i> Confirm Booking';
    }
  }

  // Utility functions
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  formatOpeningHours(hours) {
    if (typeof hours === 'string') return hours;
    // Handle JSON opening hours format
    return '10:00 AM - 9:00 PM';
  }

  showMessage(message, type = 'info') {
    // Create or update message element
    let messageEl = document.getElementById('booking-message');
    if (!messageEl) {
      messageEl = document.createElement('div');
      messageEl.id = 'booking-message';
      messageEl.className = 'booking-message';
      document.body.appendChild(messageEl);
    }

    messageEl.textContent = message;
    messageEl.className = `booking-message booking-message-${type}`;
    messageEl.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (messageEl) {
        messageEl.style.display = 'none';
      }
    }, 5000);
  }
}

// Initialize booking system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if we're on a booking page or main page
  if (window.location.pathname.includes('booking') || 
      window.location.pathname === '/' || 
      document.querySelector('[data-page="booking"]')) {
    new BookingSystem();
  }
});

// Export for use in other modules
export default BookingSystem;

// Admin Dashboard for Mr Quickie Website
import { supabase, mrQuickieDB, handleSupabaseError } from './supabase-config.js';
import { authState, authUtils } from './auth.js';

// Admin dashboard manager
class AdminDashboard {
  constructor() {
    this.currentUser = null;
    this.stats = {};
    this.init();
  }

  // Initialize admin dashboard
  async init() {
    // Check if user is admin
    if (!this.checkAdminAccess()) {
      this.redirectToLogin();
      return;
    }

    try {
      this.currentUser = authState.getCurrentUser();
      await this.loadDashboardStats();
      this.createDashboardUI();
      this.setupEventListeners();
      this.setupRealTimeUpdates();
    } catch (error) {
      console.error('Error initializing admin dashboard:', error);
      this.showError('Failed to load admin dashboard');
    }
  }

  // Check admin access
  checkAdminAccess() {
    if (!authState.isAuthenticated()) {
      return false;
    }

    return authUtils.hasRole('admin') || authUtils.hasRole('staff');
  }

  // Redirect to login
  redirectToLogin() {
    sessionStorage.setItem('admin_redirect', window.location.href);
    window.location.href = '/';
  }

  // Load dashboard statistics
  async loadDashboardStats() {
    try {
      const [
        bookingsCount,
        contactsCount,
        productsCount,
        servicesCount,
        usersCount,
        recentBookings,
        recentContacts
      ] = await Promise.all([
        this.getBookingsCount(),
        this.getContactsCount(),
        this.getProductsCount(),
        this.getServicesCount(),
        this.getUsersCount(),
        this.getRecentBookings(),
        this.getRecentContacts()
      ]);

      this.stats = {
        bookings: bookingsCount,
        contacts: contactsCount,
        products: productsCount,
        services: servicesCount,
        users: usersCount,
        recentBookings,
        recentContacts
      };
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      this.stats = {};
    }
  }

  // Get bookings count
  async getBookingsCount() {
    const { count, error } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
  }

  // Get contacts count
  async getContactsCount() {
    const { count, error } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
  }

  // Get products count
  async getProductsCount() {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
  }

  // Get services count
  async getServicesCount() {
    const { count, error } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
  }

  // Get users count
  async getUsersCount() {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
  }

  // Get recent bookings
  async getRecentBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        services(name),
        branches(name)
      `)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    return data || [];
  }

  // Get recent contacts
  async getRecentContacts() {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    return data || [];
  }

  // Create dashboard UI
  createDashboardUI() {
    const dashboardHTML = `
      <div id="admin-dashboard" class="admin-dashboard">
        <div class="dashboard-header">
          <div class="container">
            <div class="row">
              <div class="col-12">
                <h1>Admin Dashboard</h1>
                <p>Welcome back, ${authUtils.getUserDisplayName()}!</p>
              </div>
            </div>
          </div>
        </div>

        <div class="dashboard-content">
          <div class="container">
            <!-- Stats Cards -->
            <div class="row">
              <div class="col-md-3 col-sm-6">
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="fas fa-calendar-check"></i>
                  </div>
                  <div class="stat-info">
                    <h3>${this.stats.bookings}</h3>
                    <p>Total Bookings</p>
                  </div>
                </div>
              </div>

              <div class="col-md-3 col-sm-6">
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="fas fa-envelope"></i>
                  </div>
                  <div class="stat-info">
                    <h3>${this.stats.contacts}</h3>
                    <p>Contact Messages</p>
                  </div>
                </div>
              </div>

              <div class="col-md-3 col-sm-6">
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="fas fa-box"></i>
                  </div>
                  <div class="stat-info">
                    <h3>${this.stats.products}</h3>
                    <p>Products</p>
                  </div>
                </div>
              </div>

              <div class="col-md-3 col-sm-6">
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="fas fa-cogs"></i>
                  </div>
                  <div class="stat-info">
                    <h3>${this.stats.services}</h3>
                    <p>Services</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Management Sections -->
            <div class="row">
              <div class="col-md-6">
                <div class="dashboard-section">
                  <h3>Recent Bookings</h3>
                  <div class="section-actions">
                    <button class="btn btn-primary btn-sm" id="manage-bookings">
                      <i class="fas fa-calendar"></i> Manage All
                    </button>
                  </div>
                  <div class="table-responsive">
                    <table class="table table-striped">
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Service</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody id="recent-bookings">
                        ${this.renderRecentBookings()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="dashboard-section">
                  <h3>Recent Messages</h3>
                  <div class="section-actions">
                    <button class="btn btn-primary btn-sm" id="manage-contacts">
                      <i class="fas fa-envelope"></i> Manage All
                    </button>
                  </div>
                  <div class="table-responsive">
                    <table class="table table-striped">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Subject</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody id="recent-contacts">
                        ${this.renderRecentContacts()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="row">
              <div class="col-12">
                <div class="dashboard-section">
                  <h3>Quick Actions</h3>
                  <div class="quick-actions">
                    <button class="btn btn-success" id="add-product">
                      <i class="fas fa-plus"></i> Add Product
                    </button>
                    <button class="btn btn-success" id="add-service">
                      <i class="fas fa-plus"></i> Add Service
                    </button>
                    <button class="btn btn-info" id="view-analytics">
                      <i class="fas fa-chart-bar"></i> View Analytics
                    </button>
                    <button class="btn btn-warning" id="export-data">
                      <i class="fas fa-download"></i> Export Data
                    </button>
                    <button class="btn btn-secondary" id="settings">
                      <i class="fas fa-cog"></i> Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Booking Details Modal -->
      <div class="modal fade" id="booking-modal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Booking Details</h5>
              <button type="button" class="close" data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body" id="booking-modal-body">
              <!-- Booking details will be loaded here -->
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" id="update-booking">Update Status</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Details Modal -->
      <div class="modal fade" id="contact-modal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Contact Message</h5>
              <button type="button" class="close" data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body" id="contact-modal-body">
              <!-- Contact details will be loaded here -->
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" id="reply-contact">Reply</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Replace page content with dashboard
    document.body.innerHTML = dashboardHTML;
  }

  // Render recent bookings
  renderRecentBookings() {
    if (!this.stats.recentBookings || this.stats.recentBookings.length === 0) {
      return '<tr><td colspan="5" class="text-center text-muted">No recent bookings</td></tr>';
    }

    return this.stats.recentBookings.map(booking => `
      <tr>
        <td>${booking.customer_name}</td>
        <td>${booking.services?.name || 'Unknown Service'}</td>
        <td>${this.formatDate(booking.preferred_date)}</td>
        <td>
          <span class="badge badge-${this.getStatusColor(booking.status)}">
            ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline-primary view-booking" 
                  data-booking-id="${booking.id}">
            <i class="fas fa-eye"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Render recent contacts
  renderRecentContacts() {
    if (!this.stats.recentContacts || this.stats.recentContacts.length === 0) {
      return '<tr><td colspan="5" class="text-center text-muted">No recent messages</td></tr>';
    }

    return this.stats.recentContacts.map(contact => `
      <tr>
        <td>${contact.name}</td>
        <td>${contact.subject || 'No Subject'}</td>
        <td>${this.formatDate(contact.created_at)}</td>
        <td>
          <span class="badge badge-${this.getStatusColor(contact.status)}">
            ${contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline-primary view-contact" 
                  data-contact-id="${contact.id}">
            <i class="fas fa-eye"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Setup event listeners
  setupEventListeners() {
    // View booking details
    document.addEventListener('click', (e) => {
      if (e.target.matches('.view-booking, .view-booking *')) {
        const btn = e.target.closest('.view-booking');
        const bookingId = btn.getAttribute('data-booking-id');
        this.showBookingDetails(bookingId);
      }

      if (e.target.matches('.view-contact, .view-contact *')) {
        const btn = e.target.closest('.view-contact');
        const contactId = btn.getAttribute('data-contact-id');
        this.showContactDetails(contactId);
      }
    });

    // Quick actions
    document.getElementById('manage-bookings')?.addEventListener('click', () => {
      this.showBookingManagement();
    });

    document.getElementById('manage-contacts')?.addEventListener('click', () => {
      this.showContactManagement();
    });

    document.getElementById('add-product')?.addEventListener('click', () => {
      this.showAddProductForm();
    });

    document.getElementById('add-service')?.addEventListener('click', () => {
      this.showAddServiceForm();
    });

    document.getElementById('export-data')?.addEventListener('click', () => {
      this.exportData();
    });
  }

  // Setup real-time updates
  setupRealTimeUpdates() {
    // Listen for new bookings
    const bookingChannel = supabase
      .channel('admin-bookings')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'bookings' },
        (payload) => {
          this.handleNewBooking(payload.new);
        }
      )
      .subscribe();

    // Listen for new contact messages
    const contactChannel = supabase
      .channel('admin-contacts')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'contact_messages' },
        (payload) => {
          this.handleNewContact(payload.new);
        }
      )
      .subscribe();
  }

  // Handle new booking notification
  handleNewBooking(booking) {
    this.showNotification('New booking received!', 'success');
    this.updateStats();
  }

  // Handle new contact notification
  handleNewContact(contact) {
    this.showNotification('New contact message received!', 'info');
    this.updateStats();
  }

  // Show booking details
  async showBookingDetails(bookingId) {
    try {
      const { data: booking, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services(name, description),
          branches(name, address)
        `)
        .eq('id', bookingId)
        .single();

      if (error) throw error;

      const modalBody = document.getElementById('booking-modal-body');
      modalBody.innerHTML = this.renderBookingDetails(booking);

      // Show modal
      const modal = document.getElementById('booking-modal');
      modal.classList.add('show');
      modal.style.display = 'block';

    } catch (error) {
      console.error('Error loading booking details:', error);
      this.showError('Failed to load booking details');
    }
  }

  // Show contact details
  async showContactDetails(contactId) {
    try {
      const { data: contact, error } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('id', contactId)
        .single();

      if (error) throw error;

      const modalBody = document.getElementById('contact-modal-body');
      modalBody.innerHTML = this.renderContactDetails(contact);

      // Show modal
      const modal = document.getElementById('contact-modal');
      modal.classList.add('show');
      modal.style.display = 'block';

    } catch (error) {
      console.error('Error loading contact details:', error);
      this.showError('Failed to load contact details');
    }
  }

  // Render booking details
  renderBookingDetails(booking) {
    return `
      <div class="booking-details">
        <div class="row">
          <div class="col-md-6">
            <h5>Customer Information</h5>
            <p><strong>Name:</strong> ${booking.customer_name}</p>
            <p><strong>Email:</strong> ${booking.customer_email}</p>
            <p><strong>Phone:</strong> ${booking.customer_phone}</p>
          </div>
          <div class="col-md-6">
            <h5>Booking Information</h5>
            <p><strong>Service:</strong> ${booking.services?.name}</p>
            <p><strong>Branch:</strong> ${booking.branches?.name}</p>
            <p><strong>Date:</strong> ${this.formatDate(booking.preferred_date)}</p>
            <p><strong>Time:</strong> ${booking.preferred_time}</p>
            <p><strong>Status:</strong> 
              <span class="badge badge-${this.getStatusColor(booking.status)}">
                ${booking.status}
              </span>
            </p>
          </div>
        </div>
        ${booking.notes ? `
          <div class="row">
            <div class="col-12">
              <h5>Notes</h5>
              <p>${booking.notes}</p>
            </div>
          </div>
        ` : ''}
        <div class="row">
          <div class="col-12">
            <h5>Update Status</h5>
            <select id="booking-status-update" class="form-control">
              <option value="pending" ${booking.status === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="in_progress" ${booking.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
              <option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>Completed</option>
              <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </div>
        </div>
      </div>
    `;
  }

  // Render contact details
  renderContactDetails(contact) {
    return `
      <div class="contact-details">
        <div class="row">
          <div class="col-md-6">
            <h5>Contact Information</h5>
            <p><strong>Name:</strong> ${contact.name}</p>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Phone:</strong> ${contact.phone || 'Not provided'}</p>
          </div>
          <div class="col-md-6">
            <h5>Message Information</h5>
            <p><strong>Subject:</strong> ${contact.subject || 'No subject'}</p>
            <p><strong>Type:</strong> ${contact.type}</p>
            <p><strong>Date:</strong> ${this.formatDate(contact.created_at)}</p>
            <p><strong>Status:</strong> 
              <span class="badge badge-${this.getStatusColor(contact.status)}">
                ${contact.status}
              </span>
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <h5>Message</h5>
            <div class="message-content">
              ${contact.message}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Update statistics
  async updateStats() {
    try {
      await this.loadDashboardStats();
      // Update stat cards
      // This is a simplified update - in a real app you'd update specific elements
      location.reload();
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  }

  // Export data
  async exportData() {
    try {
      this.showNotification('Preparing data export...', 'info');
      
      // This is a simplified export - you could implement CSV/Excel export
      const data = {
        bookings: this.stats.recentBookings,
        contacts: this.stats.recentContacts,
        stats: this.stats,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mr-quickie-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      
      this.showNotification('Data exported successfully!', 'success');
      
    } catch (error) {
      console.error('Error exporting data:', error);
      this.showError('Failed to export data');
    }
  }

  // Utility functions
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusColor(status) {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      in_progress: 'primary',
      completed: 'success',
      cancelled: 'danger',
      new: 'info',
      replied: 'success',
      resolved: 'success',
      archived: 'secondary'
    };
    return colors[status] || 'secondary';
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      min-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  showError(message) {
    this.showNotification(message, 'danger');
  }

  // Show booking management (placeholder)
  showBookingManagement() {
    this.showNotification('Booking management feature coming soon!', 'info');
  }

  // Show contact management (placeholder)
  showContactManagement() {
    this.showNotification('Contact management feature coming soon!', 'info');
  }

  // Show add product form (placeholder)
  showAddProductForm() {
    this.showNotification('Add product feature coming soon!', 'info');
  }

  // Show add service form (placeholder)
  showAddServiceForm() {
    this.showNotification('Add service feature coming soon!', 'info');
  }
}

// Initialize admin dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if we're on an admin page
  if (window.location.pathname.includes('admin') || 
      window.location.pathname.includes('dashboard') ||
      document.querySelector('[data-page="admin"]')) {
    new AdminDashboard();
  }
});

// Export for use in other modules
export default AdminDashboard;

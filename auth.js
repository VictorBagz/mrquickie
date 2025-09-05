// Authentication System for Mr Quickie Website
import { supabase, auth, handleSupabaseError } from './supabase-config.js';

// DOM elements for auth forms
const authElements = {
  loginForm: null,
  signupForm: null,
  resetForm: null,
  userProfile: null,
  authButtons: null,
  
  // Initialize DOM elements
  init() {
    this.loginForm = document.getElementById('login-form');
    this.signupForm = document.getElementById('signup-form');
    this.resetForm = document.getElementById('reset-form');
    this.userProfile = document.getElementById('user-profile');
    this.authButtons = document.querySelectorAll('[data-auth-action]');
    
    // Create auth forms if they don't exist
    if (!this.loginForm) {
      this.createAuthForms();
    }
    
    this.bindEvents();
  },
  
  // Create authentication forms
  createAuthForms() {
    const authModalHTML = `
      <!-- Authentication Modal -->
      <div id="auth-modal" class="auth-modal" style="display: none;">
        <div class="auth-modal-content">
          <span class="auth-close">&times;</span>
          
          <!-- Login Form -->
          <div id="login-form" class="auth-form active">
            <h3>Sign In to Mr Quickie</h3>
            <form id="login-form-element">
              <div class="form-group">
                <label for="login-email">Email Address</label>
                <input type="email" id="login-email" name="email" required>
              </div>
              <div class="form-group">
                <label for="login-password">Password</label>
                <input type="password" id="login-password" name="password" required>
              </div>
              <button type="submit" class="auth-btn auth-btn-primary">Sign In</button>
              <div class="auth-links">
                <a href="#" data-auth-switch="signup">Don't have an account? Sign up</a>
                <a href="#" data-auth-switch="reset">Forgot password?</a>
              </div>
            </form>
          </div>
          
          <!-- Signup Form -->
          <div id="signup-form" class="auth-form">
            <h3>Create Your Account</h3>
            <form id="signup-form-element">
              <div class="form-group">
                <label for="signup-fullname">Full Name</label>
                <input type="text" id="signup-fullname" name="fullName" required>
              </div>
              <div class="form-group">
                <label for="signup-email">Email Address</label>
                <input type="email" id="signup-email" name="email" required>
              </div>
              <div class="form-group">
                <label for="signup-phone">Phone Number</label>
                <input type="tel" id="signup-phone" name="phone">
              </div>
              <div class="form-group">
                <label for="signup-password">Password</label>
                <input type="password" id="signup-password" name="password" required minlength="6">
              </div>
              <div class="form-group">
                <label for="signup-confirm-password">Confirm Password</label>
                <input type="password" id="signup-confirm-password" name="confirmPassword" required>
              </div>
              <button type="submit" class="auth-btn auth-btn-primary">Create Account</button>
              <div class="auth-links">
                <a href="#" data-auth-switch="login">Already have an account? Sign in</a>
              </div>
            </form>
          </div>
          
          <!-- Password Reset Form -->
          <div id="reset-form" class="auth-form">
            <h3>Reset Your Password</h3>
            <form id="reset-form-element">
              <div class="form-group">
                <label for="reset-email">Email Address</label>
                <input type="email" id="reset-email" name="email" required>
              </div>
              <button type="submit" class="auth-btn auth-btn-primary">Send Reset Link</button>
              <div class="auth-links">
                <a href="#" data-auth-switch="login">Back to Sign In</a>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <!-- User Profile Dropdown -->
      <div id="user-profile" class="user-profile" style="display: none;">
        <div class="user-info">
          <img id="user-avatar" src="/images/default-avatar.png" alt="User Avatar" class="user-avatar">
          <span id="user-name">User Name</span>
        </div>
        <div class="user-menu">
          <a href="#" id="profile-link">My Profile</a>
          <a href="#" id="bookings-link">My Bookings</a>
          <a href="#" id="orders-link">My Orders</a>
          <a href="#" id="logout-link">Sign Out</a>
        </div>
      </div>
    `;
    
    // Append to body
    document.body.insertAdjacentHTML('beforeend', authModalHTML);
    
    // Re-initialize elements
    this.loginForm = document.getElementById('login-form');
    this.signupForm = document.getElementById('signup-form');
    this.resetForm = document.getElementById('reset-form');
    this.userProfile = document.getElementById('user-profile');
  },
  
  // Bind event listeners
  bindEvents() {
    // Modal controls
    const modal = document.getElementById('auth-modal');
    const closeBtn = document.querySelector('.auth-close');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }
    
    // Form switching
    document.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-auth-switch')) {
        e.preventDefault();
        const targetForm = e.target.getAttribute('data-auth-switch');
        this.switchForm(targetForm);
      }
      
      if (e.target.hasAttribute('data-auth-action')) {
        e.preventDefault();
        const action = e.target.getAttribute('data-auth-action');
        if (action === 'login') {
          this.showModal('login');
        } else if (action === 'signup') {
          this.showModal('signup');
        } else if (action === 'logout') {
          this.handleLogout();
        }
      }
    });
    
    // Form submissions
    const loginFormElement = document.getElementById('login-form-element');
    const signupFormElement = document.getElementById('signup-form-element');
    const resetFormElement = document.getElementById('reset-form-element');
    
    if (loginFormElement) {
      loginFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin(e.target);
      });
    }
    
    if (signupFormElement) {
      signupFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSignup(e.target);
      });
    }
    
    if (resetFormElement) {
      resetFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handlePasswordReset(e.target);
      });
    }
  },
  
  // Show authentication modal
  showModal(formType = 'login') {
    const modal = document.getElementById('auth-modal');
    modal.style.display = 'block';
    this.switchForm(formType);
  },
  
  // Switch between auth forms
  switchForm(formType) {
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => form.classList.remove('active'));
    
    const targetForm = document.getElementById(`${formType}-form`);
    if (targetForm) {
      targetForm.classList.add('active');
    }
  },
  
  // Handle login
  async handleLogin(form) {
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
      this.showLoading(true);
      const { user } = await auth.signIn(email, password);
      
      this.showMessage('Login successful!', 'success');
      this.hideModal();
      this.updateUI(user);
      
    } catch (error) {
      this.showMessage(handleSupabaseError(error), 'error');
    } finally {
      this.showLoading(false);
    }
  },
  
  // Handle signup
  async handleSignup(form) {
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const fullName = formData.get('fullName');
    const phone = formData.get('phone');
    
    // Validate passwords match
    if (password !== confirmPassword) {
      this.showMessage('Passwords do not match', 'error');
      return;
    }
    
    try {
      this.showLoading(true);
      const { user } = await auth.signUp(email, password, {
        full_name: fullName,
        phone: phone
      });
      
      this.showMessage('Account created! Please check your email to verify your account.', 'success');
      this.switchForm('login');
      
    } catch (error) {
      this.showMessage(handleSupabaseError(error), 'error');
    } finally {
      this.showLoading(false);
    }
  },
  
  // Handle password reset
  async handlePasswordReset(form) {
    const formData = new FormData(form);
    const email = formData.get('email');
    
    try {
      this.showLoading(true);
      await auth.resetPassword(email);
      
      this.showMessage('Password reset link sent to your email!', 'success');
      this.switchForm('login');
      
    } catch (error) {
      this.showMessage(handleSupabaseError(error), 'error');
    } finally {
      this.showLoading(false);
    }
  },
  
  // Handle logout
  async handleLogout() {
    try {
      await auth.signOut();
      this.showMessage('Logged out successfully', 'success');
      this.updateUI(null);
    } catch (error) {
      this.showMessage(handleSupabaseError(error), 'error');
    }
  },
  
  // Update UI based on auth state
  updateUI(user) {
    const authButtons = document.querySelectorAll('[data-auth-button]');
    const userProfile = document.getElementById('user-profile');
    const userName = document.getElementById('user-name');
    const userAvatar = document.getElementById('user-avatar');
    
    if (user) {
      // User is logged in
      authButtons.forEach(btn => {
        if (btn.getAttribute('data-auth-button') === 'login') {
          btn.style.display = 'none';
        } else if (btn.getAttribute('data-auth-button') === 'profile') {
          btn.style.display = 'block';
        }
      });
      
      if (userProfile) {
        userProfile.style.display = 'block';
      }
      
      if (userName) {
        userName.textContent = user.user_metadata?.full_name || user.email;
      }
      
      if (userAvatar && user.user_metadata?.avatar_url) {
        userAvatar.src = user.user_metadata.avatar_url;
      }
      
    } else {
      // User is not logged in
      authButtons.forEach(btn => {
        if (btn.getAttribute('data-auth-button') === 'login') {
          btn.style.display = 'block';
        } else if (btn.getAttribute('data-auth-button') === 'profile') {
          btn.style.display = 'none';
        }
      });
      
      if (userProfile) {
        userProfile.style.display = 'none';
      }
    }
  },
  
  // Show loading state
  showLoading(isLoading) {
    const submitButtons = document.querySelectorAll('.auth-btn[type="submit"]');
    submitButtons.forEach(btn => {
      if (isLoading) {
        btn.disabled = true;
        btn.textContent = 'Loading...';
      } else {
        btn.disabled = false;
        btn.textContent = btn.getAttribute('data-original-text') || 'Submit';
      }
    });
  },
  
  // Show message to user
  showMessage(message, type = 'info') {
    // Create or update message element
    let messageEl = document.getElementById('auth-message');
    if (!messageEl) {
      messageEl = document.createElement('div');
      messageEl.id = 'auth-message';
      messageEl.className = 'auth-message';
      document.body.appendChild(messageEl);
    }
    
    messageEl.textContent = message;
    messageEl.className = `auth-message auth-message-${type}`;
    messageEl.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (messageEl) {
        messageEl.style.display = 'none';
      }
    }, 5000);
  },
  
  // Hide modal
  hideModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
};

// Authentication state management
const authState = {
  currentUser: null,
  isInitialized: false,
  
  // Initialize auth system
  async init() {
    try {
      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        return;
      }
      
      this.currentUser = session?.user || null;
      this.isInitialized = true;
      
      // Update UI
      authElements.updateUI(this.currentUser);
      
      // Listen for auth changes
      auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session);
        this.currentUser = session?.user || null;
        authElements.updateUI(this.currentUser);
        
        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            this.handleSignIn(session.user);
            break;
          case 'SIGNED_OUT':
            this.handleSignOut();
            break;
          case 'USER_UPDATED':
            this.handleUserUpdate(session.user);
            break;
        }
      });
      
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  },
  
  // Handle sign in
  handleSignIn(user) {
    console.log('User signed in:', user);
    
    // Update user profile in database
    this.updateUserProfile(user);
    
    // Redirect if needed
    const redirectUrl = sessionStorage.getItem('auth_redirect');
    if (redirectUrl) {
      sessionStorage.removeItem('auth_redirect');
      window.location.href = redirectUrl;
    }
  },
  
  // Handle sign out
  handleSignOut() {
    console.log('User signed out');
    
    // Clear any user-specific data
    sessionStorage.removeItem('user_preferences');
    localStorage.removeItem('cart_items');
    
    // Redirect to home if on protected page
    if (this.isProtectedPage()) {
      window.location.href = '/';
    }
  },
  
  // Handle user update
  handleUserUpdate(user) {
    console.log('User updated:', user);
    this.updateUserProfile(user);
  },
  
  // Update user profile in database
  async updateUserProfile(user) {
    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name,
          avatar_url: user.user_metadata?.avatar_url,
          phone: user.user_metadata?.phone,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error updating user profile:', error);
      }
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
    }
  },
  
  // Check if current page requires authentication
  isProtectedPage() {
    const protectedPaths = ['/profile', '/bookings', '/orders', '/admin'];
    const currentPath = window.location.pathname;
    return protectedPaths.some(path => currentPath.startsWith(path));
  },
  
  // Get current user
  getCurrentUser() {
    return this.currentUser;
  },
  
  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser;
  },
  
  // Require authentication (redirect if not logged in)
  requireAuth() {
    if (!this.isAuthenticated()) {
      sessionStorage.setItem('auth_redirect', window.location.href);
      authElements.showModal('login');
      return false;
    }
    return true;
  }
};

// Utility functions
export const authUtils = {
  // Check if user has specific role
  hasRole(requiredRole) {
    const user = authState.getCurrentUser();
    if (!user) return false;
    
    const userRole = user.user_metadata?.role || 'customer';
    
    const roleHierarchy = {
      'customer': 1,
      'staff': 2,
      'admin': 3
    };
    
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  },
  
  // Get user display name
  getUserDisplayName() {
    const user = authState.getCurrentUser();
    if (!user) return 'Guest';
    
    return user.user_metadata?.full_name || 
           user.email?.split('@')[0] || 
           'User';
  },
  
  // Get user avatar URL
  getUserAvatarUrl() {
    const user = authState.getCurrentUser();
    if (!user) return '/images/default-avatar.png';
    
    return user.user_metadata?.avatar_url || '/images/default-avatar.png';
  }
};

// Initialize authentication when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  authElements.init();
  authState.init();
});

// Export for use in other modules
export { authElements, authState, authUtils };
export default { authElements, authState, authUtils };

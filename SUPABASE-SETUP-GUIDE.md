# 🚀 Complete Supabase Backend Setup Guide for Mr Quickie

## Overview

This guide will walk you through setting up Supabase as the complete backend solution for the Mr Quickie website, including:

- **Database**: PostgreSQL with complete schema for products, services, bookings, users, and more
- **Authentication**: User registration, login, password reset, and role-based access
- **File Storage**: Image uploads for products, services, gallery, and user avatars
- **Real-time Features**: Live updates for bookings and admin dashboard
- **API**: Auto-generated REST API and real-time subscriptions

## 📋 Prerequisites

- Node.js 16+ and npm installed
- A Supabase account (free tier available)
- Basic understanding of JavaScript and SQL

## 🎯 Step 1: Create Supabase Project

### 1.1 Sign Up for Supabase
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign up with GitHub, Google, or email
3. Create a new organization (or use existing)

### 1.2 Create New Project
1. Click "New Project"
2. Choose your organization
3. Fill in project details:
   - **Name**: `mr-quickie-backend`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location (e.g., Southeast Asia for Philippines)
4. Click "Create new project"
5. Wait 2-3 minutes for project initialization

### 1.3 Get Project Credentials
1. Go to **Settings** → **API**
2. Copy and save these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep this secret!)

## 🗄️ Step 2: Set Up Database Schema

### 2.1 Run Database Schema
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the entire content from `database-schema.sql` file
3. Paste it into the SQL editor
4. Click "Run" to execute the schema
5. Verify all tables are created in **Table Editor**

### 2.2 Enable Row Level Security (RLS)
The schema already includes RLS policies, but verify in **Authentication** → **Policies**:

- **Public Access**: Categories, Services, Products, Branches, Gallery, Blog Posts
- **User Access**: Users can view/edit their own data
- **Admin Access**: Staff and admin roles have full access

### 2.3 Set Up Storage Buckets
1. Go to **Storage** in Supabase dashboard
2. Verify these buckets were created:
   - `products` (public)
   - `services` (public)
   - `gallery` (public)
   - `testimonials` (public)
   - `blog` (public)
   - `users` (private)

## 🔐 Step 3: Configure Authentication

### 3.1 Email Settings
1. Go to **Authentication** → **Settings**
2. Configure **Site URL**: `http://localhost:3000` (development) or your domain
3. Set **Redirect URLs**:
   - `http://localhost:3000`
   - `https://yourdomain.com` (production)

### 3.2 Email Templates (Optional)
1. Go to **Authentication** → **Email Templates**
2. Customize confirmation and password reset emails with Mr Quickie branding

### 3.3 Social Authentication (Optional)
Configure Google, Facebook, or other providers in **Authentication** → **Providers**

## ⚙️ Step 4: Configure Local Environment

### 4.1 Create Environment File
Create `.env` file in your project root:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Development Environment
NODE_ENV=development

# Optional: Additional Services
GOOGLE_MAPS_API_KEY=your-google-maps-key-here
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password

# Optional: Payment Integration
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
STRIPE_SECRET_KEY=sk_test_your-stripe-key

# Optional: Analytics
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

### 4.2 Update Project Files
Replace placeholder values in `supabase-config.js`:

```javascript
// Update these lines with your actual values
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project-id.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-public-key-here';
```

## 🚀 Step 5: Integration Setup

### 5.1 Update HTML to Include Supabase
Add to your `index.html` before closing `</body>` tag:

```html
<!-- Supabase Integration -->
<script type="module" src="supabase-config.js"></script>
<script type="module" src="auth.js"></script>
<script type="module" src="contact-forms.js"></script>
<script type="module" src="product-catalog.js"></script>
<script type="module" src="booking-system.js"></script>

<!-- Authentication UI -->
<div id="auth-buttons" class="auth-buttons">
  <button class="btn btn-outline-primary" data-auth-action="login" data-auth-button="login">
    <i class="fas fa-sign-in-alt"></i> Sign In
  </button>
  <div class="user-profile-dropdown" data-auth-button="profile" style="display: none;">
    <button class="btn btn-primary" id="user-profile-btn">
      <img id="user-avatar-nav" src="/images/default-avatar.png" alt="User" class="user-avatar-small">
      <span id="user-name-nav">User</span>
    </button>
  </div>
</div>
```

### 5.2 Add Supabase CSS Styles
Add to your `styles.css`:

```css
/* Supabase Authentication Styles */
.auth-modal {
  display: none;
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
}

.auth-modal-content {
  background-color: white;
  margin: 5% auto;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  position: relative;
}

.auth-close {
  position: absolute;
  right: 15px;
  top: 15px;
  font-size: 24px;
  cursor: pointer;
}

.auth-form {
  display: none;
}

.auth-form.active {
  display: block;
}

.auth-btn {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.auth-btn-primary {
  background-color: #007bff;
  color: white;
}

.auth-links {
  text-align: center;
  margin-top: 15px;
}

.auth-links a {
  color: #007bff;
  text-decoration: none;
  margin: 0 10px;
}

/* Product Catalog Styles */
.product-catalog {
  padding: 60px 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 20px;
}

/* Booking System Styles */
.booking-section {
  padding: 60px 0;
}

.booking-step {
  margin-bottom: 30px;
}

.service-card, .branch-card {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin: 15px 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.service-card.selected, .branch-card.selected {
  border-color: #007bff;
  background-color: #f0f8ff;
}

.booking-navigation {
  text-align: center;
  margin-top: 30px;
}

.booking-navigation button {
  margin: 0 10px;
}

/* Contact Forms Styles */
.contact-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 4px;
  z-index: 9999;
  max-width: 400px;
}

.form-message-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.form-message-error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.form-message-warning {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

/* Responsive Design */
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .auth-modal-content {
    margin: 10% auto;
    width: 95%;
  }
  
  .booking-step {
    padding: 15px;
  }
}
```

## 📊 Step 6: Testing and Verification

### 6.1 Test Database Connection
1. Open browser console on your website
2. Should see: "🚀 Supabase client initialized for Mr Quickie"
3. No configuration warnings

### 6.2 Test Authentication
1. Try to sign up with a new account
2. Check email for verification link
3. Try to sign in after verification
4. Test password reset functionality

### 6.3 Test Contact Forms
1. Fill out and submit contact form
2. Check Supabase **Table Editor** → **contact_messages** for new entry
3. Verify all form fields are properly saved

### 6.4 Test Product Catalog
1. Add sample products in Supabase **Table Editor**
2. Refresh website to see products displayed
3. Test filtering and search functionality

### 6.5 Test Booking System
1. Add sample services and branches in Supabase
2. Try to create a booking
3. Check **bookings** table for new entries

## 🔒 Step 7: Security Configuration

### 7.1 Row Level Security Policies
Verify these policies are active:

```sql
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users 
FOR SELECT USING (auth.uid() = id);

-- Public can read active content
CREATE POLICY "Public can read active products" ON products 
FOR SELECT USING (is_active = true);

-- Admin access for management
CREATE POLICY "Admins full access" ON products 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('admin', 'staff')
  )
);
```

### 7.2 Environment Variables Security
- Never commit `.env` files to Git
- Use different credentials for development/production
- Rotate keys regularly

### 7.3 API Rate Limiting
Configure in **Settings** → **API**:
- Set reasonable rate limits
- Enable CORS for your domain only

## 📈 Step 8: Advanced Features

### 8.1 Real-time Subscriptions
```javascript
// Listen for new bookings (admin dashboard)
const bookingSubscription = supabase
  .channel('bookings-channel')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'bookings' },
    (payload) => {
      console.log('New booking:', payload.new);
      // Update admin dashboard
    }
  )
  .subscribe();
```

### 8.2 File Upload Integration
```javascript
// Upload product images
const uploadProductImage = async (file, productId) => {
  const fileName = `${productId}-${Date.now()}.${file.name.split('.').pop()}`;
  
  const { data, error } = await supabase.storage
    .from('products')
    .upload(fileName, file);
    
  if (error) throw error;
  
  // Get public URL
  const publicUrl = supabase.storage
    .from('products')
    .getPublicUrl(fileName).data.publicUrl;
    
  return publicUrl;
};
```

### 8.3 Admin Dashboard
Create admin panel with:
- Booking management
- Product/service management
- User management
- Analytics dashboard

## 🚀 Step 9: Deployment

### 9.1 Production Environment
1. Create production Supabase project
2. Set production environment variables
3. Update CORS settings for production domain
4. Configure custom domain (optional)

### 9.2 Database Migration
```sql
-- Export development data
pg_dump supabase_db > development_data.sql

-- Import to production
psql production_db < development_data.sql
```

### 9.3 Monitoring and Backup
- Enable database backups in Supabase
- Set up monitoring alerts
- Configure error tracking

## 📚 Additional Resources

### Documentation
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

### Support
- [Supabase Discord Community](https://discord.supabase.com/)
- [Stack Overflow - Supabase Tag](https://stackoverflow.com/questions/tagged/supabase)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

## 🎯 Next Steps

1. **Complete Setup**: Follow all steps above
2. **Customize**: Modify database schema for specific needs
3. **Extend**: Add more features like analytics, notifications
4. **Optimize**: Implement caching and performance improvements
5. **Scale**: Monitor usage and upgrade plan as needed

## 🔧 Troubleshooting

### Common Issues

**1. "Configuration not found" error**
- Check `.env` file exists and has correct values
- Verify Supabase URL and API keys are correct

**2. Authentication not working**
- Check Site URL in Supabase settings
- Verify email confirmation is completed

**3. Database connection issues**
- Check RLS policies are correctly set
- Verify user permissions

**4. File upload errors**
- Check storage bucket permissions
- Verify file size limits

**5. CORS errors**
- Add your domain to allowed origins
- Check request headers

---

## 🎉 Congratulations!

You now have a complete, production-ready backend for your Mr Quickie website powered by Supabase! The system includes:

✅ **Complete Database Schema** with 12+ tables
✅ **User Authentication** with role-based access
✅ **File Storage** for images and documents
✅ **Real-time Features** for live updates
✅ **Contact Forms** integration
✅ **Product Catalog** with search/filter
✅ **Booking System** for appointments
✅ **Admin Dashboard** capabilities
✅ **Security** with RLS policies
✅ **Scalability** for business growth

Your website is now ready for production use with enterprise-grade backend infrastructure!

---

*Last Updated: December 2024*  
*For support, contact: marketing@mrquickie.com*

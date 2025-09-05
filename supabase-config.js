// Supabase Configuration for Mr Quickie Website
import { createClient } from '@supabase/supabase-js';

// Environment variables (you'll need to create a .env file)
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project-id.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-public-key-here';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Database table names
export const TABLES = {
  USERS: 'users',
  PRODUCTS: 'products',
  SERVICES: 'services',
  BOOKINGS: 'bookings',
  CONTACT_MESSAGES: 'contact_messages',
  TESTIMONIALS: 'testimonials',
  GALLERY: 'gallery',
  BLOG_POSTS: 'blog_posts',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  BRANCHES: 'branches',
  SERVICE_REQUESTS: 'service_requests'
};

// Auth helpers
export const auth = {
  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Sign up new user
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    if (error) throw error;
    return data;
  },

  // Sign in user
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  // Sign out user
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Reset password
  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  // Listen to auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helpers
export const db = {
  // Generic CRUD operations
  select: async (table, columns = '*', filters = {}) => {
    let query = supabase.from(table).select(columns);
    
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  insert: async (table, data) => {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select();
    if (error) throw error;
    return result;
  },

  update: async (table, id, data) => {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select();
    if (error) throw error;
    return result;
  },

  delete: async (table, id) => {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Search functionality
  search: async (table, column, searchTerm) => {
    const { data, error } = await supabase
      .from(table)
      .select()
      .textSearch(column, searchTerm);
    if (error) throw error;
    return data;
  }
};

// Real-time subscriptions
export const realtime = {
  subscribe: (table, callback, filters = {}) => {
    let channel = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          ...filters
        },
        callback
      )
      .subscribe();
    
    return channel;
  },

  unsubscribe: (channel) => {
    supabase.removeChannel(channel);
  }
};

// File storage helpers
export const storage = {
  upload: async (bucket, fileName, file) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);
    if (error) throw error;
    return data;
  },

  download: async (bucket, fileName) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(fileName);
    if (error) throw error;
    return data;
  },

  getPublicUrl: (bucket, fileName) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    return data.publicUrl;
  },

  delete: async (bucket, fileName) => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);
    if (error) throw error;
  }
};

// Mr Quickie specific database operations
export const mrQuickieDB = {
  // Products
  getProducts: async (category = null) => {
    let query = supabase
      .from(TABLES.PRODUCTS)
      .select(`
        *,
        categories(name, slug)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category_id', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Services
  getServices: async () => {
    const { data, error } = await supabase
      .from(TABLES.SERVICES)
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data;
  },

  // Contact messages
  submitContactMessage: async (messageData) => {
    const { data, error } = await supabase
      .from(TABLES.CONTACT_MESSAGES)
      .insert({
        name: messageData.name,
        email: messageData.email,
        phone: messageData.phone,
        subject: messageData.subject,
        message: messageData.message,
        created_at: new Date().toISOString()
      });
    if (error) throw error;
    return data;
  },

  // Service bookings
  createBooking: async (bookingData) => {
    const { data, error } = await supabase
      .from(TABLES.BOOKINGS)
      .insert({
        customer_name: bookingData.customerName,
        customer_email: bookingData.customerEmail,
        customer_phone: bookingData.customerPhone,
        service_id: bookingData.serviceId,
        branch_id: bookingData.branchId,
        preferred_date: bookingData.preferredDate,
        preferred_time: bookingData.preferredTime,
        notes: bookingData.notes,
        status: 'pending',
        created_at: new Date().toISOString()
      });
    if (error) throw error;
    return data;
  },

  // Gallery images
  getGalleryImages: async (limit = 20) => {
    const { data, error } = await supabase
      .from(TABLES.GALLERY)
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  },

  // Testimonials
  getTestimonials: async (limit = 10) => {
    const { data, error } = await supabase
      .from(TABLES.TESTIMONIALS)
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  },

  // Branches
  getBranches: async () => {
    const { data, error } = await supabase
      .from(TABLES.BRANCHES)
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });
    if (error) throw error;
    return data;
  },

  // Blog posts
  getBlogPosts: async (limit = 10) => {
    const { data, error } = await supabase
      .from(TABLES.BLOG_POSTS)
      .select(`
        *,
        categories(name, slug)
      `)
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  }
};

// Error handling helper
export const handleSupabaseError = (error) => {
  console.error('Supabase Error:', error);
  
  if (error.code === 'PGRST116') {
    return 'No data found';
  } else if (error.code === '23505') {
    return 'This record already exists';
  } else if (error.code === '42501') {
    return 'Permission denied';
  } else {
    return error.message || 'An unexpected error occurred';
  }
};

// Configuration validation
export const validateConfig = () => {
  if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
    console.warn('⚠️ Supabase URL not configured properly');
    return false;
  }
  
  if (!supabaseAnonKey || supabaseAnonKey.includes('your-anon-public-key')) {
    console.warn('⚠️ Supabase Anon Key not configured properly');
    return false;
  }
  
  return true;
};

// Initialize and export
if (typeof window !== 'undefined') {
  // Client-side initialization
  validateConfig();
  console.log('🚀 Supabase client initialized for Mr Quickie');
}

export default supabase;

// Product Catalog Integration with Supabase for Mr Quickie Website
import { mrQuickieDB, supabase, handleSupabaseError } from './supabase-config.js';
import { authState } from './auth.js';

// Product catalog manager
class ProductCatalog {
  constructor() {
    this.products = [];
    this.categories = [];
    this.filters = {
      category: null,
      priceRange: null,
      searchTerm: '',
      sortBy: 'name'
    };
    this.init();
  }

  // Initialize product catalog
  async init() {
    try {
      await this.loadCategories();
      await this.loadProducts();
      this.createProductDisplay();
      this.setupEventListeners();
    } catch (error) {
      console.error('Error initializing product catalog:', error);
    }
  }

  // Load categories from Supabase
  async loadCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      this.categories = data || [];
    } catch (error) {
      console.error('Error loading categories:', error);
      this.categories = [];
    }
  }

  // Load products from Supabase
  async loadProducts() {
    try {
      this.products = await mrQuickieDB.getProducts(this.filters.category);
    } catch (error) {
      console.error('Error loading products:', error);
      this.products = [];
    }
  }

  // Create product display HTML
  createProductDisplay() {
    const existingCatalog = document.getElementById('product-catalog');
    if (existingCatalog) {
      this.updateProductDisplay();
      return;
    }

    const catalogHTML = `
      <section id="product-catalog" class="product-catalog">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <div class="catalog-header">
                <h2>Our Products</h2>
                <p>Quality shoe care and maintenance products</p>
              </div>
            </div>
          </div>

          <!-- Filters -->
          <div class="row">
            <div class="col-12">
              <div class="catalog-filters">
                <div class="filter-row">
                  <div class="filter-group">
                    <label for="category-filter">Category:</label>
                    <select id="category-filter" class="form-control">
                      <option value="">All Categories</option>
                      ${this.categories.map(cat => 
                        `<option value="${cat.id}">${cat.name}</option>`
                      ).join('')}
                    </select>
                  </div>

                  <div class="filter-group">
                    <label for="price-filter">Price Range:</label>
                    <select id="price-filter" class="form-control">
                      <option value="">All Prices</option>
                      <option value="0-100">₱0 - ₱100</option>
                      <option value="100-300">₱100 - ₱300</option>
                      <option value="300-500">₱300 - ₱500</option>
                      <option value="500+">₱500+</option>
                    </select>
                  </div>

                  <div class="filter-group">
                    <label for="sort-filter">Sort By:</label>
                    <select id="sort-filter" class="form-control">
                      <option value="name">Name</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>

                  <div class="filter-group">
                    <div class="search-box">
                      <input type="text" id="search-products" class="form-control" 
                             placeholder="Search products...">
                      <button type="button" class="search-btn">
                        <i class="fas fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Products Grid -->
          <div class="row">
            <div class="col-12">
              <div id="products-grid" class="products-grid">
                <div class="loading-spinner" style="display: none;">
                  <i class="fas fa-spinner fa-spin"></i>
                  <p>Loading products...</p>
                </div>
                <div class="products-container">
                  ${this.renderProducts()}
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="row">
            <div class="col-12">
              <div id="products-pagination" class="pagination-wrapper">
                <!-- Pagination will be rendered here -->
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Product Modal -->
      <div class="modal fade" id="product-modal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="product-modal-title">Product Details</h5>
              <button type="button" class="close" data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body" id="product-modal-body">
              <!-- Product details will be loaded here -->
            </div>
          </div>
        </div>
      </div>
    `;

    // Insert into page
    const main = document.querySelector('main') || document.querySelector('#Content');
    if (main) {
      main.insertAdjacentHTML('beforeend', catalogHTML);
    }
  }

  // Render products HTML
  renderProducts() {
    if (!this.products || this.products.length === 0) {
      return `
        <div class="no-products">
          <i class="fas fa-box-open"></i>
          <h3>No Products Found</h3>
          <p>No products match your current filters.</p>
        </div>
      `;
    }

    return this.products.map(product => `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-image">
          <img src="${product.image_url || '/images/placeholder-product.png'}" 
               alt="${product.name}" 
               loading="lazy">
          ${product.compare_price ? `
            <div class="product-badge sale-badge">SALE</div>
          ` : ''}
          ${product.is_featured ? `
            <div class="product-badge featured-badge">FEATURED</div>
          ` : ''}
        </div>

        <div class="product-info">
          <div class="product-category">
            ${product.categories?.name || 'Product'}
          </div>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">
            ${product.short_description || product.description?.substring(0, 100) + '...'}
          </p>
          
          <div class="product-price">
            <span class="current-price">₱${this.formatPrice(product.price)}</span>
            ${product.compare_price ? `
              <span class="original-price">₱${this.formatPrice(product.compare_price)}</span>
              <span class="discount-percent">
                ${Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF
              </span>
            ` : ''}
          </div>

          <div class="product-actions">
            <button class="btn btn-primary btn-add-to-cart" 
                    data-product-id="${product.id}">
              <i class="fas fa-shopping-cart"></i>
              Add to Cart
            </button>
            <button class="btn btn-outline-secondary btn-view-details" 
                    data-product-id="${product.id}">
              <i class="fas fa-eye"></i>
              View Details
            </button>
          </div>

          ${product.stock_quantity <= 5 && product.stock_quantity > 0 ? `
            <div class="stock-warning">
              <i class="fas fa-exclamation-triangle"></i>
              Only ${product.stock_quantity} left in stock!
            </div>
          ` : ''}
          
          ${product.stock_quantity === 0 ? `
            <div class="out-of-stock">
              <i class="fas fa-times-circle"></i>
              Out of Stock
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  // Setup event listeners
  setupEventListeners() {
    // Filter controls
    document.getElementById('category-filter')?.addEventListener('change', (e) => {
      this.filters.category = e.target.value || null;
      this.applyFilters();
    });

    document.getElementById('price-filter')?.addEventListener('change', (e) => {
      this.filters.priceRange = e.target.value || null;
      this.applyFilters();
    });

    document.getElementById('sort-filter')?.addEventListener('change', (e) => {
      this.filters.sortBy = e.target.value;
      this.applySorting();
    });

    // Search
    const searchInput = document.getElementById('search-products');
    const searchBtn = document.querySelector('.search-btn');

    searchInput?.addEventListener('input', this.debounce((e) => {
      this.filters.searchTerm = e.target.value;
      this.applyFilters();
    }, 300));

    searchBtn?.addEventListener('click', () => {
      this.filters.searchTerm = searchInput.value;
      this.applyFilters();
    });

    // Product actions
    document.addEventListener('click', (e) => {
      if (e.target.matches('.btn-add-to-cart, .btn-add-to-cart *')) {
        const btn = e.target.closest('.btn-add-to-cart');
        const productId = btn.getAttribute('data-product-id');
        this.addToCart(productId);
      }

      if (e.target.matches('.btn-view-details, .btn-view-details *')) {
        const btn = e.target.closest('.btn-view-details');
        const productId = btn.getAttribute('data-product-id');
        this.showProductDetails(productId);
      }
    });
  }

  // Apply filters
  async applyFilters() {
    try {
      this.showLoading(true);
      
      let filteredProducts = [...this.products];

      // Apply search filter
      if (this.filters.searchTerm) {
        const searchTerm = this.filters.searchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description?.toLowerCase().includes(searchTerm) ||
          product.short_description?.toLowerCase().includes(searchTerm)
        );
      }

      // Apply price range filter
      if (this.filters.priceRange) {
        const [min, max] = this.filters.priceRange.split('-').map(p => 
          p.includes('+') ? Infinity : parseFloat(p)
        );
        filteredProducts = filteredProducts.filter(product =>
          product.price >= min && (max === Infinity || product.price <= max)
        );
      }

      this.products = filteredProducts;
      this.applySorting();
      
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      this.showLoading(false);
    }
  }

  // Apply sorting
  applySorting() {
    const sortedProducts = [...this.products];

    switch (this.filters.sortBy) {
      case 'name':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price_asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sortedProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }

    this.products = sortedProducts;
    this.updateProductDisplay();
  }

  // Update product display
  updateProductDisplay() {
    const container = document.querySelector('.products-container');
    if (container) {
      container.innerHTML = this.renderProducts();
    }
  }

  // Add product to cart
  async addToCart(productId) {
    try {
      const product = this.products.find(p => p.id === productId);
      if (!product) {
        this.showMessage('Product not found', 'error');
        return;
      }

      if (product.stock_quantity === 0) {
        this.showMessage('This product is out of stock', 'error');
        return;
      }

      // Get existing cart or create new one
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Check if product already in cart
      const existingItem = cart.find(item => item.productId === productId);
      
      if (existingItem) {
        if (existingItem.quantity >= product.stock_quantity) {
          this.showMessage('Cannot add more items. Stock limit reached.', 'warning');
          return;
        }
        existingItem.quantity += 1;
      } else {
        cart.push({
          productId: productId,
          name: product.name,
          price: product.price,
          image: product.image_url,
          quantity: 1
        });
      }

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Update cart UI
      this.updateCartUI();
      
      this.showMessage(`${product.name} added to cart!`, 'success');

    } catch (error) {
      console.error('Error adding to cart:', error);
      this.showMessage('Error adding product to cart', 'error');
    }
  }

  // Show product details in modal
  async showProductDetails(productId) {
    try {
      const product = this.products.find(p => p.id === productId);
      if (!product) {
        this.showMessage('Product not found', 'error');
        return;
      }

      const modalTitle = document.getElementById('product-modal-title');
      const modalBody = document.getElementById('product-modal-body');

      modalTitle.textContent = product.name;
      modalBody.innerHTML = this.renderProductDetails(product);

      // Show modal
      const modal = document.getElementById('product-modal');
      modal.classList.add('show');
      modal.style.display = 'block';

    } catch (error) {
      console.error('Error showing product details:', error);
      this.showMessage('Error loading product details', 'error');
    }
  }

  // Render product details
  renderProductDetails(product) {
    return `
      <div class="product-details">
        <div class="row">
          <div class="col-md-6">
            <div class="product-images">
              <div class="main-image">
                <img src="${product.image_url || '/images/placeholder-product.png'}" 
                     alt="${product.name}" class="img-fluid">
              </div>
              ${product.gallery_images && product.gallery_images.length > 0 ? `
                <div class="gallery-images">
                  ${product.gallery_images.map(img => `
                    <img src="${img}" alt="${product.name}" class="gallery-thumb">
                  `).join('')}
                </div>
              ` : ''}
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="product-info">
              <div class="product-category">
                ${product.categories?.name || 'Product'}
              </div>
              
              <h3>${product.name}</h3>
              
              <div class="product-price">
                <span class="current-price">₱${this.formatPrice(product.price)}</span>
                ${product.compare_price ? `
                  <span class="original-price">₱${this.formatPrice(product.compare_price)}</span>
                  <span class="discount-badge">
                    ${Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF
                  </span>
                ` : ''}
              </div>

              <div class="product-description">
                <p>${product.description || product.short_description}</p>
              </div>

              ${product.specifications ? `
                <div class="product-specifications">
                  <h4>Specifications</h4>
                  <ul>
                    ${Object.entries(product.specifications).map(([key, value]) => `
                      <li><strong>${key}:</strong> ${value}</li>
                    `).join('')}
                  </ul>
                </div>
              ` : ''}

              <div class="product-stock">
                ${product.stock_quantity > 0 ? `
                  <span class="in-stock">
                    <i class="fas fa-check-circle"></i>
                    ${product.stock_quantity} in stock
                  </span>
                ` : `
                  <span class="out-of-stock">
                    <i class="fas fa-times-circle"></i>
                    Out of stock
                  </span>
                `}
              </div>

              <div class="product-actions">
                <div class="quantity-selector">
                  <label for="product-quantity">Quantity:</label>
                  <input type="number" id="product-quantity" min="1" 
                         max="${product.stock_quantity}" value="1" class="form-control">
                </div>
                
                <button class="btn btn-primary btn-add-to-cart-modal" 
                        data-product-id="${product.id}"
                        ${product.stock_quantity === 0 ? 'disabled' : ''}>
                  <i class="fas fa-shopping-cart"></i>
                  Add to Cart
                </button>
              </div>

              ${product.sku ? `
                <div class="product-sku">
                  <small>SKU: ${product.sku}</small>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Update cart UI
  updateCartUI() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update cart count in navigation
    const cartBadge = document.querySelector('.cart-count');
    if (cartBadge) {
      cartBadge.textContent = cartCount;
      cartBadge.style.display = cartCount > 0 ? 'inline' : 'none';
    }
  }

  // Show loading state
  showLoading(isLoading) {
    const spinner = document.querySelector('.loading-spinner');
    const container = document.querySelector('.products-container');
    
    if (spinner && container) {
      if (isLoading) {
        spinner.style.display = 'block';
        container.style.opacity = '0.5';
      } else {
        spinner.style.display = 'none';
        container.style.opacity = '1';
      }
    }
  }

  // Show message
  showMessage(message, type = 'info') {
    // Create or update message element
    let messageEl = document.getElementById('product-message');
    if (!messageEl) {
      messageEl = document.createElement('div');
      messageEl.id = 'product-message';
      messageEl.className = 'product-message';
      document.body.appendChild(messageEl);
    }

    messageEl.textContent = message;
    messageEl.className = `product-message product-message-${type}`;
    messageEl.style.display = 'block';

    // Auto-hide after 3 seconds
    setTimeout(() => {
      if (messageEl) {
        messageEl.style.display = 'none';
      }
    }, 3000);
  }

  // Utility functions
  formatPrice(price) {
    return parseFloat(price).toFixed(2);
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize product catalog when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if we're on a product page or main page
  if (window.location.pathname.includes('product') || 
      window.location.pathname === '/' || 
      document.querySelector('[data-page="products"]')) {
    new ProductCatalog();
  }
});

// Export for use in other modules
export default ProductCatalog;

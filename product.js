document.addEventListener('DOMContentLoaded', function() {
    // Get the product grid container
    const productGrid = document.querySelector('.product-grid');
    
    // Get the modal elements
    const productModal = document.getElementById('product-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalMainImage = document.getElementById('modal-main-image');
    const modalProductTitle = document.getElementById('modal-product-title');
    const modalProductPrice = document.getElementById('modal-product-price');
    const modalProductDescription = document.getElementById('modal-product-description');
    const modalProductDetails = document.getElementById('modal-product-details');
    const thumbnailGallery = document.querySelector('.thumbnail-gallery');
    const reviewsPanel = document.getElementById('reviews-panel');
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    
    // Check if we're on the products page and populate the grid
    if (productGrid && window.location.pathname.includes('products.html')) {
        generateProductItems();
    }

    function safelyGetStorage(key) {
        try {
            return safelyGetStorage('key') || [];
        } catch (e) {
            console.warn('Unable to access localStorage:', e);
            return [];
        }
    }
    
    function safelySetStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('Unable to write to localStorage:', e);
            return false;
        }
    }
    
    // Function to open product modal
    function openProductModal(productName) {
        if (!productModal) return;
        
        const product = PRODUCT_DATA[productName];
        
        // Set modal content
        modalMainImage.src = product.images[0];
        modalProductTitle.textContent = productName;
        modalProductPrice.textContent = product.price;
        modalProductDescription.innerHTML = product.description;
        modalProductDetails.innerHTML = product.details;
        
        // Clear existing thumbnails
        thumbnailGallery.innerHTML = '';
        
        // Add thumbnails
        product.images.forEach((image, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail' + (index === 0 ? ' active' : '');
            thumbnail.innerHTML = `<img src="${image}" alt="${productName} image ${index + 1}">`;
            
            thumbnail.addEventListener('click', function() {
                // Update main image
                modalMainImage.src = image;
                
                // Update active thumbnail
                document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
                this.classList.add('active');
            });
            
            thumbnailGallery.appendChild(thumbnail);
        });
        
        // Clear existing reviews
        reviewsPanel.innerHTML = '';
        
        // Add reviews
        if (product.reviews && product.reviews.length > 0) {
            product.reviews.forEach(review => {
                const reviewElement = document.createElement('div');
                reviewElement.className = 'review';
                
                // Create stars based on rating
                let stars = '';
                for (let i = 0; i < 5; i++) {
                    if (i < review.rating) {
                        stars += '<i class="fas fa-star"></i>';
                    } else {
                        stars += '<i class="far fa-star"></i>';
                    }
                }
                
                reviewElement.innerHTML = `
                    <div class="review-header">
                        <span class="reviewer-name">${review.name}</span>
                        <span class="review-date">${review.date}</span>
                    </div>
                    <div class="review-rating">${stars}</div>
                    <div class="review-text">${review.text}</div>
                `;
                
                reviewsPanel.appendChild(reviewElement);
            });
        } else {
            reviewsPanel.innerHTML = '<p>No reviews yet.</p>';
        }
        
        // Set the current product for the Add to Cart button
        addToCartBtn.setAttribute('data-product', productName);
        
        // Show modal
        productModal.style.display = 'block';
    }
    
    // Close modal when clicking the close button
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            productModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside the modal content
    if (productModal) {
        window.addEventListener('click', function(event) {
            if (event.target === productModal) {
                productModal.style.display = 'none';
            }
        });
    }
    
    // Tab functionality
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panels
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding panel
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-panel`).classList.add('active');
        });
    });
    
    // Add to Cart functionality from modal
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            const product = PRODUCT_DATA[productName];
            const size = document.getElementById('size').value;
            const quantity = parseInt(document.getElementById('quantity').value);
            
            addToCart(productName, productName, product.price, product.images[0], size, quantity);
            
            // Close modal after adding to cart
            productModal.style.display = 'none';
        });
    }

    // Function to generate product items for the products page
    function generateProductItems() {
        // Clear existing products
        productGrid.innerHTML = '';
        
        // Generate product items from data
        Object.entries(PRODUCT_DATA).forEach(([productName, productInfo]) => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.setAttribute('data-category', productInfo.category);
            
            productItem.innerHTML = `
                <div class="product-image">
                    <img src="${productInfo.images[0]}" alt="${productName}">
                    <div class="overlay"></div>
                </div>
                <h3>${productName}</h3>
                <p>${productInfo.price}</p>
                <div class="product-buttons">
                    <button class="view-details-button" data-product="${productName}">View Details</button>
                    <button class="product-button add-to-cart-quick" data-product="${productName}">Add to Cart</button>
                </div>
            `;
            
            productGrid.appendChild(productItem);
        });
        
        // Add event listeners to the newly created buttons
        setupProductEventListeners();
    }
    
    // Setup event listeners for all product buttons (both on homepage and products page)
    function setupProductEventListeners() {
        // View Details buttons
        document.querySelectorAll('.view-details-button').forEach(button => {
            // Remove any existing event listeners
            button.removeEventListener('click', viewDetailsHandler);
            // Add new event listener
            button.addEventListener('click', viewDetailsHandler);
        });
        
        // Quick Add to Cart buttons
        document.querySelectorAll('.add-to-cart-quick').forEach(button => {
            // Remove any existing event listeners
            button.removeEventListener('click', quickAddHandler);
            // Add new event listener
            button.addEventListener('click', quickAddHandler);
        });
        
        // Regular Add to Cart buttons (on homepage)
        document.querySelectorAll('.product-button:not(.add-to-cart-quick)').forEach(button => {
            // Remove any existing event listeners
            button.removeEventListener('click', regularAddHandler);
            // Add new event listener
            button.addEventListener('click', regularAddHandler);
        });
    }
    
    // Event handler functions
    function viewDetailsHandler(e) {
        e.preventDefault();
        const productName = this.getAttribute('data-product');
        openProductModal(productName);
    }
    
    function quickAddHandler(e) {
        e.preventDefault();
        const productName = this.getAttribute('data-product');
        const product = PRODUCT_DATA[productName];
        
        // Default to size "m" and quantity 1 for quick add
        addToCart(productName, productName, product.price, product.images[0], 'm', 1);
    }
    
    function regularAddHandler(e) {
        e.preventDefault();
        
        // Get product info from the parent product item
        const productItem = this.closest('.product-item');
        const productName = productItem.querySelector('h3').textContent;
        const productPrice = productItem.querySelector('p').textContent;
        const productImage = productItem.querySelector('img').src;
        
        // Default to size "m" and quantity 1 for quick add
        addToCart(productName, productName, productPrice, productImage, 'm', 1);
    }
    
    // Run setup for any existing product buttons
    setupProductEventListeners();

    // Add this to your document.ready function in product.js

// Filter and sort functionality for products page
const categoryFilter = document.getElementById('category-filter');
const sortProducts = document.getElementById('sort-products');

if (categoryFilter && sortProducts) {
    // Add event listeners to filter and sort dropdowns
    categoryFilter.addEventListener('change', filterAndSortProducts);
    sortProducts.addEventListener('change', filterAndSortProducts);
    
    function filterAndSortProducts() {
        const category = categoryFilter.value;
        const sortBy = sortProducts.value;
        const productItems = document.querySelectorAll('.product-item');
        
        // Filter products by category
        productItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all' || category === itemCategory) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Get visible products for sorting
        const visibleProducts = Array.from(productItems).filter(item => 
            item.style.display !== 'none'
        );
        
        // Sort products
        visibleProducts.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('p').textContent.replace('$', ''));
            const priceB = parseFloat(b.querySelector('p').textContent.replace('$', ''));
            
            switch (sortBy) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'newest':
                    // For demo purposes, just reverse the order
                    return -1;
                default: // featured
                    return 0;
            }
        });
        
        // Reorder products in the DOM
        const productGrid = document.querySelector('.product-grid');
        visibleProducts.forEach(item => {
            productGrid.appendChild(item);
        });
    }
}

});

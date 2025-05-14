document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage
    updateCartUI();
    updateCartCount();
    

    const dropdown = document.querySelector('.cart-dropdown');
    if (dropdown) {
        dropdown.style.display = 'none'; // Hide dropdown on page load
    }
    // Toggle cart dropdown on click (optional alternative to hover)
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = document.querySelector('.cart-dropdown');
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
    }
    
    // Checkout button functionality
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            // Redirect to checkout page or show checkout modal
            alert('Proceeding to checkout...');
            // window.location.href = 'checkout.html';
        });
    }
    
    // View cart button functionality
    const viewCartBtn = document.querySelector('.view-cart-btn');
    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', function() {
            window.location.href = 'cart.html';
        });
    }
    
    // Add event delegation for remove buttons
    const cartDropdown = document.querySelector('.cart-dropdown');
    if (cartDropdown) {
        cartDropdown.addEventListener('click', function(e) {
            if (e.target.closest('.cart-item-remove')) {
                const index = parseInt(e.target.closest('.cart-item-remove').getAttribute('data-index'));
                removeFromCart(index);
            }
        });
    }
});


// Function to add item to cart
function addToCart(id, title, price, image, size, quantity) {
    // Get existing cart or initialize empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Convert price from string format ($35.00) to number (35.00)
    const priceValue = parseFloat(price.replace('$', ''));
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => 
        item.id === id && item.size === size
    );

    if (existingItemIndex > -1) {
        // Update quantity if item already exists
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item to cart
        cart.push({
            id,
            title,
            price: priceValue,
            image,
            size,
            quantity
        });
    }

    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart UI and count
    updateCartUI();
    updateCartCount();
    
}

// Function to update cart count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (!cartCount) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Function to update cart UI
function updateCartUI() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalPriceElement = document.querySelector('.total-price');
    
    // If these elements don't exist yet, return early
    if (!cartItemsContainer || !totalPriceElement) return;
    
    // Clear current cart items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
        totalPriceElement.textContent = '$0.00';
        return;
    }
    
    // Calculate total price
    let totalPrice = 0;
    
    // Add each item to cart UI
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">Size: ${item.size.toUpperCase()} | Qty: ${item.quantity}</div>
            </div>
            <div class="cart-item-remove" data-index="${index}">
                <i class="fas fa-times"></i>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Update total price
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

// Function to remove item from cart
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    updateCartCount();
}

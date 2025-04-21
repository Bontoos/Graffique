document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the cart page
    if (!document.querySelector('.cart-page')) return;
    
    // Initialize cart page
    updateCartPage();
    
    // Continue shopping button
    const continueShoppingBtn = document.querySelector('.continue-shopping');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            window.location.href = 'products.html';
        });
    }
    
    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn-large');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            alert('Proceeding to checkout...');
            // Implement checkout functionality or redirect to checkout page
        });
    }
    
    // Function to update the cart page
    function updateCartPage() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItemsContainer = document.querySelector('.cart-items-large');
        const emptyCartMessage = document.querySelector('.empty-cart-message-large');
        const cartContainer = document.querySelector('.cart-container-large');
        const subtotalElement = document.querySelector('.subtotal-price');
        const totalElement = document.querySelector('.total-price-large');
        
        // Show/hide elements based on cart state
        if (cart.length === 0) {
            cartContainer.style.display = 'none';
            emptyCartMessage.style.display = 'block';
            return;
        } else {
            cartContainer.style.display = 'flex';
            emptyCartMessage.style.display = 'none';
        }
        
        // Clear current cart items
        cartItemsContainer.innerHTML = '';
        
        // Calculate subtotal
        let subtotal = 0;
        
        // Add each item to cart UI
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item-large';
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-image-large">
                <div class="cart-item-details-large">
                    <div class="cart-item-title-large">${item.title}</div>
                    <div class="cart-item-price-large">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-options">
                        <div class="cart-item-size">Size: ${item.size.toUpperCase()}</div>
                        <div class="cart-item-quantity-control">
                            <button class="quantity-btn decrease-quantity" data-index="${index}">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-index="${index}">
                            <button class="quantity-btn increase-quantity" data-index="${index}">+</button>
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="cart-item-remove-large" data-index="${index}">
                            <i class="fas fa-trash"></i> Remove
                        </div>
                    </div>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        // Update price displays
        const shipping = 5.00; // Fixed shipping cost
        const total = subtotal + shipping;
        
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
        
        // Add event listeners to quantity controls and remove buttons
        setupCartItemControls();
    }
    
    // Setup event listeners for cart item controls
    function setupCartItemControls() {
        // Decrease quantity buttons
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                updateItemQuantity(index, -1);
            });
        });
        
        // Increase quantity buttons
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                updateItemQuantity(index, 1);
            });
        });
        
        // Quantity input fields
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const newQuantity = parseInt(this.value);
                
                if (newQuantity < 1) {
                    this.value = 1;
                    return;
                }
                
                setItemQuantity(index, newQuantity);
            });
        });
        
        // Remove buttons
        document.querySelectorAll('.cart-item-remove-large').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeCartItem(index);
            });
        });
    }
    
    // Update item quantity (increase or decrease)
    function updateItemQuantity(index, change) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (index >= 0 && index < cart.length) {
            cart[index].quantity += change;
            
            // Ensure quantity doesn't go below 1
            if (cart[index].quantity < 1) {
                cart[index].quantity = 1;
            }
            
            // Save updated cart
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            updateCartPage();
            updateCartUI();
            updateCartCount();
        }
    }
    
    // Set item quantity to specific value
    function setItemQuantity(index, quantity) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (index >= 0 && index < cart.length) {
            cart[index].quantity = quantity;
            
            // Save updated cart
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            updateCartPage();
            updateCartUI();
            updateCartCount();
        }
    }
    
    // Remove item from cart
    function removeCartItem(index) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (index >= 0 && index < cart.length) {
            // Ask for confirmation
            if (confirm(`Remove ${cart[index].title} from your cart?`)) {
                // Remove the item
                cart.splice(index, 1);
                
                // Save updated cart
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Update UI
                updateCartPage();
                updateCartUI();
                updateCartCount();
            }
        }
    }
});

    // Navigation scroll effect
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('.nav');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    let navOverlay = document.querySelector('.nav-overlay');

    function toggleMobileMenu() {
        if (!navLinks || !navOverlay) return;
        navLinks.classList.toggle('active');
        navOverlay.classList.toggle('active');
        menuToggle.classList.toggle('active');
    }

    function setupMobileNav() {
        // Create overlay if it doesn't exist
        if (!document.querySelector('.nav-overlay')) {
            // Create overlay
            navOverlay = document.createElement('div');
            navOverlay.className = 'nav-overlay';
            document.body.appendChild(navOverlay);

            // Add click events
            menuToggle.addEventListener('click', toggleMobileMenu);
            navOverlay.addEventListener('click', toggleMobileMenu);

            // Handle window resize
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    navLinks.classList.remove('active');
                    navOverlay.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            });
        }
    }

    const dropdown = document.querySelector('.cart-dropdown');
    if (dropdown) {
        dropdown.style.display = 'none'; // Hide dropdown on page load
    }

    // Make sure this runs after DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        setupMobileNav();
    });


    // Initialize mobile navigation
    setupMobileNav();
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
        
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
        
            // Handle both "index.html#section" and "#section" formats
            const sectionId = targetId.includes('#') ? targetId.split('#')[1] : targetId.substring(1);
            const targetElement = document.getElementById(sectionId);
        
            if (!targetElement) return;
        
            // Get the navbar height to use as offset
            const navHeight = document.querySelector('.nav').offsetHeight;
        
            window.scrollTo({
                // Subtract navbar height from the scroll position
                top: targetElement.offsetTop - navHeight,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (navLinks && navLinks.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });



    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
        
            // Get form values
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
        
            // Here you would typically send the data to a server
            // For demo purposes, we'll just show an alert
            alert(`Thanks for reaching out, ${name}! We'll get back to you soon.`);
        
            // Reset form
            this.reset();
        });
    }

    // Add spray paint effect to product items
    const productItems = document.querySelectorAll('.product-item');
    productItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.overlay');
            if (overlay) {
                overlay.style.opacity = '0.3';
            }
        });
    
        item.addEventListener('mouseleave', function() {
            const overlay = this.querySelector('.overlay');
            if (overlay) {
                overlay.style.opacity = '0';
            }
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const hero = document.querySelector('#hero');
        if (hero) {
            const scrollPosition = window.scrollY;
            hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        }
    });

    // Scroll reveal animation
    let sections = document.querySelectorAll('section');

    function revealOnScroll() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
        
            if (sectionTop < windowHeight - 100) {
                section.classList.add('fade-in');
            }
        });
    }

    // Initialize
    window.addEventListener('DOMContentLoaded', function() {
        // Setup mobile navigation
        setupMobileNav();
    
        // Initial reveal check
        revealOnScroll();
    
        // Add scroll event for reveal animations
        window.addEventListener('scroll', revealOnScroll);
    });


    // Initialize
    window.addEventListener('DOMContentLoaded', function() {
        // Setup mobile navigation
        setupMobileNav();
    
        // Select all sections
        sections = document.querySelectorAll('section');
    
        // Initial reveal check
        revealOnScroll();
    
        // Add scroll event for reveal animations
        window.addEventListener('scroll', revealOnScroll);
    });

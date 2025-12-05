/**
 * Navigation Enhancement Script
 * Mobile menu toggle and smooth scrolling
 */

class NavigationEnhancer {
    constructor() {
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        this.init();
    }

    init() {
        // Mobile menu toggle
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Smooth scrolling for anchor links
        this.setupSmoothScrolling();

        // Close mobile menu when clicking outside
        this.setupClickOutsideHandler();

        // Handle dropdown menus on mobile
        this.setupDropdownHandlers();

        // Track navigation clicks for analytics
        this.setupAnalyticsTracking();
    }

    toggleMobileMenu() {
        const isOpen = this.navMenu.classList.contains('active');
        
        this.navMenu.classList.toggle('active');
        this.mobileMenuToggle.classList.toggle('active');
        this.mobileMenuToggle.setAttribute('aria-expanded', !isOpen);

        // Animate hamburger icon
        const spans = this.mobileMenuToggle.querySelectorAll('span');
        if (!isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

    setupSmoothScrolling() {
        // Smooth scrolling for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupClickOutsideHandler() {
        document.addEventListener('click', (e) => {
            if (this.navMenu.classList.contains('active')) {
                const isClickInsideNav = this.navMenu.contains(e.target) || this.mobileMenuToggle.contains(e.target);
                if (!isClickInsideNav) {
                    this.closeMobileMenu();
                }
            }
        });
    }

    setupDropdownHandlers() {
        this.dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Only handle dropdowns on mobile
                if (window.innerWidth <= 768) {
                    const dropdown = toggle.parentElement;
                    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                    
                    // Close other dropdowns
                    document.querySelectorAll('.nav-dropdown.active').forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('active');
                        }
                    });
                    
                    // Toggle current dropdown
                    dropdown.classList.toggle('active');
                }
            });
        });

        // Handle hover on desktop
        document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
            dropdown.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) {
                    dropdown.classList.add('active');
                }
            });
            
            dropdown.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) {
                    dropdown.classList.remove('active');
                }
            });
        });
    }

    setupAnalyticsTracking() {
        // Track navigation clicks
        document.querySelectorAll('.nav-link, .dropdown-link, .nav-card-link, .quick-link').forEach(link => {
            link.addEventListener('click', (e) => {
                // Track in Google Analytics (if available)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'navigation_click', {
                        'event_category': 'Navigation',
                        'event_label': link.textContent.trim(),
                        'custom_map': {'dimension1': link.href}
                    });
                }
                
                // Track in console for debugging
                console.log('Navigation click:', link.textContent.trim(), '→', link.href);
            });
        });

        // Track popular navigation items
        const popularLinks = [
            '/content/locations/speed-test-new-york.html',
            '/content/problems/internet-keeps-disconnecting.html',
            '/content/results/what-does-100-mbps-mean.html'
        ];

        popularLinks.forEach(href => {
            const link = document.querySelector(`a[href="${href}"]`);
            if (link) {
                link.addEventListener('click', () => {
                    console.log('Popular navigation clicked:', href);
                    // Send to analytics
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'popular_navigation', {
                            'event_category': 'Popular Links',
                            'event_label': href
                        });
                    }
                });
            }
        });
    }

    closeMobileMenu() {
        if (this.navMenu.classList.contains('active')) {
            this.navMenu.classList.remove('active');
            this.mobileMenuToggle.classList.remove('active');
            this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
            
            // Reset hamburger icon
            const spans = this.mobileMenuToggle.querySelectorAll('span');
            spans.forEach(span => span.style.transform = 'none');
            spans[1].style.opacity = '1';
        }
    }

    // Add keyboard navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
            
            // Handle tab navigation in mobile menu
            if (this.navMenu.classList.contains('active')) {
                const focusableElements = this.navMenu.querySelectorAll('a, button');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }

    // Track user engagement
    trackEngagement() {
        // Track time spent on page
        let startTime = Date.now();
        let hasInteracted = false;

        document.addEventListener('click', () => {
            hasInteracted = true;
        });

        window.addEventListener('beforeunload', () => {
            const timeSpent = (Date.now() - startTime) / 1000;
            const pagesViewed = sessionStorage.getItem('pagesViewed') || 1;

            console.log('User engagement:', {
                timeSpent: Math.round(timeSpent),
                hasInteracted: hasInteracted,
                pagesViewed: pagesViewed
            });

            // Send to analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'user_engagement', {
                    'event_category': 'Engagement',
                    'event_label': 'page_exit',
                    'value': Math.round(timeSpent),
                    'custom_map': {
                        'dimension1': hasInteracted.toString(),
                        'metric1': pagesViewed
                    }
                });
            }
        });

        // Track pages viewed in session
        let pagesViewed = parseInt(sessionStorage.getItem('pagesViewed') || '1');
        sessionStorage.setItem('pagesViewed', (pagesViewed + 1).toString());
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new NavigationEnhancer();
});
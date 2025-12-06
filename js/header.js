/**
 * Header Navigation Controller
 * Manages dropdowns and populates navigation items
 */

class HeaderNavigation {
    constructor() {
        this.dropdowns = {
            troubleshoot: document.getElementById('troubleshoot-dropdown'),
            location: document.getElementById('location-dropdown'),
            isp: document.getElementById('isp-dropdown')
        };

        this.triggers = document.querySelectorAll('.nav-dropdown-trigger');
        this.currentPage = window.location.pathname;

        this.init();
    }

    async init() {
        // Load navigation data
        await this.loadNavigationData();

        // Populate dropdowns
        this.populateDropdowns();

        // Setup event listeners
        this.setupEventListeners();

        // Highlight current page
        this.highlightCurrentPage();
    }

    /**
     * Load navigation data from JSON files
     */
    async loadNavigationData() {
        try {
            // Load top problems
            const problemsResponse = await fetch('/data/problem.json');
            this.problemsData = await problemsResponse.json();

            // Load top cities
            const citiesResponse = await fetch('/data/cities.json');
            this.citiesData = await citiesResponse.json();

            // Load top ISPs
            const ispsResponse = await fetch('/data/isps.json');
            this.ispsData = await ispsResponse.json();

        } catch (error) {
            console.error('Failed to load navigation data:', error);
            this.loadFallbackData();
        }
    }

    /**
     * Fallback data if JSON files aren't available
     */
    loadFallbackData() {
        this.problemsData = [
            { keyword: 'internet-keeps-disconnecting', title: 'Internet Keeps Disconnecting? 15 Proven Fixes That Actually Work [2024]' },
            { keyword: 'why-is-my-internet-slow', title: 'Why Is My Internet Slow? Complete Speed Diagnosis Guide [2024]' },
            { keyword: 'wifi-slow-but-ethernet-fast', title: 'WiFi Slow But Ethernet Fast? Here\'s Why & How to Fix It [2024]' },
            { keyword: 'internet-speed-test-accurate', title: 'Are Internet Speed Tests Accurate? The Truth About Testing [2024]' },
            { keyword: 'internet-speed-for-streaming', title: 'Internet Speed for Streaming: Exact Requirements for Netflix, Hulu & More [2024]' }
        ];

        this.citiesData = [
            { name: 'New York', state: 'NY' },
            { name: 'Los Angeles', state: 'CA' },
            { name: 'Chicago', state: 'IL' },
            { name: 'Houston', state: 'TX' },
            { name: 'Phoenix', state: 'AZ' }
        ];

        this.ispsData = [
            { name: 'Xfinity', type: 'Cable' },
            { name: 'Spectrum', type: 'Cable' },
            { name: 'AT&T', type: 'Mixed' },
            { name: 'Verizon Fios', type: 'Fiber' },
            { name: 'CenturyLink', type: 'Mixed' }
        ];
    }

    /**
     * Populate all dropdown menus
     */
    populateDropdowns() {
        // Troubleshoot dropdown
        this.populateDropdown('troubleshoot', this.problemsData.slice(0, 8), (item) => ({
            text: `🔧 ${item.title.split('?')[0]}?`,
            url: `/content/problems/${item.keyword}.html`,
            icon: '🔧'
        }));

        // Location dropdown
        this.populateDropdown('location', this.citiesData.slice(0, 8), (item) => ({
            text: `${item.name}, ${item.state}`,
            url: `/content/locations/speed-test-${this.slugify(item.name)}-${item.state.toLowerCase()}.html`,
            icon: '📍'
        }));

        // ISP dropdown
        this.populateDropdown('isp', this.ispsData.slice(0, 8), (item) => ({
            text: `${item.name}`,
            url: `/content/isps/${this.slugify(item.name)}-speed-test.html`,
            icon: '🏢'
        }));
    }

    /**
     * Helper function to create slugs
     */
    slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    }

    /**
     * Populate individual dropdown
     */
    populateDropdown(type, items, formatter) {
        const dropdown = this.dropdowns[type];
        if (!dropdown) return;

        dropdown.innerHTML = items.map(item => {
            const formatted = formatter(item);
            return `
                <a href="${formatted.url}" class="dropdown-item">
                    <span class="dropdown-item-icon">${formatted.icon}</span>
                    ${formatted.text}
                </a>
            `;
        }).join('');
    }

    /**
     * Setup dropdown event listeners
     */
    setupEventListeners() {
        // Dropdown triggers
        this.triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown(trigger);
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            this.closeAllDropdowns();
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
            }
        });

        // Handle touch devices
        this.setupTouchHandlers();
    }

    /**
     * Toggle individual dropdown
     */
    toggleDropdown(trigger) {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

        // Close all dropdowns first
        this.closeAllDropdowns();

        // Open if was closed
        if (!isExpanded) {
            trigger.setAttribute('aria-expanded', 'true');
            this.addDropdownOverlay();
        }
    }

    /**
     * Close all dropdowns
     */
    closeAllDropdowns() {
        this.triggers.forEach(trigger => {
            trigger.setAttribute('aria-expanded', 'false');
        });
        this.removeDropdownOverlay();
    }

    /**
     * Add overlay for mobile dropdowns
     */
    addDropdownOverlay() {
        let overlay = document.getElementById('header-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'header-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 999;
                backdrop-filter: blur(2px);
            `;
            overlay.addEventListener('click', () => this.closeAllDropdowns());
            document.body.appendChild(overlay);
        }
        overlay.style.display = 'block';
    }

    /**
     * Remove dropdown overlay
     */
    removeDropdownOverlay() {
        const overlay = document.getElementById('header-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    /**
     * Touch device handlers
     */
    setupTouchHandlers() {
        // Close dropdowns on touch outside
        document.addEventListener('touchstart', (e) => {
            if (!e.target.closest('.nav-dropdown')) {
                this.closeAllDropdowns();
            }
        }, { passive: true });
    }

    /**
     * Highlight current page in navigation
     */
    highlightCurrentPage() {
        // Remove all active states
        document.querySelectorAll('.nav-dropdown-trigger, .nav-test-button').forEach(el => {
            el.removeAttribute('aria-current');
        });

        // Add active state based on current page
        const currentPath = window.location.pathname;

        if (currentPath === '/' || currentPath === '/index.html') {
            document.querySelector('.nav-test-button')?.setAttribute('aria-current', 'page');
        } else if (currentPath.includes('/content/problems/')) {
            document.querySelector('.nav-dropdown-trigger')?.setAttribute('aria-current', 'page');
        }
    }

    /**
     * Get navigation data for external use
     */
    getNavigationData() {
        return {
            problems: this.problemsData,
            cities: this.citiesData,
            isps: this.ispsData
        };
    }
}

// Initialize header when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.headerNavigation = new HeaderNavigation();
});

// Export for use in other modules
window.NavigationData = {
    getData: () => window.headerNavigation?.getNavigationData() || {}
};

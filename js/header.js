/**
 * Header Navigation Controller
 * Manages search modals and populates navigation items
 */

class HeaderNavigation {
    constructor() {
        this.searchData = {
            troubleshoot: [],
            locations: [],
            isps: [],
            results: []
        };

        this.currentModal = null;
        this.searchTriggers = document.querySelectorAll('.search-trigger');
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
            const problemsData = await problemsResponse.json();
            this.searchData.troubleshoot = problemsData.map(item => ({
                text: item.title.split('?')[0] + '?',
                url: `/content/problems/${item.keyword}.html`,
                keywords: [item.keyword, item.title.toLowerCase()]
            }));

            // Load top cities
            const citiesResponse = await fetch('/data/cities.json');
            const citiesData = await citiesResponse.json();
            this.searchData.locations = citiesData.map(city => ({
                text: `${city.name}, ${city.state}`,
                url: `/content/locations/speed-test-${this.slugify(city.name)}-${city.state.toLowerCase()}.html`,
                keywords: [city.name.toLowerCase(), city.state.toLowerCase(), `${city.name} ${city.state}`.toLowerCase()]
            }));

            // Load top ISPs
            const ispsResponse = await fetch('/data/isps.json');
            const ispsData = await ispsResponse.json();
            this.searchData.isps = ispsData.map(isp => ({
                text: isp.name,
                url: `/content/isps/${this.slugify(isp.name)}-speed-test.html`,
                keywords: [isp.name.toLowerCase(), isp.type.toLowerCase()]
            }));

            // Load results data
            const resultsResponse = await fetch('/data/results.json');
            const resultsData = await resultsResponse.json();
            this.searchData.results = resultsData.map(result => ({
                text: `${result.speed} Mbps`,
                url: `/content/results/what-does-${result.speed}-mbps-mean.html`,
                keywords: [`${result.speed} mbps`, result.rating.toLowerCase(), result.description.toLowerCase()]
            }));

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
     * Setup search modal functionality
     */
    setupSearchModals() {
        this.searchTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const searchType = trigger.dataset.search;
                this.openSearchModal(searchType);
            });
        });
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
     * Open search modal for specific type
     */
    openSearchModal(searchType) {
        // Close any existing modal
        this.closeSearchModal();

        // Create modal HTML
        const modalHTML = this.createSearchModal(searchType);
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Get modal elements
        const modal = document.querySelector('.search-modal-overlay');
        this.currentModal = modal;

        // Setup modal events
        this.setupModalEvents(modal, searchType);

        // Focus search input
        const searchInput = modal.querySelector('.search-input');
        searchInput.focus();

        // Show initial results
        this.handleSearch('', searchType, modal);
    }

    /**
     * Close search modal
     */
    closeSearchModal() {
        if (this.currentModal) {
            this.currentModal.remove();
            this.currentModal = null;
        }
    }

    /**
     * Create search modal HTML
     */
    createSearchModal(searchType) {
        const titles = {
            troubleshoot: '🔧 Troubleshoot Internet Issues',
            locations: '📍 Search by Location',
            isps: '🏢 Search by ISP',
            results: '📊 Speed Test Results'
        };

        const placeholders = {
            troubleshoot: 'Search for internet problems...',
            locations: 'Search for cities...',
            isps: 'Search for internet providers...',
            results: 'Search for speed results...'
        };

        return `
            <div class="search-modal-overlay">
                <div class="search-modal-content">
                    <div class="search-modal-header">
                        <h2 class="search-modal-title">${titles[searchType]}</h2>
                        <button class="search-modal-close" aria-label="Close search">✕</button>
                    </div>
                    <div class="search-modal-body">
                        <div class="search-input-container">
                            <input type="text" class="search-input" placeholder="${placeholders[searchType]}" autocomplete="off">
                            <div class="search-input-icon">🔍</div>
                        </div>
                        <div class="search-results-list">
                            <!-- Results will be populated here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render initial results for empty search
     */
    renderInitialResults(searchType) {
        const data = this.searchData[searchType] || [];
        const initialCount = 10;

        if (data.length === 0) {
            return '<div class="search-no-results"><div class="no-results-icon">📄</div><div class="no-results-text">No data available</div></div>';
        }

        return data.slice(0, initialCount).map(item => `
            <a href="${item.url}" class="search-result-item">
                <div class="search-result-content">
                    <div class="search-result-title">${item.text}</div>
                    <div class="search-result-url">${item.url}</div>
                </div>
                <div class="search-result-arrow">→</div>
            </a>
        `).join('') +
        (data.length > initialCount ? `
            <div class="search-result-item" style="justify-content: center; color: var(--text-secondary); cursor: default;">
                <div class="search-result-content">
                    <div class="search-result-title">Type to search ${data.length} items...</div>
                </div>
            </div>
        ` : '');
    }

    /**
     * Setup modal event listeners
     */
    setupModalEvents(modal, searchType) {
        const searchInput = modal.querySelector('.search-input');
        const closeBtn = modal.querySelector('.search-modal-close');
        const overlay = modal.querySelector('.search-modal-overlay');

        // Search input handler
        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value, searchType, modal);
        });

        // Close modal handlers
        closeBtn.addEventListener('click', () => this.closeSearchModal());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.closeSearchModal();
        });

        // Keyboard navigation
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSearchModal();
            }
        });
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
     * Handle search input
     */
    handleSearch(query, searchType, modal) {
        const resultsList = modal.querySelector('.search-results-list');
        const data = this.searchData[searchType] || [];

        if (!query.trim()) {
            // Show initial results
            resultsList.innerHTML = this.renderInitialResults(searchType);
            return;
        }

        // Filter results
        const filteredResults = data.filter(item => {
            const searchTerm = query.toLowerCase();
            return item.text.toLowerCase().includes(searchTerm) ||
                   item.keywords.some(keyword => keyword.includes(searchTerm));
        });

        if (filteredResults.length === 0) {
            resultsList.innerHTML = `
                <div class="search-no-results">
                    <div class="no-results-icon">🔍</div>
                    <div class="no-results-text">No results found for "${query}"</div>
                    <div class="no-results-suggestion">Try a different search term</div>
                </div>
            `;
            return;
        }

        // Render filtered results
        resultsList.innerHTML = filteredResults.slice(0, 20).map(item => `
            <a href="${item.url}" class="search-result-item">
                <div class="search-result-content">
                    <div class="search-result-title">${this.highlightMatch(item.text, query)}</div>
                    <div class="search-result-url">${item.url}</div>
                </div>
                <div class="search-result-arrow">→</div>
            </a>
        `).join('');
    }

    /**
     * Highlight matching text in results
     */
    highlightMatch(text, query) {
        if (!query.trim()) return text;

        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    /**
     * Highlight current page in navigation
     */
    highlightCurrentPage() {
        // Remove all active states
        document.querySelectorAll('.search-trigger, .cta-button').forEach(el => {
            el.removeAttribute('aria-current');
        });

        // Add active state based on current page
        const currentPath = window.location.pathname;

        if (currentPath === '/' || currentPath === '/index.html') {
            document.querySelector('.cta-button')?.setAttribute('aria-current', 'page');
        } else if (currentPath.includes('/content/problems/')) {
            document.querySelector('[data-search="troubleshoot"]')?.setAttribute('aria-current', 'page');
        } else if (currentPath.includes('/content/locations/')) {
            document.querySelector('[data-search="locations"]')?.setAttribute('aria-current', 'page');
        } else if (currentPath.includes('/content/isps/')) {
            document.querySelector('[data-search="isps"]')?.setAttribute('aria-current', 'page');
        } else if (currentPath.includes('/content/results/')) {
            document.querySelector('[data-search="results"]')?.setAttribute('aria-current', 'page');
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

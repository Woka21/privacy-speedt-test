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
        console.log('HeaderNavigation init called');
        // Load navigation data
        await this.loadNavigationData();

        // Setup search modal functionality
        this.setupSearchModals();

        // Highlight current page
        this.highlightCurrentPage();

        console.log('HeaderNavigation init completed');
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
        this.searchData.troubleshoot = [
            { text: 'Internet Keeps Disconnecting?', url: '/content/problems/internet-keeps-disconnecting.html', keywords: ['disconnecting', 'connection drops'] },
            { text: 'Why Is My Internet Slow?', url: '/content/problems/why-is-my-internet-slow.html', keywords: ['slow internet', 'speed issues'] },
            { text: 'WiFi Slow But Ethernet Fast?', url: '/content/problems/wifi-slow-but-ethernet-fast.html', keywords: ['wifi slow', 'ethernet fast'] },
            { text: 'Are Internet Speed Tests Accurate?', url: '/content/problems/internet-speed-test-accurate.html', keywords: ['speed test', 'accurate'] },
            { text: 'Internet Speed for Streaming', url: '/content/problems/internet-speed-for-streaming.html', keywords: ['streaming', 'netflix', 'hulu'] }
        ];

        this.searchData.locations = [
            { text: 'New York, NY', url: '/content/locations/speed-test-new-york-ny.html', keywords: ['new york', 'ny', 'new york ny'] },
            { text: 'Los Angeles, CA', url: '/content/locations/speed-test-los-angeles-ca.html', keywords: ['los angeles', 'ca', 'los angeles ca'] },
            { text: 'Chicago, IL', url: '/content/locations/speed-test-chicago-il.html', keywords: ['chicago', 'il', 'chicago il'] },
            { text: 'Houston, TX', url: '/content/locations/speed-test-houston-tx.html', keywords: ['houston', 'tx', 'houston tx'] },
            { text: 'Phoenix, AZ', url: '/content/locations/speed-test-phoenix-az.html', keywords: ['phoenix', 'az', 'phoenix az'] }
        ];

        this.searchData.isps = [
            { text: 'Xfinity', url: '/content/isps/xfinity-speed-test.html', keywords: ['xfinity', 'cable'] },
            { text: 'Spectrum', url: '/content/isps/spectrum-speed-test.html', keywords: ['spectrum', 'cable'] },
            { text: 'AT&T', url: '/content/isps/at&t-speed-test.html', keywords: ['at&t', 'mixed'] },
            { text: 'Verizon Fios', url: '/content/isps/verizon-fios-speed-test.html', keywords: ['verizon', 'fiber'] },
            { text: 'CenturyLink', url: '/content/isps/centurylink-speed-test.html', keywords: ['centurylink', 'mixed'] }
        ];

        this.searchData.results = [
            { text: '10 Mbps', url: '/content/results/what-does-10-mbps-mean.html', keywords: ['10 mbps', 'basic', 'sufficient for basic browsing'] },
            { text: '25 Mbps', url: '/content/results/what-does-25-mbps-mean.html', keywords: ['25 mbps', 'good', 'hd streaming'] },
            { text: '50 Mbps', url: '/content/results/what-does-50-mbps-mean.html', keywords: ['50 mbps', 'very good', '4k streaming'] },
            { text: '100 Mbps', url: '/content/results/what-does-100-mbps-mean.html', keywords: ['100 mbps', 'excellent', 'gaming'] },
            { text: '200 Mbps', url: '/content/results/what-does-200-mbps-mean.html', keywords: ['200 mbps', 'outstanding', 'power users'] }
        ];
    }

    /**
     * Setup search modal functionality
     */
    setupSearchModals() {
        console.log('Setting up search modals, found triggers:', this.searchTriggers.length);
        this.searchTriggers.forEach(trigger => {
            console.log('Attaching click listener to:', trigger, 'with data-search:', trigger.dataset.search);
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const searchType = trigger.dataset.search;
                console.log('Opening modal for type:', searchType);
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
            troubleshoot: this.searchData.troubleshoot,
            locations: this.searchData.locations,
            isps: this.searchData.isps,
            results: this.searchData.results
        };
    }
}

// Make class available globally
window.HeaderNavigation = HeaderNavigation;

// Initialize header when DOM is ready (fallback)
document.addEventListener('DOMContentLoaded', () => {
    if (!window.headerNavigation) {
        window.headerNavigation = new HeaderNavigation();
    }
});

// Export for use in other modules
window.NavigationData = {
    getData: () => window.headerNavigation?.getNavigationData() || {}
};

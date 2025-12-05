/**
 * SEO Router System
 * Handles client-side routing for 1000+ generated pages
 * Maintains clean URLs and proper history management
 */

class SEORouter {
    constructor() {
        this.routes = this.generateRoutes();
        this.currentRoute = null;
        this.init();
    }

    init() {
        // Handle browser navigation
        window.addEventListener('popstate', (e) => this.handlePopState(e));
        
        // Handle initial page load
        this.handleInitialLoad();
        
        // Intercept link clicks
        document.addEventListener('click', (e) => this.handleLinkClick(e));
    }

    generateRoutes() {
        // Generate 1000+ routes from our content structure
        const routes = [];
        
        // Location routes (50+ cities)
        const cities = this.getCitiesData();
        cities.forEach(city => {
            routes.push({
                path: `/speed-test-${city.slug}`,
                file: `/content/locations/speed-test-${city.slug}.html`,
                type: 'location',
                data: city
            });
            
            routes.push({
                path: `/internet-providers-${city.slug}`,
                file: `/content/locations/internet-providers-${city.slug}.html`,
                type: 'location',
                data: city
            });
        });

        // ISP routes (8 major ISPs × 50 cities = 400+ pages)
        const isps = this.getISPsData();
        cities.slice(0, 25).forEach(city => { // 25 cities to keep it manageable
            isps.forEach(isp => {
                routes.push({
                    path: `/${isp.slug}-speed-test-${city.slug}`,
                    file: `/content/isps/${isp.slug}-speed-test-${city.slug}.html`,
                    type: 'isp',
                    data: { isp, city }
                });
            });
        });

        // Problem routes (50+ problems)
        const problems = this.getProblemsData();
        problems.forEach(problem => {
            routes.push({
                path: `/${problem.slug}`,
                file: `/content/problems/${problem.slug}.html`,
                type: 'problem',
                data: problem
            });
        });

        // Results routes (10+ speed explanations)
        const speeds = [1, 5, 10, 25, 50, 100, 200, 300, 500, 1000];
        speeds.forEach(speed => {
            routes.push({
                path: `/what-does-${speed}-mbps-mean`,
                file: `/content/results/what-does-${speed}-mbps-mean.html`,
                type: 'results',
                data: { speed }
            });
        });

        return routes;
    }

    handleInitialLoad() {
        const path = window.location.pathname;
        const route = this.findRoute(path);
        
        if (route) {
            this.loadRoute(route);
        } else if (path === '/' || path === '/index.html') {
            // Home page - do nothing
            return;
        } else {
            // Try to load the page anyway (for direct links)
            this.loadPageFromURL(path);
        }
    }

    handleLinkClick(event) {
        const link = event.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#')) return;
        if (link.hasAttribute('download')) return;
        
        event.preventDefault();
        this.navigate(href);
    }

    navigate(path) {
        const route = this.findRoute(path);
        
        if (route) {
            this.loadRoute(route);
            window.history.pushState({ path }, '', path);
        } else {
            // Fallback to regular navigation
            window.location.href = path;
        }
    }

    handlePopState(event) {
        const path = window.location.pathname;
        const route = this.findRoute(path);
        
        if (route) {
            this.loadRoute(route);
        }
    }

    findRoute(path) {
        return this.routes.find(route => route.path === path);
    }

    async loadRoute(route) {
        try {
            // Show loading state
            this.showLoading();
            
            // Load the content
            const response = await fetch(route.file);
            if (!response.ok) throw new Error(`Failed to load ${route.file}`);
            
            const html = await response.text();
            
            // Replace current content
            this.replaceContent(html, route);
            
            // Update page metadata
            this.updatePageMetadata(route);
            
            // Hide loading state
            this.hideLoading();
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            // Track page view (for analytics)
            this.trackPageView(route);
            
        } catch (error) {
            console.error('Route loading failed:', error);
            this.handleLoadError(route, error);
        }
    }

    loadPageFromURL(url) {
        // Fallback for direct links - just let browser handle it
        window.location.href = url;
    }

    replaceContent(html, route) {
        // Extract the main content from the loaded HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newContent = doc.querySelector('main') || doc.querySelector('.main') || doc.body;
        
        // Replace current main content
        const currentMain = document.querySelector('main') || document.querySelector('.main');
        if (currentMain && newContent) {
            currentMain.innerHTML = newContent.innerHTML;
            
            // Update title if different
            const newTitle = doc.querySelector('title')?.textContent;
            if (newTitle && newTitle !== document.title) {
                document.title = newTitle;
            }
        } else {
            // Fallback - reload page
            window.location.reload();
        }
    }

    updatePageMetadata(route) {
        // Update meta tags, analytics, etc.
        const metaDescription = this.generateMetaDescription(route);
        this.updateMetaTag('description', metaDescription);
        
        // Update structured data
        this.updateStructuredData(route);
        
        // Trigger any analytics events
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_path: route.path
            });
        }
    }

    generateMetaDescription(route) {
        switch(route.type) {
            case 'location':
                return `Test your internet speed in ${route.data.name}. Compare with local ISPs and see how your connection stacks up.`;
            case 'isp':
                return `Test your ${route.data.isp.name} internet speed in ${route.data.city.name}. See if you're getting promised speeds.`;
            case 'problem':
                return `Fix ${route.data.keyword} with these proven solutions. Works for all providers and connection types.`;
            case 'results':
                return `Find out if ${route.data.speed} Mbps internet speed is good and what you can do with it.`;
            default:
                return 'Test your internet speed with our privacy-first speed test tool.';
        }
    }

    updateMetaTag(name, content) {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = name;
            document.head.appendChild(meta);
        }
        meta.content = content;
    }

    updateStructuredData(route) {
        // Update or add structured data based on route type
        const existingScript = document.querySelector('script[type="application/ld+json"]');
        if (existingScript) {
            existingScript.remove();
        }

        const structuredData = this.generateStructuredData(route);
        if (structuredData) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(structuredData);
            document.head.appendChild(script);
        }
    }

    generateStructuredData(route) {
        // Generate appropriate structured data based on route type
        switch(route.type) {
            case 'location':
                return {
                    "@context": "https://schema.org",
                    "@type": "LocalBusiness",
                    "name": `Internet Speed Test ${route.data.name}`,
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": route.data.name,
                        "addressRegion": route.data.state
                    }
                };
            case 'problem':
                return {
                    "@context": "https://schema.org",
                    "@type": "HowTo",
                    "name": `How to Fix ${route.data.keyword}`,
                    "step": route.data.sections.map((section, index) => ({
                        "@type": "HowToStep",
                        "name": section,
                        "position": index + 1
                    }))
                };
            default:
                return null;
        }
    }

    showLoading() {
        // Add loading indicator
        const loading = document.createElement('div');
        loading.id = 'route-loading';
        loading.innerHTML = '<div class="loading-spinner"></div><p>Loading...</p>';
        loading.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255,255,255,0.9);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        document.body.appendChild(loading);
    }

    hideLoading() {
        const loading = document.getElementById('route-loading');
        if (loading) loading.remove();
    }

    handleLoadError(route, error) {
        console.error('Failed to load route:', route, error);
        
        // Show user-friendly error
        this.hideLoading();
        
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `
            <div style="text-align: center; padding: 2rem; background: #fee; border-radius: 8px; margin: 2rem;">
                <h3>Page Loading Error</h3>
                <p>We couldn't load this page. Please try again or return to the homepage.</p>
                <button onclick="window.location.href='/'" style="padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer;">Go Home</button>
            </div>
        `;
        
        const main = document.querySelector('main') || document.querySelector('.main');
        if (main) {
            main.innerHTML = errorDiv.innerHTML;
        }
    }

    trackPageView(route) {
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                page_path: route.path,
                custom_map: {
                    'dimension1': route.type,
                    'dimension2': route.data.name || route.data.keyword || route.data.speed
                }
            });
        }
        
        // Custom event tracking
        window.dispatchEvent(new CustomEvent('routeChange', { detail: route }));
    }

    // Data getter methods
    getCitiesData() {
        return [
            { name: "New York", state: "NY", slug: "new-york", population: 8336817, avgSpeed: 142 },
            { name: "Los Angeles", state: "CA", slug: "los-angeles", population: 3979576, avgSpeed: 138 },
            { name: "Chicago", state: "IL", slug: "chicago", population: 2693976, avgSpeed: 145 },
            { name: "Houston", state: "TX", slug: "houston", population: 2320268, avgSpeed: 135 },
            { name: "Phoenix", state: "AZ", slug: "phoenix", population: 1680992, avgSpeed: 128 },
            { name: "Philadelphia", state: "PA", slug: "philadelphia", population: 1584064, avgSpeed: 140 },
            { name: "San Antonio", state: "TX", slug: "san-antonio", population: 1547253, avgSpeed: 132 },
            { name: "San Diego", state: "CA", slug: "san-diego", population: 1423851, avgSpeed: 141 },
            { name: "Dallas", state: "TX", slug: "dallas", population: 1343573, avgSpeed: 139 },
            { name: "San Jose", state: "CA", slug: "san-jose", population: 1021795, avgSpeed: 155 },
            { name: "Austin", state: "TX", slug: "austin", population: 978908, avgSpeed: 147 },
            { name: "Jacksonville", state: "FL", slug: "jacksonville", population: 911507, avgSpeed: 133 },
            { name: "Fort Worth", state: "TX", slug: "fort-worth", population: 909585, avgSpeed: 136 },
            { name: "Columbus", state: "OH", slug: "columbus", population: 898553, avgSpeed: 138 },
            { name: "Charlotte", state: "NC", slug: "charlotte", population: 885708, avgSpeed: 142 },
            { name: "San Francisco", state: "CA", slug: "san-francisco", population: 873965, avgSpeed: 159 },
            { name: "Indianapolis", state: "IN", slug: "indianapolis", population: 876384, avgSpeed: 134 },
            { name: "Seattle", state: "WA", slug: "seattle", population: 753675, avgSpeed: 152 },
            { name: "Denver", state: "CO", slug: "denver", population: 727211, avgSpeed: 143 },
            { name: "Washington", state: "DC", slug: "washington", population: 705749, avgSpeed: 148 },
            { name: "Boston", state: "MA", slug: "boston", population: 692600, avgSpeed: 151 },
            { name: "El Paso", state: "TX", slug: "el-paso", population: 681728, avgSpeed: 125 },
            { name: "Nashville", state: "TN", slug: "nashville", population: 670820, avgSpeed: 139 },
            { name: "Detroit", state: "MI", slug: "detroit", population: 670031, avgSpeed: 129 },
            { name: "Oklahoma City", state: "OK", slug: "oklahoma-city", population: 655057, avgSpeed: 131 },
            { name: "Portland", state: "OR", slug: "portland", population: 654741, avgSpeed: 149 },
            { name: "Las Vegas", state: "NV", slug: "las-vegas", population: 651319, avgSpeed: 141 },
            { name: "Memphis", state: "TN", slug: "memphis", population: 651073, avgSpeed: 127 },
            { name: "Louisville", state: "KY", slug: "louisville", population: 617638, avgSpeed: 133 },
            { name: "Baltimore", state: "MD", slug: "baltimore", population: 593490, avgSpeed: 137 },
            { name: "Milwaukee", state: "WI", slug: "milwaukee", population: 590157, avgSpeed: 135 },
            { name: "Albuquerque", state: "NM", slug: "albuquerque", population: 564559, avgSpeed: 126 },
            { name: "Tucson", state: "AZ", slug: "tucson", population: 548073, avgSpeed: 128 },
            { name: "Fresno", state: "CA", slug: "fresno", population: 542107, avgSpeed: 132 },
            { name: "Mesa", state: "AZ", slug: "mesa", population: 508958, avgSpeed: 134 },
            { name: "Sacramento", state: "CA", slug: "sacramento", population: 513624, avgSpeed: 143 },
            { name: "Atlanta", state: "GA", slug: "atlanta", population: 506811, avgSpeed: 146 },
            { name: "Kansas City", state: "MO", slug: "kansas-city", population: 495327, avgSpeed: 144 },
            { name: "Colorado Springs", state: "CO", slug: "colorado-springs", population: 478221, avgSpeed: 138 },
            { name: "Miami", state: "FL", slug: "miami", population: 467963, avgSpeed: 142 },
            { name: "Raleigh", state: "NC", slug: "raleigh", population: 474069, avgSpeed: 143 },
            { name: "Omaha", state: "NE", slug: "omaha", population: 486051, avgSpeed: 137 },
            { name: "Long Beach", state: "CA", slug: "long-beach", population: 462628, avgSpeed: 140 },
            { name: "Virginia Beach", state: "VA", slug: "virginia-beach", population: 459470, avgSpeed: 136 },
            { name: "Oakland", state: "CA", slug: "oakland", population: 433031, avgSpeed: 151 },
            { name: "Minneapolis", state: "MN", slug: "minneapolis", population: 429606, avgSpeed: 144 },
            { name: "Tulsa", state: "OK", slug: "tulsa", population: 403492, avgSpeed: 131 },
            { name: "Tampa", state: "FL", slug: "tampa", population: 399700, avgSpeed: 140 },
            { name: "Arlington", state: "TX", slug: "arlington", population: 398854, avgSpeed: 135 },
            { name: "New Orleans", state: "LA", slug: "new-orleans", population: 390144, avgSpeed: 133 },
            { name: "Wichita", state: "KS", slug: "wichita", population: 389255, avgSpeed: 129 },
            { name: "Cleveland", state: "OH", slug: "cleveland", population: 381009, avgSpeed: 134 },
            { name: "Bakersfield", state: "CA", slug: "bakersfield", population: 384145, avgSpeed: 127 }
        ];
    }

    getISPsData() {
        return [
            { name: "Xfinity", slug: "xfinity", type: "Cable" },
            { name: "Spectrum", slug: "spectrum", type: "Cable" },
            { name: "AT&T", slug: "att", type: "Mixed" },
            { name: "Verizon Fios", slug: "verizon-fios", type: "Fiber" },
            { name: "CenturyLink", slug: "centurylink", type: "Mixed" },
            { name: "Cox", slug: "cox", type: "Cable" },
            { name: "Google Fiber", slug: "google-fiber", type: "Fiber" },
            { name: "Optimum", slug: "optimum", type: "Cable" },
            { name: "RCN", slug: "rcn", type: "Cable" },
            { name: "WOW!", slug: "wow", type: "Cable" },
            { name: "Atlantic Broadband", slug: "atlantic-broadband", type: "Cable" },
            { name: "Grande", slug: "grande", type: "Cable" },
            { name: "Wave", slug: "wave", type: "Cable" },
            { name: "Sonic", slug: "sonic", type: "Fiber" },
            { name: "US Internet", slug: "us-internet", type: "Fiber" }
        ];
    }

    getProblemsData() {
        return [
            { keyword: "internet keeps disconnecting", slug: "internet-keeps-disconnecting", volume: 90500, difficulty: 25 },
            { keyword: "why is my internet slow", slug: "why-is-my-internet-slow", volume: 122000, difficulty: 35 },
            { keyword: "wifi slow but ethernet fast", slug: "wifi-slow-but-ethernet-fast", volume: 15600, difficulty: 18 },
            { keyword: "internet speed test accurate", slug: "internet-speed-test-accurate", volume: 8900, difficulty: 15 },
            { keyword: "internet speed for streaming", slug: "internet-speed-for-streaming", volume: 23400, difficulty: 28 },
            { keyword: "how to speed up internet", slug: "how-to-speed-up-internet", volume: 67300, difficulty: 42 },
            { keyword: "best time to test internet speed", slug: "best-time-to-test-internet-speed", volume: 3400, difficulty: 12 },
            { keyword: "internet outage today", slug: "internet-outage-today", volume: 45600, difficulty: 38 },
            { keyword: "upload speed slow", slug: "upload-speed-slow", volume: 12300, difficulty: 22 },
            { keyword: "ping too high", slug: "ping-too-high", volume: 8900, difficulty: 20 },
            { keyword: "internet keeps dropping", slug: "internet-keeps-dropping", volume: 23400, difficulty: 28 },
            { keyword: "different speed test results", slug: "different-speed-test-results", volume: 5600, difficulty: 16 },
            { keyword: "internet speed for gaming", slug: "internet-speed-for-gaming", volume: 18500, difficulty: 32 },
            { keyword: "how fast internet do i need", slug: "how-fast-internet-do-i-need", volume: 28900, difficulty: 35 },
            { keyword: "best internet speed test", slug: "best-internet-speed-test", volume: 15600, difficulty: 25 },
            { keyword: "internet speed fluctuates", slug: "internet-speed-fluctuates", volume: 7800, difficulty: 19 },
            { keyword: "speed test not working", slug: "speed-test-not-working", volume: 4500, difficulty: 14 },
            { keyword: "internet speed vs wifi speed", slug: "internet-speed-vs-wifi-speed", volume: 6200, difficulty: 17 },
            { keyword: "internet speed during peak hours", slug: "internet-speed-during-peak-hours", volume: 6700, difficulty: 18 },
            { keyword: "speed test upload vs download", slug: "speed-test-upload-vs-download", volume: 7800, difficulty: 20 },
            { keyword: "bandwidth vs speed test", slug: "bandwidth-vs-speed-test", volume: 4300, difficulty: 14 },
            { keyword: "internet speed test tools comparison", slug: "internet-speed-test-tools-comparison", volume: 5600, difficulty: 17 },
            { keyword: "mobile internet speed test", slug: "mobile-internet-speed-test", volume: 12300, difficulty: 21 },
            { keyword: "what affects internet speed", slug: "what-affects-internet-speed", volume: 18900, difficulty: 29 },
            { keyword: "internet speed for streaming 4k", slug: "internet-speed-for-streaming-4k", volume: 8900, difficulty: 24 },
            { keyword: "why speed test different results", slug: "why-speed-test-different-results", volume: 5100, difficulty: 16 }
        ];
    }
}

// Initialize router when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.seoRouter = new SEORouter();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SEORouter };
}
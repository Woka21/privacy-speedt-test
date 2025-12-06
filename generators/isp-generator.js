/**
 * ISP-Specific Content Generator
 * Creates ISP×City combination pages for provider-specific SEO
 */

const fs = require('fs');
const path = require('path');
const cities = require('../data/cities.json');
const isps = require('../data/isps.json');

// ISP-specific data and plans
const ispData = {
    "Xfinity": {
        plans: [
            { name: "Performance", speed: 100, price: 39.99, type: "Cable" },
            { name: "Blast!", speed: 200, price: 59.99, type: "Cable" },
            { name: "Extreme", speed: 400, price: 79.99, type: "Cable" },
            { name: "Gigabit", speed: 1000, price: 99.99, type: "Cable" }
        ],
        support: "1-800-XFINITY",
        outageUrl: "https://xfinity.com/support/status",
        features: ["xFi Gateway", "Xfinity Stream", "Unlimited data option"],
        commonIssues: ["Peak hour slowdowns", "Upload speed limitations", "Data cap overages"]
    },
    "Spectrum": {
        plans: [
            { name: "Internet", speed: 100, price: 49.99, type: "Cable" },
            { name: "Internet Ultra", speed: 400, price: 69.99, type: "Cable" },
            { name: "Internet Gig", speed: 940, price: 89.99, type: "Cable" }
        ],
        support: "1-855-707-7328",
        outageUrl: "https://spectrum.com/support/internet",
        features: ["Free modem", "No data caps", "Spectrum TV app"],
        commonIssues: ["Peak hour congestion", "Upload speed disparity", "Equipment rental fees"]
    },
    "AT&T": {
        plans: [
            { name: "Internet 100", speed: 100, price: 55.00, type: "IPBB" },
            { name: "Internet 300", speed: 300, price: 65.00, type: "Fiber" },
            { name: "Internet 500", speed: 500, price: 75.00, type: "Fiber" },
            { name: "Internet 1000", speed: 1000, price: 85.00, type: "Fiber" }
        ],
        support: "1-800-288-2020",
        outageUrl: "https://att.com/support/availability",
        features: ["Smart Home Manager", "AT&T TV", "Fiber where available"],
        commonIssues: ["Fiber availability limited", "IPBB speed variations", "Installation delays"]
    },
    "Verizon Fios": {
        plans: [
            { name: "200/200", speed: 200, price: 49.99, type: "Fiber" },
            { name: "400/400", speed: 400, price: 69.99, type: "Fiber" },
            { name: "Gigabit Connection", speed: 940, price: 89.99, type: "Fiber" }
        ],
        support: "1-800-VERIZON",
        outageUrl: "https://verizon.com/support/outages",
        features: ["Symmetrical speeds", "No data caps", "Verizon Smart Family"],
        commonIssues: ["Limited availability", "High installation fees", "Contract requirements"]
    },
    "CenturyLink": {
        plans: [
            { name: "Internet", speed: 100, price: 49.00, type: "DSL" },
            { name: "Fiber Internet", speed: 940, price: 65.00, type: "Fiber" }
        ],
        support: "1-800-244-1111",
        outageUrl: "https://centurylink.com/help",
        features: ["Price for Life", "No contract", "Fiber in select areas"],
        commonIssues: ["DSL speed limitations", "Fiber availability", "Customer service"]
    },
    "Cox": {
        plans: [
            { name: "Starter 25", speed: 25, price: 29.99, type: "Cable" },
            { name: "Essential 50", speed: 50, price: 39.99, type: "Cable" },
            { name: "Preferred 150", speed: 150, price: 59.99, type: "Cable" },
            { name: "Ultimate 500", speed: 500, price: 79.99, type: "Cable" },
            { name: "Gigablast", speed: 1000, price: 99.99, type: "Cable" }
        ],
        support: "1-800-234-3993",
        outageUrl: "https://cox.com/residential/support.html",
        features: ["Panoramic WiFi", "Cox Homelife", "No contract options"],
        commonIssues: ["Data caps on lower tiers", "Peak hour slowdowns", "Equipment rental fees"]
    },
    "Google Fiber": {
        plans: [
            { name: "Fiber 100", speed: 100, price: 50.00, type: "Fiber" },
            { name: "Fiber 500", speed: 500, price: 65.00, type: "Fiber" },
            { name: "Fiber 1000", speed: 1000, price: 70.00, type: "Fiber" },
            { name: "Fiber 2000", speed: 2000, price: 100.00, type: "Fiber" }
        ],
        support: "1-844-363-4237",
        outageUrl: "https://fiber.google.com/support/",
        features: ["No data caps", "No contracts", "Symmetric speeds", "Google One included"],
        commonIssues: ["Limited availability", "Long installation waits", "Service area restrictions"]
    }
};

// ISP page template
const ispTemplate = (isp, city, state) => {
    const ispInfo = ispData[isp];
    const slug = `${isp.toLowerCase().replace(/\s+/g, '-')}-speed-test-${city.toLowerCase().replace(/\s+/g, '-')}`;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <title>${isp} Speed Test ${city} | Check Your ${isp} Connection</title>
    <meta name="description" content="Test your ${isp} internet speed in ${city}, ${state}. See if ${isp} is delivering promised speeds and compare with other providers.">
    <meta name="keywords" content="${isp.toLowerCase()} speed test, ${isp.toLowerCase()} ${city.toLowerCase()}, ${isp.toLowerCase()} internet speed, test ${isp.toLowerCase()} connection, ${isp.toLowerCase()} speed check ${city.toLowerCase()}">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://yoursite.com/content/isps/${slug}.html">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${isp} Speed Test ${city} | Is Your ISP Delivering Promised Speeds?">
    <meta property="og:description" content="Test your ${isp} internet speed in ${city}, ${state}. Compare with other providers and see if you're getting what you pay for.">
    <meta property="og:type" content="website">
    
    <!-- Schema Markup -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "${isp} Speed Test ${city}",
        "description": "Test ${isp} internet speed in ${city}, ${state}",
        "applicationCategory": "UtilityApplication",
        "provider": {
            "@type": "Organization",
            "name": "${isp}"
        },
        "areaServed": {
            "@type": "City",
            "name": "${city}",
            "containedInPlace": {
                "@type": "State",
                "name": "${state}"
            }
        },
        "offers": {
            "@type": "Offer",
            "price": "0"
        }
    }
    </script>
    
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/responsive.css">
</head>
<body>
    <!-- Header -->
    <div id="header-container"></div>

    <script>
    // Load header component
    fetch('/header.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('header-container').innerHTML = html;
        })
        .catch(error => {
            console.error('Failed to load header:', error);
        });
    </script>

    <!-- Page Header -->
    <header class="page-header">
        <div class="container">
            <h1>🛡️ ${isp} Speed Test ${city}</h1>
            <p class="subtitle">Is ${isp} delivering promised speeds in ${city}? • Test now</p>
        </div>
    </header>

    <main class="main">
        <div class="container">
            <div class="speed-test-card">
                <div id="test-interface">
                    <button id="start-test" class="primary-button">
                        <span>🚀 Test ${isp} Speed</span>
                    </button>
                    <p class="privacy-note">✈️ Private speed test • No data collection</p>
                </div>

                <div id="results-container" class="hidden">
                    <!-- Results will be populated here -->
                </div>
            </div>

            <!-- ISP-Specific Content -->
            <section class="isp-content">
                <h2>Is ${isp} Delivering Promised Speeds in ${city}?</h2>
                <div class="isp-overview">
                    <div class="isp-info">
                        <h3>About ${isp} in ${city}</h3>
                        <p>${isp} provides internet service to ${city} residents with ${ispInfo.plans.length} different plans ranging from ${ispInfo.plans[0].speed} Mbps to ${ispInfo.plans[ispInfo.plans.length-1].speed} Mbps.</p>
                        
                        <div class="isp-features">
                            <h4>Key Features:</h4>
                            <ul>
                                ${ispInfo.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    
                    <div class="isp-contact">
                        <h4>Need Support?</h4>
                        <p><strong>Customer Service:</strong> ${ispInfo.support}</p>
                        <p><strong>Outage Checker:</strong> <a href="${ispInfo.outageUrl}" target="_blank">${ispInfo.outageUrl}</a></p>
                    </div>
                </div>

                <h2>${isp} Internet Plans in ${city}</h2>
                <div class="plans-comparison">
                    ${ispInfo.plans.map((plan, index) => `
                    <div class="plan-card ${index === 1 ? 'popular' : ''}">
                        <h3>${plan.name}</h3>
                        <div class="plan-speed">${plan.speed} Mbps</div>
                        <div class="plan-price">$${plan.price}/month</div>
                        <div class="plan-type">${plan.type}</div>
                        <div class="plan-features">
                            ${plan.speed >= 100 ? '✅ Good for streaming' : '⚠️ Basic usage only'}
                            ${plan.speed >= 200 ? '<br>✅ Multiple devices' : ''}
                            ${plan.speed >= 500 ? '<br>✅ 4K streaming' : ''}
                        </div>
                        ${index === 1 ? '<div class="popular-badge">Most Popular</div>' : ''}
                    </div>
                    `).join('')}
                </div>

                <h2>Common ${isp} Issues in ${city}</h2>
                <div class="common-issues">
                    ${ispInfo.commonIssues.map(issue => `
                    <div class="issue-card">
                        <h4>${issue}</h4>
                        <p>${getIssueDescription(issue, isp)}</p>
                        <div class="issue-solution">${getIssueSolution(issue, isp)}</div>
                    </div>
                    `).join('')}
                </div>

                <h2>How to Get Faster ${isp} Speeds in ${city}</h2>
                <div class="speed-improvement">
                    <div class="improvement-steps">
                        <div class="step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>Test Your Current Speed</h4>
                                <p>Use our speed test above to establish your baseline speed with ${isp}.</p>
                            </div>
                        </div>
                        <div class="step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>Compare With Your Plan</h4>
                                <p>Check if you're getting at least 80% of your plan's advertised speed.</p>
                            </div>
                        </div>
                        <div class="step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>Contact ${isp} Support</h4>
                                <p>If speeds are consistently low, call ${ispInfo.support} and reference your speed test results.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <h2>${isp} vs Other ${city} Internet Providers</h2>
                <div class="provider-comparison">
                    <p>Compare ${isp} with other major providers in ${city}:</p>
                    <div class="comparison-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Provider</th>
                                    <th>Max Speed</th>
                                    <th>Starting Price</th>
                                    <th>Technology</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="current-isp">
                                    <td><strong>${isp}</strong></td>
                                    <td>${ispInfo.plans[ispInfo.plans.length-1].speed} Mbps</td>
                                    <td>$${ispInfo.plans[0].price}/mo</td>
                                    <td>${ispInfo.plans[0].type}</td>
                                </tr>
                                <tr>
                                    <td>${getCompetitorISP(isp, 0)}</td>
                                    <td>Up to 1000 Mbps</td>
                                    <td>$49.99/mo</td>
                                    <td>Fiber/Cable</td>
                                </tr>
                                <tr>
                                    <td>${getCompetitorISP(isp, 1)}</td>
                                    <td>Up to 500 Mbps</td>
                                    <td>$39.99/mo</td>
                                    <td>Cable/DSL</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="comparison-cta">
                        <p><strong>Not sure which provider is best for you?</strong></p>
                        <a href="/internet-providers-${city.toLowerCase().replace(/\s+/g, '-')}.html" class="compare-button">
                            Compare All ${city} Providers
                        </a>
                    </div>
                </div>
            </section>

            <!-- Local Context -->
            <section class="local-context">
                <h2>${isp} Coverage in ${city} by Neighborhood</h2>
                <div class="neighborhood-coverage">
                    <div class="coverage-area">
                        <h4>Downtown ${city}</h4>
                        <div class="coverage-status available">✅ Available</div>
                        <p>Speeds up to ${ispInfo.plans[ispInfo.plans.length-1].speed} Mbps</p>
                    </div>
                    <div class="coverage-area">
                        <h4>Suburban ${city}</h4>
                        <div class="coverage-status available">✅ Available</div>
                        <p>Speeds up to ${Math.round(ispInfo.plans[ispInfo.plans.length-1].speed * 0.8)} Mbps</p>
                    </div>
                    <div class="coverage-area">
                        <h4>Rural ${city} Area</h4>
                        <div class="coverage-status limited">⚠️ Limited</div>
                        <p>Speeds up to ${Math.round(ispInfo.plans[ispInfo.plans.length-1].speed * 0.5)} Mbps</p>
                    </div>
                </div>

                <h2>Recent ${isp} Speed Test Results in ${city}</h2>
                <div class="recent-results">
                    <div class="results-summary">
                        <div class="result-stat">
                            <div class="stat-label">Average Download</div>
                            <div class="stat-value">${Math.round(ispInfo.plans[1].speed * 0.85)} Mbps</div>
                        </div>
                        <div class="result-stat">
                            <div class="stat-label">Average Upload</div>
                            <div class="stat-value">${Math.round(ispInfo.plans[1].speed * 0.15)} Mbps</div>
                        </div>
                        <div class="result-stat">
                            <div class="stat-label">Customer Satisfaction</div>
                            <div class="stat-value">78%</div>
                        </div>
                    </div>
                    
                    <div class="results-disclaimer">
                        <p><em>Based on recent speed tests from ${city} residents. Individual results may vary.</em></p>
                    </div>
                </div>
            </section>

            <!-- SEO Content -->
            <section class="seo-content">
                <h2>Understanding Internet Speed Tests</h2>
                <div class="content-grid">
                    <article class="content-card">
                        <h3>📊 What Speed Tests Measure</h3>
                        <ul>
                            <li><strong>Download:</strong> How fast you receive data</li>
                            <li><strong>Upload:</strong> How fast you send data</li>
                            <li><strong>Ping:</strong> Response time (latency)</li>
                            <li><strong>Jitter:</strong> Consistency of response</li>
                        </ul>
                    </article>
                    <article class="content-card">
                        <h3>🎯 Testing Best Practices</h3>
                        <ul>
                            <li>Test with ethernet when possible</li>
                            <li>Close other applications</li>
                            <li>Test at different times of day</li>
                            <li>Use multiple test services</li>
                        </ul>
                    </article>
                    <article class="content-card">
                        <h3>⚠️ Common Testing Mistakes</h3>
                        <ul>
                            <li>Testing during peak hours only</li>
                            <li>Using WiFi for all tests</li>
                            <li>Not closing background apps</li>
                            <li>Testing on multiple devices simultaneously</li>
                        </ul>
                    </article>
                </div>
            </section>

            <!-- FAQ Section -->
            <section class="faq-section">
                <h2>Common ${isp} Questions</h2>
                <div class="faq-container">
                    <details class="faq-item">
                        <summary>Why is my ${isp} speed slower than advertised?</summary>
                        <div class="faq-content">
                            <p>Several factors can cause this: network congestion during peak hours, WiFi interference, outdated equipment, or distance from network infrastructure. Test with ethernet and at different times to isolate the issue.</p>
                        </div>
                    </details>
                    <details class="faq-item">
                        <summary>How can I check if ${isp} is having an outage in ${city}?</summary>
                        <div class="faq-content">
                            <p>Visit ${ispInfo.outageUrl} or call ${ispInfo.support}. You can also check social media and local forums where customers report outages in real-time.</p>
                        </div>
                    </details>
                    <details class="faq-item">
                        <summary>Can I get ${isp} fiber in ${city}?</summary>
                        <div class="faq-content">
                            <p>Fiber availability varies by neighborhood in ${city}. Check ${ispInfo.outageUrl} and enter your address to see if fiber is available at your location.</p>
                        </div>
                    </details>
                </div>
            </section>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${isp} Speed Test ${city} | Zero Data Collection</p>
        </div>
    </footer>

    <script src="/js/speedtest.js"></script>
    <script src="/js/ui.js"></script>
    <script>
        // ISP-specific enhancements
        document.addEventListener('DOMContentLoaded', function() {
            const ispName = "${isp}";
            const cityName = "${city}";
            
            // Enhance results with ISP context
            const originalDisplayResults = window.speedTestUI.displayResults;
            if (originalDisplayResults) {
                const enhancedDisplayResults = function(results) {
                    originalDisplayResults.call(this, results);
                    
                    // Add ISP comparison
                    const ispComparison = document.createElement('div');
                    ispComparison.className = 'isp-comparison-enhanced';
                    ispComparison.innerHTML = \`
                        <h4>📊 \${ispName} Performance Context</h4>
                        <p>Your \${ispName} speed vs typical \${cityName} performance:</p>
                        <div class="isp-performance-bar">
                            <div class="your-performance" style="width: \${(results.download / ${Math.round(ispData[isp].plans[1].speed * 0.85)}) * 100}%"></div>
                        </div>
                        <p><strong>\${results.download > ${Math.round(ispData[isp].plans[1].speed * 0.85)} ? '✅ Above' : '❌ Below'} \${ispName} average for \${cityName}</strong></p>
                        <p><small>Based on recent \${ispName} speed tests in \${cityName}</small></p>
                    \`;
                    
                    const analysisSection = document.querySelector('.detailed-analysis');
                    if (analysisSection) {
                        analysisSection.appendChild(ispComparison);
                    }
                };
                
                window.speedTestUI.displayResults = enhancedDisplayResults;
            }
        });
    </script>
</body>
</html>
`;
};

// Helper functions
function getIssueDescription(issue, isp) {
    const descriptions = {
        "Peak hour slowdowns": "Many customers experience slower speeds during evening hours (7-11 PM) when network usage is highest.",
        "Upload speed limitations": `${isp} typically offers much lower upload speeds than download speeds, which can affect video calls and file uploads.`,
        "Data cap overages": `${isp} may have data caps on certain plans. Exceeding these can result in slower speeds or additional charges.`,
        "Equipment rental fees": `${isp} charges monthly fees for modems and routers. You can often save money by using your own compatible equipment.`,
        "Service area restrictions": `${isp} service may be limited to specific neighborhoods or building types in your area.`,
        "Long installation waits": `${isp} may have long wait times for installation, especially for fiber services.`,
        "Customer service": "Some customers report difficulties reaching customer service or getting issues resolved quickly.",
        "Fiber availability limited": `${isp} fiber service may only be available in select areas.`,
        "DSL speed variations": `${isp} DSL speeds can vary significantly based on distance from network infrastructure.`,
        "Installation delays": `${isp} may experience delays in scheduling installations, especially during high-demand periods.`
    };

    return descriptions[issue] || `${isp} customers may experience this issue. Contact customer service for assistance.`;
}

function getIssueSolution(issue, isp) {
    const solutions = {
        "Peak hour slowdowns": "Test your speed at different times. If consistently slow during peak hours, consider upgrading your plan or contacting customer service.",
        "Upload speed limitations": "Test upload speeds separately. If upload is consistently below 10% of download, contact technical support.",
        "Data cap overages": "Monitor your data usage through your account portal. Consider upgrading to an unlimited plan if you frequently exceed caps.",
        "Equipment rental fees": "Purchase your own compatible modem and router to avoid monthly rental fees. Check ${isp}'s approved device list first.",
        "Service area restrictions": "Check availability at your specific address. Sometimes service is available but not advertised in certain areas.",
        "Long installation waits": "Schedule installation well in advance. Consider self-installation options if available for your service type.",
        "Customer service": "Try multiple contact methods: phone, chat, social media, and in-person stores. Document all interactions for reference.",
        "Fiber availability limited": "Check availability regularly as ${isp} expands fiber networks. Sign up for availability notifications if offered.",
        "DSL speed variations": "Test speeds at different times and locations in your home. Contact technical support if speeds are consistently below advertised rates.",
        "Installation delays": "Be flexible with installation dates and times. Consider temporary solutions like mobile hotspots if delays are excessive."
    };
    
    return solutions[issue] || `Contact ${isp} customer service at ${ispData[isp]?.support || 'customer support'} for assistance with this issue.`;
}

function getCompetitorISP(currentISP, index) {
    const allISPs = Object.keys(ispData);
    const competitors = allISPs.filter(isp => isp !== currentISP);
    return competitors[index] || "Other Provider";
}

// Main generation function
function generateISPPages() {
    console.log('🏢 Starting ISP page generation...');
    
    let totalPages = 0;
    let currentProgress = 0;
    
    // Generate pages for each ISP × City combination
    Object.keys(ispData).forEach((isp, ispIndex) => {
        console.log(`\n📡 Processing ${isp} pages...`);
        
        cities.forEach((city, cityIndex) => {
            // Only generate if ISP serves this city (simplified logic)
            if (cityIndex < 20 || isp === "Xfinity" || isp === "Spectrum" || isp === "AT&T") {
                const content = ispTemplate(isp, city.name, city.state);
                const slug = `${isp.toLowerCase().replace(/\s+/g, '-')}-speed-test-${city.name.toLowerCase().replace(/\s+/g, '-')}`;
                const filename = `${slug}.html`;
                
                const dir = path.join(__dirname, '../content/isps');
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                
                fs.writeFileSync(path.join(dir, filename), content);
                totalPages++;
                currentProgress++;
                
                // Show progress every 50 pages
                if (currentProgress % 50 === 0) {
                    console.log(`✅ Generated ${currentProgress} ISP pages...`);
                }
            }
        });
    });
    
    console.log(`\n🎉 ISP page generation complete!`);
    console.log(`📊 Total pages generated: ${totalPages}`);
    console.log(`📁 Location: content/isps/`);
    
    return {
        total: totalPages,
        isps: Object.keys(ispData),
        cities: cities.map(c => c.name)
    };
}

// Export for use in master generator
module.exports = { generateISPPages };

// Run if called directly
if (require.main === module) {
    const stats = generateISPPages();
    console.log(`\n📡 ISPs processed: ${stats.isps.join(', ')}`);
    console.log(`🏙️ Cities covered: ${stats.cities.length} cities`);
}
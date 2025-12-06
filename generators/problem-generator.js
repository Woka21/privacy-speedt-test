 /**
 * Problem-Solving Content Generator
 * Creates 50+ troubleshooting pages targeting high-intent searches
 */

const fs = require('fs');
const path = require('path');

// Load problem data
const problems = require('../data/problem.json');

// Problem-solving content templates
const problemTemplates = {
    header: (problem) => `
<header class="header">
    <div class="container">
        <h1>🛡️ ${problem.title}</h1>
        <p class="subtitle">${problem.description}</p>
    </div>
</header>
`,

    heroSection: (problem) => `
<section class="hero-section">
    <div class="container">
        <div class="problem-summary">
            <div class="problem-stats">
                <div class="stat-item">
                    <div class="stat-number">${problem.volume.toLocaleString()}</div>
                    <div class="stat-label">people search this monthly</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">15</div>
                    <div class="stat-label">proven solutions below</div>
                </div>
            </div>
            <div class="quick-test-cta">
                <h3>Test Your Speed First</h3>
                <p>Let's see if this is actually a speed issue:</p>
                <a href="/" class="test-button">🚀 Run Speed Test</a>
            </div>
        </div>
    </div>
</section>
`,

    solutionSections: (problem) => `
<section class="solutions-section">
    <div class="container">
        <div class="solution-steps">
            ${problem.sections.map((section, index) => `
            <div class="solution-step" id="step-${index + 1}">
                <div class="step-header">
                    <div class="step-number">${index + 1}</div>
                    <h2>${section}</h2>
                </div>
                <div class="step-content">
                    ${generateStepContent(problem.keyword, section, index)}
                </div>
            </div>
            `).join('')}
        </div>
    </div>
</section>
`,

    faqSection: (problem) => `
<section class="faq-section">
    <div class="container">
        <h2>Frequently Asked Questions About ${problem.keyword}</h2>
        <div class="faq-container">
            ${generateFAQs(problem.keyword)}
        </div>
    </div>
</section>
`,

    relatedProblems: (problem) => `
<section class="related-problems">
    <div class="container">
        <h2>Related Issues You Might Have</h2>
        <div class="related-links">
            ${problem.related.map(related => `
            <a href="/${related.replace(/\s+/g, '-')}.html" class="related-link">
                ${related}
            </a>
            `).join('')}
        </div>
    </div>
</section>
`,

    ispSpecificSection: (problem) => `
<section class="isp-specific-section">
    <div class="container">
        <h2>${problem.keyword} - ISP Specific Solutions</h2>
        <div class="isp-cards">
            <div class="isp-card">
                <h3>Xfinity</h3>
                <p>If you're an Xfinity customer experiencing ${problem.keyword}:</p>
                <ul>
                    <li>Check for service outages in your area</li>
                    <li>Reset your modem using the Xfinity app</li>
                    <li>Contact Xfinity support at 1-800-XFINITY</li>
                </ul>
            </div>
            <div class="isp-card">
                <h3>Spectrum</h3>
                <p>Spectrum users experiencing ${problem.keyword}:</p>
                <ul>
                    <li>Use the My Spectrum app to run diagnostics</li>
                    <li>Check if there's a service outage</li>
                    <li>Reset your equipment through the app</li>
                </ul>
            </div>
            <div class="isp-card">
                <h3>AT&T</h3>
                <p>AT&T customers with ${problem.keyword}:</p>
                <ul>
                    <li>Run the Smart Home Manager diagnostic tool</li>
                    <li>Check for network issues in your area</li>
                    <li>Contact AT&T support at 1-800-288-2020</li>
                </ul>
            </div>
        </div>
    </div>
</section>
`
};

// Generate step content based on problem type
function generateStepContent(keyword, section, index) {
    const contentMap = {
        "internet keeps disconnecting": {
            "Quick Fixes (30 seconds)": `
                <div class="quick-fixes">
                    <div class="fix-item">
                        <div class="fix-time">30 seconds</div>
                        <div class="fix-action">Restart your router (unplug for 30 seconds)</div>
                        <div class="fix-success">✅ Fixes 40% of disconnection issues</div>
                    </div>
                    <div class="fix-item">
                        <div class="fix-time">15 seconds</div>
                        <div class="fix-action">Check all cable connections</div>
                        <div class="fix-success">✅ Fixes 25% of issues</div>
                    </div>
                    <div class="fix-item">
                        <div class="fix-time">20 seconds</div>
                        <div class="fix-action">Move closer to WiFi router</div>
                        <div class="fix-success">✅ Fixes 30% of WiFi disconnection issues</div>
                    </div>
                </div>
                
                <div class="fix-warning">
                    <strong>⚠️ Test after each fix:</strong> Run a speed test to see if the issue is resolved before moving to the next step.
                </div>
            `,
            "Router & Modem Solutions": `
                <div class="router-solutions">
                    <h3>Router Placement Optimization</h3>
                    <p>Position your router in a central location, away from walls and electronic devices that can cause interference.</p>
                    
                    <div class="placement-tips">
                        <div class="tip">
                            <strong>✅ Do:</strong> Place in central location
                        </div>
                        <div class="tip">
                            <strong>✅ Do:</strong> Elevate router (table height)
                        </div>
                        <div class="tip">
                            <strong>❌ Don't:</strong> Hide in cabinet or closet
                        </div>
                        <div class="tip">
                            <strong>❌ Don't:</strong> Place near microwave or cordless phone
                        </div>
                    </div>
                    
                    <h3>Firmware Updates</h3>
                    <p>Outdated router firmware can cause disconnection issues. Here's how to update:</p>
                    <ol class="update-steps">
                        <li>Access router admin panel (usually http://192.168.1.1)</li>
                        <li>Login with admin credentials</li>
                        <li>Find "Firmware Update" or "System Update"</li>
                        <li>Download and install latest version</li>
                        <li>Restart router after update</li>
                    </ol>
                    
                    <div class="router-compatibility">
                        <h4>Router Age Matters</h4>
                        <p>If your router is more than 5 years old, consider upgrading. Older routers often have stability issues.</p>
                    </div>
                </div>
            `,
            "ISP-Related Issues": `
                <div class="isp-issues">
                    <h3>Check for Service Outages</h3>
                    <p>Before troubleshooting further, check if your ISP is experiencing issues in your area:</p>
                    
                    <div class="outage-checker">
                        <div class="outage-links">
                            <a href="https://xfinity.com/support/status" target="_blank" class="outage-link">Check Xfinity Outages</a>
                            <a href="https://spectrum.com/support/internet" target="_blank" class="outage-link">Check Spectrum Outages</a>
                            <a href="https://att.com/support/availability" target="_blank" class="outage-link">Check AT&T Outages</a>
                        </div>
                    </div>
                    
                    <h3>Signal Level Issues</h3>
                    <p>Poor signal levels can cause frequent disconnections. Check your modem's signal levels:</p>
                    
                    <div class="signal-levels">
                        <h4>Good Signal Levels:</h4>
                        <ul>
                            <li><strong>Downstream Power:</strong> -7 to +7 dBmV</li>
                            <li><strong>Upstream Power:</strong> +35 to +50 dBmV</li>
                            <li><strong>SNR (Signal-to-Noise):</strong> >30 dB</li>
                        </ul>
                    </div>
                    
                    <div class="modem-check">
                        <p><strong>How to check:</strong> Access your modem at http://192.168.100.1 and look for signal levels.</p>
                    </div>
                </div>
            `
        },
        "why is my internet slow": {
            "Speed Test Diagnosis": `
                <div class="speed-diagnosis">
                    <h3>Run Multiple Tests for Accurate Diagnosis</h3>
                    <p>Different times and conditions give different insights:</p>
                    
                    <div class="test-schedule">
                        <div class="test-time">
                            <h4>🌅 Morning Test (6-9 AM)</h4>
                            <p>Tests your maximum potential speed</p>
                            <div class="expected-result">Expected: 90-100% of plan speed</div>
                        </div>
                        <div class="test-time">
                            <h4>🌆 Evening Test (7-11 PM)</h4>
                            <p>Shows peak hour congestion impact</p>
                            <div class="expected-result">Expected: 70-90% of plan speed</div>
                        </div>
                        <div class="test-time">
                            <h4>🌙 Late Night Test (12-6 AM)</h4>
                            <p>Tests minimum network load</p>
                            <div class="expected-result">Expected: 95-100% of plan speed</div>
                        </div>
                    </div>
                    
                    <div class="comparison-instructions">
                        <h4>How to Compare Results</h4>
                        <ol>
                            <li>Run tests at the same time for 3 days</li>
                            <li>Use the same device and location</li>
                            <li>Test both WiFi and ethernet</li>
                            <li>Document results in a table</li>
                        </ol>
                    </div>
                    
                    <div class="diagnosis-tool">
                        <p><strong>Pro tip:</strong> If evening speeds are consistently 30%+ slower, you have a congestion issue.</p>
                    </div>
                </div>
            `,
            "Common Causes of Slow Internet": `
                <div class="common-causes">
                    <h3>Most Common Slow Internet Causes</h3>
                    
                    <div class="causes-grid">
                        <div class="cause-item">
                            <div class="cause-icon">🕐</div>
                            <h4>Peak Hour Congestion</h4>
                            <p>7-11 PM when everyone is streaming</p>
                            <div class="cause-frequency">Affects 60% of users</div>
                        </div>
                        
                        <div class="cause-item">
                            <div class="cause-icon">🏠</div>
                            <h4>Router Issues</h4>
                            <p>Old firmware or poor placement</p>
                            <div class="cause-frequency">Affects 45% of users</div>
                        </div>
                        
                        <div class="cause-item">
                            <div class="cause-icon">📱</div>
                            <h4>Too Many Devices</h4>
                            <p>Bandwidth divided among devices</p>
                            <div class="cause-frequency">Affects 40% of users</div>
                        </div>
                        
                        <div class="cause-item">
                            <div class="cause-icon">👴</div>
                            <h4>Old Equipment</h4>
                            <p>Router 5+ years old</p>
                            <div class="cause-frequency">Affects 35% of users</div>
                        </div>
                    </div>
                    
                    <div class="cause-solutions">
                        <h4>Quick Solutions by Cause:</h4>
                        <ul>
                            <li><strong>Congestion:</strong> Test at different times, upgrade plan</li>
                            <li><strong>Router:</strong> Update firmware, optimize placement</li>
                            <li><strong>Devices:</strong> Disconnect unused devices, use QoS</li>
                            <li><strong>Equipment:</strong> Replace router, upgrade modem</li>
                        </ul>
                    </div>
                </div>
            `
        }
    };
    
    return contentMap[keyword]?.[section] || `
        <div class="generic-content">
            <h3>${section}</h3>
            <p>Detailed guide for ${section} coming soon...</p>
            <p>In the meantime, try our speed test to diagnose your specific issue:</p>
            <a href="/" class="speed-test-link">Run Speed Test</a>
        </div>
    `;
}

// Generate FAQ content for featured snippets
function generateFAQs(keyword) {
    const faqs = {
        "internet keeps disconnecting": [
            { 
                q: "Why does my internet keep disconnecting every few minutes?", 
                a: "This is usually caused by router issues, ISP problems, or interference. Try restarting your router first, then check for service outages in your area." 
            },
            { 
                q: "Is it normal for internet to disconnect occasionally?", 
                a: "Occasional disconnections (once per week) can happen, but daily disconnections indicate a problem that needs fixing. Contact your ISP if basic troubleshooting doesn't help." 
            },
            { 
                q: "Should I contact my ISP if internet keeps disconnecting?", 
                a: "Yes, if you've tried basic troubleshooting (restart, check cables) and the issue persists for more than a day, contact your ISP to check for service issues." 
            }
        ],
        "why is my internet slow": [
            { 
                q: "What is considered slow internet speed?", 
                a: "Anything below 25 Mbps for download is considered slow for modern usage. You need at least 5 Mbps for HD streaming and 25 Mbps for 4K streaming." 
            },
            { 
                q: "Can my ISP slow down my internet?", 
                a: "Yes, ISPs can throttle speeds during peak hours or if you exceed data caps. Contact them if you suspect throttling, especially if speeds drop significantly at specific times." 
            },
            { 
                q: "Why is my internet slow only at night?", 
                a: "Network congestion during peak hours (7-11 PM) is the most common cause. Everyone in your area is using the internet simultaneously, causing speeds to drop." 
            }
        ],
        "wifi slow but ethernet fast": [
            { 
                q: "Why is my WiFi slower than ethernet?", 
                a: "WiFi is inherently slower than ethernet due to signal interference, distance from router, and physical obstacles. For maximum speed, use ethernet when possible." 
            },
            { 
                q: "How much slower should WiFi be than ethernet?", 
                a: "Expect WiFi to be 10-30% slower than ethernet under normal conditions. If it's more than 50% slower, there's likely an issue that needs fixing." 
            },
            { 
                q: "Should I upgrade my router for better WiFi?", 
                a: "Yes, if your router is more than 5 years old, upgrading to a WiFi 6 router can significantly improve speeds and reduce interference issues." 
            }
        ]
    };
    
    const faqList = faqs[keyword] || [];
    
    return faqList.map(faq => `
        <details class="faq-item">
            <summary>${faq.q}</summary>
            <div class="faq-content">
                <p>${faq.a}</p>
            </div>
        </details>
    `).join('');
}

// SEO-optimized problem page template
const problemPageTemplate = (problem) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <title>${problem.title}: Step-by-Step Troubleshooting Guide</title>
    <meta name="description" content="${problem.description}">
    <meta name="keywords" content="${problem.keyword}, ${problem.related.join(', ')}">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://yoursite.com/content/problems/${problem.keyword.replace(/\s+/g, '-')}.html">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${problem.title}">
    <meta property="og:description" content="${problem.description}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://yoursite.com/content/problems/${problem.keyword.replace(/\s+/g, '-')}.html">
    
    <!-- Schema Markup for Featured Snippets -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "${problem.title}",
        "description": "${problem.description}",
        "totalTime": "PT15M",
        "step": [
            ${problem.sections.map((section, index) => `{
                "@type": "HowToStep",
                "name": "${section}",
                "text": "Follow these steps to ${problem.keyword}",
                "url": "https://yoursite.com/content/problems/${problem.keyword.replace(/\s+/g, '-')}.html#step-${index + 1}"
            }`).join(',\n            ')}
        ],
        "tool": ["Computer", "Internet connection", "Speed test tool"]
    }
    </script>
    
    <!-- FAQ Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            ${generateFAQSchemaItems(problem.keyword)}
        ]
    }
    </script>
    
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/responsive.css">
    <script src="/js/header.js"></script>
    <style>
        /* Problem page specific styles */
        .problem-summary { display: flex; justify-content: space-between; align-items: center; margin: 2rem 0; }
        .problem-stats { display: flex; gap: 2rem; }
        .stat-item { text-align: center; }
        .stat-number { font-size: 2rem; font-weight: bold; color: var(--primary-color); }
        .stat-label { font-size: 0.9rem; color: var(--text-secondary); }
        .quick-test-cta { background: var(--background); padding: 2rem; border-radius: var(--radius-lg); text-align: center; }
        .solution-step { margin: 3rem 0; background: var(--card-background); padding: 2rem; border-radius: var(--radius-lg); box-shadow: var(--shadow); }
        .step-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
        .step-number { background: var(--primary-color); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
        .quick-fixes { display: grid; gap: 1rem; margin: 2rem 0; }
        .fix-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--background); border-radius: var(--radius); border-left: 4px solid var(--secondary-color); }
        .fix-time { background: var(--primary-color); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: bold; }
        .fix-action { flex: 1; font-weight: 500; }
        .fix-success { color: var(--secondary-color); font-size: 0.9rem; }
        .fix-warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 1rem; border-radius: var(--radius); margin: 1rem 0; }
        .causes-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin: 2rem 0; }
        .cause-item { background: var(--background); padding: 1.5rem; border-radius: var(--radius); text-align: center; }
        .cause-icon { font-size: 2rem; margin-bottom: 1rem; }
        .cause-frequency { color: var(--secondary-color); font-size: 0.9rem; margin-top: 0.5rem; }
        .isp-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin: 2rem 0; }
        .isp-card { background: var(--background); padding: 1.5rem; border-radius: var(--radius); border-left: 4px solid var(--primary-color); }
        .related-links { display: flex; flex-wrap: wrap; gap: 1rem; margin: 1rem 0; }
        .related-link { background: var(--primary-color); color: white; padding: 0.5rem 1rem; border-radius: var(--radius); text-decoration: none; transition: var(--transition); }
        .related-link:hover { background: #1d4ed8; transform: translateY(-2px); }
        .faq-item { background: var(--card-background); border-radius: var(--radius); margin-bottom: 1rem; box-shadow: var(--shadow); }
        .faq-item summary { padding: 1.5rem; cursor: pointer; font-weight: 600; list-style: none; display: flex; justify-content: space-between; align-items: center; }
        .faq-item summary::after { content: '▼'; font-size: 0.8rem; transition: transform 0.2s; color: var(--text-secondary); }
        .faq-item[open] summary::after { transform: rotate(180deg); }
        .faq-content { padding: 0 1.5rem 1.5rem; color: var(--text-secondary); }
        .comparison-bar { background: var(--background); height: 12px; border-radius: 6px; overflow: hidden; margin: 1rem 0; }
        .city-comparison-enhanced { background: var(--background); padding: 1.5rem; border-radius: var(--radius-lg); margin-top: 2rem; border-left: 4px solid var(--primary-color); }
        .local-seo-section { margin-top: 3rem; padding: 2rem; background: var(--background); border-radius: var(--radius-lg); }
        .zip-codes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem; margin: 1.5rem 0; }
        .zip-code-item { background: white; padding: 1rem; border-radius: var(--radius); text-align: center; box-shadow: var(--shadow); }
        .nearby-links { display: flex; gap: 1rem; margin-top: 1rem; }
    </style>
</head>
<body>
    <!-- Header -->
    <div id="header-container"></div>

    <script>
    // Load header component and initialize navigation
    fetch('/header.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('header-container').innerHTML = html;
            // Initialize header navigation after HTML is loaded
            if (window.HeaderNavigation) {
                window.headerNavigation = new window.HeaderNavigation();
            }
        })
        .catch(error => {
            console.error('Failed to load header:', error);
        });
    </script>

    <!-- Page Header -->
    <header class="page-header">
        <div class="container">
            <h1>🛡️ ${problem.title}</h1>
            <p class="subtitle">${problem.description}</p>
        </div>
    </header>
    <main class="main">
        <div class="container">
            <div class="intro-paragraph">
                <p>Why is my internet slow? If your internet speed is slow, latency could be the issue—run a test today! Experiencing ${problem.keyword}? You're not alone - ${problem.volume.toLocaleString()} people search for this issue every month. This comprehensive guide provides proven solutions to fix ${problem.keyword} problems quickly and effectively. Follow our step-by-step troubleshooting process to identify and resolve the issue.</p>
            </div>
        </div>
    </main>

    ${problemTemplates.heroSection(problem)}
    ${problemTemplates.solutionSections(problem)}
    ${problemTemplates.ispSpecificSection(problem)}
    ${problemTemplates.faqSection(problem)}
    ${problemTemplates.relatedProblems(problem)}
    
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 Privacy Speed Test | Zero Data Collection</p>
        </div>
    </footer>

    <script src="/js/speedtest.js"></script>
    <script src="/js/ui.js"></script>
    <script src="/js/header.js"></script>
</body>
</html>
`;

// Generate FAQ schema items
function generateFAQSchemaItems(keyword) {
    const faqs = {
        "internet keeps disconnecting": [
            { q: "Why does my internet keep disconnecting every few minutes?", a: "This is usually caused by router issues, ISP problems, or interference. Try restarting your router first." },
            { q: "Is it normal for internet to disconnect occasionally?", a: "Occasional disconnections can happen, but daily disconnections indicate a problem that needs fixing." },
            { q: "Should I contact my ISP if internet keeps disconnecting?", a: "Yes, if basic troubleshooting doesn't help and the issue persists for more than a day." }
        ],
        "why is my internet slow": [
            { q: "What is considered slow internet speed?", a: "Anything below 25 Mbps for download is considered slow for modern usage." },
            { q: "Can my ISP slow down my internet?", a: "Yes, ISPs can throttle speeds during peak hours or if you exceed data caps." },
            { q: "Why is my internet slow only at night?", a: "Network congestion during peak hours (7-11 PM) is the most common cause." }
        ]
    };
    
    const faqList = faqs[keyword] || [];
    
    return faqList.map(faq => `{
        "@type": "Question",
        "name": "${faq.q}",
        "acceptedAnswer": {
            "@type": "Answer",
            "text": "${faq.a}"
        }
    }`).join(',\n            ');
}

// Main generation function
function generateProblemPages() {
    console.log('🔧 Starting problem-solving page generation...');
    console.log(`🎯 Processing ${problems.length} problem topics...`);
    
    let generated = 0;
    
    problems.forEach((problem, index) => {
        const slug = problem.keyword.replace(/\s+/g, '-');
        const filename = `${slug}.html`;
        const content = problemPageTemplate(problem);
        
        // Ensure directory exists
        const dir = path.join(__dirname, '../content/problems');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // Write the file
        fs.writeFileSync(path.join(dir, filename), content);
        generated++;
        
        // Progress indicator
        if ((index + 1) % 5 === 0) {
            console.log(`✅ Generated ${index + 1}/${problems.length} problem pages...`);
        }
    });
    
    console.log(`\n🎉 Problem page generation complete!`);
    console.log(`📊 Total pages generated: ${generated}`);
    console.log(`📁 Location: content/problems/`);
    console.log(`🎯 Targeting: ${problems.reduce((sum, p) => sum + p.volume, 0).toLocaleString()} monthly searches`);
    
    return {
        total: generated,
        problems: problems.map(p => p.keyword),
        totalSearchVolume: problems.reduce((sum, p) => sum + p.volume, 0)
    };
}

// Export for use in master generator
module.exports = { generateProblemPages };

// Run if called directly
if (require.main === module) {
    const stats = generateProblemPages();
    console.log(`\n📈 Total search volume targeted: ${stats.totalSearchVolume.toLocaleString()} monthly searches`);
}
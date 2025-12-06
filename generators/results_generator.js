/**
 * Results Explanation Generator
 * Creates pages explaining what different speed results mean
 */

const fs = require('fs');
const path = require('path');

// Load results data
const resultsData = require('../data/results.json');

// Speed values to create pages for
const speedValues = resultsData.map(r => r.speed);

// Content templates for different speed ranges
const speedContent = resultsData.reduce((acc, result) => {
    acc[result.speed] = result;
    return acc;
}, {});

// Template for results explanation pages
const resultsTemplate = (speed) => {
    const content = speedContent[speed];
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Is ${speed} Mbps Good? What ${speed} Mbps Internet Speed Means</title>
    <meta name="description" content="Find out if ${speed} Mbps internet speed is good. See what you can do with ${speed} Mbps and compare with national averages.">
    <meta name="keywords" content="is ${speed} mbps good, ${speed} mbps internet speed, what can i do with ${speed} mbps, ${speed} mbps download speed, is ${speed} mbps fast">
    
    <!-- Schema Markup -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Is ${speed} Mbps Good? Internet Speed Guide",
        "description": "Complete guide to ${speed} Mbps internet speed including what you can do and whether it's sufficient for your needs.",
        "author": {
            "@type": "Organization",
            "name": "Privacy Speed Test"
        },
        "datePublished": "${new Date().toISOString()}",
        "dateModified": "${new Date().toISOString()}"
    }
    </script>
    
    <!-- FAQ Schema for Featured Snippet -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
            "@type": "Question",
            "name": "Is ${speed} Mbps internet speed good?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "${speed} Mbps internet speed is ${content.rating}. ${content.description}. You can ${content.capabilities.join(', ')} but ${content.limitations[0]}."
            }
        }, {
            "@type": "Question", 
            "name": "What can I do with ${speed} Mbps internet?",
            "acceptedAnswer": {
                "@type": "Answer", 
                "text": "With ${speed} Mbps you can: ${content.capabilities.join(', ')}. However, ${content.limitations[0]}."
            }
        }]
    }
    </script>
    
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/responsive.css">
    <script src="/js/header.js"></script>
    <style>
        .speed-rating { display: inline-block; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0.5rem 0; }
        .rating-very-slow { background: #ef4444; color: white; }
        .rating-slow { background: #f59e0b; color: white; }
        .rating-basic { background: #6b7280; color: white; }
        .rating-good { background: #3b82f6; color: white; }
        .rating-very-good { background: #10b981; color: white; }
        .rating-excellent { background: #059669; color: white; }
        .rating-outstanding { background: #047857; color: white; }
        .rating-premium { background: #065f46; color: white; }
        .rating-ultra-premium { background: #064e3b; color: white; }
        .rating-gigabit { background: #052e16; color: white; }
        .speed-comparison { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 2rem 0; }
        .comparison-card { background: var(--card-background); padding: 2rem; border-radius: var(--radius-lg); box-shadow: var(--shadow); }
        .comparison-table { width: 100%; background: var(--card-background); border-collapse: collapse; margin: 2rem 0; }
        .comparison-table th, .comparison-table td { padding: 1rem; text-align: left; border-bottom: 1px solid var(--border-color); }
        .comparison-table th { background: var(--background); font-weight: 600; }
        .recommendation-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: var(--radius-lg); margin: 2rem 0; }
        .capabilities-list { list-style: none; margin: 1rem 0; }
        .capabilities-list li { padding: 0.5rem 0; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; }
        .capabilities-list li:before { content: "✅"; margin-right: 0.5rem; color: var(--secondary-color); }
        .limitations-list { list-style: none; margin: 1rem 0; }
        .limitations-list li { padding: 0.5rem 0; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; }
        .limitations-list li:before { content: "❌"; margin-right: 0.5rem; color: var(--danger-color); }
        .speed-visualization { background: var(--background); padding: 2rem; border-radius: var(--radius-lg); margin: 2rem 0; text-align: center; }
        .speed-bar { background: linear-gradient(90deg, var(--primary-color), var(--secondary-color)); height: 20px; border-radius: 10px; margin: 1rem 0; position: relative; overflow: hidden; }
        .speed-marker { position: absolute; top: -5px; width: 2px; height: 30px; background: white; }
        .speed-label { position: absolute; top: 25px; font-size: 0.8rem; transform: translateX(-50%); }
        .comparison-section { margin: 3rem 0; }
        .comparison-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin: 2rem 0; }
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
            <h1>Is ${speed} Mbps Good? Complete Speed Guide</h1>
            <p class="subtitle">Understand what ${speed} Mbps internet speed means for your usage</p>
        </div>
    </header>

    <main class="main">
        <div class="container">
            <!-- Quick Answer for Featured Snippet -->
            <section class="quick-answer">
                <div class="answer-card">
                    <h2>Quick Answer: Is ${speed} Mbps Good?</h2>
                    <div class="speed-rating rating-${content.rating.toLowerCase().replace(' ', '-')}">${content.rating}</div>
                    <p><strong>${speed} Mbps</strong> is <strong>${content.description}</strong>. You can ${content.capabilities.join(', ')}, but ${content.limitations[0]}.</p>
                </div>
            </section>

            <!-- Speed Visualization -->
            <section class="speed-visualization">
                <h3>${speed} Mbps Speed Visualization</h3>
                <div class="speed-bar" style="width: ${Math.min(speed/1000 * 100, 100)}%">
                    <div class="speed-marker" style="left: ${speed/1000 * 100}%"></div>
                    <div class="speed-label" style="left: ${speed/1000 * 100}%">${speed} Mbps</div>
                </div>
                <p>Your speed compared to maximum residential speeds</p>
            </section>

            <!-- What You Can Do -->
            <section class="capabilities-section">
                <h2>What Can You Do With ${speed} Mbps?</h2>
                <div class="comparison-grid">
                    <div class="comparison-card">
                        <h3>✅ You CAN Do:</h3>
                        <ul class="capabilities-list">
                            ${content.capabilities.map(cap => `<li>${cap}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="comparison-card">
                        <h3>❌ You CANNOT Do:</h3>
                        <ul class="limitations-list">
                            ${content.limitations.map(limit => `<li>${limit}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Detailed Breakdown -->
            <section class="detailed-breakdown">
                <h2>Detailed ${speed} Mbps Breakdown</h2>
                
                <div class="comparison-section">
                    <h3>By Activity Type</h3>
                    <table class="comparison-table">
                        <thead>
                            <tr>
                                <th>Activity</th>
                                <th>Performance</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>📺 Netflix Streaming</td>
                                <td>${speed >= 25 ? '✅ 4K Ultra HD' : speed >= 5 ? '✅ HD (1080p)' : '⚠️ SD only'}</td>
                                <td>${speed >= 25 ? 'Multiple 4K streams' : speed >= 5 ? 'Single HD stream' : 'Basic quality'}</td>
                            </tr>
                            <tr>
                                <td>💬 Video Calls</td>
                                <td>${speed >= 3 ? '✅ HD quality' : '⚠️ SD quality'}</td>
                                <td>${speed >= 3 ? 'Professional quality' : 'Basic video calling'}</td>
                            </tr>
                            <tr>
                                <td>🎮 Online Gaming</td>
                                <td>${speed >= 25 ? '✅ Excellent' : speed >= 10 ? '✅ Good' : '⚠️ Basic'}</td>
                                <td>${speed >= 25 ? 'Gaming + streaming' : speed >= 10 ? 'Smooth gaming' : 'Casual gaming only'}</td>
                            </tr>
                            <tr>
                                <td>📁 File Downloads</td>
                                <td>${speed >= 100 ? '✅ Very fast' : speed >= 50 ? '✅ Fast' : '⚠️ Moderate'}</td>
                                <td>${speed >= 100 ? 'Large files quickly' : speed >= 50 ? 'Good download speed' : 'Smaller files only'}</td>
                            </tr>
                            <tr>
                                <td>👥 Multiple Users</td>
                                <td>${speed >= 100 ? '✅ 5+ users' : speed >= 50 ? '✅ 3-4 users' : speed >= 25 ? '⚠️ 2-3 users' : '❌ 1-2 users'}</td>
                                <td>${speed >= 100 ? 'Large household' : speed >= 50 ? 'Family suitable' : speed >= 25 ? 'Small family' : 'Single/Couple'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Comparison with Other Speeds -->
            <section class="comparison-section">
                <h2>How ${speed} Mbps Compares</h2>
                <div class="comparison-grid">
                    <div class="comparison-card">
                        <h3>vs National Average</h3>
                        <p>US average: 132 Mbps</p>
                        <div class="comparison-result">
                            ${speed > 132 ? '✅ Above average' : '⚠️ Below average'}
                        </div>
                        <p>${speed > 132 ? 'Faster than most Americans' : 'Slower than most Americans'}</p>
                    </div>
                    <div class="comparison-card">
                        <h3>vs Recommended Minimum</h3>
                        <p>FCC minimum: 25 Mbps</p>
                        <div class="comparison-result">
                            ${speed >= 25 ? '✅ Meets minimum' : '❌ Below minimum'}
                        </div>
                        <p>${speed >= 25 ? 'Suitable for modern usage' : 'Needs upgrade for modern usage'}</p>
                    </div>
                    <div class="comparison-card">
                        <h3>Speed Rating</h3>
                        <div class="speed-rating rating-${content.rating.toLowerCase().replace(' ', '-')}">${content.rating}</div>
                        <p>${content.description}</p>
                    </div>
                </div>
            </section>

            <!-- Recommendations -->
            <section class="recommendations-section">
                <div class="recommendation-card">
                    <h2>Our Recommendation</h2>
                    <p><strong>${content.recommendation}</strong></p>
                    <p>${content.ispSuggestion}</p>
                    
                    <div class="recommendation-cta">
                        <a href="/" class="primary-button">Test Your Current Speed</a>
                        <a href="/what-is-good-internet-speed.html" class="secondary-button">Learn About Good Speeds</a>
                    </div>
                </div>
            </section>

            <!-- FAQ Section -->
            <section class="faq-section">
                <h2>Common Questions About ${speed} Mbps</h2>
                <div class="faq-container">
                    <details class="faq-item">
                        <summary>Is ${speed} Mbps fast enough for Netflix?</summary>
                        <div class="faq-content">
                            <p>${speed >= 25 ? `Yes! ${speed} Mbps is excellent for Netflix. You can stream in 4K Ultra HD on multiple devices simultaneously.` : speed >= 5 ? `Yes, ${speed} Mbps supports HD streaming on one device comfortably.` : `${speed} Mbps only supports basic SD streaming. Consider upgrading for HD quality.`}</p>
                        </div>
                    </details>
                    <details class="faq-item">
                        <summary>Can I work from home with ${speed} Mbps?</summary>
                        <div class="faq-content">
                            <p>${speed >= 25 ? `Absolutely! ${speed} Mbps is excellent for remote work including video calls, file sharing, and cloud applications.` : speed >= 10 ? `${speed} Mbps works for basic remote work including video calls and email, but may struggle with heavy file uploads.` : `${speed} Mbps is suitable only for basic email and text-based work. Video calls will be challenging.`}</p>
                        </div>
                    </details>
                    <details class="faq-item">
                        <summary>How many devices can use ${speed} Mbps simultaneously?</summary>
                        <div class="faq-content">
                            <p>${speed >= 100 ? `${speed} Mbps supports 5+ devices simultaneously including multiple 4K streams, gaming, and video calls.` : speed >= 50 ? `${speed} Mbps works well for 3-4 devices including HD streaming and video calls.` : speed >= 25 ? `${speed} Mbps supports 2-3 devices for basic HD streaming and browsing.` : `${speed} Mbps is best for 1-2 devices with basic usage only.`}</p>
                        </div>
                    </details>
                </div>
            </section>

            <!-- Related Pages -->
            <section class="related-pages">
                <h2>Related Speed Guides</h2>
                <div class="related-links">
                    ${speedValues.filter(s => Math.abs(s - speed) <= 50 && s !== speed).slice(0, 4).map(s => `
                    <a href="/what-does-${s}-mbps-mean.html" class="related-link">
                        Is ${s} Mbps Good?
                    </a>
                    `).join('')}
                    <a href="/internet-speed-for-streaming.html" class="related-link">
                        Speed for Streaming
                    </a>
                    <a href="/how-fast-internet-do-i-need.html" class="related-link">
                        How Much Speed Do I Need?
                    </a>
                </div>
            </section>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 Speed Test Guide | Zero Data Collection | <a href="/privacy">Privacy Policy</a></p>
        </div>
    </footer>

    <script src="/js/speedtest.js"></script>
    <script src="/js/ui.js"></script>
    <script src="/js/header.js"></script>
</body>
</html>
`;
};

// Main generation function
function generateResultsPages() {
    console.log('📊 Starting results explanation page generation...');
    console.log(`🎯 Processing ${speedValues.length} speed values...`);
    
    let generated = 0;
    
    speedValues.forEach((speed, index) => {
        const filename = `what-does-${speed}-mbps-mean.html`;
        const content = resultsTemplate(speed);
        
        const dir = path.join(__dirname, '../content/results');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(path.join(dir, filename), content);
        generated++;
        
        if ((index + 1) % 3 === 0) {
            console.log(`✅ Generated ${index + 1}/${speedValues.length} results pages...`);
        }
    });
    
    console.log(`\n🎉 Results page generation complete!`);
    console.log(`📊 Total pages generated: ${generated}`);
    console.log(`📁 Location: content/results/`);
    
    return {
        total: generated,
        speeds: speedValues,
        avgContent: "Complete speed explanation guides"
    };
}

// Export for use in master generator
module.exports = { generateResultsPages };

// Run if called directly
if (require.main === module) {
    const stats = generateResultsPages();
    console.log(`\n📈 Generated explanations for speeds: ${stats.speeds.join(', ')} Mbps`);
}
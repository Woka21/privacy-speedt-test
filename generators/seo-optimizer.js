/**
 * Advanced SEO Optimization Generator
 * Adds schema markup, meta tags, and technical SEO elements
 */

const fs = require('fs');
const path = require('path');

// SEO optimization rules and templates
const seoRules = {
    // Meta tag templates
    metaTemplates: {
        title: (pageType, location, metric) => {
            const templates = {
                location: `${metric} Internet Speed Test ${location} | Check Your Connection`,
                isp: `${location} Speed Test | Is Your ISP Delivering Promised Speeds?`,
                problem: `${location} | 15 Proven Fixes That Actually Work [2024]`
            };
            return templates[pageType];
        },
        
        description: (pageType, location, data) => {
            const templates = {
                location: `Test your internet speed in ${location}. Compare results with local ISPs and see how your connection stacks up against the ${data.avgSpeed} Mbps city average.`,
                isp: `Test your ${location} internet speed. See if your ISP is delivering promised speeds and compare with other providers in your area.`,
                problem: `Fix ${location} with these proven solutions. Works for all providers and connection types. Step-by-step guide with ISP-specific fixes.`
            };
            return templates[pageType];
        }
    },

    // Schema markup generators
    schemaTemplates: {
        FAQPage: (questions) => ({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": questions.map(q => ({
                "@type": "Question",
                "name": q.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": q.answer
                }
            }))
        }),

        HowTo: (title, description, steps) => ({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": title,
            "description": description,
            "totalTime": "PT15M",
            "step": steps.map((step, index) => ({
                "@type": "HowToStep",
                "name": step.title,
                "text": step.content,
                "url": `https://yoursite.com/#step-${index + 1}`
            }))
        }),

        LocalBusiness: (businessData) => ({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": businessData.name,
            "description": businessData.description,
            "address": {
                "@type": "PostalAddress",
                "addressLocality": businessData.city,
                "addressRegion": businessData.state,
                "addressCountry": "US"
            },
            "telephone": businessData.phone,
            "areaServed": {
                "@type": "City",
                "name": businessData.city
            }
        })
    },

    // Technical SEO enhancements
    technicalSEO: {
        // Add to HTML head
        addMetaTags: (html, pageData) => {
            const enhancedHead = `
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageData.title}</title>
    <meta name="description" content="${pageData.description}">
    <meta name="keywords" content="${pageData.keywords.join(', ')}">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://yoursite.com/${pageData.slug}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${pageData.title}">
    <meta property="og:description" content="${pageData.description}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://yoursite.com/${pageData.slug}">
    <meta property="og:site_name" content="Privacy Speed Test">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageData.title}">
    <meta name="twitter:description" content="${pageData.description}">
    
    <!-- Additional SEO Meta Tags -->
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <meta name="author" content="Privacy Speed Test">
    <meta name="publisher" content="Privacy Speed Test">
    
    <!-- Language and Region -->
    <meta property="og:locale" content="en_US">
    <meta property="og:locale:alternate" content="en_GB">
    
    <!-- Article Meta (for blog posts) -->
    ${pageData.type === 'blog' ? `
    <meta property="article:published_time" content="${pageData.publishedDate}">
    <meta property="article:modified_time" content="${pageData.modifiedDate}">
    <meta property="article:author" content="${pageData.author}">
    <meta property="article:section" content="${pageData.category}">
    <meta property="article:tag" content="${pageData.tags.join(', ')}">
    ` : ''}
    
    <!-- Page Speed Optimization -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="//cdnjs.cloudflare.com">
    <link rel="dns-prefetch" href="//cdn.jsdelivr.net">
    
    <!-- Mobile Optimization -->
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="Speed Test">
    <link rel="apple-touch-icon" href="/icons/icon-192x192.png">
    
    <!-- PWA Manifest -->
    <link rel="manifest" href="/manifest.json">
    
    <!-- Theme Color -->
    <meta name="theme-color" content="#2563eb">
    <meta name="msapplication-TileColor" content="#2563eb">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    ${JSON.stringify(pageData.schema)}
    </script>
`;

            return html.replace(/<head>.*?<\/head>/s, enhancedHead);
        },

        // Optimize images
        optimizeImages: (html) => {
            // Add lazy loading and responsive images
            return html.replace(/<img([^>]+)>/g, (match, attrs) => {
                if (attrs.includes('loading=')) return match; // Already optimized
                
                return `<img${attrs} 
                    loading="lazy" 
                    decoding="async" 
                    class="responsive-img"
                    srcset="/img/${attrs.match(/src="([^"]+)"/)?.[1]} 1x, /img/${attrs.match(/src="([^"]+)"/)?.[1].replace('.jpg', '@2x.jpg')} 2x"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw">`;
            });
        },

        // Add internal linking
        addInternalLinks: (html, pageType, location) => {
            const links = {
                location: [
                    { text: "internet speed test", url: "/" },
                    { text: "wifi speed test", url: "/wifi-speed-test" },
                    { text: "upload speed test", url: "/upload-speed-test" },
                    { text: `${location} internet providers`, url: `/internet-providers-${location.toLowerCase().replace(/\s+/g, '-')}` },
                    { text: "troubleshoot internet issues", url: "/internet-keeps-disconnecting" }
                ],
                isp: [
                    { text: "speed test", url: "/" },
                    { text: "compare internet providers", url: "/internet-providers" },
                    { text: "internet speed guide", url: "/what-is-good-internet-speed" }
                ],
                problem: [
                    { text: "run speed test", url: "/" },
                    { text: "internet provider comparison", url: "/internet-providers" },
                    { text: "speed optimization tips", url: "/how-to-speed-up-internet" }
                ]
            };

            // Add contextual links in content
            const pageLinks = links[pageType] || links.location;
            
            pageLinks.forEach(link => {
                const regex = new RegExp(`\\\\b${link.text}\\\\b`, 'gi');
                html = html.replace(regex, `<a href="${link.url}" class="internal-link">${link.text}</a>`);
            });

            return html;
        },

        // Add FAQ structured data
        generateFAQSchema: (questions) => {
            return {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": questions.map(q => ({
                    "@type": "Question",
                    "name": q.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": q.answer
                    }
                }))
            };
        }
    }
};

// Apply SEO optimizations to existing pages
function optimizeExistingPages() {
    console.log('🔍 Optimizing existing pages for SEO...');
    
    const contentDirs = ['locations', 'isps', 'problems', 'results'];
    
    contentDirs.forEach(dir => {
        const fullPath = path.join(__dirname, '../content', dir);
        
        if (fs.existsSync(fullPath)) {
            const files = fs.readdirSync(fullPath);
            
            files.forEach((file, index) => {
                if (file.endsWith('.html')) {
                    const filePath = path.join(fullPath, file);
                    let html = fs.readFileSync(filePath, 'utf8');
                    
                    // Extract page data
                    const pageData = extractPageData(html, file, dir);
                    
                    // Apply optimizations
                    html = seoRules.technicalSEO.addMetaTags(html, pageData);
                    html = seoRules.technicalSEO.optimizeImages(html);
                    html = seoRules.technicalSEO.addInternalLinks(html, dir, pageData.location);
                    
                    // Add FAQ schema if not present
                    if (dir === 'problems' && !html.includes('FAQPage')) {
                        const faqs = generateFAQsForProblem(file);
                        const faqSchema = seoRules.metaTemplates.FAQPage(faqs);
                        html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>\n</head>`);
                    }
                    
                    // Save optimized version
                    fs.writeFileSync(filePath, html);
                    
                    if ((index + 1) % 10 === 0) {
                        console.log(`✅ Optimized ${index + 1} pages in ${dir}...`);
                    }
                }
            });
        }
    });
    
    console.log('✅ SEO optimization complete!');
}

// Extract page data from HTML for SEO optimization
function extractPageData(html, filename, type) {
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const descMatch = html.match(/<meta name="description" content="(.*?)"/);
    
    // Extract location from filename or content
    let location = '';
    if (type === 'locations') {
        location = filename.replace('speed-test-', '').replace('.html', '').replace(/-/g, ' ');
    } else if (type === 'isps') {
        location = filename.split('-speed-test-')[1]?.replace('.html', '').replace(/-/g, ' ') || 'your area';
    }
    
    return {
        title: titleMatch?.[1] || 'Internet Speed Test',
        description: descMatch?.[1] || 'Test your internet speed',
        slug: filename.replace('.html', ''),
        type: type,
        location: location,
        keywords: generateKeywords(type, location),
        schema: generateSchema(type, location),
        publishedDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString()
    };
}

// Generate keywords for page
function generateKeywords(type, location) {
    const baseKeywords = {
        locations: [
            'internet speed test', 'speed test', 'wifi speed test', 'broadband speed test',
            'internet speed check', 'connection speed test', 'bandwidth test'
        ],
        isps: [
            'isp speed test', 'internet provider speed test', 'connection test',
            'speed check', 'internet speed comparison'
        ],
        problems: [
            'internet troubleshooting', 'fix internet problems', 'internet issues',
            'connection problems', 'speed issues'
        ]
    };
    
    const typeKeywords = baseKeywords[type] || baseKeywords.locations;
    const locationKeywords = location ? [
        `${location} internet speed`,
        `internet speed ${location}`,
        `${location} speed test`,
        `speed test ${location}`
    ] : [];
    
    return [...typeKeywords, ...locationKeywords];
}

// Generate appropriate schema markup
function generateSchema(type, location) {
    const schemas = {
        locations: {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": `Internet Speed Test ${location}`,
            "applicationCategory": "UtilityApplication",
            "offers": { "@type": "Offer", "price": "0" }
        },
        isps: {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "ISP Speed Test Comparison",
            "applicationCategory": "UtilityApplication"
        },
        problems: {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": `How to Fix ${location}`,
            "author": { "@type": "Organization", "name": "Privacy Speed Test" }
        }
    };
    
    return schemas[type] || schemas.locations;
}

// Generate FAQs for problem pages
function generateFAQsForProblem(filename) {
    const problem = filename.replace('.html', '').replace(/-/g, ' ');
    
    return [
        {
            question: `Why does my ${problem}?`,
            answer: `This issue is commonly caused by router problems, ISP issues, or network interference. Try the solutions in our guide above.`
        },
        {
            question: `How do I fix ${problem} quickly?`,
            answer: `Start with our quick fixes section above - most issues resolve with simple router restart or connection checks.`
        },
        {
            question: `When should I contact my ISP about ${problem}?`,
            answer: `Contact your ISP if the issue persists after trying all troubleshooting steps, or if you notice service outages in your area.`
        }
    ];
}

// Run optimization
optimizeExistingPages();
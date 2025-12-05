/**
 * MASTER CONTENT FACTORY
 * Orchestrates all generators to create 1000+ SEO pages
 */

const { generateLocationPages } = require('./generators/location-generator');
const { generateProblemPages } = require('./generators/problem-generator');
const { generateISPPages } = require('./generators/isp-generator');
const { generateResultsPages } = require('./generators/results_generator');

// Progress tracking
let progress = {
    total: 0,
    completed: 0,
    startTime: Date.now(),
    phases: []
};

function updateProgress(phase, count) {
    progress.completed += count;
    progress.phases.push({ phase, count, timestamp: Date.now() });
    
    const percentage = Math.round((progress.completed / progress.total) * 100);
    const elapsed = Math.round((Date.now() - progress.startTime) / 1000);
    
    console.log(`📊 Progress: ${percentage}% (${progress.completed}/${progress.total}) - ${elapsed}s elapsed`);
    console.log(`✅ ${phase}: ${count} pages generated`);
}

// MAIN FACTORY FUNCTION
async function generateAllContent() {
    console.log('🏭 LAUNCHING CONTENT FACTORY...');
    console.log('🎯 Target: 1000+ SEO-optimized pages');
    console.log('');

    // PHASE 1: Location Pages (50+ pages)
    console.log('🏙️ PHASE 1: Location Pages');
    const locationStats = await generateLocationPages();
    updateProgress('Location Pages', locationStats.total);

    // PHASE 2: Problem-Solving Pages (50+ pages)
    console.log('\n🔧 PHASE 2: Problem-Solving Pages');
    const problemStats = await generateProblemPages();
    updateProgress('Problem Pages', problemStats.total);

    // PHASE 3: ISP Pages (100+ pages)
    console.log('\n🏢 PHASE 3: ISP Pages');
    const ispStats = await generateISPPages();
    updateProgress('ISP Pages', ispStats.total);

    // PHASE 4: Results Pages (10+ pages)
    console.log('\n📊 PHASE 4: Results Explanation Pages');
    const resultsStats = await generateResultsPages();
    updateProgress('Results Pages', resultsStats.total);

    // FINAL SUMMARY
    const totalTime = Math.round((Date.now() - progress.startTime) / 1000);
    const pagesPerMinute = Math.round(progress.completed / (totalTime / 60));

    console.log('\n🎉 CONTENT FACTORY COMPLETE!');
    console.log('='.repeat(50));
    console.log(`📊 Total Pages Generated: ${progress.completed}`);
    console.log(`⏱️  Total Time: ${totalTime} seconds`);
    console.log(`⚡ Speed: ${pagesPerMinute} pages/minute`);
    console.log('');

    console.log('📈 SEO IMPACT SUMMARY:');
    console.log(`🏙️  Location Pages: ${locationStats.total} cities covered`);
    console.log(`🔧 Problem Pages: ${problemStats.total} issues solved`);
    console.log(`🏢 ISP Pages: ${ispStats.total} provider×city combinations`);
    console.log(`📊 Results Pages: ${resultsStats.total} speed explanations`);
    console.log(`🎯 Total Search Volume: ${(locationStats.total * 10000 + problemStats.totalSearchVolume + ispStats.total * 500 + resultsStats.total * 1000).toLocaleString()} monthly searches`);
    
    console.log('\n📁 Files Created:');
    console.log(`├── content/locations/ (${locationStats.total} pages)`);
    console.log(`├── content/problems/ (${problemStats.total} pages)`);
    console.log(`├── content/isps/ (${ispStats.total} pages)`);
    console.log(`├── content/results/ (${resultsStats.total} pages)`);
    console.log('');

    console.log('🚀 NEXT STEPS:');
    console.log('1. Deploy to hosting (Netlify/GitHub Pages)');
    console.log('2. Submit sitemap to Google Search Console');
    console.log('3. Monitor rankings and traffic');
    console.log('4. Scale up with more cities/content');

    return {
        total: progress.completed,
        phases: progress.phases,
        stats: {
            locations: locationStats,
            problems: problemStats,
            isps: ispStats,
            results: resultsStats
        },
        performance: {
            totalTime,
            pagesPerMinute,
            efficiency: progress.completed / (totalTime / 60)
        }
    };
}

// Run the factory
if (require.main === module) {
    generateAllContent().then(results => {
        console.log('\n✅ Factory execution complete!');
        process.exit(0);
    }).catch(error => {
        console.error('❌ Factory execution failed:', error);
        process.exit(1);
    });
}

module.exports = { generateAllContent };
/**
 * Enhanced UI Controller for Privacy Speed Test
 * Professional results display with circular gauges
 */

class SpeedTestUI {
    constructor() {
        this.speedTest = new PrivacySpeedTest();
        this.elements = this.cacheElements();
        this.currentResults = null;
        this.isTestRunning = false;
        
        this.bindEvents();
        this.checkForSharedResults();
        this.setupAutoStart();
    }

    /**
     * Cache DOM elements for better performance
     */
    cacheElements() {
        return {
            // Test interface
            startButton: document.getElementById('start-test'),
            testInterface: document.getElementById('test-interface'),
            testProgress: document.getElementById('test-progress'),
            progressFill: document.querySelector('.progress-fill'),
            progressText: document.querySelector('.progress-text'),
            
            // Results header
            resultsContainer: document.getElementById('results-container'),
            resultsTime: document.getElementById('results-time'),
            
            // Gauge elements
            downloadGauge: document.getElementById('download-gauge-text'),
            uploadGauge: document.getElementById('upload-gauge-text'),
            pingGauge: document.getElementById('ping-gauge-text'),
            jitterGauge: document.getElementById('jitter-gauge-text'),
            
            // Rating elements
            downloadRating: document.getElementById('download-rating'),
            uploadRating: document.getElementById('upload-rating'),
            pingRating: document.getElementById('ping-rating'),
            jitterRating: document.getElementById('jitter-rating'),
            
            // Analysis elements
            connectionType: document.getElementById('connection-type'),
            streamingCapabilities: document.getElementById('streaming-capabilities'),
            videoCallCapabilities: document.getElementById('video-call-capabilities'),
            gamingCapabilities: document.getElementById('gaming-capabilities'),
            uploadCapabilities: document.getElementById('upload-capabilities'),
            
            // Comparison elements
            downloadComparisonBar: document.getElementById('download-comparison-bar'),
            cityComparisonBar: document.getElementById('city-comparison-bar'),
            nationalComparisonBar: document.getElementById('national-comparison-bar'),
            yourDownloadValue: document.getElementById('your-download-value'),
            
            // Action buttons
            shareButtonNew: document.getElementById('share-results-new'),
            testAgainButtonNew: document.getElementById('test-again-new'),
            saveButton: document.getElementById('save-results'),
            
            // Modal elements
            shareModalNew: document.getElementById('share-modal-new'),
            shareLinkNew: document.getElementById('share-link-new'),
            copyButtonNew: document.getElementById('copy-link-new'),
            closeModalNew: document.getElementById('close-modal-new'),
            shareDownloadSpeed: document.getElementById('share-download-speed')
        };
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Test button
        this.elements.startButton.addEventListener('click', () => this.startTest());
        
        // New action buttons
        if (this.elements.shareButtonNew) {
            this.elements.shareButtonNew.addEventListener('click', () => this.shareResults());
        }
        if (this.elements.testAgainButtonNew) {
            this.elements.testAgainButtonNew.addEventListener('click', () => this.resetTest());
        }
        if (this.elements.saveButton) {
            this.elements.saveButton.addEventListener('click', () => this.saveResults());
        }
        
        // Modal buttons (new modal)
        if (this.elements.copyButtonNew) {
            this.elements.copyButtonNew.addEventListener('click', () => this.copyShareLink());
        }
        if (this.elements.closeModalNew) {
            this.elements.closeModalNew.addEventListener('click', () => this.closeShareModal());
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeShareModal();
            if (e.key === 'Enter' && !this.isTestRunning && this.elements.resultsContainer.classList.contains('hidden')) {
                this.startTest();
            }
        });
    }

    /**
     * Setup auto-start functionality
     */
    setupAutoStart() {
        // Auto-start after 2 seconds if no results shown
        setTimeout(() => {
            if (!this.isTestRunning && this.elements.resultsContainer.classList.contains('hidden')) {
                this.startTest();
            }
        }, 2000);
    }

    /**
     * Start the speed test
     */
    async startTest() {
        if (this.isTestRunning) return;
        
        this.isTestRunning = true;
        this.elements.startButton.disabled = true;
        
        // Hide interface, show progress
        this.elements.testInterface.classList.add('hidden');
        this.elements.resultsContainer.classList.add('hidden');
        this.elements.testProgress.classList.remove('hidden');
        
        // Start progress animation
        this.animateProgress();
        
        // Run the test
        try {
            await this.speedTest.runFullTest((results, error) => {
                if (error) {
                    this.showError(error);
                    return;
                }
                
                this.currentResults = results;
                this.displayResults(results);
                this.generateAnalysis(results);
                this.showResults();
            });
        } catch (error) {
            this.showError(error);
        }
    }

    /**
     * Animate progress bar during test
     */
    animateProgress() {
        const steps = [
            { text: 'Connecting to test servers...', percent: 10 },
            { text: 'Testing download speed...', percent: 35 },
            { text: 'Testing upload speed...', percent: 60 },
            { text: 'Testing ping latency...', percent: 80 },
            { text: 'Analyzing results...', percent: 95 },
            { text: 'Complete!', percent: 100 }
        ];
        
        let currentStep = 0;
        
        const interval = setInterval(() => {
            if (currentStep < steps.length) {
                const step = steps[currentStep];
                this.elements.progressText.textContent = step.text;
                this.elements.progressFill.style.width = `${step.percent}%`;
                currentStep++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    this.elements.testProgress.classList.add('hidden');
                }, 500);
            }
        }, 800);
    }

    /**
     * Enhanced display results with circular gauges
     */
    displayResults(results) {
        // Update timestamp
        if (this.elements.resultsTime) {
            this.elements.resultsTime.textContent = `Test completed at ${new Date().toLocaleTimeString()}`;
        }
        
        // Update gauge values with animation
        this.animateGauge('download', results.download, 500);
        this.animateGauge('upload', results.upload, 700);
        this.animateGauge('ping', results.ping, 900);
        this.animateGauge('jitter', results.jitter, 1100);
        
        // Update rating colors and text
        this.updateRatingDisplay('download', results.download);
        this.updateRatingDisplay('upload', results.upload);
        this.updateRatingDisplay('ping', results.ping);
        this.updateRatingDisplay('jitter', results.jitter);
        
        // Update capabilities and analysis
        this.updateCapabilities(results);
        this.updateComparisonChart(results.download);
    }

    /**
     * Animate circular gauge
     */
    animateGauge(type, value, delay = 0) {
        setTimeout(() => {
            const gaugeText = this.elements[`${type}Gauge`];
            const gaugeFill = document.querySelector(`.${type}-gauge`);
            
            if (!gaugeText || !gaugeFill) return;
            
            // Animate text
            this.animateValue(gaugeText, value, 1500);
            
            // Animate gauge fill
            const maxValue = this.getMaxValue(type);
            const percentage = Math.min(value / maxValue, 1);
            const circumference = 2 * Math.PI * 54; // radius of 54
            const offset = circumference - (percentage * circumference);
            
            gaugeFill.style.strokeDashoffset = offset;
            
            // Set color based on value
            const color = this.getGaugeColor(type, value);
            gaugeFill.style.stroke = color;
            
        }, delay);
    }

    /**
     * Animate number counting effect
     */
    animateValue(element, targetValue, duration = 1500) {
        element.textContent = '0';
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.floor(targetValue * this.easeOutQuart(progress));
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    /**
     * Easing function for smooth animation
     */
    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    /**
     * Get max value for gauge scaling
     */
    getMaxValue(type) {
        switch(type) {
            case 'download': return 1000;
            case 'upload': return 100;
            case 'ping': return 200;
            case 'jitter': return 50;
            default: return 100;
        }
    }

    /**
     * Get gauge color based on value
     */
    getGaugeColor(type, value) {
        const rating = this.getRating(type, value);
        switch(rating) {
            case 'excellent': return '#10b981';
            case 'good': return '#3b82f6';
            case 'fair': return '#f59e0b';
            case 'poor': return '#ef4444';
            default: return '#6b7280';
        }
    }

    /**
     * Update rating display
     */
    updateRatingDisplay(type, value) {
        const ratingElement = this.elements[`${type}Rating`];
        if (!ratingElement) return;
        
        const rating = this.getRating(type, value);
        const ratingText = this.getRatingText(type, rating);
        
        ratingElement.textContent = ratingText;
        ratingElement.className = `speed-rating rating-${rating}`;
    }

    /**
     * Get rating based on value
     */
    getRating(type, value) {
        switch(type) {
            case 'download':
                if (value >= 100) return 'excellent';
                if (value >= 25) return 'good';
                if (value >= 10) return 'fair';
                return 'poor';
            case 'upload':
                if (value >= 20) return 'excellent';
                if (value >= 5) return 'good';
                if (value >= 1) return 'fair';
                return 'poor';
            case 'ping':
                if (value <= 20) return 'excellent';
                if (value <= 50) return 'good';
                if (value <= 100) return 'fair';
                return 'poor';
            case 'jitter':
                if (value <= 10) return 'excellent';
                if (value <= 30) return 'good';
                if (value <= 50) return 'fair';
                return 'poor';
            default:
                return 'good';
        }
    }

    /**
     * Get rating text
     */
    getRatingText(type, rating) {
        const texts = {
            download: {
                excellent: 'Excellent',
                good: 'Good',
                fair: 'Fair',
                poor: 'Poor'
            },
            upload: {
                excellent: 'Excellent',
                good: 'Good',
                fair: 'Limited',
                poor: 'Very Limited'
            },
            ping: {
                excellent: 'Excellent',
                good: 'Good',
                fair: 'Moderate',
                poor: 'High'
            },
            jitter: {
                excellent: 'Very Stable',
                good: 'Stable',
                fair: 'Moderate',
                poor: 'Unstable'
            }
        };
        
        return texts[type]?.[rating] || 'Good';
    }

    /**
     * Update capabilities based on results
     */
    updateCapabilities(results) {
        // Connection type
        if (this.elements.connectionType) {
            this.elements.connectionType.textContent = this.speedTest.getConnectionType();
        }
        
        // Download capabilities
        this.updateCapabilityItems('streaming-capabilities', [
            { text: 'Netflix HD (5 Mbps needed)', requirement: 5, value: results.download },
            { text: 'Netflix 4K (25 Mbps needed)', requirement: 25, value: results.download },
            { text: 'YouTube HD', requirement: 10, value: results.download },
            { text: 'Multiple streams', requirement: 50, value: results.download }
        ]);
        
        // Upload capabilities
        this.updateCapabilityItems('upload-capabilities', [
            { text: 'Photo uploads', requirement: 1, value: results.upload },
            { text: 'Cloud backups', requirement: 5, value: results.upload },
            { text: 'File sharing', requirement: 3, value: results.upload },
            { text: 'Large video uploads', requirement: 20, value: results.upload }
        ]);
        
        // Gaming capabilities
        const pingRating = this.getRating('ping', results.ping);
        const gamingItems = [
            { text: 'Online gaming (25 Mbps needed)', requirement: 25, value: results.download },
            { text: 'Game downloads', requirement: 10, value: results.download },
            { text: 'Streaming gameplay', requirement: 10, value: results.upload },
            { text: 'Low latency gaming', requirement: 50, value: 200 - results.ping, inverse: true }
        ];
        
        this.updateCapabilityItems('gaming-capabilities', gamingItems);
        
        // Video call capabilities
        this.updateCapabilityItems('video-call-capabilities', [
            { text: 'Zoom HD (3 Mbps needed)', requirement: 3, value: results.upload },
            { text: 'Teams HD (3 Mbps needed)', requirement: 3, value: results.upload },
            { text: 'Google Meet HD', requirement: 3, value: results.upload },
            { text: 'Multiple HD calls', requirement: 10, value: results.upload }
        ]);
    }

    /**
     * Update capability items with dynamic checkmarks
     */
    updateCapabilityItems(containerId, items) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = items.map(item => {
            const isCapable = item.inverse ? item.value >= item.requirement : item.value >= item.requirement;
            const icon = isCapable ? '✅' : '❌';
            const className = isCapable ? 'capability-item positive' : 'capability-item negative';
            return `<div class="${className}">${icon} ${item.text}</div>`;
        }).join('');
    }

    /**
     * Update comparison chart
     */
    updateComparisonChart(downloadSpeed) {
        const cityAvg = 142; // Example city average
        const nationalAvg = 132; // Example national average
        
        // Calculate percentages (max bar = 200 Mbps for visualization)
        const maxDisplay = Math.max(downloadSpeed, cityAvg, nationalAvg, 200);
        
        const yourPercent = (downloadSpeed / maxDisplay) * 100;
        const cityPercent = (cityAvg / maxDisplay) * 100;
        const nationalPercent = (nationalAvg / maxDisplay) * 100;
        
        // Animate bars
        setTimeout(() => {
            if (this.elements.downloadComparisonBar) {
                this.elements.downloadComparisonBar.style.width = `${yourPercent}%`;
            }
            if (this.elements.cityComparisonBar) {
                this.elements.cityComparisonBar.style.width = `${cityPercent}%`;
            }
            if (this.elements.nationalComparisonBar) {
                this.elements.nationalComparisonBar.style.width = `${nationalPercent}%`;
            }
        }, 500);
        
        // Update values
        if (this.elements.yourDownloadValue) {
            this.elements.yourDownloadValue.textContent = `${downloadSpeed} Mbps`;
        }
    }

    /**
     * Generate analysis content
     */
    generateAnalysis(results) {
        // Analysis is now handled by updateCapabilities() and HTML templates
        // This method can be used for additional dynamic content if needed
        return '';
    }

    /**
     * Share results functionality
     */
    shareResults() {
        if (!this.currentResults) return;
        
        const shareLink = this.speedTest.generateShareLink();
        
        // Update share preview
        if (this.elements.shareDownloadSpeed) {
            this.elements.shareDownloadSpeed.textContent = this.currentResults.download;
        }
        
        // Update share link
        if (this.elements.shareLinkNew) {
            this.elements.shareLinkNew.value = shareLink;
        }
        
        // Show modal
        if (this.elements.shareModalNew) {
            this.elements.shareModalNew.classList.remove('hidden');
        }
        
        // Auto-select link
        setTimeout(() => {
            if (this.elements.shareLinkNew) {
                this.elements.shareLinkNew.select();
            }
        }, 100);
    }

    /**
     * Copy share link to clipboard
     */
    async copyShareLink() {
        try {
            await navigator.clipboard.writeText(this.elements.shareLinkNew.value);
            
            // Show feedback
            const originalText = this.elements.copyButtonNew.textContent;
            this.elements.copyButtonNew.textContent = '✅ Copied!';
            this.elements.copyButtonNew.style.background = 'var(--secondary-color)';
            
            setTimeout(() => {
                this.elements.copyButtonNew.textContent = originalText;
                this.elements.copyButtonNew.style.background = '';
            }, 2000);
            
        } catch (error) {
            // Fallback for older browsers
            this.elements.shareLinkNew.select();
            document.execCommand('copy');
            
            this.elements.copyButtonNew.textContent = '✅ Copied!';
            setTimeout(() => {
                this.elements.copyButtonNew.textContent = 'Copy Link';
            }, 2000);
        }
    }

    /**
     * Close share modal
     */
    closeShareModal() {
        if (this.elements.shareModalNew) {
            this.elements.shareModalNew.classList.add('hidden');
        }
    }

    /**
     * Save results locally
     */
    saveResults() {
        if (!this.currentResults) return;
        
        try {
            // Save to localStorage
            this.speedTest.saveResultsLocally();
            
            // Show feedback
            const originalText = this.elements.saveButton.textContent;
            this.elements.saveButton.textContent = '✅ Saved!';
            this.elements.saveButton.style.background = 'var(--secondary-color)';
            
            setTimeout(() => {
                this.elements.saveButton.textContent = originalText;
                this.elements.saveButton.style.background = '';
            }, 2000);
            
        } catch (error) {
            alert('Could not save results. Please try again.');
        }
    }

    /**
     * Check for shared results in URL
     */
    checkForSharedResults() {
        if (window.location.hash.includes('results=')) {
            const results = PrivacySpeedTest.decodeSharedResults(window.location.hash);
            if (results) {
                this.currentResults = results;
                this.displayResults(results);
                this.showResultsFromShare();
            }
        }
    }

    /**
     * Show results from shared link
     */
    showResultsFromShare() {
        this.elements.testInterface.classList.add('hidden');
        this.elements.resultsContainer.classList.remove('hidden');
        
        // Update title
        document.title = `Shared Results: ${this.currentResults.download} Mbps | Privacy Speed Test`;
        
        // Add share indicator
        const shareIndicator = document.createElement('div');
        shareIndicator.className = 'share-indicator';
        shareIndicator.innerHTML = '📤 <em>Shared results from another user</em>';
        this.elements.resultsContainer.insertBefore(shareIndicator, this.elements.resultsContainer.firstChild);
    }

    /**
     * Show results with animation
     */
    showResults() {
        this.elements.resultsContainer.classList.remove('hidden');
        this.elements.testProgress.classList.add('hidden');
        
        // Add entrance animation
        this.elements.resultsContainer.style.animation = 'fadeInUp 0.6s ease-out';
        
        // Update page title
        document.title = `${this.currentResults.download} Mbps ↓ ${this.currentResults.upload} Mbps ↑ | Privacy Speed Test`;
        
        // Scroll to results
        setTimeout(() => {
            this.elements.resultsContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 300);
    }

    /**
     * Reset test for another run
     */
    resetTest() {
        this.isTestRunning = false;
        this.currentResults = null;
        
        // Reset UI
        this.elements.resultsContainer.classList.add('hidden');
        this.elements.testInterface.classList.remove('hidden');
        this.elements.startButton.disabled = false;
        
        // Reset title
        document.title = 'Privacy-First Internet Speed Test | Zero Data Collection';
        
        // Clear hash if present
        if (window.location.hash.includes('results=')) {
            history.replaceState(null, null, ' ');
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Show error message
     */
    showError(error) {
        console.error('Speed test error:', error);
        
        // Reset UI
        this.isTestRunning = false;
        this.elements.testProgress.classList.add('hidden');
        this.elements.testInterface.classList.remove('hidden');
        this.elements.startButton.disabled = false;
        
        // Show user-friendly error
        alert('Speed test failed. Please check your internet connection and try again.');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.speedTestUI = new SpeedTestUI();
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            console.log('Service Worker registration failed');
        });
    });
}
/**
 * Enhanced UI Controller with Interactive Results
 * Real-time loading, Ookla-inspired animations
 */

class SpeedTestUI {
    constructor() {
        this.speedTest = new PrivacySpeedTest();
        this.elements = this.cacheElements();
        this.currentResults = null;
        this.isTestRunning = false;
        this.animationFrame = null;
        
        this.bindEvents();
        this.checkForSharedResults();
        this.setupAutoStart();
        this.setupThemeToggle();
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        return {
            // Test interface
            startButton: document.getElementById('start-test'),
            testInterface: document.getElementById('test-interface'),
            testProgress: document.getElementById('test-progress'),
            progressFill: document.querySelector('.progress-fill'),
            progressText: document.querySelector('.progress-text'),
            
            // Results
            resultsContainer: document.getElementById('results-container'),
            resultsTime: document.getElementById('results-time'),
            downloadGauge: document.getElementById('download-gauge-text'),
            uploadGauge: document.getElementById('upload-gauge-text'),
            pingGauge: document.getElementById('ping-gauge-text'),
            jitterGauge: document.getElementById('jitter-gauge-text'),
            
            // Theme toggle
            themeToggle: document.querySelector('.theme-toggle'),
            
            // Action buttons
            shareButtonNew: document.getElementById('share-results-new'),
            testAgainButtonNew: document.getElementById('test-again-new'),
            saveButton: document.getElementById('save-results')
        };
    }

    /**
     * Start the speed test with interactive loading
     */
    async startTest() {
        if (this.isTestRunning) return;
        
        this.isTestRunning = true;
        this.elements.startButton.disabled = true;
        
        // Smooth transition to testing state
        this.transitionToTesting();
        
        // Start interactive progress animation
        this.startInteractiveProgress();
        
        // Run the test with real-time updates
        try {
            await this.speedTest.runFullTest((results, error) => {
                if (error) {
                    this.showError(error);
                    return;
                }
                
                this.currentResults = results;
                this.updateResultsRealTime(results);
                this.showResults();
            });
        } catch (error) {
            this.showError(error);
        }
    }

    /**
     * Smooth transition to testing state (no disappearing)
     */
    transitionToTesting() {
        // Fade out start button
        this.elements.startButton.style.opacity = '0';
        this.elements.startButton.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            this.elements.testInterface.style.opacity = '0';
            this.elements.testInterface.style.transform = 'translateY(-20px)';
            
            // Immediately show progress with animation
            setTimeout(() => {
                this.elements.testInterface.classList.add('hidden');
                this.elements.resultsContainer.classList.add('hidden');
                this.elements.testProgress.classList.remove('hidden');
                this.elements.testProgress.style.opacity = '0';
                this.elements.testProgress.style.transform = 'translateY(20px)';
                
                // Animate progress appearance
                setTimeout(() => {
                    this.elements.testProgress.style.opacity = '1';
                    this.elements.testProgress.style.transform = 'translateY(0)';
                }, 50);
            }, 200);
        }, 150);
    }

    /**
     * Interactive progress animation (Ookla-style)
     */
    startInteractiveProgress() {
        const steps = [
            { text: 'Connecting to test servers...', percent: 5 },
            { text: 'Testing download speed...', percent: 35 },
            { text: 'Testing upload speed...', percent: 60 },
            { text: 'Testing ping latency...', percent: 80 },
            { text: 'Analyzing results...', percent: 95 },
            { text: 'Complete!', percent: 100 }
        ];
        
        let currentStep = 0;
        let progress = 0;
        
        const animateProgress = () => {
            if (currentStep < steps.length && this.isTestRunning) {
                const step = steps[currentStep];
                
                // Smooth progress animation
                const targetProgress = step.percent;
                const progressDiff = targetProgress - progress;
                const increment = progressDiff / 20; // 20 frames for smooth animation
                
                const animateFrame = () => {
                    if (progress < targetProgress && this.isTestRunning) {
                        progress += increment;
                        this.elements.progressFill.style.width = `${Math.min(progress, 100)}%`;
                        this.elements.progressText.textContent = step.text;
                        
                        // Add pulsing effect during active testing
                        if (progress < 95) {
                            this.elements.progressFill.style.animation = 'pulse 1s infinite';
                        }
                        
                        requestAnimationFrame(animateFrame);
                    } else {
                        currentStep++;
                        if (currentStep < steps.length) {
                            setTimeout(animateProgress, 300);
                        }
                    }
                };
                
                animateFrame();
            }
        };
        
        animateProgress();
    }

    /**
     * Real-time results updating (no disappearing/reappearing)
     */
    updateResultsRealTime(results) {
        // Update gauges with smooth animation
        this.animateGauge('download', results.download, 0);
        this.animateGauge('upload', results.upload, 200);
        this.animateGauge('ping', results.ping, 400);
        this.animateGauge('jitter', results.jitter, 600);
        
        // Update ratings with color transitions
        setTimeout(() => {
            this.updateRatingDisplay('download', results.download);
            this.updateRatingDisplay('upload', results.upload);
            this.updateRatingDisplay('ping', results.ping);
            this.updateRatingDisplay('jitter', results.jitter);
        }, 800);
        
        // Update timestamp
        if (this.elements.resultsTime) {
            this.elements.resultsTime.textContent = `Test completed at ${new Date().toLocaleTimeString()}`;
        }
        
        // Smooth reveal of results (no disappearing)
        this.elements.resultsContainer.style.opacity = '0';
        this.elements.resultsContainer.style.transform = 'translateY(20px)';
        this.elements.resultsContainer.classList.remove('hidden');
        
        setTimeout(() => {
            this.elements.resultsContainer.style.opacity = '1';
            this.elements.resultsContainer.style.transform = 'translateY(0)';
            this.elements.testProgress.style.opacity = '0';
            this.elements.testProgress.style.transform = 'translateY(-20px)';
        }, 100);
    }

    /**
     * Smooth gauge animation (Ookla-inspired)
     */
    animateGauge(type, value, delay) {
        setTimeout(() => {
            const gaugeText = this.elements[`${type}Gauge`];
            const gaugeFill = document.querySelector(`.${type}-gauge`);
            
            if (!gaugeText || !gaugeFill) return;
            
            // Animate number with easing
            this.animateValue(gaugeText, value, 1000);
            
            // Animate gauge fill with easing
            const maxValue = this.getMaxValue(type);
            const percentage = Math.min(value / maxValue, 1);
            const circumference = 2 * Math.PI * 54;
            const offset = circumference - (percentage * circumference);
            
            gaugeFill.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            gaugeFill.style.strokeDashoffset = offset;
            
            // Color transition based on value
            const color = this.getGaugeColor(type, value);
            gaugeFill.style.stroke = color;
            
        }, delay);
    }

    /**
     * Smooth number counting with easing
     */
    animateValue(element, targetValue, duration) {
        element.textContent = '0';
        const startTime = performance.now();
        const startValue = 0;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease-out cubic easing
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easedProgress);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    /**
     * Get max value for gauge scaling
     */
    getMaxValue(type) {
        switch(type) {
            case 'download': return 1000;
            case 'upload': return 100;
            case 'ping': return 200;
            case 'jitter': return 50;
            default: return 100;
        }
    }

    /**
     * Get gauge color based on value
     */
    getGaugeColor(type, value) {
        const rating = this.getRating(type, value);
        const colors = {
            excellent: '#10b981',
            good: '#3b82f6', 
            fair: '#f59e0b',
            poor: '#ef4444'
        };
        return colors[rating] || '#6b7280';
    }

    /**
     * Theme toggle functionality
     */
    setupThemeToggle() {
        // Create theme toggle button if doesn't exist
        if (!this.elements.themeToggle) {
            const toggle = document.createElement('button');
            toggle.className = 'theme-toggle';
            toggle.innerHTML = `
                <span class="theme-icon theme-icon-sun">☀️</span>
                <span class="theme-icon theme-icon-moon">🌙</span>
            `;
            document.body.appendChild(toggle);
            this.elements.themeToggle = toggle;
        }
        
        // Load saved theme or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Toggle theme on click
        this.elements.themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Add transition effect
            this.elements.themeToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.elements.themeToggle.style.transform = 'scale(1)';
            }, 150);
        });
    }

    /**
     * Show results with smooth animation
     */
    showResults() {
        // Update page title for SEO
        document.title = `${this.currentResults.download} Mbps ↓ ${this.currentResults.upload} Mbps ↑ | Privacy Speed Test`;
        
        // Scroll to results smoothly
        setTimeout(() => {
            this.elements.resultsContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 500);
        
        this.isTestRunning = false;
    }

    /**
     * Reset test for another run
     */
    resetTest() {
        this.isTestRunning = false;
        this.currentResults = null;
        
        // Smooth reset animation
        this.elements.resultsContainer.style.opacity = '0';
        this.elements.resultsContainer.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            this.elements.resultsContainer.classList.add('hidden');
            this.elements.testInterface.classList.remove('hidden');
            this.elements.testInterface.style.opacity = '1';
            this.elements.testInterface.style.transform = 'translateY(0)';
            this.elements.startButton.style.opacity = '1';
            this.elements.startButton.style.transform = 'scale(1)';
            this.elements.startButton.disabled = false;
            
            // Reset title
            document.title = 'Privacy-First Internet Speed Test | Zero Data Collection';
        }, 300);
        
        // Clear hash if present
        if (window.location.hash.includes('results=')) {
            history.replaceState(null, null, ' ');
        }
    }

    /**
     * All other methods remain the same but with smooth animations
     */
    // ... [keep existing methods but add smooth transitions]
}

// Enhanced CSS for animations
const style = document.createElement('style');
style.textContent = `
    /* Smooth transitions for all elements */
    * {
        transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
    }
    
    /* Smooth results appearance */
    #results-container {
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    #test-progress {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    #test-interface {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    /* Pulsing animation for progress */
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    .progress-fill {
        animation: pulse 1s infinite;
    }
    
    /* Smooth gauge animations */
    .gauge-fill {
        transition: stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s ease;
    }
    
    .gauge-value {
        transition: all 0.1s ease;
    }
`;

document.head.appendChild(style);
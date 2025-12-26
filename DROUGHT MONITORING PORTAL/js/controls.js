// ========================================
// MAP 2 CONTROLS - TEMPERATURE & PRECIPITATION
// ========================================

const Map2Controls = {
    isPlaying: false,
    currentMonthIndex: 0,
    playbackSpeed: 1,
    playbackInterval: null,
    sliderActive: false,
    loadingInProgress: false,
    activeLayerType: null, // 'temperature' or 'precipitation'

    init: function() {
        console.log('🎮 Initializing Map 2 Controls...');
        this.waitForMap2().then(() => this.setupControls());
    },

    waitForMap2: function() {
        return new Promise((resolve) => {
            const check = () => {
                if (typeof isMap2Ready === 'function' && isMap2Ready()) {
                    resolve();
                } else {
                    setTimeout(check, 200);
                }
            };
            check();
        });
    },

    setupControls: function() {
        // Layer Toggle Buttons
        document.getElementById('temperatureToggleBtn')?.addEventListener('click', () => {
            this.activateLayerType('temperature');
        });
        
        document.getElementById('precipitationToggleBtn')?.addEventListener('click', () => {
            this.activateLayerType('precipitation');
        });

        // Playback Controls
        document.getElementById('map2PlayPauseBtn')?.addEventListener('click', () => this.togglePlayPause());
        document.getElementById('map2StepBackBtn')?.addEventListener('click', () => this.stepBackward());
        document.getElementById('map2StepForwardBtn')?.addEventListener('click', () => this.stepForward());
        document.getElementById('closeMap2Slider')?.addEventListener('click', () => this.closeSlider());
        
        // Timeline Controls
        document.getElementById('map2TimelineRange')?.addEventListener('input', (e) => this.handleTimelineChange(e));
        document.getElementById('map2SpeedSelect')?.addEventListener('change', (e) => this.handleSpeedChange(e));

        this.createMonthMarkers();
        console.log('✅ Map 2 Controls Ready');
    },

    activateLayerType: function(layerType) {
        const slider = document.getElementById('map2Slider');
        const tempBtn = document.getElementById('temperatureToggleBtn');
        const precBtn = document.getElementById('precipitationToggleBtn');
        
        if (!slider) return;

        if (!isMap2Ready()) {
            alert('⚠️ Please wait for map to load');
            return;
        }

        // If clicking the same active layer, close it
        if (this.activeLayerType === layerType && this.sliderActive) {
            this.closeSlider();
            return;
        }

        // Stop any current playback
        this.stopPlayback();

        // Update button states
        tempBtn?.classList.remove('active');
        precBtn?.classList.remove('active');
        
        if (layerType === 'temperature') {
            tempBtn?.classList.add('active');
        } else {
            precBtn?.classList.add('active');
        }

        this.activeLayerType = layerType;
        this.sliderActive = true;
        this.currentMonthIndex = 0;
        
        // Update slider title
        this.updateSliderTitle(layerType);
        
        // Show slider
        slider.classList.add('active');

        // Check if layers already loaded
        if (typeof areLayersLoaded === 'function' && areLayersLoaded(layerType)) {
            console.log(`✅ Using cached ${layerType} layers`);
            this.updateDisplay();
            return;
        }

        // Load layers
        this.loadingInProgress = true;
        this.showLoadingIndicator(0, 3, 'Initializing', 'step1');

        if (typeof loadAllLayers === 'function') {
            loadAllLayers(layerType, (current, total, msg, step) => {
                this.showLoadingIndicator(current, total, msg, step);
            })
            .then(() => {
                this.loadingInProgress = false;
                this.hideLoadingIndicator();
                this.updateDisplay();
                console.log(`🎉 ${layerType.toUpperCase()} LAYERS LOADED!`);
            })
            .catch((error) => {
                console.error('❌ Loading failed:', error);
                this.loadingInProgress = false;
                this.hideLoadingIndicator();
                alert('Failed to load layers. Please refresh.');
            });
        }
    },

    updateSliderTitle: function(layerType) {
        const titleEl = document.getElementById('map2SliderTitle');
        if (titleEl) {
            if (layerType === 'temperature') {
                titleEl.innerHTML = '<i class="fas fa-temperature-high"></i> Monthly Temperature 2026';
            } else {
                titleEl.innerHTML = '<i class="fas fa-cloud-rain"></i> Monthly Precipitation 2026';
            }
        }
    },

    showLoadingIndicator: function(current, total, message, step) {
        const slider = document.getElementById('map2Slider');
        if (!slider) return;

        let indicator = document.getElementById('map2-loading-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'map2-loading-indicator';
            indicator.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(10, 14, 39, 0.98);
                backdrop-filter: blur(25px);
                padding: 40px 60px;
                border-radius: 18px;
                border: 3px solid rgba(0, 212, 255, 0.6);
                color: #00d4ff;
                font-family: 'Inter', sans-serif;
                z-index: 1000;
                text-align: center;
                box-shadow: 0 15px 50px rgba(0, 212, 255, 0.4);
            `;
            slider.appendChild(indicator);
        }

        const progress = Math.round((current / total) * 100);
        const stepIcons = { step1: '📦', step2: '⏳', step3: '✓' };
        const icon = stepIcons[step] || '⚙️';
        const layerTypeText = this.activeLayerType === 'temperature' ? 'Temperature' : 'Precipitation';
        const iconColor = this.activeLayerType === 'temperature' ? '#ff6b6b' : '#00d4ff';

        indicator.innerHTML = `
            <div style="margin-bottom: 25px; font-size: 56px; color: ${iconColor};">
                ${step === 'step2' ? '<i class="fas fa-spinner fa-spin"></i>' : icon}
            </div>
            <div style="font-weight: 700; margin-bottom: 15px; font-size: 22px;">
                ${message}
            </div>
            <div style="font-size: 18px; color: #67e8f9; margin-bottom: 20px;">
                ${current} / ${total} Complete (${progress}%)
            </div>
            <div style="width: 320px; height: 10px; background: rgba(0, 212, 255, 0.2); border-radius: 5px; margin: 0 auto; overflow: hidden;">
                <div style="width: ${progress}%; height: 100%; background: linear-gradient(90deg, ${iconColor}, #a855f7); transition: width 0.3s ease; border-radius: 5px;"></div>
            </div>
            <div style="font-size: 13px; color: #94a3b8; margin-top: 20px;">
                Loading ${layerTypeText} layers...
            </div>
        `;
    },

    hideLoadingIndicator: function() {
        const indicator = document.getElementById('map2-loading-indicator');
        if (indicator) {
            indicator.style.transition = 'opacity 0.3s ease';
            indicator.style.opacity = '0';
            setTimeout(() => indicator.remove(), 300);
        }
    },

    closeSlider: function() {
        const slider = document.getElementById('map2Slider');
        const tempBtn = document.getElementById('temperatureToggleBtn');
        const precBtn = document.getElementById('precipitationToggleBtn');
        
        if (slider) slider.classList.remove('active');
        tempBtn?.classList.remove('active');
        precBtn?.classList.remove('active');
        
        this.sliderActive = false;
        this.activeLayerType = null;
        this.stopPlayback();
        
        if (typeof hideAllLayers === 'function') {
            hideAllLayers();
        }
    },

    togglePlayPause: function() {
        if (this.loadingInProgress) {
            alert('⚠️ Please wait for loading to complete');
            return;
        }

        if (!this.activeLayerType || !areLayersLoaded(this.activeLayerType)) {
            alert('⚠️ Layers not loaded yet');
            return;
        }

        if (this.isPlaying) {
            this.stopPlayback();
        } else {
            this.startPlayback();
        }
    },

    startPlayback: function() {
        this.isPlaying = true;
        
        const playPauseBtn = document.getElementById('map2PlayPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }

        const interval = 700 / this.playbackSpeed;
        const maxIndex = getLayerCount(this.activeLayerType) - 1;

        this.playbackInterval = setInterval(() => {
            if (this.currentMonthIndex < maxIndex) {
                this.currentMonthIndex++;
            } else {
                this.currentMonthIndex = 0; // Loop back
            }
            this.updateDisplay();
        }, interval);

        console.log(`▶️ PLAYBACK STARTED (${this.activeLayerType})`);
    },

    stopPlayback: function() {
        this.isPlaying = false;
        
        const playPauseBtn = document.getElementById('map2PlayPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }

        if (this.playbackInterval) {
            clearInterval(this.playbackInterval);
            this.playbackInterval = null;
        }
    },

    stepBackward: function() {
        if (this.loadingInProgress || !this.activeLayerType) return;
        this.stopPlayback();
        if (this.currentMonthIndex > 0) {
            this.currentMonthIndex--;
            this.updateDisplay();
        }
    },

    stepForward: function() {
        if (this.loadingInProgress || !this.activeLayerType) return;
        this.stopPlayback();
        const maxIndex = getLayerCount(this.activeLayerType) - 1;
        if (this.currentMonthIndex < maxIndex) {
            this.currentMonthIndex++;
            this.updateDisplay();
        }
    },

    handleTimelineChange: function(e) {
        if (this.loadingInProgress || !this.activeLayerType) return;
        this.stopPlayback();
        this.currentMonthIndex = parseInt(e.target.value);
        this.updateDisplay();
    },

    handleSpeedChange: function(e) {
        this.playbackSpeed = parseFloat(e.target.value);
        if (this.isPlaying) {
            this.stopPlayback();
            this.startPlayback();
        }
    },

    updateDisplay: function() {
        if (!this.activeLayerType) return;

        const months = ['January', 'February', 'March'];
        const maxIndex = months.length - 1;
        
        // Update month display
        const currentMonthEl = document.getElementById('map2CurrentMonth');
        if (currentMonthEl) {
            currentMonthEl.textContent = months[this.currentMonthIndex];
        }

        // Update range slider
        const timelineRange = document.getElementById('map2TimelineRange');
        if (timelineRange) {
            timelineRange.max = maxIndex;
            timelineRange.value = this.currentMonthIndex;
        }

        // Update progress bar
        const progressEl = document.getElementById('map2TimelineProgress');
        if (progressEl) {
            const progress = (this.currentMonthIndex / maxIndex) * 100;
            progressEl.style.width = `${progress}%`;
        }

        // Show the month layer
        if (typeof showMonth === 'function') {
            showMonth(this.activeLayerType, this.currentMonthIndex);
        }
    },

    createMonthMarkers: function() {
        const container = document.getElementById('map2TimelineMarkers');
        if (!container) return;

        container.innerHTML = '';
        const months = ['Jan', 'Feb', 'Mar'];
        const maxIndex = months.length - 1;

        months.forEach((month, index) => {
            const position = (index / maxIndex) * 100;

            const marker = document.createElement('div');
            marker.style.cssText = `
                position: absolute;
                left: ${position}%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: 2px;
                height: 16px;
                background: rgba(0, 212, 255, 0.5);
            `;
            container.appendChild(marker);

            const label = document.createElement('div');
            label.textContent = month;
            label.style.cssText = `
                position: absolute;
                left: ${position}%;
                top: -25px;
                transform: translateX(-50%);
                font-size: 12px;
                color: #67e8f9;
                font-weight: 600;
            `;
            container.appendChild(label);
        });

        console.log('📍 Month markers created (Jan-Mar)');
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => Map2Controls.init(), 1000);
    });
} else {
    setTimeout(() => Map2Controls.init(), 1000);
}

console.log('✅ Map 2 Controls Ready - Temperature & Precipitation');



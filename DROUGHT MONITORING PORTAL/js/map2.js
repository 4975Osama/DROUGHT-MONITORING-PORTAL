// ========================================
// MAP 2 - TEMPERATURE & PRECIPITATION LAYERS
// ========================================

const MAP2_CONFIG = {
    baseUrl: 'http://172.18.1.104:8080/geoserver',
    workspace: 'DROUGHT',
    version: '1.3.0',
    format: 'image/png',
    transparent: true,
    srs: 'EPSG:3857',
    bounds: [-180, -90, 180, 90]
};

// Temperature Layers (Jan-March 2026)
const TEMPERATURE_LAYERS = [
    { month: 'January', monthNum: 1, layer: 'tem_jan26', date: '2026-01-01' },
    { month: 'February', monthNum: 2, layer: 'tem_feb26', date: '2026-02-01' },
    { month: 'March', monthNum: 3, layer: 'tem_march26', date: '2026-03-01' }
];

// Precipitation Layers (Jan-March 2026)
const PRECIPITATION_LAYERS = [
    { month: 'January', monthNum: 1, layer: 'pr_jan26', date: '2026-01-01' },
    { month: 'February', monthNum: 2, layer: 'pr_feb26', date: '2026-02-01' },
    { month: 'March', monthNum: 3, layer: 'pr_march26', date: '2026-03-01' }
];

// Layer Types
const LAYER_TYPES = {
    TEMPERATURE: 'temperature',
    PRECIPITATION: 'precipitation'
};

// State Management
let map2Ready = false;
let currentLayerType = null; // 'temperature' or 'precipitation'
let currentVisibleMonthIndex = null;
let isRestoringLayers = false;

const layerStatus = {
    temperature: {
        added: new Set(),
        tilesLoaded: new Set(),
        fullyLoaded: false
    },
    precipitation: {
        added: new Set(),
        tilesLoaded: new Set(),
        fullyLoaded: false
    }
};

// ========================================
// INITIALIZE MAP 2
// ========================================
function initializeMap2() {
    console.log('🗺️ Initializing Map 2 (Temperature & Precipitation)...');
    
    try {
        AppState.maps.map2 = new mapboxgl.Map({
            container: 'map2',
            style: 'mapbox://styles/mapbox/satellite-streets-v12',
            center: [69.3451, 30.3753],
            zoom: 4,
            pitch: 0,
            bearing: 0,
            attributionControl: false,
            fadeDuration: 0,
            crossSourceCollisions: false,
            refreshExpiredTiles: false,
            maxTileCacheSize: 1000
        });
        
        AppState.maps.map2.addControl(new mapboxgl.NavigationControl(), 'top-right');
        AppState.maps.map2.addControl(new mapboxgl.FullscreenControl(), 'top-right');
        AppState.maps.map2.addControl(new mapboxgl.AttributionControl({ compact: true }));
        
        AppState.maps.map2.on('load', () => {
            console.log('✅ Map 2 loaded');
            map2Ready = true;
            testGeoServerConnection();
        });
        
        // Handle basemap changes
        AppState.maps.map2.on('style.load', () => {
            if (!map2Ready) return;
            console.log('🎨 Basemap changed - restoring layers...');
            isRestoringLayers = true;
            restoreLayersAfterBasemapChange();
        });
        
        AppState.maps.map2.on('error', (e) => {
            console.error('❌ Map 2 error:', e.error);
        });
        
    } catch (error) {
        console.error('❌ Failed to initialize Map 2:', error);
    }
}

// ========================================
// RESTORE LAYERS AFTER BASEMAP CHANGE
// ========================================
function restoreLayersAfterBasemapChange() {
    const previousLayerType = currentLayerType;
    const previousVisibleMonth = currentVisibleMonthIndex;
    
    if (!previousLayerType) {
        console.log('   No layers to restore');
        isRestoringLayers = false;
        return;
    }
    
    console.log(`   Restoring ${previousLayerType} layers...`);
    
    // Reset status for current type
    layerStatus[previousLayerType].added.clear();
    layerStatus[previousLayerType].tilesLoaded.clear();
    
    setTimeout(() => {
        const layers = previousLayerType === LAYER_TYPES.TEMPERATURE ? TEMPERATURE_LAYERS : PRECIPITATION_LAYERS;
        
        for (let i = 0; i < layers.length; i++) {
            addLayerSource(previousLayerType, i);
        }
        
        if (previousVisibleMonth !== null) {
            setTimeout(() => {
                showMonth(previousLayerType, previousVisibleMonth);
                console.log(`✅ Layers restored - showing ${layers[previousVisibleMonth].month}`);
                isRestoringLayers = false;
            }, 500);
        } else {
            isRestoringLayers = false;
        }
        
        layerStatus[previousLayerType].fullyLoaded = true;
    }, 300);
}

// ========================================
// BUILD WMS URL
// ========================================
function buildWMSUrl(layerId) {
    return `${MAP2_CONFIG.baseUrl}/${MAP2_CONFIG.workspace}/wms?` +
        `service=WMS&` +
        `version=${MAP2_CONFIG.version}&` +
        `request=GetMap&` +
        `layers=${MAP2_CONFIG.workspace}:${layerId}&` +
        `bbox={bbox-epsg-3857}&` +
        `width=256&` +
        `height=256&` +
        `srs=${MAP2_CONFIG.srs}&` +
        `transparent=${MAP2_CONFIG.transparent}&` +
        `styles=&` +
        `format=${MAP2_CONFIG.format}`;
}

// ========================================
// LOAD ALL LAYERS FOR A TYPE
// ========================================
function loadAllLayers(layerType, progressCallback) {
    return new Promise((resolve, reject) => {
        const layers = layerType === LAYER_TYPES.TEMPERATURE ? TEMPERATURE_LAYERS : PRECIPITATION_LAYERS;
        const typeName = layerType === LAYER_TYPES.TEMPERATURE ? 'Temperature' : 'Precipitation';
        
        console.log(`📦 LOADING ${layers.length} ${typeName.toUpperCase()} LAYERS`);
        
        if (!map2Ready || !AppState.maps.map2.isStyleLoaded()) {
            reject('Map not ready');
            return;
        }
        
        if (layerStatus[layerType].fullyLoaded && !isRestoringLayers) {
            console.log(`✅ ${typeName} layers already loaded - using cache`);
            resolve();
            return;
        }
        
        const map = AppState.maps.map2;
        
        // STEP 1: Add all layer sources
        console.log(`STEP 1: Adding ${layers.length} ${typeName} layer sources...`);
        for (let i = 0; i < layers.length; i++) {
            addLayerSource(layerType, i);
            if (progressCallback) {
                progressCallback(i + 1, layers.length, `Adding ${typeName} layers`, 'step1');
            }
        }
        
        // STEP 2: Force tile loading
        console.log('STEP 2: Loading tiles for each layer...');
        let currentIndex = 0;
        
        const loadTilesForLayer = () => {
            if (currentIndex >= layers.length) {
                console.log('STEP 3: Verifying all tiles loaded...');
                verifyAllTiles(layerType, progressCallback).then(() => {
                    layerStatus[layerType].fullyLoaded = true;
                    console.log(`✅ ALL ${typeName.toUpperCase()} LAYERS LOADED!`);
                    resolve();
                });
                return;
            }
            
            const layerId = `layer-${layerType}-${currentIndex}`;
            
            // Hide all layers of this type
            for (let i = 0; i < layers.length; i++) {
                const lid = `layer-${layerType}-${i}`;
                if (map.getLayer(lid)) {
                    map.setLayoutProperty(lid, 'visibility', 'none');
                }
            }
            
            // Show current
            if (map.getLayer(layerId)) {
                map.setLayoutProperty(layerId, 'visibility', 'visible');
                map.triggerRepaint();
                
                const monthName = layers[currentIndex].month;
                console.log(`   Loading tiles: ${monthName} (${currentIndex + 1}/${layers.length})`);
                
                if (progressCallback) {
                    progressCallback(currentIndex + 1, layers.length, `Loading ${monthName} tiles`, 'step2');
                }
            }
            
            currentIndex++;
            setTimeout(loadTilesForLayer, 1500);
        };
        
        setTimeout(loadTilesForLayer, 500);
    });
}

// ========================================
// ADD LAYER SOURCE
// ========================================
function addLayerSource(layerType, index) {
    const map = AppState.maps.map2;
    const layers = layerType === LAYER_TYPES.TEMPERATURE ? TEMPERATURE_LAYERS : PRECIPITATION_LAYERS;
    const monthData = layers[index];
    const sourceId = `source-${layerType}-${index}`;
    const layerId = `layer-${layerType}-${index}`;
    
    if (layerStatus[layerType].added.has(sourceId) && map.getSource(sourceId)) {
        return true;
    }
    
    try {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
        
        const wmsUrl = buildWMSUrl(monthData.layer);
        
        map.addSource(sourceId, {
            type: 'raster',
            tiles: [wmsUrl],
            tileSize: 256,
            scheme: 'xyz',
            bounds: MAP2_CONFIG.bounds,
            minzoom: 0,
            maxzoom: 18
        });
        
        map.addLayer({
            id: layerId,
            type: 'raster',
            source: sourceId,
            paint: {
                'raster-opacity': 0.75,
                'raster-fade-duration': 0,
                'raster-resampling': 'nearest'
            },
            layout: {
                visibility: 'none'
            }
        });
        
        layerStatus[layerType].added.add(sourceId);
        console.log(`   ✓ Added: ${layerType} - ${monthData.month}`);
        return true;
        
    } catch (error) {
        console.error(`   ✗ Failed: ${layerType} - ${monthData.month}`, error);
        return false;
    }
}

// ========================================
// VERIFY ALL TILES LOADED
// ========================================
function verifyAllTiles(layerType, progressCallback) {
    return new Promise((resolve) => {
        const map = AppState.maps.map2;
        const layers = layerType === LAYER_TYPES.TEMPERATURE ? TEMPERATURE_LAYERS : PRECIPITATION_LAYERS;
        let attempts = 0;
        const maxAttempts = 30;
        
        const checkTiles = () => {
            attempts++;
            let loadedCount = 0;
            
            for (let i = 0; i < layers.length; i++) {
                const sourceId = `source-${layerType}-${i}`;
                const source = map.getSource(sourceId);
                
                if (source) {
                    if (source.loaded && source.loaded()) {
                        layerStatus[layerType].tilesLoaded.add(sourceId);
                        loadedCount++;
                    }
                }
            }
            
            console.log(`   Verification attempt ${attempts}: ${loadedCount}/${layers.length} tiles loaded`);
            
            if (progressCallback) {
                progressCallback(loadedCount, layers.length, 'Verifying tiles', 'step3');
            }
            
            if (loadedCount === layers.length || attempts >= maxAttempts) {
                if (loadedCount === layers.length) {
                    console.log('   ✓ All tiles verified!');
                } else {
                    console.warn(`   ⚠ Proceeding with ${loadedCount}/${layers.length} tiles`);
                }
                resolve();
            } else {
                setTimeout(checkTiles, 400);
            }
        };
        
        setTimeout(checkTiles, 500);
    });
}

// ========================================
// SHOW SPECIFIC MONTH
// ========================================
function showMonth(layerType, monthIndex) {
    if (!layerStatus[layerType].fullyLoaded && !isRestoringLayers) {
        console.warn('⚠️ Layers not fully loaded yet');
        return;
    }
    
    const map = AppState.maps.map2;
    if (!map) return;
    
    currentLayerType = layerType;
    currentVisibleMonthIndex = monthIndex;
    
    const layers = layerType === LAYER_TYPES.TEMPERATURE ? TEMPERATURE_LAYERS : PRECIPITATION_LAYERS;
    
    requestAnimationFrame(() => {
        // Hide ALL layers (both types)
        hideAllLayersOfType(LAYER_TYPES.TEMPERATURE);
        hideAllLayersOfType(LAYER_TYPES.PRECIPITATION);
        
        // Show selected layer
        const selectedLayerId = `layer-${layerType}-${monthIndex}`;
        if (map.getLayer(selectedLayerId)) {
            map.setLayoutProperty(selectedLayerId, 'visibility', 'visible');
        }
        
        // Update info display
        updateInfoDisplay(layerType, monthIndex);
    });
}

// ========================================
// HIDE LAYERS OF A SPECIFIC TYPE
// ========================================
function hideAllLayersOfType(layerType) {
    const map = AppState.maps.map2;
    if (!map) return;
    
    const layers = layerType === LAYER_TYPES.TEMPERATURE ? TEMPERATURE_LAYERS : PRECIPITATION_LAYERS;
    
    for (let i = 0; i < layers.length; i++) {
        const layerId = `layer-${layerType}-${i}`;
        if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, 'visibility', 'none');
        }
    }
}

// ========================================
// HIDE ALL LAYERS
// ========================================
function hideAllLayers() {
    hideAllLayersOfType(LAYER_TYPES.TEMPERATURE);
    hideAllLayersOfType(LAYER_TYPES.PRECIPITATION);
    
    currentLayerType = null;
    currentVisibleMonthIndex = null;
    
    // Remove info display
    const infoDiv = document.getElementById('map2-info-display');
    if (infoDiv) infoDiv.remove();
}

// ========================================
// UPDATE INFO DISPLAY
// ========================================
function updateInfoDisplay(layerType, monthIndex) {
    const layers = layerType === LAYER_TYPES.TEMPERATURE ? TEMPERATURE_LAYERS : PRECIPITATION_LAYERS;
    const monthData = layers[monthIndex];
    const typeName = layerType === LAYER_TYPES.TEMPERATURE ? 'Temperature' : 'Precipitation';
    const icon = layerType === LAYER_TYPES.TEMPERATURE ? 'fa-temperature-high' : 'fa-cloud-rain';
    const color = layerType === LAYER_TYPES.TEMPERATURE ? '#ff6b6b' : '#00d4ff';
    
    const infoId = 'map2-info-display';
    let infoDiv = document.getElementById(infoId);
    
    if (!infoDiv) {
        infoDiv = document.createElement('div');
        infoDiv.id = infoId;
        infoDiv.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(10, 14, 39, 0.95);
            backdrop-filter: blur(20px);
            padding: 15px 20px;
            border-radius: 12px;
            border: 2px solid ${color}40;
            color: #f8fafc;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            z-index: 500;
            box-shadow: 0 8px 32px ${color}30;
            min-width: 250px;
        `;
        document.getElementById('map2').appendChild(infoDiv);
    }
    
    infoDiv.style.borderColor = `${color}40`;
    infoDiv.style.boxShadow = `0 8px 32px ${color}30`;
    
    infoDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
            <i class="fas ${icon}" style="color: ${color}; font-size: 20px;"></i>
            <strong style="font-size: 17px; color: ${color};">Monthly ${typeName}</strong>
        </div>
        <div style="margin-left: 30px; line-height: 1.7;">
            <div style="color: #67e8f9; font-size: 15px;">
                <strong style="color: ${color};">Month:</strong> ${monthData.month} 2026
            </div>
            <div style="color: #67e8f9; font-size: 14px;">
                <strong style="color: ${color};">Date:</strong> ${monthData.date}
            </div>
            <div style="color: #67e8f9; font-size: 14px;">
                <strong style="color: ${color};">Layer:</strong> ${monthData.layer}
            </div>
            <div style="color: #4caf50; font-size: 12px; margin-top: 8px;">
                <i class="fas fa-check-circle"></i> Cached - Instant Playback
            </div>
        </div>
    `;
}

// ========================================
// TEST GEOSERVER CONNECTION
// ========================================
function testGeoServerConnection() {
    console.log('🧪 Testing GeoServer connection...');
    
    const testUrl = `${MAP2_CONFIG.baseUrl}/${MAP2_CONFIG.workspace}/wms?` +
        `service=WMS&version=${MAP2_CONFIG.version}&request=GetCapabilities`;
    
    fetch(testUrl)
        .then(response => response.ok ? response.text() : Promise.reject(`HTTP ${response.status}`))
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, 'text/xml');
            const layers = xmlDoc.getElementsByTagName('Layer');
            
            let tempCount = 0;
            let precCount = 0;
            
            for (let layer of layers) {
                const nameEl = layer.getElementsByTagName('Name')[0];
                if (nameEl) {
                    const name = nameEl.textContent;
                    if (name.includes('tem_')) tempCount++;
                    if (name.includes('pr_')) precCount++;
                }
            }
            
            console.log(`✅ GeoServer connected`);
            console.log(`   Temperature layers: ${tempCount}`);
            console.log(`   Precipitation layers: ${precCount}`);
        })
        .catch(error => console.error('❌ GeoServer error:', error));
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function isMap2Ready() {
    return map2Ready && AppState.maps.map2?.isStyleLoaded();
}

function areLayersLoaded(layerType) {
    return layerStatus[layerType].fullyLoaded;
}

function getCurrentLayerType() {
    return currentLayerType;
}

function getCurrentVisibleMonth() {
    return currentVisibleMonthIndex;
}

function getLayerCount(layerType) {
    return layerType === LAYER_TYPES.TEMPERATURE ? TEMPERATURE_LAYERS.length : PRECIPITATION_LAYERS.length;
}

function getLayerData(layerType, index) {
    const layers = layerType === LAYER_TYPES.TEMPERATURE ? TEMPERATURE_LAYERS : PRECIPITATION_LAYERS;
    return layers[index];
}

function clearLayerCache(layerType) {
    layerStatus[layerType].added.clear();
    layerStatus[layerType].tilesLoaded.clear();
    layerStatus[layerType].fullyLoaded = false;
    console.log(`🗑️ ${layerType} cache cleared`);
}

// ========================================
// DEBUG TOOLS
// ========================================
window.debugMap2 = {
    isReady: isMap2Ready,
    layersLoaded: areLayersLoaded,
    showMonth: showMonth,
    hideAll: hideAllLayers,
    clearCache: clearLayerCache,
    currentType: getCurrentLayerType,
    currentMonth: getCurrentVisibleMonth,
    LAYER_TYPES: LAYER_TYPES,
    status: () => {
        console.log('=== Map 2 Status ===');
        console.log('Map Ready:', map2Ready);
        console.log('Current Layer Type:', currentLayerType);
        console.log('Current Month Index:', currentVisibleMonthIndex);
        console.log('Temperature Loaded:', layerStatus.temperature.fullyLoaded);
        console.log('Precipitation Loaded:', layerStatus.precipitation.fullyLoaded);
    }
};

console.log('✅ Map 2 Module Loaded - Temperature & Precipitation (Jan-Mar 2026)');
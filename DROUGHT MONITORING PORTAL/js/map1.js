// ========================================
// MAP 1 - DROUGHT INDEX MAP - WITH PDSI LAYER
// ========================================

// GeoServer Configuration
const GEOSERVER_CONFIG = {
    baseUrl: 'http://172.18.1.104:8080/geoserver/gwc/service/wms',
    fallbackUrl: 'http://172.18.1.104:8080/geoserver/DROUGHT/wms',
    workspace: 'DROUGHT',
    version: '1.1.0',
    format: 'image/png',
    transparent: true,
    srs: 'EPSG:3857',
    tiled: true,
    bounds: [60.872, 23.634, 77.840, 37.084]
};

// Available layers structure
const AVAILABLE_LAYERS = {
    'ndvi': {
        '1999-2002': {
            'karif': [
                { year: 1999, layer: 'NDVI_1999' },
                { year: 2000, layer: 'NDVI_2000' },
                { year: 2001, layer: 'NDVI_2001' },
                { year: 2002, layer: 'NDVI_2002' }
            ],
            'rabi': [
                { year: 1999, layer: 'R_NDVI_1999' },
                { year: 2000, layer: 'R_NDVI_2000' },
                { year: 2001, layer: 'R_NDVI_2001' },
                { year: 2002, layer: 'R_NDVI_2002' }
            ]
        },
        '2020-2025': {
            'karif': [
                { year: 2020, layer: 'NDVI_2020' },
                { year: 2021, layer: 'NDVI_2021' },
                { year: 2022, layer: 'NDVI_2022' },
                { year: 2023, layer: 'NDVI_2023' },
                { year: 2024, layer: 'NDVI_2024' },
                { year: 2025, layer: 'NDVI_2025' }
            ],
            'rabi': [
                { year: 2020, layer: 'R_NDVI_2020' },
                { year: 2021, layer: 'R_NDVI_2021' },
                { year: 2022, layer: 'R_NDVI_2022' },
                { year: 2023, layer: 'R_NDVI_2023' },
                { year: 2024, layer: 'R_NDVI_2024' }, 
                { year: 2025, layer: 'R_NDVI_2025' }
            ]
        }
    },
    'vci': {
        '1999-2002': {
            'karif': [
                { year: 1999, layer: 'VCI_1999' },
                { year: 2000, layer: 'VCI_2000' },
                { year: 2001, layer: 'VCI_2001' },
                { year: 2002, layer: 'VCI_2002' }
            ],
            'rabi': [
                { year: 1999, layer: 'VCI_R_1999' },
                { year: 2000, layer: 'VCI_R_2000' },
                { year: 2001, layer: 'VCI_R_2001' },
                { year: 2002, layer: 'VCI_R_2002' }
            ]
        },
        '2020-2025': {
            'karif': [
                { year: 2020, layer: 'VCI_2020' },
                { year: 2021, layer: 'VCI_2021' },
                { year: 2022, layer: 'VCI_2022' },
                { year: 2023, layer: 'VCI_2023' },
                { year: 2024, layer: 'VCI_2024' },
                { year: 2025, layer: 'VCI_2025' }
            ],
            'rabi': [
                { year: 2020, layer: 'VCI_2020' },
                { year: 2021, layer: 'VCI_2021' },
                { year: 2022, layer: 'VCI_2022' },
                { year: 2023, layer: 'VCI_2023' },
                { year: 2024, layer: 'VCI_2024' },
                { year: 2025, layer: 'VCI_2025' }
            ]
        }
    },
    'spi': {
        '1999-2002': {
            'karif': [
                { year: 1999, layer: 'SPI_1999' },
                { year: 2000, layer: 'SPI_2000' },
                { year: 2001, layer: 'SPI_2001' },
                { year: 2002, layer: 'SPI_2002' }
            ],
            'rabi': [
                { year: 1999, layer: 'R_SPI_1999' },
                { year: 2000, layer: 'R_SPI_2000' },
                { year: 2001, layer: 'R_SPI_2001' },
                { year: 2002, layer: 'R_SPI_2002' }
            ]
        },
        '2020-2025': {
            'karif': [
                { year: 2020, layer: 'SPI_2020' },
                { year: 2021, layer: 'SPI_2021' },
                { year: 2022, layer: 'SPI_2022' },
                { year: 2023, layer: 'SPI_2023' },
                { year: 2024, layer: 'SPI_2024' },
                { year: 2025, layer: 'SPI_2025' }
            ],
            'rabi': [
                { year: 2020, layer: 'SPI_R_2020' },
                { year: 2021, layer: 'SPI_R_2021' },
                { year: 2022, layer: 'SPI_R_2022' },
                { year: 2023, layer: 'SPI_R_2023' },
                { year: 2024, layer: 'SPI_R_2024' },
                { year: 2025, layer: 'SPI_R_2025' }
            ]
        }
    },
    'tci': {
        '1999-2002': {
            'karif': [
                { year: 1999, layer: 'TCI_1999' },
                { year: 2000, layer: 'TCI_2000' },
                { year: 2001, layer: 'TCI_2001' },
                { year: 2002, layer: 'TCI_2002' }
            ],
            'rabi': [
                { year: 1999, layer: 'TCI_R_1999' },
                { year: 2000, layer: 'TCI_R_2000' },
                { year: 2001, layer: 'TCI_R_2001' },
                { year: 2002, layer: 'TCI_R_2002' }
            ]
        },
        '2020-2025': {
            'karif': [
                { year: 2020, layer: 'TCI_2020' },
                { year: 2021, layer: 'TCI_2021' },
                { year: 2022, layer: 'TCI_2022' },
                { year: 2023, layer: 'TCI_2023' },
                { year: 2024, layer: 'TCI_2024' },
                { year: 2025, layer: 'TCI_2025' }
            ],
            'rabi': [
                { year: 2020, layer: 'R_TCI_2020' },
                { year: 2021, layer: 'R_TCI_2021' },
                { year: 2022, layer: 'R_TCI_2022' },
                { year: 2023, layer: 'R_TCI_2023' },
                { year: 2024, layer: 'R_TCI_2024' },
                { year: 2025, layer: 'R_TCI_2025' }
            ]
        }
    }
};

// Track loaded sources
const loadedSources = new Set();
const loadingMetrics = {};

// PDSI layer state
let pdsiLayerActive = false;

// District layer state
let districtLayerActive = false;

// ========================================
// INITIALIZE MAP
// ========================================
function initializeMap1() {
    console.log('🗺️  Initializing Map 1...');

    try {
        AppState.maps.map1 = new mapboxgl.Map({
            container: 'map1',
            style: 'mapbox://styles/mapbox/satellite-streets-v12',
            center: [69.3451, 30.3753],
            zoom: 4,
            pitch: 0,
            bearing: 0,
            attributionControl: false
        });

        AppState.maps.map1.addControl(new mapboxgl.NavigationControl(), 'top-right');
        AppState.maps.map1.addControl(new mapboxgl.FullscreenControl(), 'top-right');
        AppState.maps.map1.addControl(new mapboxgl.AttributionControl({ compact: true }));

        AppState.maps.map1.on('load', () => {
            console.log('✅ Map 1 loaded successfully');

            if (typeof hideMapLoading === 'function') {
                hideMapLoading('map1');
            }

            testGeoServerConnection();
            initializePerformanceMonitoring();
            initializePDSIToggle();
            initializeDistrictToggle();
        });

        AppState.maps.map1.on('error', (e) => {
            console.error('❌ Map 1 error:', e.error);
        });

        AppState.maps.map1.on('dataloading', (e) => {
            if (e.sourceId && e.sourceId.startsWith('geoserver-')) {
                if (!loadingMetrics[e.sourceId]) {
                    loadingMetrics[e.sourceId] = { startTime: Date.now() };
                }
            }
        });

        AppState.maps.map1.on('data', (e) => {
            if (e.sourceId && e.sourceId.startsWith('geoserver-') && e.isSourceLoaded) {
                if (loadingMetrics[e.sourceId] && loadingMetrics[e.sourceId].startTime) {
                    const loadTime = Date.now() - loadingMetrics[e.sourceId].startTime;
                    console.log(`⏱️  ${e.sourceId} loaded in ${loadTime}ms`);
                    
                    if (loadTime > 3000) {
                        console.warn(`⚠️  SLOW LOADING: ${e.sourceId} took ${loadTime}ms`);
                    }
                    
                    delete loadingMetrics[e.sourceId];
                }
            }
        });

    } catch (error) {
        console.error('❌ Failed to initialize Map 1:', error);
        if (typeof hideMapLoading === 'function') {
            hideMapLoading('map1');
        }
    }
}

// ========================================
// BUILD WMS URL
// ========================================
function buildWMSUrl(layerName, useCache = true) {
    const baseUrl = useCache ? GEOSERVER_CONFIG.baseUrl : GEOSERVER_CONFIG.fallbackUrl;
    
    let url = `${baseUrl}?` +
        `service=WMS&` +
        `version=${GEOSERVER_CONFIG.version}&` +
        `request=GetMap&` +
        `layers=${GEOSERVER_CONFIG.workspace}:${layerName}&` +
        `bbox={bbox-epsg-3857}&` +
        `width=256&` +
        `height=256&` +
        `srs=${GEOSERVER_CONFIG.srs}&` +
        `format=${GEOSERVER_CONFIG.format}&` +
        `transparent=${GEOSERVER_CONFIG.transparent}&` +
        `styles=`;

    if (GEOSERVER_CONFIG.tiled) {
        url += `&tiled=true`;
    }

    return url;
}

// ========================================
// LAZY LOADING
// ========================================
function addDroughtLayerSource(index, period, season, year) {
    const map = AppState.maps.map1;
    const sourceId = `geoserver-${index}-${period}-${season}-${year}`;
    const layerId = `layer-${index}-${period}-${season}-${year}`;

    if (loadedSources.has(sourceId)) {
        console.log(`♻️  Using cached source: ${sourceId}`);
        return { sourceId, layerId, cached: true };
    }

    const layersArray = AVAILABLE_LAYERS[index]?.[period]?.[season];
    if (!layersArray) {
        console.error('❌ No layers found for:', { index, period, season });
        return null;
    }

    const layerData = layersArray.find(l => l.year === year);
    if (!layerData) {
        console.error('❌ No layer found for year:', year);
        return null;
    }

    console.log(`🔄 Loading new source: ${sourceId}`);

    try {
        const wmsUrl = buildWMSUrl(layerData.layer);

        map.addSource(sourceId, {
            type: 'raster',
            tiles: [wmsUrl],
            tileSize: 256,
            scheme: 'xyz',
            bounds: GEOSERVER_CONFIG.bounds,
            minzoom: 0,
            maxzoom: 18
        });

        map.addLayer({
            id: layerId,
            type: 'raster',
            source: sourceId,
            paint: {
                'raster-opacity': 0.8,
                'raster-fade-duration': 300,
                'raster-resampling': 'linear'
            },
            layout: {
                visibility: 'none'
            }
        });

        loadedSources.add(sourceId);
        console.log(`✅ Added: ${layerData.layer}`);

        return { sourceId, layerId, layerName: layerData.layer, cached: false };

    } catch (error) {
        console.error(`❌ Failed to add source ${sourceId}:`, error);
        return null;
    }
}

// ========================================
// UPDATE MAP DATA
// ========================================
function updateMap1Data(yearData) {
    console.log('═══════════════════════════════════════');
    console.log('🔄 UPDATE MAP 1 CALLED');
    console.log('   Year:', yearData.year);
    console.log('   Season:', yearData.season);
    console.log('   Index:', yearData.index);
    console.log('═══════════════════════════════════════');

    if (!AppState.maps.map1) {
        console.error('❌ Map 1 not available');
        return;
    }

    if (!yearData || !yearData.year || !yearData.season || !yearData.index) {
        console.error('❌ Invalid yearData:', yearData);
        return;
    }

    const { year, season, index } = yearData;

    let period;
    if (year >= 1999 && year <= 2002) {
        period = '1999-2002';
    } else if (year >= 2020 && year <= 2025) {
        period = '2020-2025';
    } else {
        console.error('❌ Year not in valid range:', year);
        return;
    }

    console.log('📍 Determined period:', period);
    console.log('🙈 Hiding all layers...');
    hideAllDroughtLayers();

    const result = addDroughtLayerSource(index, period, season, year);

    if (!result) {
        console.error('❌ Failed to load layer source');
        return;
    }

    const { layerId, layerName, cached } = result;

    console.log('👁️  Showing layer:', layerId);
    AppState.maps.map1.setLayoutProperty(layerId, 'visibility', 'visible');

    const visibility = AppState.maps.map1.getLayoutProperty(layerId, 'visibility');
    console.log('✓ Layer visibility set to:', visibility);

    showLayerInfo(layerName, year, season, index, cached);
    
    // Keep special layers on top
    ensureSpecialLayersOnTop();

    AppState.maps.map1.triggerRepaint();

    console.log('✅ Map update complete');
    console.log('═══════════════════════════════════════');
}

// ========================================
// HIDE ALL DROUGHT LAYERS
// ========================================
function hideAllDroughtLayers() {
    const map = AppState.maps.map1;
    if (!map) return;

    const layers = map.getStyle().layers;
    let hiddenCount = 0;

    layers.forEach(layer => {
        if (layer.id.startsWith('layer-')) {
            map.setLayoutProperty(layer.id, 'visibility', 'none');
            hiddenCount++;
        }
    });

    console.log(`   Hidden ${hiddenCount} layers`);
}

// ========================================
// SHOW LAYER INFO
// ========================================
function showLayerInfo(layerName, year, season, index, cached) {
    console.log(`📊 Layer Info: ${layerName} | Year: ${year} | Season: ${season} | Index: ${index} | Cached: ${cached}`);
}

// ========================================
// PDSI LAYER MANAGEMENT
// ========================================
function initializePDSIToggle() {
    console.log('🔘 Initializing PDSI toggle button...');
    
    const toggleBtn = document.getElementById('btnPDSIToggle');
    if (!toggleBtn) {
        console.warn('⚠️ PDSI toggle button not found');
        return;
    }

    toggleBtn.addEventListener('click', () => {
        togglePDSILayer();
    });

    console.log('✅ PDSI toggle initialized');
}

function togglePDSILayer() {
    if (pdsiLayerActive) {
        removePDSILayer();
    } else {
        addPDSILayer();
    }
}

function addPDSILayer() {
    if (!AppState || !AppState.maps || !AppState.maps.map1) {
        console.warn('⚠️ Map1 not ready yet');
        return;
    }
    
    const map = AppState.maps.map1;
    const sourceId = 'pdsi-layer-source';
    const layerId = 'pdsi-layer';
    
    console.log('🔄 Adding PDSI layer...');
    
    // Remove if already exists
    try {
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
        }
        if (map.getSource(sourceId)) {
            map.removeSource(sourceId);
        }
    } catch (e) {
        console.warn('⚠️ Warning during cleanup:', e.message);
    }
    
    // Build WMS URL for PDSI
    const wmsUrl = buildWMSUrl('PDSI');
    
    console.log('📡 PDSI WMS URL:', wmsUrl);
    
    try {
        map.addSource(sourceId, {
            type: 'raster',
            tiles: [wmsUrl],
            tileSize: 256,
            scheme: 'xyz',
            bounds: GEOSERVER_CONFIG.bounds,
            minzoom: 0,
            maxzoom: 18
        });
        
        map.addLayer({
            id: layerId,
            type: 'raster',
            source: sourceId,
            paint: {
                'raster-opacity': 0.9,
                'raster-fade-duration': 300,
                'raster-resampling': 'linear'
            }
        });
        
        // Move to top
        ensureSpecialLayersOnTop();
        
        // Update button state
        const toggleBtn = document.getElementById('btnPDSIToggle');
        if (toggleBtn) {
            toggleBtn.classList.add('active');
        }
        
        pdsiLayerActive = true;
        
        console.log('✅ PDSI layer added successfully');
        console.log('   Layer ID:', layerId);
        console.log('   Source ID:', sourceId);
        console.log('   Type: Raster WMS');
        
        // Show info notification
        showPDSIInfo(true);
        
    } catch (error) {
        console.error('❌ Error adding PDSI layer:', error);
    }
}

function removePDSILayer() {
    if (!AppState || !AppState.maps || !AppState.maps.map1) return;
    
    const map = AppState.maps.map1;
    const layerId = 'pdsi-layer';
    const sourceId = 'pdsi-layer-source';
    
    try {
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
        }
        if (map.getSource(sourceId)) {
            map.removeSource(sourceId);
        }
        
        // Update button state
        const toggleBtn = document.getElementById('btnPDSIToggle');
        if (toggleBtn) {
            toggleBtn.classList.remove('active');
        }
        
        pdsiLayerActive = false;
        
        console.log('✅ PDSI layer removed successfully');
        
        // Hide info notification
        showPDSIInfo(false);
        
    } catch (error) {
        console.error('❌ Error removing PDSI layer:', error);
    }
}

function showPDSIInfo(show) {
    const infoId = 'pdsi-info-display';
    let infoDiv = document.getElementById(infoId);
    
    if (!show) {
        if (infoDiv) infoDiv.remove();
        return;
    }
    
    if (!infoDiv) {
        infoDiv = document.createElement('div');
        infoDiv.id = infoId;
        infoDiv.style.cssText = `
            position: absolute;
            bottom: 80px;
            left: 10px;
            background: rgba(10, 14, 39, 0.95);
            backdrop-filter: blur(20px);
            padding: 12px 18px;
            border-radius: 10px;
            border: 2px solid rgba(139, 92, 246, 0.5);
            color: #f8fafc;
            font-family: 'Inter', sans-serif;
            font-size: 13px;
            z-index: 500;
            box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
            min-width: 220px;
        `;
        document.getElementById('map1').appendChild(infoDiv);
    }
    
    infoDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <i class="fas fa-layer-group" style="color: #8b5cf6; font-size: 16px;"></i>
            <strong style="font-size: 15px; color: #8b5cf6;">PDSI Layer</strong>
        </div>
        <div style="margin-left: 24px; line-height: 1.5; font-size: 12px;">
            <div style="color: #a78bfa;">
                Palmer Drought Severity Index
            </div>
            <div style="color: #4ade80; margin-top: 5px;">
                <i class="fas fa-check-circle"></i> Active
            </div>
        </div>
    `;
}

// ========================================
// ENSURE SPECIAL LAYERS ON TOP
// ========================================
function ensureSpecialLayersOnTop() {
    const map = AppState.maps.map1;
    if (!map) return;
    
    // Move PDSI layer to top if it exists
    if (map.getLayer('pdsi-layer')) {
        map.moveLayer('pdsi-layer');
        console.log('📍 PDSI layer moved to top');
    }
    
    // Move blinking layer to top if it exists
    if (map.getLayer('blinking-layer')) {
        map.moveLayer('blinking-layer');
        console.log('📍 Blinking layer moved to top');
    }
    
    // Move blinking label to very top
    if (map.getLayer('blinking-layer-label')) {
        map.moveLayer('blinking-layer-label');
        console.log('📍 Blinking label layer moved to top');
    }
    
    // Move district boundary layer to top if it exists
    if (map.getLayer('district-boundary-layer')) {
        map.moveLayer('district-boundary-layer');
        console.log('📍 District boundary layer moved to top');
    }
    
    // Move district boundary label to very top (must be last for visibility)
    if (map.getLayer('district-boundary-label')) {
        map.moveLayer('district-boundary-label');
        console.log('📍 District boundary label layer moved to top');
    }
}

// ========================================
// DISTRICT BOUNDARY LAYER MANAGEMENT
// ========================================
function initializeDistrictToggle() {
    console.log('🔘 Initializing District Boundary toggle button...');
    
    const toggleBtn = document.getElementById('btnDistrictToggle');
    if (!toggleBtn) {
        console.warn('⚠️ District Boundary toggle button not found');
        return;
    }

    toggleBtn.addEventListener('click', () => {
        toggleDistrictLayer();
    });

    console.log('✅ District Boundary toggle initialized');
}

function toggleDistrictLayer() {
    if (districtLayerActive) {
        removeDistrictLayer();
    } else {
        addDistrictLayer();
    }
}

function addDistrictLayer() {
    if (!AppState || !AppState.maps || !AppState.maps.map1) {
        console.warn('⚠️ Map1 not ready yet');
        return;
    }
    
    const map1 = AppState.maps.map1;
    
    console.log('🔄 Adding District Boundary layer...');
    
    // District Boundary
    if (!map1.getSource("district-boundary")) {
        map1.addSource("district-boundary", {
            type: "geojson",
            data: "http://172.18.1.4:8080/geoserver/abdul_sattar/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=abdul_sattar:District_Boundary&outputFormat=application/json",
            generateId: true,
        });
    }

    if (!map1.getLayer("district-boundary-layer")) {
        map1.addLayer({
            id: "district-boundary-layer",
            type: "line",
            source: "district-boundary",
            layout: { visibility: "visible" },
            paint: {
                "line-color": "purple",
                "line-width": 2
            }
        });
    }

    if (!map1.getLayer("district-boundary-label")) {
        map1.addLayer({
            id: "district-boundary-label",
            type: "symbol",
            source: "district-boundary",
            minzoom: 6,
            layout: {
                visibility: "visible",
                "text-field": ["get", "DISTRICT"],
                "text-letter-spacing": 0.1,
                "text-size": 13,
                "text-offset": [0, 0],
                "text-anchor": "center",
            },
            paint: {
                "text-color": "black",
                "text-halo-color": "#ffffff",
                "text-halo-width": 1.2,
            },
        });
    }
    
    // Move to top
    ensureSpecialLayersOnTop();
    
    // Update button state
    const toggleBtn = document.getElementById('btnDistrictToggle');
    if (toggleBtn) {
        toggleBtn.classList.add('active');
    }
    
    districtLayerActive = true;
    
    console.log('✅ District Boundary layer added successfully');
    console.log('   Layers: district-boundary-layer, district-boundary-label');
    console.log('   Source: district-boundary');
}

function removeDistrictLayer() {
    if (!AppState || !AppState.maps || !AppState.maps.map1) return;
    
    const map1 = AppState.maps.map1;
    
    try {
        if (map1.getLayer("district-boundary-label")) {
            map1.removeLayer("district-boundary-label");
        }
        if (map1.getLayer("district-boundary-layer")) {
            map1.removeLayer("district-boundary-layer");
        }
        if (map1.getSource("district-boundary")) {
            map1.removeSource("district-boundary");
        }
        
        // Update button state
        const toggleBtn = document.getElementById('btnDistrictToggle');
        if (toggleBtn) {
            toggleBtn.classList.remove('active');
        }
        
        districtLayerActive = false;
        
        console.log('✅ District Boundary layer removed successfully');
        
    } catch (error) {
        console.error('❌ Error removing District Boundary layer:', error);
    }
}

// ========================================
// TEST GEOSERVER CONNECTION
// ========================================
function testGeoServerConnection() {
    console.log('🧪 Testing GeoServer connection...');

    const testUrl = `${GEOSERVER_CONFIG.fallbackUrl}?` +
        `service=WMS&` +
        `version=${GEOSERVER_CONFIG.version}&` +
        `request=GetCapabilities`;

    console.log('📡 GetCapabilities URL:', testUrl);

    fetch(testUrl)
        .then(response => {
            if (response.ok) {
                console.log('✅ GeoServer connection successful');
                return response.text();
            } else {
                console.error('❌ GeoServer response error:', response.status);
                throw new Error(`HTTP ${response.status}`);
            }
        })
        .then(data => {
            if (data) {
                console.log('📄 GeoServer capabilities loaded');

                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, 'text/xml');
                const layers = xmlDoc.getElementsByTagName('Layer');

                console.log('📋 Available Layers in GeoServer:');
                const layerNames = [];
                for (let layer of layers) {
                    const nameEl = layer.getElementsByTagName('Name')[0];
                    if (nameEl && nameEl.textContent) {
                        const name = nameEl.textContent;
                        if (name.includes('NDVI') || name.includes('VCI') || 
                            name.includes('SPI') || name.includes('TCI') || 
                            name.includes('PDSI')) {
                            layerNames.push(name);
                            console.log('   ✓', name);
                        }
                    }
                }

                if (layerNames.length === 0) {
                    console.warn('⚠️  No drought layers found in GeoServer');
                } else {
                    console.log(`✅ Found ${layerNames.length} drought layers (including PDSI)`);
                }
            }
        })
        .catch(error => {
            console.error('❌ GeoServer connection failed:', error);
        });
}

// ========================================
// PERFORMANCE MONITORING
// ========================================
function initializePerformanceMonitoring() {
    console.log('📊 Performance monitoring initialized');

    const tileLoadTimes = [];

    AppState.maps.map1.on('sourcedata', (e) => {
        if (e.sourceId && e.sourceId.startsWith('geoserver-')) {
            if (e.isSourceLoaded && !e.tile) {
                const metrics = loadingMetrics[e.sourceId];
                if (metrics && metrics.startTime) {
                    const loadTime = Date.now() - metrics.startTime;
                    tileLoadTimes.push(loadTime);

                    if (tileLoadTimes.length > 20) {
                        tileLoadTimes.shift();
                    }

                    const avg = tileLoadTimes.reduce((a, b) => a + b, 0) / tileLoadTimes.length;
                    console.log(`📈 Average load time: ${Math.round(avg)}ms (last ${tileLoadTimes.length} loads)`);
                }
            }
        }
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function listAllMapLayers() {
    if (!AppState.maps.map1) {
        console.error('Map not initialized');
        return;
    }

    const layers = AppState.maps.map1.getStyle().layers;
    const droughtLayers = layers.filter(l => l.id.startsWith('layer-'));

    console.log('📋 All drought layers:');
    droughtLayers.forEach(layer => {
        const visibility = AppState.maps.map1.getLayoutProperty(layer.id, 'visibility');
        console.log(`   ${layer.id} - ${visibility}`);
    });

    return droughtLayers;
}

function clearCache() {
    loadedSources.clear();
    console.log('🗑️  Cache cleared');
}

function getPerformanceStats() {
    console.log('📊 Performance Statistics:');
    console.log(`   Loaded sources: ${loadedSources.size}`);
    console.log(`   Available layers: ${Object.keys(AVAILABLE_LAYERS).length} indices`);
    console.log(`   PDSI Layer: ${pdsiLayerActive ? 'Active' : 'Inactive'}`);
    
    if (AppState.maps.map1) {
        const layers = AppState.maps.map1.getStyle().layers.filter(l => l.id.startsWith('layer-'));
        const visible = layers.filter(l => AppState.maps.map1.getLayoutProperty(l.id, 'visibility') === 'visible');
        console.log(`   Total layers: ${layers.length}`);
        console.log(`   Visible layers: ${visible.length}`);
    }
}

// ========================================
// BASEMAP CHANGE HANDLER
// ========================================
window.getMap1DroughtLayers = function() {
    if (!AppState.maps.map1) return { layers: [], sources: {} };
    
    const style = AppState.maps.map1.getStyle();
    const droughtLayers = [];
    const droughtSources = {};
    
    if (style && style.layers) {
        style.layers.forEach(layer => {
            if (layer.id.startsWith('layer-') || 
                layer.id === 'pdsi-layer' || 
                layer.id === 'blinking-layer' || 
                layer.id === 'blinking-layer-label') {
                droughtLayers.push(layer);
            }
        });
    }
    
    if (style && style.sources) {
        Object.keys(style.sources).forEach(sourceId => {
            if (sourceId.startsWith('geoserver-') || 
                sourceId === 'pdsi-layer-source' || 
                sourceId === 'blinking-layer-source') {
                droughtSources[sourceId] = style.sources[sourceId];
            }
        });
    }
    
    return { layers: droughtLayers, sources: droughtSources };
};

// ========================================
// BLINKING LAYER HANDLER
// ========================================
function handleSpecialLayerClick(layerName, button) {
    if (layerName === 'blinking2') {
        addBlinkingLayer();
    }
}

function addBlinkingLayer() {
    if (!AppState || !AppState.maps || !AppState.maps.map1) {
        console.warn('⚠️ Map1 not ready yet, retrying...');
        setTimeout(addBlinkingLayer, 500);
        return;
    }
    
    const map = AppState.maps.map1;
    const sourceId = 'blinking-layer-source';
    const layerId = 'blinking-layer';
    
    console.log('🔄 Adding blinking layer...');
    
    try {
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
        }
        if (map.getLayer(layerId + '-label')) {
            map.removeLayer(layerId + '-label');
        }
        if (map.getSource(sourceId)) {
            map.removeSource(sourceId);
        }
        if (map.getSource(sourceId + '-labels')) {
            map.removeSource(sourceId + '-labels');
        }
    } catch (e) {
        console.warn('⚠️ Warning during cleanup:', e.message);
    }
    
    const wmsUrl = buildWMSUrl('blinking2');
    
    console.log('📡 WMS URL:', wmsUrl);
    
    try {
        map.addSource(sourceId, {
            type: 'raster',
            tiles: [wmsUrl],
            tileSize: 256,
            scheme: 'xyz',
            bounds: GEOSERVER_CONFIG.bounds,
            minzoom: 0,
            maxzoom: 18
        });
        
        map.addLayer({
            id: layerId,
            type: 'raster',
            source: sourceId,
            paint: {
                'raster-opacity': 1,
                'raster-fade-duration': 0
            }
        });
        
        const geojsonUrl = 'http://172.18.1.104:8080/geoserver/DROUGHT/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=DROUGHT%3Ablinking2&maxFeatures=50&outputFormat=application%2Fjson';
        
        map.addSource(sourceId + '-labels', {
            type: 'geojson',
            data: geojsonUrl
        });
        
        map.addLayer({
            id: layerId + '-label',
            type: 'symbol',
            source: sourceId + '-labels',
            layout: {
                'text-field': ['get', 'District'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-size': 12,
                'text-offset': [0, 0],
                'text-anchor': 'center'
            },
            paint: {
                'text-color': '#FFFFFF',
                'text-halo-color': '#000000',
                'text-halo-width': 2,
                'text-opacity': 1
            }
        });
        
        ensureSpecialLayersOnTop();
        
        console.log('✅ Blinking layer added successfully');
        
        startBlinkingAnimation(layerId);
    } catch (error) {
        console.error('❌ Error adding blinking layer:', error);
    }
}

function removeBlinkingLayer() {
    if (!AppState || !AppState.maps || !AppState.maps.map1) return;
    
    const map = AppState.maps.map1;
    const layerId = 'blinking-layer';
    const sourceId = 'blinking-layer-source';
    
    try {
        stopBlinkingAnimation();
        
        if (map.getLayer(layerId + '-label')) {
            map.removeLayer(layerId + '-label');
        }
        if (map.getSource(sourceId + '-labels')) {
            map.removeSource(sourceId + '-labels');
        }
        
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
        }
        if (map.getSource(sourceId)) {
            map.removeSource(sourceId);
        }
        console.log('✅ Blinking layer removed successfully');
    } catch (error) {
        console.error('❌ Error removing blinking layer:', error);
    }
}

// ========================================
// BLINKING ANIMATION
// ========================================
let blinkingInterval = null;

function startBlinkingAnimation(layerId) {
    if (!AppState || !AppState.maps || !AppState.maps.map1) return;
    
    const map = AppState.maps.map1;
    let opacity = 1;
    let direction = -1;
    const step = 0.05;
    const interval = 40;
    
    if (blinkingInterval) {
        clearInterval(blinkingInterval);
    }
    
    blinkingInterval = setInterval(() => {
        try {
            if (!map.getLayer(layerId)) {
                clearInterval(blinkingInterval);
                blinkingInterval = null;
                return;
            }
            
            opacity += direction * step;
            
            if (opacity >= 1) {
                opacity = 1;
                direction = -1;
            } else if (opacity <= 0) {
                opacity = 0;
                direction = 1;
            }
            
            map.setPaintProperty(layerId, 'raster-opacity', opacity);
        } catch (error) {
            clearInterval(blinkingInterval);
            blinkingInterval = null;
        }
    }, interval);
    
    console.log('💫 Blinking animation started');
}

function stopBlinkingAnimation() {
    if (blinkingInterval) {
        clearInterval(blinkingInterval);
        blinkingInterval = null;
        console.log('⏹️  Blinking animation stopped');
    }
}

// ========================================
// DEBUG TOOLS
// ========================================
if (typeof window !== 'undefined') {
    window.debugMap1 = {
        listLayers: listAllMapLayers,
        testConnection: testGeoServerConnection,
        clearCache: clearCache,
        stats: getPerformanceStats,
        
        togglePDSI: togglePDSILayer,
        addPDSI: addPDSILayer,
        removePDSI: removePDSILayer,
        
        showLayer: (layerId) => {
            if (AppState.maps.map1.getLayer(layerId)) {
                hideAllDroughtLayers();
                AppState.maps.map1.setLayoutProperty(layerId, 'visibility', 'visible');
                console.log('✅ Showing:', layerId);
            } else {
                console.error('❌ Layer not found:', layerId);
            }
        },
        
        testUrl: (layerName = 'NDVI_1999') => {
            const url = buildWMSUrl(layerName).replace('{bbox-epsg-3857}', '7000000,3000000,9000000,5000000');
            console.log('🧪 Test URL:', url);
            window.open(url, '_blank');
        },

        testPDSI: () => {
            console.log('🧪 Testing PDSI layer...');
            const url = buildWMSUrl('PDSI').replace('{bbox-epsg-3857}', '7000000,3000000,9000000,5000000');
            console.log('PDSI Test URL:', url);
            window.open(url, '_blank');
        },

        loadedSources: () => {
            console.log('📦 Loaded sources:', Array.from(loadedSources));
        }
    };

    console.log('🛠️  Debug tools available:');
    console.log('   window.debugMap1.togglePDSI()');
    console.log('   window.debugMap1.testPDSI()');
    console.log('   window.debugMap1.stats()');
}

console.log('✅ Map 1 module loaded - WITH PDSI LAYER SUPPORT');
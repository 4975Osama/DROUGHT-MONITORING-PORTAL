// ========================================
// DROUGHT MONITORING PORTAL - COMPREHENSIVE BASEMAP EDITION
// Main JavaScript File
// ========================================

// Global State Management
const AppState = {
    currentPeriod: null,
    currentSeason: null,
    currentIndex: null,
    sliderActive: false,
    isPlaying: false,
    currentTimeIndex: 0,
    timelineData: [],
    playbackSpeed: 1,
    playbackInterval: null,
    maps: {
        map1: null,
        map2: null
    },
    currentBasemap: {
        map1: 'hybrid',
        map2: 'hybrid'
    }
};

// Comprehensive Basemap Styles Configuration
const BASEMAP_STYLES = {
    // ========================================
    // MAPBOX BASEMAPS
    // ========================================
    'hybrid': {
        name: '🌐 Satellite Hybrid',
        provider: 'Mapbox',
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        icon: 'fas fa-globe',
        category: 'satellite'
    },
    'satellite': {
        name: '🛰️ Satellite',
        provider: 'Mapbox',
        style: 'mapbox://styles/mapbox/satellite-v9',
        icon: 'fas fa-satellite',
        category: 'satellite'
    },
    'streets': {
        name: '🗺️ Streets',
        provider: 'Mapbox',
        style: 'mapbox://styles/mapbox/streets-v12',
        icon: 'fas fa-road',
        category: 'general'
    },
    'outdoors': {
        name: '🏔️ Outdoors',
        provider: 'Mapbox',
        style: 'mapbox://styles/mapbox/outdoors-v12',
        icon: 'fas fa-mountain',
        category: 'terrain'
    },
    'light': {
        name: '☀️ Light',
        provider: 'Mapbox',
        style: 'mapbox://styles/mapbox/light-v11',
        icon: 'fas fa-sun',
        category: 'general'
    },
    'dark': {
        name: '🌙 Dark',
        provider: 'Mapbox',
        style: 'mapbox://styles/mapbox/dark-v11',
        icon: 'fas fa-moon',
        category: 'general'
    },
    'navigation-day': {
        name: '🧭 Navigation Day',
        provider: 'Mapbox',
        style: 'mapbox://styles/mapbox/navigation-day-v1',
        icon: 'fas fa-compass',
        category: 'navigation'
    },
    'navigation-night': {
        name: '🌃 Navigation Night',
        provider: 'Mapbox',
        style: 'mapbox://styles/mapbox/navigation-night-v1',
        icon: 'fas fa-moon',
        category: 'navigation'
    },

    // ========================================
    // OPENSTREETMAP BASEMAPS
    // ========================================
    'osm-standard': {
        name: '🗺️ OpenStreetMap',
        provider: 'OpenStreetMap',
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        attribution: '© OpenStreetMap contributors',
        maxzoom: 19,
        icon: 'fas fa-map',
        category: 'general'
    },
    'osm-humanitarian': {
        name: '🏥 Humanitarian',
        provider: 'HOT OSM',
        type: 'raster',
        tiles: ['https://tile-{a-c}.openstreetmap.fr/hot/{z}/{x}/{y}.png'],
        attribution: '© OpenStreetMap contributors, Tiles courtesy of HOT',
        maxzoom: 19,
        icon: 'fas fa-hands-helping',
        category: 'general'
    },
    'osm-cycle': {
        name: '🚴 OpenCycleMap',
        provider: 'OpenCycleMap',
        type: 'raster',
        tiles: ['https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=YOUR_API_KEY'],
        attribution: '© OpenCycleMap, OpenStreetMap contributors',
        maxzoom: 18,
        icon: 'fas fa-bicycle',
        category: 'terrain'
    },

    // ========================================
    // CARTO BASEMAPS
    // ========================================
    'carto-light': {
        name: '🎨 CartoDB Light',
        provider: 'CartoDB',
        type: 'raster',
        tiles: ['https://{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'],
        attribution: '© OpenStreetMap, © CartoDB',
        maxzoom: 19,
        icon: 'fas fa-palette',
        category: 'general'
    },
    'carto-dark': {
        name: '🎨 CartoDB Dark',
        provider: 'CartoDB',
        type: 'raster',
        tiles: ['https://{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'],
        attribution: '© OpenStreetMap, © CartoDB',
        maxzoom: 19,
        icon: 'fas fa-paint-brush',
        category: 'general'
    },
    'carto-voyager': {
        name: '🗺️ CartoDB Voyager',
        provider: 'CartoDB',
        type: 'raster',
        tiles: ['https://{a-d}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'],
        attribution: '© OpenStreetMap, © CartoDB',
        maxzoom: 19,
        icon: 'fas fa-map-marked',
        category: 'general'
    },

    // ========================================
    // ESRI BASEMAPS
    // ========================================
    'esri-worldimagery': {
        name: '🌍 ESRI World Imagery',
        provider: 'ESRI',
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        attribution: '© Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
        maxzoom: 19,
        icon: 'fas fa-globe-americas',
        category: 'satellite'
    },
    'esri-worldstreet': {
        name: '🗺️ ESRI Street Map',
        provider: 'ESRI',
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'],
        attribution: '© Esri, DeLorme, NAVTEQ',
        maxzoom: 19,
        icon: 'fas fa-road',
        category: 'general'
    },
    'esri-worldtopo': {
        name: '🗻 ESRI Topographic',
        provider: 'ESRI',
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'],
        attribution: '© Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
        maxzoom: 19,
        icon: 'fas fa-mountain',
        category: 'terrain'
    },
    'esri-natgeo': {
        name: '🌏 National Geographic',
        provider: 'ESRI',
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}'],
        attribution: '© Esri, National Geographic, Garmin, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
        maxzoom: 16,
        icon: 'fas fa-globe-asia',
        category: 'general'
    },
    'esri-ocean': {
        name: '🌊 ESRI Ocean',
        provider: 'ESRI',
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}'],
        attribution: '© Esri, GEBCO, NOAA, National Geographic, DeLorme, HERE, Geonames.org, and other contributors',
        maxzoom: 16,
        icon: 'fas fa-water',
        category: 'terrain'
    },

    // ========================================
    // GOOGLE-STYLE BASEMAPS (via public tiles)
    // ========================================
    'google-satellite': {
        name: '🛰️ Google Satellite',
        provider: 'Google',
        type: 'raster',
        tiles: ['https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'],
        attribution: '© Google',
        maxzoom: 20,
        icon: 'fas fa-satellite-dish',
        category: 'satellite'
    },
    'google-hybrid': {
        name: '🌐 Google Hybrid',
        provider: 'Google',
        type: 'raster',
        tiles: ['https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'],
        attribution: '© Google',
        maxzoom: 20,
        icon: 'fas fa-map-marker-alt',
        category: 'satellite'
    },
    'google-streets': {
        name: '🗺️ Google Streets',
        provider: 'Google',
        type: 'raster',
        tiles: ['https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'],
        attribution: '© Google',
        maxzoom: 20,
        icon: 'fas fa-route',
        category: 'general'
    },
    'google-terrain': {
        name: '⛰️ Google Terrain',
        provider: 'Google',
        type: 'raster',
        tiles: ['https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}'],
        attribution: '© Google',
        maxzoom: 20,
        icon: 'fas fa-mountain',
        category: 'terrain'
    },

    // ========================================
    // STAMEN BASEMAPS
    // ========================================
    'stamen-terrain': {
        name: '🗺️ Stamen Terrain',
        provider: 'Stamen',
        type: 'raster',
        tiles: ['https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg'],
        attribution: 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL',
        maxzoom: 18,
        icon: 'fas fa-image',
        category: 'terrain'
    },
    'stamen-toner': {
        name: '⚫ Stamen Toner',
        provider: 'Stamen',
        type: 'raster',
        tiles: ['https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png'],
        attribution: 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL',
        maxzoom: 20,
        icon: 'fas fa-adjust',
        category: 'general'
    },
    'stamen-watercolor': {
        name: '🎨 Stamen Watercolor',
        provider: 'Stamen',
        type: 'raster',
        tiles: ['https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg'],
        attribution: 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL',
        maxzoom: 18,
        icon: 'fas fa-fill-drip',
        category: 'general'
    },

    // ========================================
    // TERRAIN/ELEVATION BASEMAPS
    // ========================================
    'opentopo': {
        name: '🗻 OpenTopoMap',
        provider: 'OpenTopoMap',
        type: 'raster',
        tiles: ['https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png'],
        attribution: '© OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)',
        maxzoom: 17,
        icon: 'fas fa-mountain',
        category: 'terrain'
    },

    // ========================================
    // NASA/SCIENTIFIC BASEMAPS
    // ========================================
    'nasa-gibs': {
        name: '🛰️ NASA GIBS',
        provider: 'NASA',
        type: 'raster',
        tiles: ['https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpeg'],
        attribution: '© NASA',
        maxzoom: 8,
        icon: 'fas fa-rocket',
        category: 'satellite'
    }
};

// Index Names Mapping
const INDEX_NAMES = {
    'ndvi': 'Normalized Difference Vegetation Index',
    'vci': 'Vegetation Condition Index',
    'spi': 'Standardized Precipitation Index',
    'tci': 'Temperature Condition Index'
};

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Drought Monitoring Portal...');
    console.log(`📍 Loaded ${Object.keys(BASEMAP_STYLES).length} basemaps from ${getUniqueProviders().length} providers`);
    
    setTimeout(() => {
        initializeMaps();
        initializeBasemapControls();
    }, 100);
    
    initializeEventListeners();
    updateLastUpdateTime();
    
    setInterval(updateLastUpdateTime, 60000);
});

function getUniqueProviders() {
    return [...new Set(Object.values(BASEMAP_STYLES).map(b => b.provider))];
}

// ========================================
// BASEMAP CONTROLS
// ========================================

function initializeBasemapControls() {
    createBasemapSelector('map1');
    createBasemapSelector('map2');
}

function createBasemapSelector(mapId) {
    const mapContainer = document.getElementById(mapId);
    if (!mapContainer) return;

    const basemapControl = document.createElement('div');
    basemapControl.className = 'basemap-control';
    basemapControl.id = `basemap-control-${mapId}`;
    
    const toggleButton = document.createElement('button');
    toggleButton.className = 'basemap-toggle-btn';
    toggleButton.innerHTML = '<i class="fas fa-layer-group"></i>';
    toggleButton.title = 'Change Basemap';
    
    const optionsPanel = document.createElement('div');
    optionsPanel.className = 'basemap-options';
    optionsPanel.style.display = 'none';
    
    // Add search/filter
    const searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.className = 'basemap-search';
    searchBox.placeholder = '🔍 Search basemaps...';
    optionsPanel.appendChild(searchBox);
    
    // Group by category
    const categories = {
        'satellite': '🛰️ Satellite',
        'general': '🗺️ General',
        'terrain': '🏔️ Terrain/Topo',
        'navigation': '🧭 Navigation'
    };
    
    Object.keys(categories).forEach(categoryKey => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'basemap-category';
        
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'basemap-category-header';
        categoryHeader.textContent = categories[categoryKey];
        categoryDiv.appendChild(categoryHeader);
        
        const categoryOptions = document.createElement('div');
        categoryOptions.className = 'basemap-category-options';
        
        Object.keys(BASEMAP_STYLES).forEach(key => {
            const basemap = BASEMAP_STYLES[key];
            if (basemap.category !== categoryKey) return;
            
            const option = document.createElement('button');
            option.className = 'basemap-option';
            option.setAttribute('data-basemap', key);
            option.setAttribute('data-map', mapId);
            option.setAttribute('data-provider', basemap.provider);
            option.setAttribute('data-name', basemap.name.toLowerCase());
            
            const icon = document.createElement('i');
            icon.className = basemap.icon;
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'basemap-name';
            nameSpan.textContent = basemap.name;
            
            const providerSpan = document.createElement('span');
            providerSpan.className = 'basemap-provider';
            providerSpan.textContent = basemap.provider;
            
            option.appendChild(icon);
            option.appendChild(nameSpan);
            option.appendChild(providerSpan);
            
            if (AppState.currentBasemap[mapId] === key) {
                option.classList.add('active');
            }
            
            option.addEventListener('click', () => {
                changeBasemap(mapId, key);
                categoryOptions.querySelectorAll('.basemap-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                option.classList.add('active');
                optionsPanel.style.display = 'none';
            });
            
            categoryOptions.appendChild(option);
        });
        
        categoryDiv.appendChild(categoryOptions);
        optionsPanel.appendChild(categoryDiv);
    });
    
    // Search functionality
    searchBox.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const allOptions = optionsPanel.querySelectorAll('.basemap-option');
        
        allOptions.forEach(option => {
            const name = option.getAttribute('data-name');
            const provider = option.getAttribute('data-provider').toLowerCase();
            
            if (name.includes(searchTerm) || provider.includes(searchTerm)) {
                option.style.display = 'flex';
            } else {
                option.style.display = 'none';
            }
        });
        
        // Hide empty categories
        const categories = optionsPanel.querySelectorAll('.basemap-category');
        categories.forEach(cat => {
            const visibleOptions = cat.querySelectorAll('.basemap-option[style="display: flex;"], .basemap-option:not([style*="display"])');
            cat.style.display = visibleOptions.length > 0 ? 'block' : 'none';
        });
    });
    
    toggleButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = optionsPanel.style.display === 'block';
        
        document.querySelectorAll('.basemap-options').forEach(panel => {
            panel.style.display = 'none';
        });
        
        optionsPanel.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
            searchBox.value = '';
            searchBox.dispatchEvent(new Event('input'));
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!basemapControl.contains(e.target)) {
            optionsPanel.style.display = 'none';
        }
    });
    
    basemapControl.appendChild(toggleButton);
    basemapControl.appendChild(optionsPanel);
    mapContainer.appendChild(basemapControl);
}

function changeBasemap(mapId, basemapKey) {
    console.log(`🗺️  Changing ${mapId} basemap to: ${basemapKey}`);
    
    const map = AppState.maps[mapId];
    if (!map) {
        console.error(`Map ${mapId} not found`);
        return;
    }
    
    const basemapConfig = BASEMAP_STYLES[basemapKey];
    
    // Get current map state
    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();
    const currentPitch = map.getPitch();
    const currentBearing = map.getBearing();
    
    // Store current layers and sources
    const currentStyle = map.getStyle();
    const customLayers = [];
    const customSources = {};
    
    if (currentStyle && currentStyle.layers) {
        currentStyle.layers.forEach(layer => {
            if (layer.id.startsWith('layer-') || layer.id.startsWith('precipitation-')) {
                customLayers.push(layer);
            }
        });
    }
    
    if (currentStyle && currentStyle.sources) {
        Object.keys(currentStyle.sources).forEach(sourceId => {
            if (sourceId.startsWith('geoserver-') || sourceId.startsWith('precipitation-')) {
                customSources[sourceId] = currentStyle.sources[sourceId];
            }
        });
    }
    
    // Check if it's a Mapbox style or custom tiles
    if (basemapConfig.style) {
        // Mapbox style
        map.setStyle(basemapConfig.style);
    } else if (basemapConfig.type === 'raster') {
        // Custom raster tiles
        const customStyle = {
            version: 8,
            sources: {
                'basemap-source': {
                    type: 'raster',
                    tiles: basemapConfig.tiles,
                    tileSize: 256,
                    attribution: basemapConfig.attribution,
                    maxzoom: basemapConfig.maxzoom || 19
                }
            },
            layers: [{
                id: 'basemap-layer',
                type: 'raster',
                source: 'basemap-source',
                minzoom: 0,
                maxzoom: 22
            }]
        };
        map.setStyle(customStyle);
    }
    
    // Update state
    AppState.currentBasemap[mapId] = basemapKey;
    
    // Restore custom layers after style loads
    map.once('style.load', () => {
        console.log(`✅ Basemap changed, restoring ${Object.keys(customSources).length} sources and ${customLayers.length} layers`);
        
        // Re-add sources
        Object.keys(customSources).forEach(sourceId => {
            if (!map.getSource(sourceId)) {
                map.addSource(sourceId, customSources[sourceId]);
            }
        });
        
        // Re-add layers
        customLayers.forEach(layer => {
            if (!map.getLayer(layer.id)) {
                map.addLayer(layer);
            }
        });
        
        // Restore map position
        map.setCenter(currentCenter);
        map.setZoom(currentZoom);
        map.setPitch(currentPitch);
        map.setBearing(currentBearing);
        
        console.log(`✅ ${mapId} basemap change complete: ${basemapConfig.name}`);
    });
}

// ========================================
// EVENT LISTENERS
// ========================================

function initializeEventListeners() {
    const periodButtons = document.querySelectorAll('.period-btn');
    periodButtons.forEach(btn => {
        btn.addEventListener('click', handlePeriodClick);
    });
    
    const seasonButtons = document.querySelectorAll('.season-btn');
    seasonButtons.forEach(btn => {
        btn.addEventListener('click', handleSeasonClick);
    });
    
    const indexButtons = document.querySelectorAll('.index-btn');
    indexButtons.forEach(btn => {
        btn.addEventListener('click', handleIndexClick);
    });
    
    const playPauseBtn = document.getElementById('playPauseBtn');
    const stepBackBtn = document.getElementById('stepBackBtn');
    const stepForwardBtn = document.getElementById('stepForwardBtn');
    const closeSliderBtn = document.getElementById('closeSlider');
    const timelineRange = document.getElementById('timelineRange');
    const speedSelect = document.getElementById('speedSelect');
    
    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
    if (stepBackBtn) stepBackBtn.addEventListener('click', stepBackward);
    if (stepForwardBtn) stepForwardBtn.addEventListener('click', stepForward);
    if (closeSliderBtn) closeSliderBtn.addEventListener('click', closeSlider);
    if (timelineRange) timelineRange.addEventListener('input', handleTimelineChange);
    if (speedSelect) speedSelect.addEventListener('change', handleSpeedChange);
}

// ========================================
// PERIOD & SEASON HANDLING
// ========================================

function handlePeriodClick(e) {
    const button = e.currentTarget;
    const period = button.getAttribute('data-period');
    const submenu = button.nextElementSibling;
    const allPeriodButtons = document.querySelectorAll('.period-btn');
    const allSubmenus = document.querySelectorAll('.submenu');
    
    const isActive = button.classList.contains('active');
    
    allPeriodButtons.forEach(btn => {
        if (btn !== button) {
            btn.classList.remove('active');
        }
    });
    
    allSubmenus.forEach(menu => {
        if (menu !== submenu) {
            menu.classList.remove('open');
            menu.querySelectorAll('.index-submenu').forEach(sub => {
                sub.classList.remove('open');
            });
            menu.querySelectorAll('.season-btn').forEach(seasonBtn => {
                seasonBtn.classList.remove('active');
            });
        }
    });
    
    if (!isActive) {
        button.classList.add('active');
        submenu.classList.add('open');
        AppState.currentPeriod = period;
    } else {
        button.classList.remove('active');
        submenu.classList.remove('open');
        submenu.querySelectorAll('.index-submenu').forEach(sub => {
            sub.classList.remove('open');
        });
        submenu.querySelectorAll('.season-btn').forEach(seasonBtn => {
            seasonBtn.classList.remove('active');
        });
        AppState.currentPeriod = null;
    }
}

function handleSeasonClick(e) {
    const button = e.currentTarget;
    const period = button.getAttribute('data-period');
    const season = button.getAttribute('data-season');
    const indexSubmenu = button.nextElementSibling;
    
    const isActive = button.classList.contains('active');
    
    const parentSubmenu = button.closest('.submenu');
    parentSubmenu.querySelectorAll('.season-btn').forEach(btn => {
        if (btn !== button) {
            btn.classList.remove('active');
        }
    });
    
    parentSubmenu.querySelectorAll('.index-submenu').forEach(sub => {
        if (sub !== indexSubmenu) {
            sub.classList.remove('open');
        }
    });
    
    if (!isActive) {
        button.classList.add('active');
        indexSubmenu.classList.add('open');
        AppState.currentPeriod = period;
        AppState.currentSeason = season;
    } else {
        button.classList.remove('active');
        indexSubmenu.classList.remove('open');
        AppState.currentSeason = null;
    }
}

function handleIndexClick(e) {
    const button = e.currentTarget;
    const period = button.getAttribute('data-period');
    const season = button.getAttribute('data-season');
    const index = button.getAttribute('data-index');
    const layer = button.getAttribute('data-layer');
    const isActive = button.classList.contains('active');
    
    const allIndexButtons = document.querySelectorAll('.index-btn');
    allIndexButtons.forEach(btn => btn.classList.remove('active'));
    
    if (!isActive) {
        button.classList.add('active');
        AppState.currentPeriod = period;
        AppState.currentSeason = season;
        AppState.currentIndex = index;
        
        // Only show slider if it's a regular index button (has season and index)
        if (season && index) {
            showSlider(period, season, index);
        } else if (layer) {
            // Handle special layers like blinking layer
            if (typeof handleSpecialLayerClick === 'function') {
                handleSpecialLayerClick(layer, button);
            }
        }
    } else {
        AppState.currentPeriod = null;
        AppState.currentSeason = null;
        AppState.currentIndex = null;
        
        // If it's a special layer, remove it
        if (layer) {
            if (typeof removeBlinkingLayer === 'function') {
                removeBlinkingLayer();
            }
        } else {
            closeSlider();
        }
    }
}

// ========================================
// SLIDER FUNCTIONALITY
// ========================================

function showSlider(period, season, index) {
    const slider = document.getElementById('timelineSlider');
    const sliderTitle = document.getElementById('sliderTitle');
    const periodInfo = document.getElementById('periodInfo');
    const seasonInfo = document.getElementById('seasonInfo');
    const indexInfo = document.getElementById('indexInfo');
    const map1Title = document.getElementById('map1Title');
    
    if (!slider) return;
    
    const seasonName = season.charAt(0).toUpperCase() + season.slice(1);
    const indexName = index.toUpperCase();
    sliderTitle.textContent = `${period} - ${seasonName} - ${indexName}`;
    
    if (periodInfo) periodInfo.textContent = `Period: ${period}`;
    if (seasonInfo) seasonInfo.textContent = `Season: ${seasonName}`;
    if (indexInfo) indexInfo.textContent = `Index: ${indexName}`;
    
    if (map1Title) {
        map1Title.textContent = `${INDEX_NAMES[index]} (${indexName})`;
    }
    
    generateTimelineData(period, season, index);
    
    slider.classList.add('active');
    AppState.sliderActive = true;
    
    stopPlayback();
    AppState.currentTimeIndex = 0;
    updateTimelineDisplay();
    
    console.log(`📊 Showing slider: ${period} | ${season} | ${index}`);
}

function closeSlider() {
    const slider = document.getElementById('timelineSlider');
    if (slider) {
        slider.classList.remove('active');
    }
    AppState.sliderActive = false;
    stopPlayback();
    
    const map1Title = document.getElementById('map1Title');
    if (map1Title) {
        map1Title.textContent = 'Drought Index Map';
    }
    
    // Hide all drought layers when closing slider
    if (typeof hideAllDroughtLayers === 'function') {
        hideAllDroughtLayers();
    }
}

function generateTimelineData(period, season, index) {
    const [startYear, endYear] = period.split('-').map(Number);
    AppState.timelineData = [];
    
    for (let year = startYear; year <= endYear; year++) {
        AppState.timelineData.push({
            year: year,
            season: season,
            index: index,
            label: `${year}`
        });
    }
    
    console.log(`Generated timeline: ${startYear}-${endYear} (${AppState.timelineData.length} years)`);
    
    const timelineRange = document.getElementById('timelineRange');
    if (timelineRange) {
        timelineRange.max = AppState.timelineData.length - 1;
        timelineRange.value = 0;
    }
    
    createTimelineMarkers();
}

function createTimelineMarkers() {
    const markersContainer = document.getElementById('timelineMarkers');
    if (!markersContainer) return;
    
    markersContainer.innerHTML = '';
    
    const totalSteps = AppState.timelineData.length;
    if (totalSteps === 0) return;
    
    AppState.timelineData.forEach((data, index) => {
        const position = totalSteps === 1 ? 50 : (index / (totalSteps - 1)) * 100;
        
        const marker = document.createElement('div');
        marker.style.cssText = `
            position: absolute;
            left: ${position}%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 2px;
            height: 16px;
            background: rgba(0, 212, 255, 0.5);
            pointer-events: none;
        `;
        markersContainer.appendChild(marker);
        
        const label = document.createElement('div');
        label.textContent = data.year;
        label.style.cssText = `
            position: absolute;
            left: ${position}%;
            top: -25px;
            transform: translateX(-50%);
            font-size: 12px;
            color: var(--accent-cyan);
            pointer-events: none;
            white-space: nowrap;
            font-weight: 600;
        `;
        markersContainer.appendChild(label);
    });
}

// ========================================
// PLAYBACK CONTROLS
// ========================================

function togglePlayPause() {
    if (AppState.isPlaying) {
        stopPlayback();
    } else {
        startPlayback();
    }
}

function startPlayback() {
    if (AppState.timelineData.length === 0) return;
    
    AppState.isPlaying = true;
    const playPauseBtn = document.getElementById('playPauseBtn');
    if (playPauseBtn) {
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    
    const interval = 1000 / AppState.playbackSpeed;
    
    AppState.playbackInterval = setInterval(() => {
        if (AppState.currentTimeIndex < AppState.timelineData.length - 1) {
            AppState.currentTimeIndex++;
            updateTimelineDisplay();
        } else {
            AppState.currentTimeIndex = 0;
            updateTimelineDisplay();
        }
    }, interval);
}

function stopPlayback() {
    AppState.isPlaying = false;
    const playPauseBtn = document.getElementById('playPauseBtn');
    if (playPauseBtn) {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
    
    if (AppState.playbackInterval) {
        clearInterval(AppState.playbackInterval);
        AppState.playbackInterval = null;
    }
}

function stepBackward() {
    stopPlayback();
    if (AppState.currentTimeIndex > 0) {
        AppState.currentTimeIndex--;
        updateTimelineDisplay();
    }
}

function stepForward() {
    stopPlayback();
    if (AppState.currentTimeIndex < AppState.timelineData.length - 1) {
        AppState.currentTimeIndex++;
        updateTimelineDisplay();
    }
}

function handleTimelineChange(e) {
    stopPlayback();
    AppState.currentTimeIndex = parseInt(e.target.value);
    updateTimelineDisplay();
}

function handleSpeedChange(e) {
    AppState.playbackSpeed = parseFloat(e.target.value);
    
    if (AppState.isPlaying) {
        stopPlayback();
        startPlayback();
    }
}

function updateTimelineDisplay() {
    if (AppState.timelineData.length === 0) return;
    
    const currentData = AppState.timelineData[AppState.currentTimeIndex];
    
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = currentData.year;
    }
    
    const timelineRange = document.getElementById('timelineRange');
    if (timelineRange) {
        timelineRange.value = AppState.currentTimeIndex;
    }
    
    const progressEl = document.getElementById('timelineProgress');
    if (progressEl) {
        const progress = AppState.timelineData.length === 1 
            ? 0 
            : (AppState.currentTimeIndex / (AppState.timelineData.length - 1)) * 100;
        progressEl.style.width = `${progress}%`;
    }
    
    updateMapData(currentData);
}

function updateMapData(timeData) {
    console.log(`📊 Updating maps: ${timeData.year} | ${timeData.season} | ${timeData.index}`);
    
    if (typeof updateMap1Data === 'function') {
        updateMap1Data(timeData);
    }
    if (typeof updateMap2Data === 'function') {
        updateMap2Data(timeData);
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
    });
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
        lastUpdateElement.textContent = timeString;
    }
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

document.addEventListener('keydown', (e) => {
    if (!AppState.sliderActive) return;
    
    switch(e.key) {
        case ' ':
        case 'Space':
            e.preventDefault();
            togglePlayPause();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            stepBackward();
            break;
        case 'ArrowRight':
            e.preventDefault();
            stepForward();
            break;
        case 'Escape':
            e.preventDefault();
            closeSlider();
            break;
    }
});

// ========================================
// RESPONSIVE MENU TOGGLE
// ========================================

const createMobileMenuToggle = () => {
    if (window.innerWidth <= 768) {
        const navLeft = document.querySelector('.nav-left');
        if (!navLeft) return;
        
        if (navLeft.querySelector('.mobile-menu-toggle')) return;
        
        const menuToggle = document.createElement('button');
        menuToggle.className = 'mobile-menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        menuToggle.style.cssText = `
            background: transparent;
            border: none;
            color: var(--accent-cyan);
            font-size: 24px;
            cursor: pointer;
            margin-right: 15px;
        `;
        
        menuToggle.addEventListener('click', () => {
            const sideMenu = document.querySelector('.side-menu');
            if (sideMenu) {
                sideMenu.classList.toggle('open');
            }
        });
        
        navLeft.insertBefore(menuToggle, navLeft.firstChild);
    }
};

window.addEventListener('load', createMobileMenuToggle);
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        const sideMenu = document.querySelector('.side-menu');
        if (sideMenu) {
            sideMenu.classList.remove('open');
        }
    }
});

// ========================================
// DEBUG TOOLS
// ========================================

if (typeof window !== 'undefined') {
    window.debugApp = {
        changeBasemap: (mapId, basemap) => changeBasemap(mapId, basemap),
        getBasemap: (mapId) => AppState.currentBasemap[mapId],
        listBasemaps: () => {
            console.log('📋 Available Basemaps:');
            console.table(
                Object.entries(BASEMAP_STYLES).map(([key, value]) => ({
                    ID: key,
                    Name: value.name,
                    Provider: value.provider,
                    Category: value.category
                }))
            );
        },
        listByProvider: () => {
            const providers = {};
            Object.entries(BASEMAP_STYLES).forEach(([key, value]) => {
                if (!providers[value.provider]) {
                    providers[value.provider] = [];
                }
                providers[value.provider].push(value.name);
            });
            console.log('📋 Basemaps by Provider:');
            console.table(providers);
        },
        state: () => console.log(AppState),
        stats: () => {
            console.log('📊 Basemap Statistics:');
            console.log(`   Total basemaps: ${Object.keys(BASEMAP_STYLES).length}`);
            console.log(`   Providers: ${getUniqueProviders().join(', ')}`);
            console.log(`   Categories: ${[...new Set(Object.values(BASEMAP_STYLES).map(b => b.category))].join(', ')}`);
        }
    };
    
    console.log('🛠️  App Debug Tools:');
    console.log('   window.debugApp.listBasemaps()      - List all basemaps');
    console.log('   window.debugApp.listByProvider()    - Group by provider');
    console.log('   window.debugApp.stats()             - Show statistics');
    console.log('   window.debugApp.changeBasemap("map1", "google-hybrid")');
}

// ========================================
// CONSOLE WELCOME MESSAGE
// ========================================

console.log('%c🌍 Drought Monitoring Portal Initialized', 'color: #00d4ff; font-size: 16px; font-weight: bold;');
console.log('%c📊 Indices: NDVI, VCI, SPI, TCI', 'color: #00d4ff;');
console.log('%c📅 Periods: 1999-2002, 2020-2025', 'color: #00d4ff;');
console.log('%c🌱 Seasons: Karif, Rabi', 'color: #00d4ff;');
console.log('%c🗺️  Basemaps: ' + Object.keys(BASEMAP_STYLES).length + ' options from ' + getUniqueProviders().length + ' providers', 'color: #00d4ff; font-weight: bold;');
console.log('%c📍 Providers: ' + getUniqueProviders().join(', '), 'color: #00d4ff;');
console.log('%c⌨️  Keyboard Shortcuts:', 'color: #00d4ff; font-weight: bold;');
console.log('  Space: Play/Pause timeline');
console.log('  ← →: Step backward/forward');
console.log('  Escape: Close slider');



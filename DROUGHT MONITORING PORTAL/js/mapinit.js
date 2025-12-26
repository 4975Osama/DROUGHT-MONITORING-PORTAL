// ========================================
// MAP INITIALIZATION
// ========================================

function initializeMaps() {
    // Check if Mapbox GL JS is loaded
    if (typeof mapboxgl === 'undefined') {
        console.error('Mapbox GL JS not loaded. Please check the script tag in your HTML.');
        showMapError();
        return;
    }
    
    // Mapbox access token (replace with your own token)
    // Get a free token at: https://www.mapbox.com/
    mapboxgl.accessToken = 'pk.eyJ1IjoibmVvYzIwMjMiLCJhIjoiY2x1aTBubHAwMjYzOTJqcGc2cGFhMHU2ciJ9.tFU9_qFCY02qCvfiPMPDUg';
    
    // Check if token is valid (not the example one)
    if (mapboxgl.accessToken.includes('example')) {
        console.warn('Using example Mapbox token. Please replace with your own token.');
        showMapError();
        return;
    }
    
    try {
        console.log('Initializing maps...');
        
        // Initialize both maps
        initializeMap1();
        initializeMap2();
        
        console.log('Maps initialized successfully');
        
    } catch (error) {
        console.error('Error initializing maps:', error);
        showMapError();
    }
}

function showMapError() {
    const mapContainers = document.querySelectorAll('.map');
    mapContainers.forEach(container => {
        container.innerHTML = `
            <div class="map-error">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Map Loading Error</h3>
                <p>Please add your Mapbox access token in js/mapinit.js</p>
                <p class="small">Get a free token at <a href="https://www.mapbox.com/" target="_blank">mapbox.com</a></p>
            </div>
        `;
    });
}

// Add CSS for error message
const errorStyle = document.createElement('style');
errorStyle.textContent = `
    .map-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #a0aec0;
        text-align: center;
        padding: 20px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
    }
    .map-error i {
        font-size: 48px;
        color: #f59e0b;
        margin-bottom: 15px;
    }
    .map-error h3 {
        color: #00d4ff;
        margin-bottom: 10px;
    }
    .map-error .small {
        font-size: 12px;
        margin-top: 10px;
    }
    .map-error a {
        color: #00d4ff;
        text-decoration: none;
    }
    .map-error a:hover {
        text-decoration: underline;
    }
`;
document.head.appendChild(errorStyle);
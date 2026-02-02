// ========== CONFIGURATION ==========
const PLAYER_CONFIG = {
    retryDelay: 3000,
    maxRetries: 3,
    updateInterval: 1000,
    hlsConfig: {
        debug: false,
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        manifestLoadingTimeOut: 10000,
        manifestLoadingMaxRetry: 4,
        levelLoadingTimeOut: 10000,
        levelLoadingMaxRetry: 4,
        fragLoadingTimeOut: 20000,
        fragLoadingMaxRetry: 6,
        xhrSetup: function(xhr, url) {
            // Add custom headers if needed
            xhr.withCredentials = false;
        }
    }
};

// ========== DOM ELEMENTS ==========
const player = {
    video: document.getElementById('videoPlayer'),
    loading: document.getElementById('loadingOverlay'),
    errorOverlay: document.getElementById('errorOverlay'),
    playerError: document.getElementById('playerError'),
    retryBtn: document.getElementById('retryBtn'),
    status: document.getElementById('status'),
    quality: document.getElementById('quality'),
    streamInfo: document.getElementById('streamInfo'),
    viewerCount: document.getElementById('viewerCount'),
    fullscreenBtn: document.getElementById('fullscreenBtn'),
    qualityBtn: document.getElementById('qualityBtn'),
    shareBtn: document.getElementById('shareBtn')
};

// ========== GLOBAL VARIABLES ==========
let hls = null;
let streamData = null;
let retryCount = 0;
let updateTimer = null;

// ========== UTILITY FUNCTIONS ==========

/**
 * Decode Base64 stream data
 */
function decodeStreamData(encoded) {
    try {
        // Restore URL-safe Base64 to standard Base64
        let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
        
        // Add padding if needed
        while (base64.length % 4) {
            base64 += '=';
        }
        
        // Decode
        const jsonString = decodeURIComponent(escape(atob(base64)));
        return JSON.parse(jsonString);
    } catch (err) {
        console.error('Decode error:', err);
        return null;
    }
}

/**
 * Get stream data from URL parameters
 */
function getStreamDataFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const streamParam = urlParams.get('stream');
    
    if (!streamParam) {
        return null;
    }
    
    return decodeStreamData(streamParam);
}

/**
 * Show loading overlay
 */
function showLoading(message = 'Connecting to live stream...') {
    player.loading.style.display = 'flex';
    player.loading.querySelector('p').textContent = message;
    player.errorOverlay.style.display = 'none';
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    player.loading.style.display = 'none';
}

/**
 * Show error overlay
 */
function showError(message) {
    player.errorOverlay.style.display = 'flex';
    player.playerError.textContent = message;
    hideLoading();
    updateStatus('error');
}

/**
 * Hide error overlay
 */
function hideError() {
    player.errorOverlay.style.display = 'none';
}

/**
 * Update stream status
 */
function updateStatus(status) {
    const statusElement = player.status;
    
    switch(status) {
        case 'live':
            statusElement.textContent = '● LIVE';
            statusElement.className = 'status-live';
            statusElement.style.color = '#10b981';
            break;
        case 'buffering':
            statusElement.textContent = '⏳ BUFFERING';
            statusElement.style.color = '#f59e0b';
            break;
        case 'error':
            statusElement.textContent = '⚠️ ERROR';
            statusElement.style.color = '#ef4444';
            break;
        case 'ended':
            statusElement.textContent = '● ENDED';
            statusElement.style.color = '#6b7280';
            break;
    }
}

/**
 * Update stream info
 */
function updateStreamInfo() {
    if (!hls) return;
    
    const level = hls.levels[hls.currentLevel];
    if (level) {
        const resolution = `${level.width}x${level.height}`;
        const bitrate = (level.bitrate / 1000000).toFixed(2);
        player.quality.textContent = `${resolution} @ ${bitrate} Mbps`;
        player.streamInfo.textContent = `Resolution: ${resolution} • Bitrate: ${bitrate} Mbps`;
    }
}

/**
 * Simulate viewer count (random between 1-10)
 */
function updateViewerCount() {
    const count = Math.floor(Math.random() * 10) + 1;
    player.viewerCount.textContent = count;
}

// ========== HLS PLAYER INITIALIZATION ==========

/**
 * Initialize HLS player with PROXY
 */
function initializePlayer(streamUrl, token) {
    console.log('🎥 Initializing HLS Player');
    console.log('Original Stream URL:', streamUrl);
    
    showLoading('Connecting through proxy...');
    
    // ========== USE PROXY URL ==========
    const baseUrl = window.location.origin;
    const proxyUrl = `${baseUrl}/api/proxy/stream?url=${encodeURIComponent(streamUrl)}${token ? `&token=${encodeURIComponent(token)}` : ''}`;
    
    console.log('🔄 Using Proxy URL');
    
    // Check HLS.js support
    if (!Hls.isSupported()) {
        // Fallback for native HLS support (Safari)
        if (player.video.canPlayType('application/vnd.apple.mpegurl')) {
            console.log('✅ Using native HLS support');
            player.video.src = proxyUrl;
            setupVideoEvents();
            hideLoading();
            return;
        } else {
            showError('⚠️ Your browser does not support HLS playback. Please use Chrome, Firefox, or Safari.');
            return;
        }
    }
    
    // Create HLS instance
    hls = new Hls(PLAYER_CONFIG.hlsConfig);
    
    // Load source through PROXY
    hls.loadSource(proxyUrl);
    hls.attachMedia(player.video);
    
    // Setup HLS events
    setupHlsEvents();
    setupVideoEvents();
}

/**
 * Setup HLS.js events
 */
function setupHlsEvents() {
    // Manifest parsed
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('✅ Manifest parsed successfully');
        hideLoading();
        updateStatus('live');
        
        // Auto play
        player.video.play().catch(err => {
            console.log('Autoplay prevented:', err);
            showError('🔇 Click anywhere to start playback');
            
            // Allow user to click to play
            document.addEventListener('click', () => {
                player.video.play();
                hideError();
            }, { once: true });
        });
        
        updateStreamInfo();
    });
    
    // Level switched
    hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        console.log('Quality level switched:', data.level);
        updateStreamInfo();
    });
    
    // Fragment loading
    hls.on(Hls.Events.FRAG_LOADING, () => {
        updateStatus('buffering');
    });
    
    // Fragment loaded
    hls.on(Hls.Events.FRAG_LOADED, () => {
        updateStatus('live');
    });
    
    // Error handling
    hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS Error:', data);
        
        if (data.fatal) {
            switch(data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                    handleNetworkError(data);
                    break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                    handleMediaError(data);
                    break;
                default:
                    showError('⚠️ Fatal error: Unable to play stream. The stream may have ended or URL expired.');
                    break;
            }
        }
    });
}

/**
 * Setup video element events
 */
function setupVideoEvents() {
    player.video.addEventListener('playing', () => {
        console.log('▶️ Video playing');
        hideLoading();
        updateStatus('live');
    });
    
    player.video.addEventListener('waiting', () => {
        console.log('⏳ Video buffering');
        updateStatus('buffering');
    });
    
    player.video.addEventListener('ended', () => {
        console.log('⏹️ Stream ended');
        updateStatus('ended');
        showError('📡 Live stream has ended');
    });
    
    player.video.addEventListener('error', (e) => {
        console.error('Video error:', e);
        showError('⚠️ Video playback error. Stream may have ended.');
    });
    
    // Update info periodically
    player.video.addEventListener('timeupdate', () => {
        if (hls && !updateTimer) {
            updateTimer = setTimeout(() => {
                updateStreamInfo();
                updateTimer = null;
            }, PLAYER_CONFIG.updateInterval);
        }
    });
}

/**
 * Handle network errors
 */
function handleNetworkError(data) {
    console.error('Network error:', data);
    
    if (retryCount < PLAYER_CONFIG.maxRetries) {
        retryCount++;
        showLoading(`Connection lost. Retrying (${retryCount}/${PLAYER_CONFIG.maxRetries})...`);
        
        setTimeout(() => {
            console.log('Retrying connection...');
            hls.startLoad();
        }, PLAYER_CONFIG.retryDelay);
    } else {
        showError('⚠️ Network error: Unable to connect to stream. The stream may have ended or your internet connection is unstable.');
    }
}

/**
 * Handle media errors
 */
function handleMediaError(data) {
    console.error('Media error:', data);
    
    if (retryCount < PLAYER_CONFIG.maxRetries) {
        retryCount++;
        showLoading(`Media error. Retrying (${retryCount}/${PLAYER_CONFIG.maxRetries})...`);
        
        setTimeout(() => {
            hls.recoverMediaError();
        }, PLAYER_CONFIG.retryDelay);
    } else {
        showError('⚠️ Media error: Unable to decode stream. The stream may have ended or the URL has expired.');
    }
}

/**
 * Retry stream loading
 */
function retryStream() {
    console.log('🔄 Retrying stream...');
    retryCount = 0;
    hideError();
    
    if (hls) {
        hls.destroy();
    }
    
    initializePlayer(streamData.url, streamData.token);
}

// ========== PLAYER CONTROLS ==========

/**
 * Toggle fullscreen
 */
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        player.video.requestFullscreen().catch(err => {
            console.error('Fullscreen error:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

/**
 * Change quality
 */
function changeQuality() {
    if (!hls) return;
    
    const levels = hls.levels;
    if (levels.length <= 1) {
        alert('Only one quality level available');
        return;
    }
    
    // Cycle through quality levels
    let nextLevel = hls.currentLevel + 1;
    if (nextLevel >= levels.length) {
        nextLevel = -1; // Auto quality
    }
    
    hls.currentLevel = nextLevel;
    updateStreamInfo();
    
    console.log('Quality changed to level:', nextLevel);
}

/**
 * Share stream
 */
function shareStream() {
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'Live Stream',
            text: 'Watch this live stream!',
            url: url
        }).catch(err => console.log('Share error:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            alert('✅ Link copied to clipboard!');
        }).catch(() => {
            alert('Link: ' + url);
        });
    }
}

// ========== EVENT LISTENERS ==========

player.retryBtn.addEventListener('click', retryStream);
player.fullscreenBtn.addEventListener('click', toggleFullscreen);
player.qualityBtn.addEventListener('click', changeQuality);
player.shareBtn.addEventListener('click', shareStream);

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 Player page loaded');
    
    // Get stream data from URL
    streamData = getStreamDataFromUrl();
    
    if (!streamData || !streamData.url) {
        showError('⚠️ Invalid stream link. Please generate a new link from the home page.');
        return;
    }
    
    // Check if stream is expired (optional)
    const now = Date.now();
    const generated = streamData.timestamp;
    const hoursSinceGeneration = (now - generated) / (1000 * 60 * 60);
    
    if (hoursSinceGeneration > 24) {
        console.warn('⚠️ Stream link is old (>24 hours)');
    }
    
    console.log('Stream data:', {
        urlLength: streamData.url.length,
        hasToken: !!streamData.token,
        generated: streamData.generated
    });
    
    // Initialize player with PROXY
    initializePlayer(streamData.url, streamData.token);
    
    // Update viewer count periodically
    setInterval(updateViewerCount, 5000);
    updateViewerCount();
});

// ========== CLEANUP ==========
window.addEventListener('beforeunload', () => {
    if (hls) {
        hls.destroy();
        console.log('🧹 HLS player destroyed');
    }
});

// ========== ERROR HANDLING ==========
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

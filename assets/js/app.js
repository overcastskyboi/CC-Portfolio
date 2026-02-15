/**
 * CEC Portfolio - Main Application Logic
 * Handles: Boot Transition, Live Telemetry, and Music Player
 */

// --- Configuration Constants ---
const BOOT_TRANSITION_DELAY_MS = 1200; // 1.2 seconds
const TELEMETRY_API_ENDPOINT = 'https://129.80.222.26:3000/metrics';
const TELEMETRY_UPDATE_INTERVAL_MS = 10000; // 10 seconds
const OCI_MEDIA_BASE_URL = 'https://129.80.222.26:3000/stream/';

// --- 1. BOOT SEQUENCE TRANSITION ---
// Initial site setup and boot sequence
window.addEventListener('load', initializeSite);

// Fallback: Force transition after 3 seconds if telemetry fails or is slow
setTimeout(hideBootScreen, 3000);

// Function to hide the boot screen and show main content
function hideBootScreen() {
    const bootScreen = document.getElementById('boot-screen');
    const mainPortfolio = document.getElementById('main-portfolio');
    if (bootScreen) {
        bootScreen.classList.add('hidden');
    }
    if (mainPortfolio) {
        mainPortfolio.style.opacity = '1';
    }
}

// Function to initialize the site, including telemetry and boot sequence
async function initializeSite() {
    // Initial delay for boot sequence
    await new Promise(resolve => setTimeout(resolve, BOOT_TRANSITION_DELAY_MS));

    if (document.body.classList.contains('page-systems')) {
        try {
            await updateLiveTelemetry(); // Perform initial telemetry fetch
        } catch (err) {
            console.error("Telemetry offline, proceeding to hub...", err);
        } finally {
            // Ensure boot screen hides after initial telemetry attempt (or delay)
            hideBootScreen();
            // Start continuous telemetry updates only after initial load
            setInterval(updateLiveTelemetry, TELEMETRY_UPDATE_INTERVAL_MS);
        }
    } else {
        // If not a systems page, just hide boot screen after delay
        hideBootScreen();
    }
}

// --- 2. LIVE TELEMETRY (ORACLE OCI) ---
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');

function updateServerStatus(isOnline) {
    if (statusDot) statusDot.className = isOnline ? 'dot-online' : 'dot-offline';
    if (statusText) statusText.innerText = isOnline ? 'SERVER LIVE' : 'SERVER OFFLINE';
}

async function updateLiveTelemetry() {
    try {
        const response = await fetch(TELEMETRY_API_ENDPOINT);
        if (!response.ok) throw new Error('Offline');
        
        const data = await response.json();

        // Update Hardware Progress Bars
        updateProgressBar('cpu-fill', 'cpu-perc', data.cpu);
        updateProgressBar('ram-fill', 'ram-perc', data.mem);
        updateProgressBar('disk-fill', 'disk-perc', data.disk.capacity);

        // Update Text Metrics
        if (document.getElementById('uptime-val')) {
            const h = Math.floor(data.uptime / 3600);
            const m = Math.floor((data.uptime % 3600) / 60);
            document.getElementById('uptime-val').innerText = `${h}h ${m}m`;
        }
        if (document.getElementById('disk-total')) {
            document.getElementById('disk-total').innerText = data.disk.total;
        }

        // Set Online Status
        updateServerStatus(true);

    } catch (error) {
        console.error('Telemetry Error:', error);
        updateServerStatus(false);
    }
}

function updateProgressBar(fillId, textId, value) {
    const fill = document.getElementById(fillId);
    const text = document.getElementById(textId);
    if (fill) fill.style.width = `${value}%`;
    if (text) text.innerText = `${value}%`;
}



// --- 3. MUSIC PLAYER LOGIC ---
const audio = document.getElementById('main-audio');
const playBtn = document.getElementById('play-btn');
const trackList = document.getElementById('track-list'); // Get the UL
const playerTrackTitle = document.getElementById('player-track-title');
const activeCover = document.getElementById('active-cover');
const prevBtn = document.getElementById('prev-btn'); // For previous track button
const nextBtn = document.getElementById('next-btn'); // For next track button

let currentTrackIndex = -1; // -1 means no track selected initially
let tracks = []; // To store track data

// Function to load a track
function loadTrack(index) {
    if (index < 0 || index >= tracks.length) return;

    currentTrackIndex = index;
    const trackName = tracks[index].name.replace('.wav', '.mp3'); // Assume .mp3 on server
    const trackTitle = tracks[index].name.replace(/_/g, ' ').replace('.wav', ''); // For display
    const coverName = tracks[index].name.replace('.wav', '.webp'); // Assume .webp for cover

    audio.src = OCI_MEDIA_BASE_URL + trackName;
    playerTrackTitle.innerText = trackTitle;

    // Update active cover
    if (activeCover) {
        activeCover.srcset = `assets/img/music_covers/${coverName}`;
        activeCover.src = `assets/img/music_covers/${coverName.replace('.webp', '.jpg')}`; // Fallback for jpg
    }
    
    // Automatically play if a track is already playing or if it's the first track selected
    if (!audio.paused || currentTrackIndex === 0) { // Add condition to play first track if clicked
        audio.play();
        playBtn.innerText = '⏸';
    } else {
        playBtn.innerText = '▶';
    }
}

// Event listener for play/pause button
if (playBtn && audio) {
    playBtn.addEventListener('click', () => {
        if (currentTrackIndex === -1 && tracks.length > 0) {
            // If no track is selected, play the first one
            loadTrack(0);
        } else if (audio.paused) {
            audio.play();
            playBtn.innerText = '⏸';
        } else {
            audio.pause();
            playBtn.innerText = '▶';
        }
    });
}

// Event listeners for previous/next buttons
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentTrackIndex > 0) {
            loadTrack(currentTrackIndex - 1);
        } else if (tracks.length > 0) {
            loadTrack(tracks.length - 1); // Loop to last track
        }
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (currentTrackIndex < tracks.length - 1) {
            loadTrack(currentTrackIndex + 1);
        } else if (tracks.length > 0) {
            loadTrack(0); // Loop to first track
        }
    });
}


// Populate tracks array and set up click listeners
if (trackList) {
    const trackItems = trackList.querySelectorAll('.track-select');
    trackItems.forEach((item, index) => {
        tracks.push({
            name: item.querySelector('.name').innerText,
            // You can add more properties here like size, artist, etc.
        });
        item.addEventListener('click', () => loadTrack(index));
    });
}

// Handle audio ended event
if (audio) {
    audio.addEventListener('ended', () => {
        if (currentTrackIndex < tracks.length - 1) {
            loadTrack(currentTrackIndex + 1); // Play next track
            audio.play();
        } else {
            // Last track ended, stop or loop
            playBtn.innerText = '▶';
            currentTrackIndex = -1; // Reset selection
        }
    });
}

// --- 4. TERMINAL (CLI) OVERLAY ---
const cliTrigger = document.getElementById('cli-trigger');
const cliOverlay = document.getElementById('cli-overlay');

if (cliTrigger && cliOverlay) {
    cliTrigger.addEventListener('click', () => {
        cliOverlay.classList.toggle('hidden');
    });
}
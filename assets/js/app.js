document.addEventListener('DOMContentLoaded', () => {
    // --- Global Elements ---
    const body = document.body;
    const cliOverlay = document.getElementById('cli-overlay');
    const cliInput = document.getElementById('cli-input');
    const cliOutput = document.getElementById('cli-output');
    const globalAudioPlayer = document.getElementById('global-audio-element');
    
    // --- Page-specific Elements (check for existence) ---
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const currentTrackInfo = document.getElementById('current-track');
    const trackTimeDisplay = document.getElementById('track-time');
    const musicTracklist = document.getElementById('music-tracklist');
    const audioVisualizer = document.getElementById('audio-visualizer');

    // --- Booting Animation (index.html only) ---
    if (body.classList.contains('booting')) {
        const bootScreen = document.querySelector('.boot-screen');
        setTimeout(() => {
            bootScreen.classList.add('hidden');
            body.classList.remove('booting');
        }, 4000); // Hide after 4 seconds
    }

    // --- Global Glitch Effect for Nav Brand ---
    const navBrandGlitch = document.querySelector('.nav-brand.glitch');
    if (navBrandGlitch) {
        // Set data-text for CSS glitch effect
        navBrandGlitch.setAttribute('data-text', navBrandGlitch.textContent);
    }

    // --- CLI Overlay Logic ---
    const cliToggleBtn = document.getElementById('cli-toggle');
    if (cliToggleBtn) {
        cliToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCliOverlay();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === '`' || e.key === '~') { // Tilde key
            e.preventDefault();
            toggleCliOverlay();
        }
    });

    function toggleCliOverlay() {
        cliOverlay.classList.toggle('active');
        if (cliOverlay.classList.contains('active')) {
            cliInput.focus();
            body.style.overflow = 'hidden'; // Prevent body scroll when CLI is open
            printCliOutput('Type `help` for a list of commands.');
        } else {
            body.style.overflow = ''; // Restore body scroll
            cliOutput.innerHTML = ''; // Clear output when closing
            cliInput.value = '';
        }
    }

    function printCliOutput(message, color = 'var(--color-terminal-green)') {
        const p = document.createElement('p');
        p.textContent = message;
        p.style.color = color;
        cliOutput.appendChild(p);
        cliOutput.scrollTop = cliOutput.scrollHeight; // Auto-scroll to bottom
    }

    cliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = cliInput.value.trim();
            printCliOutput(`console@cec-portfolio:~$ ${command}`, 'var(--color-goldenrod)'); // Echo command
            executeCliCommand(command);
            cliInput.value = '';
        }
    });

    function executeCliCommand(command) {
        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        switch (cmd) {
            case 'help':
                printCliOutput('Available commands:');
                printCliOutput('  help - Display this help message.');
                printCliOutput('  cd [systems|music|hub] - Navigate to a different section.');
                printCliOutput('  play - Start playing audio (if on music page).');
                printCliOutput('  clear - Clear the terminal output.');
                printCliOutput('  uptime - Show simulated system uptime.');
                break;
            case 'cd':
                if (args.length > 0) {
                    const targetPage = args[0].toLowerCase();
                    let url = '';
                    if (targetPage === 'systems' || targetPage === 'it_work') {
                        url = 'systems.html';
                    } else if (targetPage === 'music' || targetPage === 'studio') {
                        url = 'music.html';
                    } else if (targetPage === 'hub' || targetPage === 'index') {
                        url = 'index.html';
                    } else {
                        printCliOutput(`Error: Page '${args[0]}' not found. Use 'systems', 'music', or 'hub'.`, 'red');
                        return;
                    }
                    printCliOutput(`Navigating to ${url}...`);
                    setTimeout(() => window.location.href = url, 500); // Simulate navigation delay
                } else {
                    printCliOutput('Usage: cd [systems|music|hub]', 'red');
                }
                break;
            case 'play':
                if (globalAudioPlayer && !globalAudioPlayer.src) {
                    printCliOutput('No track loaded. Use the music page to select a track.');
                } else if (globalAudioPlayer) {
                    globalAudioPlayer.play();
                    printCliOutput('Audio playback started.');
                    if (playPauseBtn) playPauseBtn.textContent = '⏸';
                }
                break;
            case 'clear':
                cliOutput.innerHTML = '';
                break;
            case 'uptime':
                const now = new Date();
                const startup = new Date(localStorage.getItem('systemStartupTime') || now);
                const diff = now.getTime() - startup.getTime();
                const seconds = Math.floor(diff / 1000);
                const minutes = Math.floor(seconds / 60);
                const hours = Math.floor(minutes / 60);
                const days = Math.floor(hours / 24);

                const uptimeStr = `${days} days, ${hours % 24} hours, ${minutes % 60} minutes, ${seconds % 60} seconds`;
                printCliOutput(`Simulated Uptime: ${uptimeStr}`);
                break;
            default:
                printCliOutput(`Error: Command not found: ${command}. Type 'help' for available commands.`, 'red');
                break;
        }
    }

    // Initialize system startup time for uptime command
    if (!localStorage.getItem('systemStartupTime')) {
        localStorage.setItem('systemStartupTime', new Date().toISOString());
    }

    // --- Global Audio Player Controls ---
    // Persistent audio state using localStorage
    const savedAudioState = JSON.parse(localStorage.getItem('audioState')) || {
        src: '',
        title: 'Not playing',
        currentTime: 0,
        volume: 0.75,
        isPlaying: false,
        tracklist: [
            { title: "Bittersweet Symphony (Demo)", src: "music/dummy_track.mp3" },
            { title: "Terminal Heartbreak", src: "music/dummy_track.mp3" },
            { title: "Neon Echoes", src: "music/dummy_track.mp3" }
        ],
        currentTrackIndex: 0
    };

    function updateAudioState(newState) {
        Object.assign(savedAudioState, newState);
        localStorage.setItem('audioState', JSON.stringify(savedAudioState));
        updatePlayerUI();
    }

    function updatePlayerUI() {
        if (currentTrackInfo) currentTrackInfo.textContent = savedAudioState.title;
        if (trackTimeDisplay) {
            const min = Math.floor(globalAudioPlayer.currentTime / 60);
            const sec = Math.floor(globalAudioPlayer.currentTime % 60);
            const totalMin = Math.floor(globalAudioPlayer.duration / 60) || 0;
            const totalSec = Math.floor(globalAudioPlayer.duration % 60) || 0;
            trackTimeDisplay.textContent = `${min}:${sec < 10 ? '0'+sec : sec} / ${totalMin}:${totalSec < 10 ? '0'+totalSec : totalSec}`;
        }
        if (playPauseBtn) playPauseBtn.textContent = savedAudioState.isPlaying ? '⏸' : '▶';
        if (volumeSlider) volumeSlider.value = savedAudioState.volume;

        // Highlight active track on music page
        if (musicTracklist) {
            Array.from(musicTracklist.children).forEach((item, index) => {
                if (index === savedAudioState.currentTrackIndex && savedAudioState.src === item.dataset.src) {
                    item.classList.add('active-track');
                } else {
                    item.classList.remove('active-track');
                }
            });
        }
    }

    // Initialize audio player
    if (globalAudioPlayer) {
        globalAudioPlayer.volume = savedAudioState.volume;
        if (savedAudioState.src) {
            globalAudioPlayer.src = savedAudioState.src;
            if (savedAudioState.isPlaying) {
                // Attempt to play, but user interaction might be required
                globalAudioPlayer.play().catch(e => console.log("Autoplay prevented:", e));
            }
        }
        updatePlayerUI(); // Initial UI update
    }

    // Player button event listeners
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (globalAudioPlayer.paused) {
                globalAudioPlayer.play();
                updateAudioState({ isPlaying: true });
            } else {
                globalAudioPlayer.pause();
                updateAudioState({ isPlaying: false });
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            savedAudioState.currentTrackIndex = (savedAudioState.currentTrackIndex - 1 + savedAudioState.tracklist.length) % savedAudioState.tracklist.length;
            const newTrack = savedAudioState.tracklist[savedAudioState.currentTrackIndex];
            globalAudioPlayer.src = newTrack.src;
            globalAudioPlayer.load();
            globalAudioPlayer.play();
            updateAudioState({ src: newTrack.src, title: newTrack.title, isPlaying: true, currentTime: 0 });
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            savedAudioState.currentTrackIndex = (savedAudioState.currentTrackIndex + 1) % savedAudioState.tracklist.length;
            const newTrack = savedAudioState.tracklist[savedAudioState.currentTrackIndex];
            globalAudioPlayer.src = newTrack.src;
            globalAudioPlayer.load();
            globalAudioPlayer.play();
            updateAudioState({ src: newTrack.src, title: newTrack.title, isPlaying: true, currentTime: 0 });
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', () => {
            globalAudioPlayer.volume = volumeSlider.value;
            updateAudioState({ volume: volumeSlider.value });
        });
    }

    if (globalAudioPlayer) {
        globalAudioPlayer.addEventListener('timeupdate', updatePlayerUI);
        globalAudioPlayer.addEventListener('ended', () => {
            // Auto-play next track
            savedAudioState.currentTrackIndex = (savedAudioState.currentTrackIndex + 1) % savedAudioState.tracklist.length;
            const newTrack = savedAudioState.tracklist[savedAudioState.currentTrackIndex];
            globalAudioPlayer.src = newTrack.src;
            globalAudioPlayer.load();
            globalAudioPlayer.play();
            updateAudioState({ src: newTrack.src, title: newTrack.title, isPlaying: true, currentTime: 0 });
        });
        globalAudioPlayer.addEventListener('loadedmetadata', updatePlayerUI); // Update duration once loaded
    }

    // --- Music Page Specifics (Tracklist & Visualizer) ---
    if (musicTracklist) {
        musicTracklist.addEventListener('click', (e) => {
            const trackItem = e.target.closest('.track-item');
            if (trackItem) {
                const src = trackItem.dataset.src;
                const title = trackItem.dataset.title;
                const index = Array.from(musicTracklist.children).indexOf(trackItem);

                globalAudioPlayer.src = src;
                globalAudioPlayer.load();
                globalAudioPlayer.play();
                updateAudioState({ src: src, title: title, isPlaying: true, currentTrackIndex: index, currentTime: 0 });
            }
        });

        // Simple Visualizer Animation
        if (audioVisualizer) {
            const bars = audioVisualizer.querySelectorAll('.bar');
            globalAudioPlayer.addEventListener('play', () => {
                bars.forEach(bar => bar.style.animationPlayState = 'running');
            });
            globalAudioPlayer.addEventListener('pause', () => {
                bars.forEach(bar => bar.style.animationPlayState = 'paused');
            });
            globalAudioPlayer.addEventListener('ended', () => {
                bars.forEach(bar => bar.style.animationPlayState = 'paused');
            });
            // Initial state
            if (savedAudioState.isPlaying) {
                 bars.forEach(bar => bar.style.animationPlayState = 'running');
            } else {
                 bars.forEach(bar => bar.style.animationPlayState = 'paused');
            }
        }
    }


    // --- Systems Page Specifics (Simulated Metrics) ---
    if (document.querySelector('.dashboard')) { // Check if on systems.html
        const cpuUsageDisplay = document.getElementById('cpu-usage-display');
        const cpuBarFill = document.getElementById('cpu-bar-fill');
        const ramUsageDisplay = document.getElementById('ram-usage-display');
        const ramBarFill = document.getElementById('ram-bar-fill');
        const uptimeDisplay = document.getElementById('uptime-display');
        const nginxLogOutput = document.getElementById('nginx-log-output');

        function updateSystemMetrics() {
            // CPU & RAM
            const cpu = (Math.random() * 40 + 10).toFixed(1); // 10-50%
            const ram = (Math.random() * 30 + 50).toFixed(1); // 50-80%
            if (cpuUsageDisplay) cpuUsageDisplay.textContent = `${cpu}%`;
            if (cpuBarFill) cpuBarFill.style.width = `${cpu}%`;
            if (ramUsageDisplay) ramUsageDisplay.textContent = `${ram}%`;
            if (ramBarFill) ramBarFill.style.width = `${ram}%`;

            // Uptime
            const startup = new Date(localStorage.getItem('systemStartupTime'));
            const now = new Date();
            const diffMs = now - startup;
            const seconds = Math.floor(diffMs / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            const format = (num) => num < 10 ? '0' + num : num;
            if (uptimeDisplay) {
                uptimeDisplay.textContent = `${days}d ${format(hours % 24)}:${format(minutes % 60)}:${format(seconds % 60)}`;
            }

            // Nginx Logs
            const fakeLogEntries = [
                `123.45.67.89 - - [${new Date().toLocaleString()}] "GET /index.html HTTP/1.1" 200 1234 "-" "Mozilla/5.0..."`,
                `203.0.113.1 - - [${new Date().toLocaleString()}] "GET /assets/css/style.css HTTP/1.1" 200 5678 "-" "Mozilla/5.0..."`,
                `198.51.100.2 - - [${new Date().toLocaleString()}] "GET /music/dummy_track.mp3 HTTP/1.1" 200 9012 "-" "Mozilla/5.0..."`,
                `10.0.0.5 - - [${new Date().toLocaleString()}] "POST /api/data HTTP/1.1" 404 150 "-" "curl/7.68.0"`,
                `172.16.0.1 - - [${new Date().toLocaleString()}] "GET /systems.html HTTP/1.1" 200 3456 "-" "Chrome/..."`,
            ];
            if (nginxLogOutput) {
                const newLog = document.createElement('p');
                newLog.textContent = fakeLogEntries[Math.floor(Math.random() * fakeLogEntries.length)];
                nginxLogOutput.appendChild(newLog);
                if (nginxLogOutput.children.length > 50) { // Keep log output manageable
                    nginxLogOutput.removeChild(nginxLogOutput.children[0]);
                }
                nginxLogOutput.scrollTop = nginxLogOutput.scrollHeight;
            }
        }
        setInterval(updateSystemMetrics, 1500); // Update every 1.5 seconds
        updateSystemMetrics(); // Initial call
    }
});

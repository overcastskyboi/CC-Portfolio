document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('main-audio');
    const playBtn = document.getElementById('play-btn');
    const progressBar = document.getElementById('progress-bar');
    const volumeSlider = document.getElementById('volume-slider');
    const trackTitle = document.getElementById('player-track-title');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    
    // Tracks array (updated from previous interaction)
    const tracks = [
        { name: "Alive But I'm Dying.wav", path: "music/Alive But I'm Dying.wav", cover: "assets/img/music_covers/Alive But I'm Dying.jpg" },
        { name: "Sorry.wav", path: "music/Sorry.wav", cover: "assets/img/music_covers/Sorry.jpg" },
        { name: "Promise.wav", path: "music/Promise.wav", cover: "assets/img/music_covers/Promise.jpg" },
        { name: "Need Somebody.wav", path: "music/Need Somebody.wav", cover: "assets/img/music_covers/Need Somebody.jpg" },
        { name: "Meant to Be.wav", path: "music/Meant to Be.wav", cover: "assets/img/music_covers/Meant to Be.jpg" },
        { name: "Look At What You've Done.wav", path: "music/Look At What You've Done.wav", cover: "assets/img/music_covers/Look At What You've Done.jpg" },
        { name: "Coulda Been (feat. Emerson Vernon).wav", path: "music/Coulda Been (feat. Emerson Vernon).wav", cover: "assets/img/music_covers/Coulda Been (feat. Emerson Vernon).jpg" }
    ];

    let currentTrackIdx = parseInt(localStorage.getItem('cec_current_track')) || 0;
    
    // --- Boot Screen Auto-Exit Logic ---
    const bootScreen = document.getElementById('boot-screen');
    if (bootScreen) { // Check if boot screen exists (i.e., we are on index.html)
        setTimeout(() => {
            bootScreen.classList.add('hidden');
            document.body.classList.remove('booting'); // Remove body class that might prevent scroll
        }, 3500); // Hide after 3.5 seconds as per user's description
    }

    function loadTrack(idx) {
        if (!audio || !tracks[idx]) return; // Null check
        audio.src = tracks[idx].path;
        trackTitle && (trackTitle.innerText = tracks[idx].name.replace('.wav', '').replace(/_/g, ' ')); // Optional chaining for trackTitle
        localStorage.setItem('cec_current_track', idx);
        document.querySelectorAll('.fs-item').forEach((el, i) => el.classList.toggle('playing', i === idx));
        
        // Update album cover if element exists
        const activeCover = document.getElementById('active-cover');
        if (activeCover && tracks[idx]?.cover) {
            activeCover.src = tracks[idx].cover;
        }
        // Update lyric snippet (placeholder)
        const lyricText = document.getElementById('lyric-text');
        if (lyricText) {
            lyricText.innerText = `"${tracks[idx].name.replace('.wav', '').replace(/_/g, ' ')} is now playing."`;
        }
    }

    // Only attempt to load track if audio element exists and tracks are available
    if (audio && tracks.length > 0) {
        loadTrack(currentTrackIdx);
    }

    playBtn?.addEventListener('click', () => { // Optional chaining for playBtn
        if (audio?.paused) { // Optional chaining for audio
            audio.play();
            if (playBtn) playBtn.innerText = "⏸";
        } else {
            audio?.pause();
            if (playBtn) playBtn.innerText = "▶";
        }
    });

    audio?.addEventListener('timeupdate', () => { // Optional chaining for audio
        if (progressBar) progressBar.value = (audio.currentTime / audio.duration) * 100 || 0;
        if (currentTimeEl) currentTimeEl.innerText = formatTime(audio.currentTime);
        if (durationEl) durationEl.innerText = formatTime(audio.duration);
    });

    function formatTime(s) { if (isNaN(s)) return "0:00"; const m = Math.floor(s/60); const sec = Math.floor(s%60); return `${m}:${sec<10?'0':''}${sec}`; }

    // --- Systems Page Specifics (Real-time Telemetry) ---
    if (document.body.classList.contains('page-systems')) {
        /**
         * LIVE OCI TELEMETRY FETCH
         * Connected to CEC Metrics API @ 129.80.222.26
         */
        async function updateLiveTelemetry() {
            const telemetryEndpoint = 'http://129.80.222.26:3000/metrics';
            const statusDot = document.getElementById('status-dot');
            const statusText = document.getElementById('status-text');
            
            try {
                const response = await fetch(telemetryEndpoint);
                if (!response.ok) throw new Error('Network response was not ok');
                
                const data = await response.json();

                // Update the UI elements
                // Ensure these IDs match your HTML!
                if(document.getElementById('cpu-perc')) { 
                    document.getElementById('cpu-perc').innerText = `${data.cpu}%`;
                }
                if(document.getElementById('ram-perc')) { 
                    document.getElementById('ram-perc').innerText = `${data.mem}%`;
                }
                // Update progress bars
                if(document.getElementById('cpu-fill')) { 
                    document.getElementById('cpu-fill').style.width = `${data.cpu}%`;
                }
                if(document.getElementById('ram-fill')) { 
                    document.getElementById('ram-fill').style.width = `${data.mem}%`;
                }
                if(document.getElementById('sys-load')) { 
                    document.getElementById('sys-load').innerText = data.load;
                }
                
                // Convert seconds to readable Uptime (Hh Mm)
                if(document.getElementById('uptime-val')) { 
                    const hours = Math.floor(data.uptime / 3600);
                    const mins = Math.floor((data.uptime % 3600) / 60);
                    document.getElementById('uptime-val').innerText = `${hours}h ${mins}m`;
                }

                // Update Status Indicator
                if(statusDot) statusDot.className = 'dot-online';
                if(statusText) statusText.innerText = 'SERVER LIVE';

            } catch (error) {
                console.error('Telemetry Fetch Error:', error);
                // UI Fallback
                const metrics = ['cpu-perc', 'ram-perc', 'sys-load', 'uptime-val'];
                metrics.forEach(id => {
                    const el = document.getElementById(id);
                    if(el) el.innerText = 'OFFLINE';
                });
                 // Also reset progress bars
                if(document.getElementById('cpu-fill')) document.getElementById('cpu-fill').style.width = "0%";
                if(document.getElementById('ram-fill')) document.getElementById('ram-fill').style.width = "0%";
                
                // Update Status Indicator
                if(statusDot) statusDot.className = 'dot-offline';
                if(statusText) statusText.innerText = 'SERVER OFFLINE';
            }
        }

        // Refresh every 10 seconds (don't over-poll the OCI node)
        setInterval(updateLiveTelemetry, 10000);
        updateLiveTelemetry(); // Run immediately on load

        // Preserve Nginx Logs (tail -f) - this was part of the old block and needs to be preserved
        setInterval(() => {
            const fakeLogEntries = [
                `123.45.67.89 - - [${new Date().toLocaleString()}] "GET /index.html HTTP/1.1" 200 1234 "-" "Mozilla/5.0..."`,
                `203.0.113.1 - - [${new Date().toLocaleString()}] "GET /assets/css/style.css HTTP/1.1" 200 5678 "-" "Mozilla/5.0..."`,
                `198.51.100.2 - - [${new Date().toLocaleString()}] "GET /music/dummy_track.mp3 HTTP/1.1" 200 9012 "-" "Mozilla/5.0..."`,
                `10.0.0.5 - - [${new Date().toLocaleString()}] "POST /api/data HTTP/1.1" 404 150 "-" "curl/7.68.0"`,
                `172.16.0.1 - - [${new Date().toLocaleString()}] "GET /systems.html HTTP/1.1" 200 3456 "-" "Chrome/..."`,
            ];
            const nginxLogOutput = document.getElementById('log-stream'); // Correct ID from systems.html
            if (nginxLogOutput) {
                const newLog = document.createElement('p');
                newLog.textContent = fakeLogEntries[Math.floor(Math.random() * fakeLogEntries.length)];
                nginxLogOutput.prepend(newLog); // prepend to show new logs at top
                if (nginxLogOutput.children.length > 20) { // Keep log output manageable
                    nginxLogOutput.removeChild(nginxLogOutput.lastChild);
                }
            }
        }, 1500); // Nginx log update interval
    }

    const cliOverlay = document.getElementById('cli-overlay');
    const cliTrigger = document.getElementById('cli-trigger'); // New: for systems/music pages
    const cliInput = document.getElementById('cli-input');
    const cliOutput = document.getElementById('cli-output');

    cliTrigger?.addEventListener('click', () => { // Optional chaining
        cliOverlay?.classList.toggle('hidden');
        if (!cliOverlay?.classList.contains('hidden')) {
            cliInput?.focus();
        }
    });


    window.addEventListener('keydown', (e) => {
        if (e.key === '~' || e.key === '`') {
            e.preventDefault();
            cliOverlay?.classList.toggle('hidden'); // Optional chaining
            if (!cliOverlay?.classList.contains('hidden')) {
                cliInput?.focus();
            }
        }
    });

    // CLI Command processing - Placeholder, actual implementation would be more complex
    cliInput?.addEventListener('keydown', (e) => { // Optional chaining
        if (e.key === 'Enter') {
            const command = cliInput.value.trim();
            if (cliOutput) {
                const commandLine = document.createElement('p');
                commandLine.innerHTML = `<span style="color: var(--gold);">opc@cec:~$</span> ${command}`;
                cliOutput.appendChild(commandLine);
            }
            // Basic command response (e.g., help, cd)
            if (command === 'help') {
                const helpOutput = document.createElement('p');
                helpOutput.innerHTML = `<span style="color: var(--terminal-green);">Available commands: help, cd [systems|music|hub], clear</span>`;
                cliOutput?.appendChild(helpOutput);
            } else if (command.startsWith('cd ')) {
                const target = command.split(' ')[1];
                let url = '';
                if (target === 'systems') url = 'systems.html';
                else if (target === 'music') url = 'music.html';
                else if (target === 'hub') url = 'index.html';

                if (url) {
                    window.location.href = url;
                } else {
                    const errorOutput = document.createElement('p');
                    errorOutput.innerHTML = `<span style="color: red;">Error: Invalid path.</span>`;
                    cliOutput?.appendChild(errorOutput);
                }
            } else if (command === 'clear') {
                if (cliOutput) cliOutput.innerHTML = '';
            }
            cliInput.value = '';
            cliOutput?.scrollTop = cliOutput.scrollHeight;
        }
    });

    // --- Audio Player Controls & Playlist Management ---
    // The previous app.js had a full audio implementation. I will integrate the user's provided `tracks` array and enhance the existing logic.

    // Re-integrating complete audio logic with null checks and optional chaining
    if (audio) {
        // Initial setup for existing tracks array (from user's code block)
        if (tracks.length > 0) {
            loadTrack(currentTrackIdx);
        }

        audio.addEventListener('ended', () => {
            currentTrackIdx = (currentTrackIdx + 1) % tracks.length;
            loadTrack(currentTrackIdx);
            audio.play();
        });

        if (progressBar) {
            progressBar.addEventListener('input', () => {
                audio.currentTime = (progressBar.value / 100) * audio.duration;
            });
        }
        
        if (volumeSlider) {
            volumeSlider.addEventListener('input', () => {
                audio.volume = volumeSlider.value;
            });
            audio.volume = volumeSlider.value; // Set initial volume
        }
    }
    // Music Page Tracklist Click Handler
    document.querySelectorAll('.track-select')?.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentTrackIdx = index;
            loadTrack(currentTrackIdx);
            audio?.play();
            playBtn && (playBtn.innerText = "⏸");
            
            // Update album cover if element exists
            const activeCover = document.getElementById('active-cover');
            if (activeCover && tracks[currentTrackIdx]?.cover) {
                activeCover.src = tracks[currentTrackIdx].cover;
            }
            // Update lyric snippet (placeholder)
            const lyricText = document.getElementById('lyric-text');
            if (lyricText) {
                lyricText.innerText = `"${tracks[currentTrackIdx].name.replace('.wav', '').replace(/_/g, ' ')} is now playing."`;
            }

        });
    });

    // Player controls (prev/next)
    document.getElementById('prev-btn')?.addEventListener('click', () => {
        currentTrackIdx = (currentTrackIdx - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrackIdx);
        audio?.play();
        playBtn && (playBtn.innerText = "⏸");
    });

    document.getElementById('next-btn')?.addEventListener('click', () => {
        currentTrackIdx = (currentTrackIdx + 1) % tracks.length;
        loadTrack(currentTrackIdx);
        audio?.play();
        playBtn && (playBtn.innerText = "⏸");
    });

});

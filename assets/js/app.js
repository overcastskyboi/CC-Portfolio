document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('main-audio');
    const playBtn = document.getElementById('play-btn');
    const progressBar = document.getElementById('progress-bar');
    const volumeSlider = document.getElementById('volume-slider');
    const trackTitle = document.getElementById('player-track-title');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    
    const tracks = [
        { name: "Alive But I'm Dying.wav", path: "music/Alive But I'm Dying.wav", cover: "assets/img/music_covers/alive.jpg" },
        { name: "Sorry.wav", path: "music/Sorry.wav", cover: "assets/img/music_covers/sorry.jpg" },
        { name: "Need_Somebody.wav", path: "music/Need Somebody.wav", cover: "assets/img/music_covers/need.jpg" },
        { name: "Promise.wav", path: "music/Promise.wav", cover: "assets/img/music_covers/promise.jpg" }
    ];

    let currentTrackIdx = parseInt(localStorage.getItem('cec_current_track')) || 0;
    
    function loadTrack(idx) {
        audio.src = tracks[idx].path;
        trackTitle.innerText = tracks[idx].name.replace('.wav', '').replace(/_/g, ' ');
        localStorage.setItem('cec_current_track', idx);
        document.querySelectorAll('.fs-item').forEach((el, i) => el.classList.toggle('playing', i === idx));
    }

    loadTrack(currentTrackIdx);

    playBtn.addEventListener('click', () => {
        if (audio.paused) { audio.play(); playBtn.innerText = "⏸"; } 
        else { audio.pause(); playBtn.innerText = "▶"; }
    });

    audio.addEventListener('timeupdate', () => {
        progressBar.value = (audio.currentTime / audio.duration) * 100 || 0;
        currentTimeEl.innerText = formatTime(audio.currentTime);
        durationEl.innerText = formatTime(audio.duration);
    });

    function formatTime(s) { if (isNaN(s)) return "0:00"; const m = Math.floor(s/60); const sec = Math.floor(s%60); return `${m}:${sec<10?'0':''}${sec}`; }

    if (document.body.classList.contains('page-systems')) {
        setInterval(() => {
            document.getElementById('cpu-fill').style.width = (Math.random()*15+5) + "%";
            document.getElementById('ram-fill').style.width = (Math.random()*10+40) + "%";
            const p = document.createElement('p'); p.innerText = `[${new Date().toLocaleTimeString()}] GET /api/v1/telemetry 200 OK`;
            document.getElementById('log-stream').prepend(p);
        }, 2000);
    }

    const cliOverlay = document.getElementById('cli-overlay');
    const cliInput = document.getElementById('cli-input');
    window.addEventListener('keydown', (e) => { if (e.key === '~' || e.key === '`') { e.preventDefault(); cliOverlay.classList.toggle('hidden'); if (!cliOverlay.classList.contains('hidden')) cliInput.focus(); } });
});
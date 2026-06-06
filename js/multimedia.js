// =========================================================
//  MULTIMEDIA.JS
//  Fitur teknis multimedia:
//  1. SIGNAL PROCESSING  – Real-time FFT waveform visualizer
//  2. KOMPRESI           – Image compression demo + storage stats
//  3. KEAMANAN           – Input sanitization, session timeout, HTTPS check
// =========================================================

/* ─────────────────────────────────────────

// ─────────────────────────────────────────
//  ASET LOKAL — ubah path sesuai folder kamu
// ─────────────────────────────────────────
const ASSETS = {
  // 🎵 Musik (sync dengan BACKSOUND_SRC di audio.js)
  music: 'assets/music/backsound.mp3',

  // 🖼️ Logo — tampil di login & topbar
  //   Kosongkan ('') kalau mau tetap pakai emoji 🦉
  logo: 'assets/img/logo.png',

  logoSize: 32,   // ukuran di topbar (px)
  logoLogin: 72,  // ukuran di login screen (px)
};

function injectLogo() {
  if (!ASSETS.logo) return;
  const img = (size) =>
    `<img src="${ASSETS.logo}" alt="EnglishKu" style="height:${size}px;width:${size}px;object-fit:contain;vertical-align:middle;display:inline-block;">`;

  const loginOwl = document.querySelector('.logo-owl');
  if (loginOwl) loginOwl.innerHTML = img(ASSETS.logoLogin);

  document.querySelectorAll('.brand-owl').forEach(el => { el.innerHTML = img(ASSETS.logoSize); });

  const wcOwl = document.querySelector('.wc-owl');
  if (wcOwl) wcOwl.innerHTML = img(56);
}


   1. SIGNAL PROCESSING – Audio Visualizer
   Real-time FFT + waveform using Web Audio API AnalyserNode
───────────────────────────────────────── */
const AudioVisualizer = (() => {
  let analyser = null, dataArray = null, animId = null;
  let bars = [], waveCtx = null;

  function init(audioCtx) {
    if (!audioCtx || analyser) return;
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;                   // 32 frequency bins (FFT)
    analyser.smoothingTimeConstant = 0.75;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.connect(audioCtx.destination);

    // inject visualizer bar container
    const wrap = document.createElement('div');
    wrap.className = 'audio-visualizer-wrap';
    wrap.id = 'audioVizWrap';
    for (let i = 0; i < 32; i++) {
      const bar = document.createElement('div');
      bar.className = 'viz-bar';
      wrap.appendChild(bar);
      bars.push(bar);
    }
    document.body.appendChild(wrap);
    loop();
  }

  function loop() {
    if (!analyser) return;
    animId = requestAnimationFrame(loop);
    analyser.getByteFrequencyData(dataArray);     // FFT frequency domain data
    bars.forEach((bar, i) => {
      const v = dataArray[i] || 0;
      const h = Math.max(3, (v / 255) * 46);
      bar.style.height = h + 'px';
      bar.classList.toggle('active', v > 30);
    });
    // update tech panel live
    updateSignalStats(dataArray);
    // update voice waveform if recording
    if (waveCtx) drawWaveform();
  }

  function getAnalyser() { return analyser; }

  // Time-domain waveform for voice recording
  function initVoiceCanvas(canvasEl) {
    if (!canvasEl || !analyser) return;
    waveCtx = canvasEl.getContext('2d');
    canvasEl.width = canvasEl.offsetWidth * window.devicePixelRatio;
    canvasEl.height = canvasEl.offsetHeight * window.devicePixelRatio;
    waveCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  function clearVoiceCanvas() { waveCtx = null; }

  function drawWaveform() {
    if (!waveCtx || !analyser) return;
    const timeDomain = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(timeDomain);    // time-domain waveform data
    const W = waveCtx.canvas.width / window.devicePixelRatio;
    const H = waveCtx.canvas.height / window.devicePixelRatio;
    waveCtx.clearRect(0, 0, W, H);
    waveCtx.beginPath();
    waveCtx.strokeStyle = 'rgba(255,107,53,.8)';
    waveCtx.lineWidth = 2;
    const sliceW = W / timeDomain.length;
    let x = 0;
    timeDomain.forEach((v, i) => {
      const y = (v / 128) * (H / 2);
      i === 0 ? waveCtx.moveTo(x, y) : waveCtx.lineTo(x, y);
      x += sliceW;
    });
    waveCtx.stroke();
  }

  // Waveform canvas for tech panel
  function drawTechWaveform(canvasEl) {
    if (!canvasEl || !analyser) { return; }
    const ctx = canvasEl.getContext('2d');
    const W = canvasEl.offsetWidth || 260, H = 40;
    canvasEl.width = W; canvasEl.height = H;
    const timeDomain = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(timeDomain);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,255,255,.03)';
    ctx.fillRect(0, 0, W, H);
    ctx.beginPath();
    ctx.strokeStyle = '#FF6B35';
    ctx.lineWidth = 1.5;
    const sw = W / timeDomain.length;
    timeDomain.forEach((v, i) => {
      const y = (v / 128) * (H / 2);
      i === 0 ? ctx.moveTo(0, y) : ctx.lineTo(i * sw, y);
    });
    ctx.stroke();
    // also draw frequency bars
    analyser.getByteFrequencyData(dataArray);
    ctx.fillStyle = 'rgba(78,205,196,.5)';
    const bw = W / dataArray.length;
    dataArray.forEach((v, i) => {
      const bh = (v / 255) * H;
      ctx.fillRect(i * bw, H - bh, bw - 1, bh);
    });
  }

  return { init, getAnalyser, initVoiceCanvas, clearVoiceCanvas, drawTechWaveform };
})();

// Live signal stats for tech panel
let _peakFreq = 0, _rms = 0;
function updateSignalStats(freqData) {
  if (!freqData) return;
  let max = 0, idx = 0, sumSq = 0;
  freqData.forEach((v, i) => {
    if (v > max) { max = v; idx = i; }
    sumSq += v * v;
  });
  _peakFreq = Math.round(idx * (22050 / freqData.length));
  _rms = Math.round(Math.sqrt(sumSq / freqData.length));
  const peakEl = document.getElementById('techPeakFreq');
  const rmsEl  = document.getElementById('techRMS');
  if (peakEl) peakEl.textContent = _peakFreq + ' Hz';
  if (rmsEl)  rmsEl.textContent  = _rms;
}

/* ─────────────────────────────────────────
   2. KOMPRESI – Image + Data Compression
───────────────────────────────────────── */
const CompressionEngine = (() => {

  // Canvas-based image compression (mimics flutter_image_compress)
  function compressImageDataURL(dataURL, quality = 0.6, maxW = 800) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, maxW / img.width);
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve({
          original: dataURL.length,
          compressed: compressed.length,
          ratio: ((1 - compressed.length / dataURL.length) * 100).toFixed(1),
          dataURL: compressed,
          originalW: img.width, originalH: img.height,
          compressedW: canvas.width, compressedH: canvas.height
        });
      };
      img.src = dataURL;
    });
  }

  // Run-length encoding on string (lossless text compression)
  function rleEncode(str) {
    let result = '', i = 0;
    while (i < str.length) {
      let count = 1;
      while (i + count < str.length && str[i + count] === str[i] && count < 255) count++;
      result += (count > 1 ? count : '') + str[i];
      i += count;
    }
    return result;
  }

  // Measure storage compression stats
  function getStorageStats() {
    const raw = JSON.stringify(AppState || {});
    const rle = rleEncode(raw);
    const encoded = localStorage.getItem('englishku_v2') || '';
    return {
      rawBytes: raw.length,
      rleBytes: rle.length,
      storedBytes: encoded.length,
      rleSaving: ((1 - rle.length / raw.length) * 100).toFixed(1),
      totalSaving: encoded.length > 0
        ? ((1 - encoded.length / raw.length) * 100).toFixed(1)
        : '0'
    };
  }

  // Base64 size estimation
  function base64Size(str) { return Math.ceil((str.length * 3) / 4); }

  return { compressImageDataURL, rleEncode, getStorageStats, base64Size };
})();

/* ─────────────────────────────────────────
   3. KEAMANAN – Security Features
───────────────────────────────────────── */
const SecurityManager = (() => {
  const MAX_NAME_LEN = 30;
  const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 min
  const ALLOWED_CHARS = /^[a-zA-Z0-9 '\-\.àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ\u00C0-\u024F\u0100-\u017E]*$/;

  let sessionTimer = null, sessionStart = null, sessionEl = null;

  // Input sanitization
  function sanitize(input) {
    if (typeof input !== 'string') return '';
    // Strip HTML tags
    let s = input.replace(/<[^>]*>/g, '');
    // Strip script-ish content
    s = s.replace(/javascript:/gi, '').replace(/on\w+=/gi, '');
    // Trim & enforce length
    s = s.trim().slice(0, MAX_NAME_LEN);
    return s;
  }

  function isValidName(name) {
    const s = sanitize(name);
    return s.length >= 2 && s.length <= MAX_NAME_LEN;
  }

  // Attach real-time sanitization to an input
  function secureInput(inputEl) {
    if (!inputEl) return;
    inputEl.parentElement?.classList.add('input-secure');
    inputEl.addEventListener('input', () => {
      const clean = sanitize(inputEl.value);
      if (inputEl.value !== clean) inputEl.value = clean;
    });
    inputEl.addEventListener('paste', e => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData('text');
      inputEl.value = sanitize(pasted);
      inputEl.dispatchEvent(new Event('input'));
    });
  }

  // HTTPS check
  function checkHTTPS() {
    return location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  }

  // Session timeout
  function startSession() {
    sessionStart = Date.now();
    sessionEl = document.getElementById('sessionTimer');
    clearInterval(sessionTimer);
    sessionTimer = setInterval(() => {
      const elapsed = Date.now() - sessionStart;
      const remaining = SESSION_TIMEOUT_MS - elapsed;
      if (remaining <= 0) {
        clearInterval(sessionTimer);
        // Auto-save then prompt
        saveState();
        if (confirm('Sesi sudah habis (30 menit). Data tersimpan. Klik OK untuk lanjut.')) {
          sessionStart = Date.now(); // reset
        }
        return;
      }
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      if (sessionEl) {
        sessionEl.textContent = `⏱ ${mins}:${secs.toString().padStart(2,'0')}`;
        sessionEl.className = 'session-timer' +
          (remaining < 5 * 60000 ? ' danger' : remaining < 10 * 60000 ? ' warn' : '');
      }
      // Update tech panel
      const techSess = document.getElementById('techSession');
      if (techSess) techSess.textContent = `${mins}m ${secs}s`;
    }, 1000);
  }

  function stopSession() { clearInterval(sessionTimer); }

  // Generate integrity hash for display
  function displayHash(data) {
    let h = 0;
    const s = JSON.stringify(data);
    for (let i = 0; i < s.length; i++) {
      h = ((h << 5) - h) + s.charCodeAt(i);
      h = h & h;
    }
    return Math.abs(h).toString(16).toUpperCase().padStart(8, '0');
  }

  return { sanitize, isValidName, secureInput, checkHTTPS, startSession, stopSession, displayHash };
})();

/* ─────────────────────────────────────────
   4. TECH PANEL UI
   Floating button showing live multimedia stats
───────────────────────────────────────── */
function initTechPanel() {
  // Inject HTML
  const panel = document.createElement('div');
  panel.className = 'tech-panel';
  panel.id = 'techPanel';
  panel.innerHTML = `
    <button class="tech-toggle" onclick="toggleTechPanel()" title="Info Teknis Multimedia">⚙️</button>
    <div class="tech-drawer" id="techDrawer">
      <h4>⚙️ Info Teknis Multimedia</h4>

      <div class="tech-section-title">🔊 Signal Processing (Web Audio API)</div>
      <div class="tech-row">
        <span class="tech-label">FFT Size</span>
        <span class="tech-val green">64-point</span>
      </div>
      <div class="tech-row">
        <span class="tech-label">Peak Frequency</span>
        <span class="tech-val orange" id="techPeakFreq">0 Hz</span>
      </div>
      <div class="tech-row">
        <span class="tech-label">RMS Amplitude</span>
        <span class="tech-val" id="techRMS">0</span>
      </div>
      <div class="tech-row">
        <span class="tech-label">Smoothing</span>
        <span class="tech-val green">0.75</span>
      </div>
      <div class="waveform-wrap">
        <canvas id="waveformCanvas" width="260" height="40"></canvas>
        <div class="waveform-label">Live Waveform + Frequency Spectrum</div>
      </div>

      <div class="tech-section" style="margin-top:.9rem">
        <div class="tech-section-title">📦 Kompresi Data</div>
        <div class="tech-row">
          <span class="tech-label">Raw JSON</span>
          <span class="tech-val" id="techRaw">— bytes</span>
        </div>
        <div class="tech-row">
          <span class="tech-label">Setelah Kompresi</span>
          <span class="tech-val green" id="techComp">— bytes</span>
        </div>
        <div class="tech-row">
          <span class="tech-label">Penghematan</span>
          <span class="tech-val orange" id="techSaving">—%</span>
        </div>
        <div class="tech-row">
          <span class="tech-label">Metode</span>
          <span class="tech-val green">XOR + Pattern Sub</span>
        </div>
      </div>

      <div class="tech-section" style="margin-top:.9rem">
        <div class="tech-section-title">🔒 Keamanan</div>
        <div class="tech-row">
          <span class="tech-label">Enkripsi</span>
          <span class="tech-val green">XOR Cipher ✓</span>
        </div>
        <div class="tech-row">
          <span class="tech-label">Integritas</span>
          <span class="tech-val green">Checksum ✓</span>
        </div>
        <div class="tech-row">
          <span class="tech-label">Input Sanitasi</span>
          <span class="tech-val green">Active ✓</span>
        </div>
        <div class="tech-row">
          <span class="tech-label">HTTPS</span>
          <span class="tech-val" id="techHTTPS">—</span>
        </div>
        <div class="tech-row">
          <span class="tech-label">Session</span>
          <span class="tech-val orange" id="techSession">—</span>
        </div>
        <div class="tech-row">
          <span class="tech-label">Data Hash</span>
          <span class="tech-val" id="techHash" style="font-size:.65rem;font-family:monospace">—</span>
        </div>
      </div>

      <div class="tech-section" style="margin-top:.9rem">
        <div class="tech-section-title">🎬 Elemen Media</div>
        <div class="tech-row"><span class="tech-label">Text</span><span class="tech-val green">✓ Soal, instruksi</span></div>
        <div class="tech-row"><span class="tech-label">Audio</span><span class="tech-val green">✓ Web Audio API</span></div>
        <div class="tech-row"><span class="tech-label">Visual/Emoji</span><span class="tech-val green">✓ SVG Unicode</span></div>
        <div class="tech-row"><span class="tech-label">Interaktif</span><span class="tech-val green">✓ Drag, Voice, Match</span></div>
      </div>
    </div>`;
  document.body.appendChild(panel);

  // Start updating stats
  setInterval(refreshTechStats, 1000);
}

function toggleTechPanel() {
  const d = document.getElementById('techDrawer');
  if (!d) return;
  d.classList.toggle('open');
  if (d.classList.contains('open')) {
    refreshTechStats();
    // draw waveform periodically while open
    const canvas = document.getElementById('waveformCanvas');
    if (canvas) AudioVisualizer.drawTechWaveform(canvas);
  }
}

function refreshTechStats() {
  const drawer = document.getElementById('techDrawer');
  if (!drawer?.classList.contains('open')) return;

  // Compression stats
  const stats = CompressionEngine.getStorageStats();
  const rawEl   = document.getElementById('techRaw');
  const compEl  = document.getElementById('techComp');
  const saveEl  = document.getElementById('techSaving');
  if (rawEl)  rawEl.textContent  = stats.rawBytes + ' B';
  if (compEl) compEl.textContent = stats.storedBytes + ' B';
  if (saveEl) saveEl.textContent = stats.totalSaving + '%';

  // HTTPS
  const httpsEl = document.getElementById('techHTTPS');
  if (httpsEl) {
    const ok = SecurityManager.checkHTTPS();
    httpsEl.textContent = ok ? 'Secure ✓' : 'File:// (dev)';
    httpsEl.className = 'tech-val ' + (ok ? 'green' : 'orange');
  }

  // Hash
  const hashEl = document.getElementById('techHash');
  if (hashEl) hashEl.textContent = SecurityManager.displayHash(AppState);

  // Waveform
  const canvas = document.getElementById('waveformCanvas');
  if (canvas) AudioVisualizer.drawTechWaveform(canvas);
}

/* ─────────────────────────────────────────
   5. COMPRESSION DEMO on Result Screen
───────────────────────────────────────── */
function injectCompressionDemo() {
  const card = document.querySelector('.result-card');
  if (!card || document.getElementById('compressDemo')) return;

  const stats = CompressionEngine.getStorageStats();
  const div = document.createElement('div');
  div.className = 'compress-demo';
  div.id = 'compressDemo';
  div.innerHTML = `
    <div class="compress-demo-title">📦 Kompresi Data Aktif</div>
    <div class="compress-bar-wrap">
      <div class="compress-bar-label"><span>Data Asli (JSON)</span><span>${stats.rawBytes} bytes</span></div>
      <div class="compress-bar-bg"><div class="compress-bar-fill red" style="width:100%"></div></div>
    </div>
    <div class="compress-bar-wrap">
      <div class="compress-bar-label"><span>Setelah Kompresi + Enkripsi</span><span>${stats.storedBytes} bytes</span></div>
      <div class="compress-bar-bg"><div class="compress-bar-fill" id="compFill" style="width:0%"></div></div>
    </div>
    <div class="compress-ratio">Penghematan: ${stats.totalSaving}% · Metode: XOR Cipher + Pattern Substitution</div>`;
  card.appendChild(div);

  // Animate bar
  setTimeout(() => {
    const fill = document.getElementById('compFill');
    if (fill) fill.style.width = (100 - parseFloat(stats.totalSaving)) + '%';
  }, 400);
}

/* ─────────────────────────────────────────
   6. VOICE: live waveform during recording
───────────────────────────────────────── */
function initVoiceWaveform() {
  const canvas = document.getElementById('voiceCanvas');
  if (canvas) AudioVisualizer.initVoiceCanvas(canvas);
}
function stopVoiceWaveform() {
  AudioVisualizer.clearVoiceCanvas();
}

/* ─────────────────────────────────────────
   7. SESSION TIMER in topbar
───────────────────────────────────────── */
function injectSessionTimer() {
  const tbRight = document.querySelector('#homeScreen .topbar-right');
  if (!tbRight || document.getElementById('sessionTimer')) return;
  const el = document.createElement('span');
  el.className = 'session-timer';
  el.id = 'sessionTimer';
  el.textContent = '⏱ 30:00';
  tbRight.prepend(el);
}

/* ─────────────────────────────────────────
   8. HTTPS + SECURITY WARNING on login
───────────────────────────────────────── */
function injectSecurityBadge() {
  const card = document.querySelector('.login-card');
  if (!card || document.getElementById('secBadge')) return;

  const isSecure = SecurityManager.checkHTTPS();
  const badge = document.createElement('div');
  badge.id = 'secBadge';
  badge.className = 'security-badge';
  badge.innerHTML = `<span class="security-badge-icon">${isSecure ? '🔒' : '⚠️'}</span>
    <span>${isSecure
      ? 'Koneksi aman · Data dienkripsi XOR · Checksum aktif'
      : 'Mode lokal · Data dienkripsi XOR · Untuk produksi gunakan HTTPS'}</span>`;

  const firstFormGroup = card.querySelector('.form-group');
  card.insertBefore(badge, firstFormGroup);

  if (!isSecure) {
    const warn = document.createElement('div');
    warn.className = 'https-warn';
    warn.innerHTML = '⚠️ Untuk keamanan penuh, akses via HTTPS atau localhost.';
    card.insertBefore(warn, firstFormGroup);
  }
}

/* ─────────────────────────────────────────
   9. MEDIA TYPE CHIPS on questions
───────────────────────────────────────── */
function injectMediaChips(questionType) {
  const qPrompt = document.querySelector('.q-prompt');
  if (!qPrompt || qPrompt.querySelector('.media-indicators')) return;

  const typeMedia = {
    mc:    ['text', 'visual', 'interactive'],
    fill:  ['text', 'interactive'],
    drag:  ['visual', 'interactive'],
    voice: ['audio', 'text', 'interactive'],
    match: ['text', 'interactive'],
  };
  const labels = { text: '📝 Text', audio: '🔊 Audio', visual: '🖼 Visual', interactive: '🖱 Interaktif' };
  const chips = (typeMedia[questionType] || ['text'])
    .map(t => `<span class="media-chip ${t}">${labels[t]}</span>`)
    .join('');

  const div = document.createElement('div');
  div.className = 'media-indicators';
  div.innerHTML = chips;
  qPrompt.appendChild(div);
}

/* ─────────────────────────────────────────
   BOOT – wire everything up
─────────────────────────────────────────── */
// Inject extra CSS for new voice controls
(function injectVoiceCSS(){
  const style=document.createElement('style');
  style.textContent=`
    /* Match item states */
    .match-item{cursor:pointer!important;user-select:none;transition:all .15s;border:2px solid #e5e7eb;border-radius:12px;padding:.7rem 1rem;text-align:center;background:#fff;font-weight:600;}
    .match-item:hover:not(.matched){background:#f3f4f6;border-color:#aaa;transform:scale(1.02);}
    .match-item.selected{background:#fff3e0!important;border-color:#FF6B35!important;box-shadow:0 0 0 3px rgba(255,107,53,.25);}
    .match-item.matched{background:#e8f5e9!important;border-color:#4caf50!important;color:#2e7d32;cursor:default!important;opacity:.85;}
    .match-item.wrong-m{background:#ffebee!important;border-color:#f44336!important;animation:shake .3s ease;}
    @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
    .voice-controls-row{display:flex;align-items:center;justify-content:center;gap:.75rem;margin:.5rem 0;}
    .voice-btn-sm{background:var(--white,#fff);border:2px solid var(--border,#e5e7eb);border-radius:50%;width:44px;height:44px;font-size:1.1rem;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;}
    .voice-btn-sm:disabled{opacity:.35;cursor:not-allowed;}
    .voice-btn-sm:not(:disabled):hover{background:var(--bg-s,#f3f4f6);transform:scale(1.08);}
    .voice-transcript{background:var(--bg-s,#f3f4f6);border:1.5px solid var(--border,#e5e7eb);border-radius:12px;padding:.6rem 1rem;min-height:2.4rem;font-size:.9rem;color:var(--text-d,#111);margin:.5rem 0;text-align:center;}
    .voice-transcript.empty{color:var(--text-m,#888);font-style:italic;}
  `;
  document.head.appendChild(style);
})();
document.addEventListener('DOMContentLoaded', () => {
  // Delay slightly so main app boots first
  setTimeout(() => {
    injectSecurityBadge();
    injectLogo();

    // Secure the name input
    SecurityManager.secureInput(document.getElementById('inputName'));

    // Tech panel floating button
    initTechPanel();

    // Hook AudioVisualizer into AudioFX context
    // We patch AudioFX to expose its AudioContext
    const origAudioCtx = window.AudioFX?._getCtx?.() || null;
    // Patch: intercept first AudioContext creation
    const _OrigAC = window.AudioContext || window.webkitAudioContext;
    if (_OrigAC && !AudioVisualizer.getAnalyser()) {
      window._ACProxy = class extends _OrigAC {
        constructor(...args) {
          super(...args);
          setTimeout(() => AudioVisualizer.init(this), 50);
        }
      };
      // Swap only if not yet created
      if (!window._acPatched) {
        window.AudioContext = window._ACProxy;
        window.webkitAudioContext = window._ACProxy;
        window._acPatched = true;
      }
    }
  }, 200);
});

// Called by app.js when home screen is shown
function onHomeShown() {
  injectSessionTimer();
  SecurityManager.startSession();
  refreshTechStats();
  // Backsound: play on home, injected mute btn
  if (typeof BackSound !== 'undefined') {
    if (!_bgMuted) BackSound.play();
    _renderMuteBtn();
  }
}

// Called by quiz.js when result screen is shown
function onResultShown() {
  setTimeout(injectCompressionDemo, 300);
  // Stop backsound on result screen, resume on home
}

// Called by quiz.js renderQuestion – inject media chips
function onQuestionRendered(type) {
  setTimeout(() => injectMediaChips(type), 50);
}
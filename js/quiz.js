// ===== QUIZ ENGINE (LingoKids Full Version) =====
let Q = { topic: null, questions: [], idx: 0, score: 0, maxScore: 0 };
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function startQuiz(topic) {
    Q.topic = topic;
    Q.questions = shuffle([...topic.questions]);
    Q.idx = 0; Q.score = 0; Q.maxScore = topic.questions.length * 10;
    
    document.getElementById('quizTitle').textContent = topic.icon + ' ' + topic.name;
    document.getElementById('qTot').textContent = Q.questions.length;
    showScreen('screen-quiz');
    renderQuestion();
}

function renderQuestion() {
    const q = Q.questions[Q.idx];
    const num = Q.idx + 1;
    document.getElementById('qNum').textContent = num;
    
    const c = document.getElementById('qContainer');
    c.innerHTML = '';
    c.style.animation = 'none'; 
    c.offsetHeight; 
    c.style.animation = 'fadeIn .35s ease both';
    
    if (typeof onQuestionRendered === 'function') onQuestionRendered(q.type);
    
    if (q.type === 'mc') renderMC(q, num);
    else if (q.type === 'fill') renderFill(q, num);
    else if (q.type === 'drag') renderDrag(q, num);
    else if (q.type === 'voice') renderVoice(q, num);
    else if (q.type === 'match') renderMatch(q, num);
}

/* ── helpers ── */
function typeLabel(t) {
    const map = { mc: 'Pilihan Ganda', fill: 'Isi Titik-Titik', drag: 'Drag & Drop', voice: 'Latihan Bicara', match: 'Pasangkan' };
    return `<span class="label-sm" style="color: var(--primary); text-transform: uppercase; letter-spacing: 1px; background: var(--surface-container); padding: 4px 12px; border-radius: 99px;">📋 ${map[t] || t}</span>`;
}

function promptBox(q) {
    return `
        <div style="margin-bottom: 16px;">${typeLabel(q.type)}</div>
        <h2 class="headline-md" style="margin: 16px 0;">${q.q}</h2>
        ${q.img ? `<div style="text-align: center; margin: 24px 0;"><span style="font-size: 80px;">${q.img}</span></div>` : ''}
    `;
}

function showFeedback(correct, q) {
    if (correct) { 
        Q.score += 10; 
        if (typeof AudioFX !== 'undefined') AudioFX.correct(); 
    } else { 
        if (typeof AudioFX !== 'undefined') AudioFX.wrong(); 
    }
    
    const ov = document.getElementById('feedbackOverlay');
    const msgs_ok = ['Benar! Hebat! 🎉', 'Keren banget! 🌟', 'Yes! Lanjut! 🚀', 'Pintar sekali! 🧠'];
    document.getElementById('fbIcon').textContent = correct ? '✅' : '❌';
    document.getElementById('fbMsg').textContent = correct ? msgs_ok[Math.floor(Math.random() * msgs_ok.length)] : 'Yah, salah nih... Coba pahami lagi ya.';
    document.getElementById('fbMsg').style.color = correct ? 'var(--tertiary-dark)' : 'var(--error)';
    
    ov.classList.remove('wrong');
    if (!correct) ov.classList.add('wrong');
    
    document.getElementById('fbExp').innerHTML = q.exp ? `<strong>Penjelasan:</strong> ${q.exp}` : '';
    ov.classList.add('active');
}

/* ── MULTIPLE CHOICE ── */
function renderMC(q, num) {
    const c = document.getElementById('qContainer');
    const letters = ['A', 'B', 'C', 'D'];
    c.innerHTML = promptBox(q) + `
        <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 24px;">
            ${q.choices.map((ch, i) => `
                <button class="btn btn-outline quiz-option" id="mc-opt-${i}" onclick="pickMC(${i})" style="justify-content: flex-start; text-align: left;">
                    <span style="background: var(--surface-container); color: var(--on-surface); padding: 4px 12px; border-radius: 8px; margin-right: 12px; font-weight: 900;">${letters[i]}</span> 
                    ${ch}
                </button>
            `).join('')}
        </div>
    `;
}

function pickMC(i) {
    const q = Q.questions[Q.idx];
    const correct = i === q.answer;
    
    for (let j = 0; j < q.choices.length; j++) {
        const btn = document.getElementById(`mc-opt-${j}`);
        btn.disabled = true;
        if (j === q.answer) {
            btn.style.backgroundColor = 'var(--tertiary-container)';
            btn.style.color = 'var(--on-tertiary)';
            btn.style.borderColor = 'var(--tertiary)';
        } else if (j === i && !correct) {
            btn.style.backgroundColor = 'var(--error-container)';
            btn.style.color = 'var(--error)';
            btn.style.borderColor = 'var(--error)';
        }
    }
    showFeedback(correct, q);
}

/* ── FILL IN THE BLANK ── */
function renderFill(q, num) {
    const c = document.getElementById('qContainer');
    const sentHTML = q.sentence.replace('___', '<span id="blankSlot" style="display: inline-block; min-width: 80px; text-align: center; border-bottom: 3px dashed var(--primary); padding: 0 16px; color: var(--primary);">?</span>');
    
    c.innerHTML = promptBox(q) + `
        <div class="card" style="background: var(--surface-container-low); margin: 24px 0; text-align: center;">
            <p class="headline-md">${sentHTML}</p>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;">
            ${shuffle(q.bank).map((w, i) => `
                <button class="btn btn-outline w-chip" id="fill-opt-${i}" onclick="pickWord('${w}', this)">${w}</button>
            `).join('')}
        </div>
    `;
}

function pickWord(w, el) {
    if (el.disabled) return;
    const q = Q.questions[Q.idx];
    
    document.querySelectorAll('.w-chip').forEach(c => c.disabled = true);
    
    const slot = document.getElementById('blankSlot');
    slot.textContent = w;
    slot.style.borderBottomStyle = 'solid';
    
    const correct = w.toLowerCase() === q.answer.toLowerCase();
    
    if (correct) {
        el.style.backgroundColor = 'var(--tertiary-container)';
        el.style.borderColor = 'var(--tertiary)';
        slot.style.color = 'var(--tertiary)';
        slot.style.borderColor = 'var(--tertiary)';
    } else {
        el.style.backgroundColor = 'var(--error-container)';
        el.style.borderColor = 'var(--error)';
        slot.style.color = 'var(--error)';
        slot.style.borderColor = 'var(--error)';
    }
    
    setTimeout(() => showFeedback(correct, q), 300);
}

// ========== DRAG & DROP ==========
let dragState = { dragging: null, answers: {} }; 

function renderDrag(q, num) {
    dragState = { dragging: null, answers: {} };
    const c = document.getElementById('qContainer');
    
    // Inject custom CSS locally for drag elements to match LingoKids
    const dragStyles = `
        <style>
            .drag-zone-box { border: 3px dashed var(--outline-variant); border-radius: var(--radius-lg); padding: 16px; min-height: 100px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: center; transition: all 0.2s; background: var(--surface-container-lowest); }
            .drag-zone-box.over { background: var(--surface-container); border-color: var(--primary); }
            .drag-chip-ui { display: inline-flex; align-items: center; gap: 8px; background: white; border: 2px solid var(--outline-variant); padding: 12px 20px; border-radius: var(--radius-full); font-weight: 700; cursor: grab; box-shadow: 0 4px 0 var(--outline-variant); }
            .drag-chip-ui:active { cursor: grabbing; transform: translateY(4px); box-shadow: 0 0 0 var(--outline-variant); }
            .drag-chip-ui.placed { opacity: 0.5; pointer-events: none; }
            .mini-chip-ui { display: inline-flex; align-items: center; gap: 6px; background: var(--primary-container); color: white; padding: 6px 12px; border-radius: var(--radius-full); font-size: 14px; font-weight: 700; cursor: pointer; }
            .mini-chip-ui .remove-x { background: rgba(0,0,0,0.2); border-radius: 50%; width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; }
        </style>
    `;

    c.innerHTML = dragStyles + promptBox(q) + `
        <p class="body-md" style="margin-bottom: 24px; color: var(--on-surface-variant);">✋ Geser item ke kotak yang sesuai (klik item di kotak untuk membatalkan)</p>
        
        <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-bottom: 32px;" id="dragPool">
            ${shuffle(q.items).map(it => `
                <div class="drag-chip-ui" id="chip_${it.id}"
                     draggable="true"
                     ondragstart="onDragStart('${it.id}')"
                     ondragend="onDragEnd()"
                     ontouchstart="touchStart(event,'${it.id}')"
                     ontouchmove="touchMove(event)"
                     ontouchend="touchEnd(event,'${it.id}')">
                    <span>${it.label}</span>
                </div>
            `).join('')}
        </div>
        
        <div style="display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 24px;" id="dropZones">
            ${q.zones.map((z, i) => {
                const colors = ['var(--primary)', 'var(--secondary)', 'var(--tertiary)', 'var(--error)'];
                const color = colors[i % colors.length];
                return `
                <div style="text-align: center;">
                    <p class="label-lg" style="margin-bottom: 8px; color: ${color};">${z.label}</p>
                    <div class="drag-zone-box" id="zone_${z.id}"
                         ondragover="onDragOver(event)"
                         ondrop="onDrop(event,'${z.id}')"
                         ondragleave="onDragLeave(event)">
                        <div id="zc_${z.id}" style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; width: 100%;"></div>
                        <div id="zp_${z.id}" style="color: var(--outline-variant); font-size: 14px; font-weight: 600;">Taruh di sini</div>
                    </div>
                </div>
            `}).join('')}
        </div>
        
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button class="btn btn-primary drag-submit" onclick="checkDrag()" style="flex: 1;">✅ Cek Jawaban</button>
            <button class="btn btn-outline" onclick="resetDrag()" style="flex: 1;">↺ Reset Semua</button>
        </div>
    `;
}

function onDragStart(id) { dragState.dragging = id; if(typeof AudioFX!=='undefined') AudioFX.tick(); }
function onDragEnd() { dragState.dragging = null; }
function onDragOver(e) { e.preventDefault(); e.currentTarget.classList.add('over'); }
function onDragLeave(e) { e.currentTarget.classList.remove('over'); }

function refreshZoneView(zoneId) {
    const zoneDiv = document.getElementById('zone_' + zoneId);
    const zc = document.getElementById('zc_' + zoneId);
    const zp = document.getElementById('zp_' + zoneId);
    if (!zc || !zp) return;

    zc.innerHTML = '';
    const items = dragState.answers[zoneId] || [];

    items.forEach(id => {
        const c = document.getElementById('chip_' + id);
        if (c) {
            const miniChip = document.createElement('div');
            miniChip.className = 'mini-chip-ui';
            miniChip.innerHTML = `${c.textContent.trim()} <span class="remove-x">✕</span>`;
            miniChip.onclick = () => resetSingleChip(id);
            zc.appendChild(miniChip);
        }
    });

    zp.style.display = items.length > 0 ? 'none' : '';
}

function onDrop(e, zoneId) {
    e.preventDefault();
    e.currentTarget.classList.remove('over');
    if (!dragState.dragging) return;

    const chipId = dragState.dragging;
    const chip = document.getElementById('chip_' + chipId);
    if (!chip) return;

    let oldZone = null;
    for (const [z, list] of Object.entries(dragState.answers)) {
        if (list.includes(chipId)) {
            oldZone = z;
            dragState.answers[z] = list.filter(id => id !== chipId);
            if (dragState.answers[z].length === 0) delete dragState.answers[z];
            break;
        }
    }
    if (oldZone) refreshZoneView(oldZone);

    if (zoneId) {
        if (!dragState.answers[zoneId]) dragState.answers[zoneId] = [];
        if (!dragState.answers[zoneId].includes(chipId)) {
            dragState.answers[zoneId].push(chipId);
        }
        refreshZoneView(zoneId);

        chip.classList.add('placed');
        chip.setAttribute('draggable', 'false');
    } else {
        resetSingleChip(chipId);
    }
    dragState.dragging = null;
}

function resetSingleChip(chipId) {
    const chip = document.getElementById('chip_' + chipId);
    if (!chip) return;

    for (const [z, list] of Object.entries(dragState.answers)) {
        if (list.includes(chipId)) {
            dragState.answers[z] = list.filter(id => id !== chipId);
            if (dragState.answers[z].length === 0) delete dragState.answers[z];
            refreshZoneView(z);
            break;
        }
    }
    
    chip.classList.remove('placed');
    chip.setAttribute('draggable', 'true');
    if(typeof AudioFX!=='undefined') AudioFX.click();
}

function resetDrag() {
    for (const chipId of Object.values(dragState.answers).flat()) resetSingleChip(chipId);
    dragState.answers = {};
    const submitBtn = document.querySelector('.drag-submit');
    if (submitBtn) submitBtn.disabled = false;
    if(typeof AudioFX!=='undefined') AudioFX.click();
}

function checkDrag() {
    const q = Q.questions[Q.idx];
    let allCorrect = true;
    const expectedMap = {};
    q.items.forEach(it => {
        if (!expectedMap[it.zone]) expectedMap[it.zone] = [];
        expectedMap[it.zone].push(it.id);
    });
    for (const [zoneId, expectedIds] of Object.entries(expectedMap)) {
        const givenIds = dragState.answers[zoneId] || [];
        if (expectedIds.sort().join(',') !== givenIds.sort().join(',')) { allCorrect = false; break; }
    }
    const allPlaced = Object.values(dragState.answers).flat();
    if (allPlaced.length !== q.items.length) allCorrect = false;

    for (const zoneId of Object.keys(expectedMap)) {
        const zoneEl = document.getElementById('zone_' + zoneId);
        const expected = expectedMap[zoneId];
        const given = dragState.answers[zoneId] || [];
        if (expected.length === given.length && expected.every(id => given.includes(id))) {
            zoneEl.style.borderColor = 'var(--tertiary)';
            zoneEl.style.backgroundColor = 'var(--tertiary-container)';
        } else {
            zoneEl.style.borderColor = 'var(--error)';
            zoneEl.style.backgroundColor = 'var(--error-container)';
        }
    }
    document.querySelector('.drag-submit').disabled = true;
    showFeedback(allCorrect, q);
}

/* ── VOICE / SPEECH ── */
let voiceRecognition=null, voiceTranscript='', isRecording=false;
let voiceAudioBlob=null, voiceAudioURL=null, voiceMediaRecorder=null;

let animationFrameId = null;

function renderVoice(q, num) {
    const c = document.getElementById('qContainer');
    c.innerHTML = promptBox(q) + `
        <div class="card" style="background: var(--surface-container-low); text-align: center; border-style: dashed; margin-bottom: 24px;">
            <p class="headline-md" style="color: var(--primary); font-size: 32px; letter-spacing: 2px;">"${q.target}"</p>
        </div>
        <canvas id="voiceCanvas" style="width:100%; height:80px; background:#f0f7ff; border-radius:12px; border:2px solid var(--primary-container); display:block;"></canvas>
        <button class="btn btn-primary" id="voiceBtn" onclick="toggleRecord()" style="margin-top:15px;">🎤 Rekam</button>
        <div id="voiceResult" class="body-md" style="margin-top:15px;">Tekan tombol untuk bicara...</div>
        <button class="btn btn-primary" id="voiceCheck" onclick="checkVoice()" style="margin-top:10px;" disabled>Cek Jawaban ✅</button>
    `;
    // Inisialisasi canvas segera setelah elemen dibuat
    const canvas = document.getElementById('voiceCanvas');
    AudioVisualizer.initVoiceCanvas(canvas); 
}

function startWaveform(stream) {
    const canvas = document.getElementById('voiceCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    function draw() {
        animationFrameId = requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);
        
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#0ea5e9';
        ctx.beginPath();

        let sliceWidth = canvas.width / dataArray.length;
        let x = 0;
        for(let i = 0; i < dataArray.length; i++) {
            let v = dataArray[i] / 128.0;
            let y = v * canvas.height / 2;
            if(i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            x += sliceWidth;
        }
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
    }
    draw();
}

// ===== FUNGSI RECORD & WAVEFORM YANG BENAR =====

async function toggleRecord() {
    if (isRecording) {
        stopRecord();
        return;
    }

    // 1. Reset UI
    document.getElementById('voiceResult').textContent = 'Mendengarkan...';
    document.getElementById('voicePlayBtn').disabled = true;
    document.getElementById('voiceResetBtn').disabled = true;
    document.getElementById('voiceCheck').disabled = true;
    voiceTranscript = '';

    // 2. Setup Speech Recognition
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    voiceRecognition = new SR();
    voiceRecognition.lang = 'en-US';
    voiceRecognition.interimResults = true;
    voiceRecognition.continuous = false;

    voiceRecognition.onresult = e => {
        let final = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
            if (e.results[i].isFinal) final += e.results[i][0].transcript;
        }
        if (final) {
            voiceTranscript = final;
            document.getElementById('voiceResult').textContent = voiceTranscript;
            document.getElementById('voiceResult').style.fontStyle = 'normal';
        }
    };
    
    voiceRecognition.onerror = () => stopRecord();
    voiceRecognition.onend = () => { if(isRecording) stopRecord(); };
    
    // --- KUNCI PERBAIKAN: Ambil stream mikrofon dulu, baru menggambar ---
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Jalankan animasi gelombang suara
        startWaveform(stream); 
        
        // Mulai simpan rekaman audio
        _startMediaRecorderWithStream(stream);

        // Mulai deteksi teks
        voiceRecognition.start();
        isRecording = true;

        // Update Tombol UI
        const btn = document.getElementById('voiceBtn');
        btn.innerHTML = '<span class="material-icons-round" style="font-size: 36px; color: var(--error);">stop</span>';
        btn.style.backgroundColor = 'var(--error-container)';
        btn.style.boxShadow = '0 6px 0 var(--error)';
        document.getElementById('voiceHint').innerHTML = '<span style="color:var(--error);">🔴 Sedang merekam... Tekan ⏹️ untuk berhenti</span>';
        
        if (typeof AudioFX !== 'undefined') AudioFX.tick();

    } catch(err) { 
        alert('Mikrofon tidak terdeteksi atau izin ditolak!'); 
    }
}

// Menangkap stream audio langsung
function _startMediaRecorderWithStream(stream) {
    voiceMediaRecorder = new MediaRecorder(stream);
    const chunks = [];
    voiceMediaRecorder.ondataavailable = e => chunks.push(e.data);
    voiceMediaRecorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop()); // Matikan mic setelah selesai
        voiceAudioBlob = new Blob(chunks, { type: 'audio/webm' });
        if (voiceAudioURL) URL.revokeObjectURL(voiceAudioURL);
        voiceAudioURL = URL.createObjectURL(voiceAudioBlob);
        document.getElementById('voicePlayBtn').disabled = false;
    };
    voiceMediaRecorder.start();
}

function stopRecord() {
    // Hentikan animasi gelombang suara
    if (animationFrameId) cancelAnimationFrame(animationFrameId); 
    
    if (voiceRecognition) { try { voiceRecognition.stop(); } catch (e) {} }
    if (voiceMediaRecorder && voiceMediaRecorder.state === 'recording') { try { voiceMediaRecorder.stop(); } catch (e) {} }
    
    isRecording = false;
    const btn = document.getElementById('voiceBtn');
    if(btn) {
        btn.innerHTML = '<span class="material-icons-round" style="font-size: 36px;">mic</span>';
        btn.style.backgroundColor = 'var(--primary-container)';
        btn.style.boxShadow = '0 6px 0 var(--primary)';
    }
    
    const hint = document.getElementById('voiceHint');
    if(hint) hint.textContent = 'Rekaman selesai. Dengarkan atau langsung cek jawaban.';
    
    if(document.getElementById('voiceResetBtn')) document.getElementById('voiceResetBtn').disabled = false;
    if(document.getElementById('voiceCheck') && voiceTranscript) document.getElementById('voiceCheck').disabled = false;
    
    // Hapus sisa gelombang di canvas menjadi kosong
    const canvas = document.getElementById('voiceCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function playbackVoice() {
    if (!voiceAudioURL) return;
    const audio = new Audio(voiceAudioURL);
    document.getElementById('voicePlayBtn').disabled = true;
    audio.play();
    audio.onended = () => { document.getElementById('voicePlayBtn').disabled = false; };
}

function resetVoice() {
    if (isRecording) stopRecord();
    voiceTranscript = '';
    if (voiceAudioURL) { URL.revokeObjectURL(voiceAudioURL); voiceAudioURL = null; }
    
    document.getElementById('voiceResult').textContent = 'Belum ada hasil rekaman...';
    document.getElementById('voiceResult').style.fontStyle = 'italic';
    document.getElementById('voiceResult').style.color = 'var(--on-surface-variant)';
    
    document.getElementById('voicePlayBtn').disabled = true;
    document.getElementById('voiceResetBtn').disabled = true;
    document.getElementById('voiceCheck').disabled = true;
    document.getElementById('voiceHint').textContent = 'Tekan 🎤 dan ucapkan kalimat di atas dengan jelas.';
    if(typeof AudioFX!=='undefined') AudioFX.tick();
}

function checkVoice() {
    const q = Q.questions[Q.idx];
    const target = q.target.toLowerCase().replace(/[^a-z\s]/g, '').trim();
    const said = (voiceTranscript || '').toLowerCase().replace(/[^a-z\s]/g, '').trim();

    const tWords = target.split(/\s+/).filter(w => w.length > 2);
    const sWords = said.split(/\s+/);
    const matched = tWords.filter(w => sWords.some(sw => sw === w || sw.startsWith(w.slice(0, -1)))).length;
    const score = tWords.length > 0 ? matched / tWords.length : 0;
    const correct = score >= 0.75;

    document.getElementById('voiceCheck').disabled = true;
    document.getElementById('voiceBtn').disabled = true;
    document.getElementById('voiceResetBtn').disabled = true;
    document.getElementById('voicePlayBtn').disabled = true;

    const pct = Math.round(score * 100);
    showFeedback(correct, { ...q, exp: (correct ? `Akurasi ~${pct}%. ` : `Akurasi ~${pct}%. Yang terdengar: "${said || '-'}". `) + (q.exp || '') });
}

function skipVoice() { const q = Q.questions[Q.idx]; showFeedback(false, { ...q, exp: 'Soal dilewati. ' + q.exp }); }

// ========== MATCH PAIRS (CONNECT BY DRAGGING) ==========
let matchState = { leftItems: [], rightItems: [], lines: [], dragging: false, dragStartSide: null, dragStartIdx: null, svg: null, containerRect: null };

function renderMatch(q, num) {
    matchState = { leftItems: [], rightItems: [], lines: [], dragging: false, svg: null };

    const leftShuffled = shuffle(q.pairs.map(p => p.left));
    const rightShuffled = shuffle(q.pairs.map(p => p.right));
    leftShuffled.forEach((val, i) => matchState.leftItems.push({ idx: i, val }));
    rightShuffled.forEach((val, i) => matchState.rightItems.push({ idx: i, val }));

    const c = document.getElementById('qContainer');
    
    const matchStyles = `
        <style>
            .match-container { position: relative; display: flex; justify-content: space-between; margin: 32px 0; min-height: 250px; }
            .match-col { display: flex; flex-direction: column; gap: 16px; width: 40%; z-index: 2; }
            .match-card { background: white; border: 2px solid var(--outline-variant); padding: 16px; border-radius: var(--radius-md); text-align: center; font-weight: 700; cursor: pointer; box-shadow: 0 4px 0 var(--outline-variant); transition: transform 0.1s; }
            .match-card:active { transform: translateY(4px); box-shadow: 0 0 0 var(--outline-variant); }
            .match-card.connected { background: var(--surface-container); border-color: var(--primary); box-shadow: 0 4px 0 var(--primary); color: var(--primary); }
            .match-svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none; }
        </style>
    `;

    c.innerHTML = matchStyles + promptBox(q) + `
        <p class="body-md" style="color: var(--on-surface-variant); margin-bottom: 16px;">💡 Tarik garis dari kartu kiri ke kartu kanan yang cocok.</p>
        
        <div class="match-container" id="matchConnectContainer">
            <div class="match-col" id="connectLeftCol">
                ${matchState.leftItems.map(item => `
                    <div class="match-card" data-side="left" data-idx="${item.idx}">${item.val}</div>
                `).join('')}
            </div>
            <div class="match-col" id="connectRightCol">
                ${matchState.rightItems.map(item => `
                    <div class="match-card" data-side="right" data-idx="${item.idx}">${item.val}</div>
                `).join('')}
            </div>
            <svg class="match-svg" id="connectSvg"></svg>
        </div>
        
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button class="btn btn-primary" id="checkMatchBtn" onclick="checkMatchLines()" style="flex: 1;">✅ Cek Jawaban</button>
            <button class="btn btn-outline" id="resetMatchBtn" onclick="resetMatchLines()" style="flex: 1;">↺ Reset Garis</button>
        </div>
    `;

    setTimeout(() => {
        matchState.svg = document.getElementById('connectSvg');
        const container = document.getElementById('matchConnectContainer');
        
        function startDrag(e, side, idx) {
            if (matchState.lines.some(l => (side === 'left' && l.leftIdx === idx) || (side === 'right' && l.rightIdx === idx))) return; 
            
            const isTouch = e.type.includes('touch');
            if (!isTouch) e.preventDefault(); 

            matchState.dragging = true;
            matchState.dragStartSide = side;
            matchState.dragStartIdx = idx;

            const card = e.target.closest('.match-card');
            matchState.containerRect = container.getBoundingClientRect();
            
            const rect = card.getBoundingClientRect();
            const startX = rect.left + rect.width / 2 - matchState.containerRect.left;
            const startY = rect.top + rect.height / 2 - matchState.containerRect.top;
            
            matchState.dragStartX = startX;
            matchState.dragStartY = startY;

            window.addEventListener('mousemove', onDragMove);
            window.addEventListener('mouseup', onDragEndMatch);
            window.addEventListener('touchmove', onDragMove, {passive: false});
            window.addEventListener('touchend', onDragEndMatch);
        }

        function onDragMove(e) {
            if (!matchState.dragging) return;
            e.preventDefault(); 
            const event = e.type.includes('touch') ? e.touches[0] : e;
            const rect = matchState.containerRect;
            
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;
            
            drawTempLine(matchState.dragStartX, matchState.dragStartY, x, y);
        }

        function onDragEndMatch(e) {
            if (!matchState.dragging) return;
            matchState.dragging = false;
            
            window.removeEventListener('mousemove', onDragMove);
            window.removeEventListener('mouseup', onDragEndMatch);
            window.removeEventListener('touchmove', onDragMove);
            window.removeEventListener('touchend', onDragEndMatch);

            const event = e.type.includes('touch') ? e.changedTouches[0] : e;
            const targetEls = document.elementsFromPoint(event.clientX, event.clientY);
            const target = targetEls ? targetEls.find(el => el.classList && el.classList.contains('match-card')) : null;

            if (target) {
                const targetSide = target.dataset.side;
                const targetIdx = parseInt(target.dataset.idx);
                const startSide = matchState.dragStartSide;
                const startIdx = matchState.dragStartIdx;

                if (startSide !== targetSide) {
                    const leftIdx = startSide === 'left' ? startIdx : targetIdx;
                    const rightIdx = startSide === 'right' ? startIdx : targetIdx;

                    if (!matchState.lines.some(l => l.leftIdx === leftIdx || l.rightIdx === rightIdx)) {
                        matchState.lines.push({ leftIdx, rightIdx, correct: false });
                        document.querySelector(`#connectLeftCol .match-card[data-idx="${leftIdx}"]`).classList.add('connected');
                        document.querySelector(`#connectRightCol .match-card[data-idx="${rightIdx}"]`).classList.add('connected');
                        if(typeof AudioFX!=='undefined') AudioFX.tick();
                    }
                }
            }
            drawAllLines();
        }

        document.querySelectorAll('#connectLeftCol .match-card').forEach(card => {
            card.addEventListener('mousedown', (e) => startDrag(e, 'left', parseInt(card.dataset.idx)));
            card.addEventListener('touchstart', (e) => startDrag(e, 'left', parseInt(card.dataset.idx)), {passive: false});
        });
        document.querySelectorAll('#connectRightCol .match-card').forEach(card => {
            card.addEventListener('mousedown', (e) => startDrag(e, 'right', parseInt(card.dataset.idx)));
            card.addEventListener('touchstart', (e) => startDrag(e, 'right', parseInt(card.dataset.idx)), {passive: false});
        });

        window.addEventListener('resize', drawAllLines);
        window._matchPairs = q.pairs;
    }, 100);
}

function drawAllLines() {
    if (!matchState.svg) return;
    const container = document.getElementById('matchConnectContainer');
    const rect = container.getBoundingClientRect();
    matchState.containerRect = rect;
    
    matchState.svg.setAttribute('width', rect.width);
    matchState.svg.setAttribute('height', rect.height);
    matchState.svg.innerHTML = '';
    
    for (const line of matchState.lines) {
        const leftCard = document.querySelector(`#connectLeftCol .match-card[data-idx="${line.leftIdx}"]`);
        const rightCard = document.querySelector(`#connectRightCol .match-card[data-idx="${line.rightIdx}"]`);
        if (leftCard && rightCard) {
            const r1 = leftCard.getBoundingClientRect();
            const p1 = { x: r1.left + r1.width / 2 - rect.left, y: r1.top + r1.height / 2 - rect.top };
            const r2 = rightCard.getBoundingClientRect();
            const p2 = { x: r2.left + r2.width / 2 - rect.left, y: r2.top + r2.height / 2 - rect.top };
            
            const lineColor = line.correct === true ? 'var(--tertiary)' : (line.correct === false ? 'var(--error)' : 'var(--outline-variant)');
            const lineEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            lineEl.setAttribute('x1', p1.x); lineEl.setAttribute('y1', p1.y);
            lineEl.setAttribute('x2', p2.x); lineEl.setAttribute('y2', p2.y);
            lineEl.setAttribute('stroke', lineColor);
            lineEl.setAttribute('stroke-width', '4');
            lineEl.setAttribute('stroke-linecap', 'round');
            matchState.svg.appendChild(lineEl);
        }
    }
}

function drawTempLine(x1, y1, x2, y2) {
    drawAllLines();
    const tempLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    tempLine.setAttribute('x1', x1); tempLine.setAttribute('y1', y1);
    tempLine.setAttribute('x2', x2); tempLine.setAttribute('y2', y2);
    tempLine.setAttribute('stroke', 'var(--primary)');
    tempLine.setAttribute('stroke-width', '4');
    tempLine.setAttribute('stroke-dasharray', '8,8');
    matchState.svg.appendChild(tempLine);
}

function resetMatchLines() {
    matchState.lines = [];
    document.querySelectorAll('.match-card').forEach(card => card.classList.remove('connected'));
    if (matchState.svg) matchState.svg.innerHTML = '';
    document.getElementById('checkMatchBtn').disabled = false;
    if(typeof AudioFX!=='undefined') AudioFX.click();
}

function checkMatchLines() {
    const q = Q.questions[Q.idx];
    const pairs = window._matchPairs;
    let allCorrect = true;
    
    const expected = new Map();
    pairs.forEach(p => expected.set(p.left, p.right));
    
    for (const line of matchState.lines) {
        const leftVal = matchState.leftItems[line.leftIdx].val;
        const rightVal = matchState.rightItems[line.rightIdx].val;
        if (expected.get(leftVal) === rightVal) { line.correct = true; } 
        else { line.correct = false; allCorrect = false; }
    }
    
    if (matchState.lines.length !== pairs.length) allCorrect = false;
    
    drawAllLines();

    if (allCorrect) {
        showFeedback(true, q);
    } else {
        showFeedback(false, { ...q, exp: 'Ada garis yang salah atau belum lengkap. Reset dan coba lagi! ' + (q.exp || '') });
    }
    document.getElementById('checkMatchBtn').disabled = true;
}

/* ── next / finish ── */
function nextQuestion() {
    document.getElementById('feedbackOverlay').classList.remove('active');
    Q.idx++;
    if (Q.idx >= Q.questions.length) finishQuiz();
    else renderQuestion();
}

function finishQuiz() {
    if (typeof AudioFX !== 'undefined') AudioFX.complete();
    const score = Q.score, max = Q.maxScore, pct = score / max;
    updateScore(Q.topic.id, score, max);
    
    document.getElementById('resEmoji').textContent = pct >= 0.9 ? '🏆' : pct >= 0.7 ? '🎉' : pct >= 0.5 ? '😊' : '💪';
    document.getElementById('resTitle').textContent = pct >= 0.9 ? 'Luar Biasa!' : pct >= 0.7 ? 'Bagus Sekali!' : pct >= 0.5 ? 'Cukup Baik!' : 'Semangat Terus!';
    document.getElementById('resPts').textContent = score; 
    document.getElementById('resMax').textContent = 'dari ' + max;
    document.getElementById('resMsg').textContent = pct >= 0.9 ? 'Nilai sempurna! Kamu benar-benar menguasai materi ini!' : pct >= 0.7 ? 'Kerja bagus! Terus belajar ya!' : pct >= 0.5 ? 'Lumayan! Coba ulangi untuk nilai lebih bagus!' : 'Jangan menyerah! Pelajari lagi dan coba lagi!';
    document.getElementById('resStars').textContent = pct >= 0.9 ? '⭐⭐⭐' : pct >= 0.7 ? '⭐⭐' : pct >= 0.5 ? '⭐' : '';
    
    showScreen('screen-result');
    if (typeof onResultShown === 'function') setTimeout(onResultShown, 100);
}

function retryQuiz() { startQuiz(Q.topic); }
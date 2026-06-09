// ===== QUIZ ENGINE – MC, Fill, Drag&Drop, Voice, Match =====
// Layout: quiz2.js | Match Pairs: quiz2.js | Core engine: quiz.js

let Q = { topic:null, questions:[], idx:0, score:0, maxScore:0 };
function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

function startQuiz(topic){
  Q.topic=topic;
  Q.questions=shuffle([...topic.questions]);
  Q.idx=0; Q.score=0; Q.maxScore=topic.questions.length*10;
  document.getElementById('quizTitle').textContent=topic.name;
  document.getElementById('qTot').textContent=Q.questions.length;
  showScreen('screen-quiz');
  renderQuestion();
}

function renderQuestion(){
  const q=Q.questions[Q.idx];
  const num=Q.idx+1, tot=Q.questions.length;
  document.getElementById('qNum').textContent=num;
  const c=document.getElementById('qContainer');
  c.innerHTML=''; c.style.animation='none'; c.offsetHeight; c.style.animation='fadeUp .35s ease both';
  onQuestionRendered(q.type);
  if(q.type==='mc') renderMC(q,num);
  else if(q.type==='fill') renderFill(q,num);
  else if(q.type==='drag') renderDrag(q,num);
  else if(q.type==='voice') renderVoice(q,num);
  else if(q.type==='match') renderMatch(q,num);
}

/* ── helpers ── */
function typeLabel(t){
  const map={mc:'Pilihan Ganda',fill:'Isi Titik-Titik',drag:'Drag & Drop',voice:'Latihan Bicara',match:'Pasangkan'};
  return `<span class="q-type-badge" style="color:var(--primary);text-transform:uppercase;letter-spacing:1px;background:var(--surface-container,#f1f5f9);padding:4px 12px;border-radius:99px;font-size:.78rem;font-weight:700;">📋 ${map[t]||t}</span>`;
}

function promptBox(q, num) {
  let imgHtml = '';
  if (q.img) {
    if (q.img.includes('assets/image/')) {
      imgHtml = `<div class="q-img"><img id="qImgEl_${num}" src="" style="display:none; max-height:150px; border-radius:12px; margin:0 auto; box-shadow:0 4px 10px rgba(0,0,0,0.1);"></div>`;
      compressAndShow(q.img, `qImgEl_${num}`);
    } else {
      imgHtml = `<div style="text-align:center;margin:24px 0;"><span style="font-size:80px;">${q.img}</span></div>`;
    }
  }
  return `
    <div style="margin-bottom:16px;">${typeLabel(q.type)}</div>
    <h2 class="q-text" style="margin:16px 0;font-size:1.15rem;font-weight:700;line-height:1.5;">${q.q}</h2>
    ${imgHtml}
  `;
}

function compressAndShow(url, imgId) {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, 400 / img.width);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const compressedData = canvas.toDataURL('image/webp', 0.6);
    const uncompressedData = canvas.toDataURL('image/png');
    const sizeAsli = (uncompressedData.length * 0.75 / 1024).toFixed(2);
    const sizeKompres = (compressedData.length * 0.75 / 1024).toFixed(2);
    const hemat = (100 - (sizeKompres / sizeAsli * 100)).toFixed(1);
    console.log(`🖼️ [KOMPRESI MULTIMEDIA] -> ${url}`);
    console.log(`   ▪ Mentah : ${sizeAsli} KB`);
    console.log(`   ▪ WebP (60%) : ${sizeKompres} KB`);
    console.log(`   ▪ Hemat : ${hemat}% 📉`);
    const imgEl = document.getElementById(imgId);
    if (imgEl) { imgEl.src = compressedData; imgEl.style.display = 'block'; }
  };
  img.src = url;
}

function showFeedback(correct, q){
  if(correct){ Q.score+=10; AudioFX.correct(); }
  else { AudioFX.wrong(); }
  document.getElementById('tbScore').textContent=AppState.totalPoints+Q.score;
  const ov=document.getElementById('feedbackOverlay');
  const msgs_ok=['Benar! Hebat! 🎉','Keren banget! 🌟','Yes! Lanjut! 🚀','Pintar sekali! 🧠'];
  document.getElementById('fbIcon').textContent=correct?'✅':'❌';
  document.getElementById('fbMsg').textContent=correct?msgs_ok[Math.floor(Math.random()*msgs_ok.length)]:'Yah, salah nih...';
  document.getElementById('fbMsg').style.color=correct?'var(--tertiary-dark,#047857)':'var(--error,#dc2626)';
  document.getElementById('fbExp').innerHTML=q.exp?`<strong>Penjelasan:</strong> ${q.exp}`:'';
  ov.classList.remove('wrong');
  if(!correct) ov.classList.add('wrong');
  ov.classList.add('active');
}

/* ── MULTIPLE CHOICE ── */
function renderMC(q, num){
  const c=document.getElementById('qContainer');
  const letters=['A','B','C','D'];
  c.innerHTML = promptBox(q, num) + `
    <div style="display:flex;flex-direction:column;gap:12px;margin-top:24px;">
      ${q.choices.map((ch,i)=>`
        <button class="choice-btn" id="mc-opt-${i}" data-i="${i}" onclick="pickMC(${i})" style="justify-content:flex-start;text-align:left;display:flex;align-items:center;gap:12px;">
          <span class="choice-ltr" style="background:var(--surface-container,#f1f5f9);padding:4px 12px;border-radius:8px;font-weight:900;">${letters[i]}</span>
          <span>${ch}</span>
        </button>
      `).join('')}
    </div>
  `;
}

function pickMC(i){
  const q=Q.questions[Q.idx];
  document.querySelectorAll('.choice-btn').forEach(b=>b.disabled=true);
  const correct=i===q.answer;
  for(let j=0;j<q.choices.length;j++){
    const btn=document.getElementById(`mc-opt-${j}`);
    if(j===q.answer) btn.classList.add('correct');
    else if(j===i && !correct) btn.classList.add('wrong');
  }
  showFeedback(correct,q);
}

/* ── FILL IN THE BLANK ── */
function renderFill(q, num){
  const c=document.getElementById('qContainer');
  const sentHTML=q.sentence.replace('___',`<span id="blankSlot" style="display:inline-block;min-width:80px;text-align:center;border-bottom:3px dashed var(--primary);padding:0 16px;color:var(--primary);">?</span>`);
  c.innerHTML = promptBox(q, num) + `
    <div class="q-card" style="background:var(--surface-container-low,#f8fafc);border-radius:14px;padding:18px;margin:24px 0;text-align:center;">
      <p style="font-size:1.1rem;font-weight:600;line-height:1.7;">${sentHTML}</p>
    </div>
    <div class="word-bank" style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;">
      ${shuffle(q.bank).map((w,i)=>`<button class="w-chip btn-outline" id="fill-opt-${i}" onclick="pickWord('${w}',this)">${w}</button>`).join('')}
    </div>
  `;
}

function pickWord(w, el){
  if(el.disabled) return;
  const q=Q.questions[Q.idx];
  document.querySelectorAll('.w-chip').forEach(c=>{c.disabled=true;});
  const slot=document.getElementById('blankSlot');
  slot.textContent=w;
  slot.style.borderBottomStyle='solid';
  const correct=w.toLowerCase()===q.answer.toLowerCase();
  if(correct){
    el.classList.add('correct');
    slot.style.color='var(--green-d,#16a34a)';
    slot.style.borderColor='var(--green-d,#16a34a)';
  } else {
    el.classList.add('wrong');
    slot.style.color='var(--red,#dc2626)';
    slot.style.borderColor='var(--red,#dc2626)';
  }
  setTimeout(()=>showFeedback(correct,q),300);
}

/* ── DRAG & DROP ── */
let dragState = { dragging: null, answers: {} };

function renderDrag(q, num) {
  dragState = { dragging: null, answers: {} };
  q.zones.forEach(z => dragState.answers[z.id] = []);

  const c = document.getElementById('qContainer');
  const dragStyles = `
    <style>
      .drag-zone-box{border:3px dashed var(--outline-variant,#cbd5e1);border-radius:14px;padding:16px;min-height:100px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:center;transition:all .2s;background:var(--surface-container-lowest,#f8fafc);}
      .drag-zone-box.over{background:var(--surface-container,#f1f5f9);border-color:var(--primary);}
      .drag-chip-ui{display:inline-flex;align-items:center;gap:8px;background:#fff;border:2px solid var(--outline-variant,#cbd5e1);padding:12px 20px;border-radius:99px;font-weight:700;cursor:grab;box-shadow:0 4px 0 var(--outline-variant,#cbd5e1);}
      .drag-chip-ui:active{cursor:grabbing;transform:translateY(4px);box-shadow:none;}
      .drag-chip-ui.placed{opacity:.5;pointer-events:none;}
      .mini-chip-ui{display:inline-flex;align-items:center;gap:6px;background:var(--primary-container,#dbeafe);color:var(--on-primary,#1d4ed8);padding:6px 12px;border-radius:99px;font-size:14px;font-weight:700;cursor:pointer;}
      .mini-chip-ui .remove-x{background:rgba(0,0,0,.15);border-radius:50%;width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;}
    </style>
  `;

  c.innerHTML = dragStyles + promptBox(q, num) + `
    <p style="color:var(--text-m,#888);margin-bottom:16px;font-size:.9rem;">✋ Geser item ke kotak yang sesuai</p>
    <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-bottom:32px;" id="dragPool">
      ${shuffle(q.items).map(it=>`
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
    <div style="display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));margin-bottom:24px;" id="dropZones">
      ${q.zones.map((z,i)=>{
        const colors=['var(--primary)','var(--secondary,#7c3aed)','var(--tertiary,#0891b2)','var(--red,#dc2626)'];
        const color=colors[i%colors.length];
        return `
          <div style="text-align:center;">
            <p style="margin-bottom:8px;color:${color};font-weight:700;">${z.label}</p>
            <div class="drag-zone-box" id="zone_${z.id}"
                 ondragover="onDragOver(event)"
                 ondrop="onDrop(event,'${z.id}')"
                 ondragleave="onDragLeave(event)">
              <div id="zc_${z.id}" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;width:100%;"></div>
              <div id="zp_${z.id}" style="color:var(--text-m,#aaa);font-size:14px;font-weight:600;">Taruh di sini</div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
    <div style="display:flex;gap:12px;flex-wrap:wrap;">
      <button class="btn-primary drag-submit" onclick="checkDrag()" style="flex:1;">✅ Cek Jawaban</button>
      <button class="btn-secondary" onclick="resetDrag()" style="flex:1;">↺ Reset Semua</button>
    </div>
  `;
}

function onDragStart(id) { dragState.dragging = id; document.getElementById('chip_'+id).classList.add('dragging'); AudioFX.tick(); }
function onDragEnd() { if(dragState.dragging) document.getElementById('chip_'+dragState.dragging)?.classList.remove('dragging'); dragState.dragging=null; }
function onDragOver(e) { e.preventDefault(); e.currentTarget.classList.add('over'); }
function onDragLeave(e) { e.currentTarget.classList.remove('over'); }

function onDrop(e, zoneId) {
  e.preventDefault();
  e.currentTarget.classList.remove('over');
  if (!dragState.dragging) return;
  const chipId = dragState.dragging;
  const chip = document.getElementById('chip_'+chipId);
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
    if (!dragState.answers[zoneId].includes(chipId)) dragState.answers[zoneId].push(chipId);
    refreshZoneView(zoneId);
    chip.classList.add('placed');
    chip.setAttribute('draggable','false');
  } else {
    resetSingleChip(chipId);
  }
  dragState.dragging = null;
}

function refreshZoneView(zoneId) {
  const zc = document.getElementById('zc_'+zoneId);
  const zp = document.getElementById('zp_'+zoneId);
  if (!zc || !zp) return;
  zc.innerHTML = '';
  const items = dragState.answers[zoneId] || [];
  items.forEach(id => {
    const c = document.getElementById('chip_'+id);
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

function resetSingleChip(chipId) {
  const chip = document.getElementById('chip_'+chipId);
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
  chip.setAttribute('draggable','true');
  AudioFX.click && AudioFX.click();
}

let touchItem=null, touchClone=null;
function touchStart(e,id){
  touchItem=id; const chip=document.getElementById('chip_'+id);
  touchClone=chip.cloneNode(true); touchClone.style.cssText='position:fixed;opacity:.75;pointer-events:none;z-index:999;transition:none;';
  document.body.appendChild(touchClone); const t=e.touches[0];
  touchClone.style.left=(t.clientX-50)+'px'; touchClone.style.top=(t.clientY-25)+'px';
  chip.style.opacity='.3'; AudioFX.tick();
}
function touchMove(e){ e.preventDefault(); if(!touchClone) return; const t=e.touches[0]; touchClone.style.left=(t.clientX-50)+'px'; touchClone.style.top=(t.clientY-25)+'px'; }
function touchEnd(e,id){
  if(!touchItem) return; const t=e.changedTouches[0];
  const el=document.elementFromPoint(t.clientX,t.clientY); const zone=el?.closest('.drag-zone-box');
  if(zone){ onDrop({preventDefault:()=>{},currentTarget:{classList:{remove:()=>{}}}}, zone.id.replace('zone_','')); dragState.dragging=id; onDrop({preventDefault:()=>{},currentTarget:zone}, zone.id.replace('zone_','')); }
  else { const chip=document.getElementById('chip_'+id); if(chip) chip.style.opacity='1'; }
  touchClone?.remove(); touchClone=null; touchItem=null;
}

function resetDrag() {
  for (const chipId of Object.values(dragState.answers).flat()) resetSingleChip(chipId);
  dragState.answers = {};
  const submitBtn = document.querySelector('.drag-submit');
  if (submitBtn) submitBtn.disabled = false;
  AudioFX.click && AudioFX.click();
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
    if (expectedIds.sort().join(',') !== givenIds.sort().join(',')) { allCorrect = false; }
  }
  const allPlaced = Object.values(dragState.answers).flat();
  if (allPlaced.length !== q.items.length) allCorrect = false;

  for (const zoneId of Object.keys(expectedMap)) {
    const zoneEl = document.getElementById('zone_'+zoneId);
    const expected = expectedMap[zoneId];
    const given = dragState.answers[zoneId] || [];
    if (expected.length === given.length && expected.every(id => given.includes(id))) {
      zoneEl.style.borderColor = 'var(--green-d,#16a34a)';
      zoneEl.style.backgroundColor = 'var(--green-light,#dcfce7)';
    } else {
      zoneEl.style.borderColor = 'var(--red,#dc2626)';
      zoneEl.style.backgroundColor = 'var(--red-light,#fee2e2)';
    }
  }
  document.querySelector('.drag-submit').disabled = true;
  showFeedback(allCorrect, q);
}

/* ── VOICE / SPEECH ── */
let voiceRecognition=null, voiceTranscript='', isRecording=false;
let voiceAudioBlob=null, voiceAudioURL=null, voiceMediaRecorder=null;
let animationFrameId=null;

function renderVoice(q, num){
  const hasSpeech=('webkitSpeechRecognition' in window)||('SpeechRecognition' in window);
  const c=document.getElementById('qContainer');
  voiceTranscript=''; isRecording=false; voiceAudioBlob=null;
  if(voiceAudioURL){ URL.revokeObjectURL(voiceAudioURL); voiceAudioURL=null; }

  c.innerHTML = promptBox(q, num) + `
    <div class="q-card" style="background:var(--surface-container-low,#f8fafc);text-align:center;border-style:dashed;border:2px dashed var(--primary);border-radius:14px;padding:20px;margin-bottom:24px;">
      <p style="color:var(--primary);font-size:1.5rem;letter-spacing:2px;font-weight:700;">"${q.target}"</p>
    </div>
    <canvas id="voiceCanvas" style="width:100%;height:80px;background:#f0f7ff;border-radius:12px;border:2px solid var(--primary-container,#dbeafe);display:block;"></canvas>
    ${hasSpeech ? `
      <div class="voice-controls-row" style="display:flex;justify-content:center;gap:12px;margin-top:15px;">
        <button class="voice-btn" id="voiceBtn" onclick="toggleRecord()" title="Rekam" style="padding:12px 24px;border-radius:99px;background:var(--primary-container,#dbeafe);border:none;cursor:pointer;font-size:1.5rem;box-shadow:0 6px 0 var(--primary,#3b82f6);">🎤</button>
        <button class="voice-btn-sm" id="voicePlayBtn" onclick="playbackVoice()" title="Dengarkan" disabled style="padding:10px 18px;border-radius:99px;background:#f1f5f9;border:2px solid #cbd5e1;cursor:pointer;font-size:1.2rem;">▶️</button>
        <button class="voice-btn-sm" id="voiceResetBtn" onclick="resetVoice()" title="Rekam Ulang" disabled style="padding:10px 18px;border-radius:99px;background:#f1f5f9;border:2px solid #cbd5e1;cursor:pointer;font-size:1.2rem;">🔄</button>
      </div>
      <div class="voice-hint" id="voiceHint" style="text-align:center;color:var(--text-m,#888);margin-top:10px;font-size:.9rem;">Tekan 🎤 lalu ucapkan kalimat di atas dengan jelas</div>
      <div class="voice-transcript" id="voiceResult" style="text-align:center;margin-top:12px;min-height:32px;font-style:italic;color:var(--text-m,#888);">Belum ada hasil rekaman...</div>
      <button class="btn-primary" id="voiceCheck" onclick="checkVoice()" disabled style="width:100%;margin-top:16px;">Cek Jawaban ✓</button>
    ` : `
      <div style="text-align:center;padding:16px;color:var(--red,#dc2626);">⚠️ Browser tidak mendukung Speech Recognition.<br>Coba pakai Chrome/Edge.<br><br>
        <button class="btn-primary" onclick="skipVoice()" style="max-width:260px">Lewati Soal ini →</button>
      </div>
    `}
  `;

  const canvas = document.getElementById('voiceCanvas');
  if(canvas && typeof AudioVisualizer !== 'undefined') AudioVisualizer.initVoiceCanvas(canvas);
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
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 3; ctx.strokeStyle = '#0ea5e9'; ctx.beginPath();
    let sliceWidth = canvas.width / dataArray.length, x = 0;
    for(let i = 0; i < dataArray.length; i++) {
      let v = dataArray[i] / 128.0, y = v * canvas.height / 2;
      if(i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.lineTo(canvas.width, canvas.height / 2); ctx.stroke();
  }
  draw();
}

async function toggleRecord(){
  if(isRecording){ stopRecord(); return; }
  const resEl = document.getElementById('voiceResult');
  if(resEl){ resEl.textContent='Mendengarkan...'; resEl.style.fontStyle='normal'; }
  document.getElementById('voicePlayBtn').disabled = true;
  document.getElementById('voiceResetBtn').disabled = true;
  document.getElementById('voiceCheck').disabled = true;
  voiceTranscript = '';

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  voiceRecognition = new SR();
  voiceRecognition.lang = 'en-US';
  voiceRecognition.interimResults = true;
  voiceRecognition.continuous = false;
  voiceRecognition.maxAlternatives = 3;
  voiceRecognition.onresult = e => {
    let final = '';
    for(let i=e.resultIndex;i<e.results.length;i++){
      if(e.results[i].isFinal) final += e.results[i][0].transcript;
    }
    if(final){ voiceTranscript = final; if(resEl){ resEl.textContent=voiceTranscript; resEl.style.fontStyle='normal'; } }
  };
  voiceRecognition.onerror = () => stopRecord();
  voiceRecognition.onend = () => { if(isRecording) stopRecord(); };

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    startWaveform(stream);
    _startMediaRecorderWithStream(stream);
    voiceRecognition.start();
    isRecording = true;
    const btn = document.getElementById('voiceBtn');
    if(btn){ btn.innerHTML='⏹️'; btn.style.backgroundColor='var(--error-container,#fee2e2)'; btn.style.boxShadow='0 6px 0 var(--red,#dc2626)'; }
    const hint = document.getElementById('voiceHint');
    if(hint) hint.innerHTML='<span style="color:var(--red,#dc2626);">🔴 Sedang merekam... Tekan ⏹️ untuk berhenti</span>';
    AudioFX.tick();
  } catch(err) {
    alert('Mikrofon tidak terdeteksi atau izin ditolak!');
  }
}

function _startMediaRecorderWithStream(stream) {
  voiceMediaRecorder = new MediaRecorder(stream);
  const chunks = [];
  voiceMediaRecorder.ondataavailable = e => chunks.push(e.data);
  voiceMediaRecorder.onstop = () => {
    stream.getTracks().forEach(t => t.stop());
    voiceAudioBlob = new Blob(chunks, { type: 'audio/webm' });
    if(voiceAudioURL) URL.revokeObjectURL(voiceAudioURL);
    voiceAudioURL = URL.createObjectURL(voiceAudioBlob);
    document.getElementById('voicePlayBtn').disabled = false;
  };
  voiceMediaRecorder.start();
}

function stopRecord(){
  if(animationFrameId) cancelAnimationFrame(animationFrameId);
  if(voiceRecognition){ try{ voiceRecognition.stop(); }catch(e){} }
  if(voiceMediaRecorder && voiceMediaRecorder.state==='recording'){ try{ voiceMediaRecorder.stop(); }catch(e){} }
  isRecording = false;
  const btn = document.getElementById('voiceBtn');
  if(btn){ btn.innerHTML='🎤'; btn.style.backgroundColor='var(--primary-container,#dbeafe)'; btn.style.boxShadow='0 6px 0 var(--primary,#3b82f6)'; }
  const hint = document.getElementById('voiceHint');
  if(hint) hint.textContent='Rekaman selesai. Dengarkan atau langsung cek jawaban.';
  if(document.getElementById('voiceResetBtn')) document.getElementById('voiceResetBtn').disabled = false;
  if(document.getElementById('voiceCheck') && voiceTranscript) document.getElementById('voiceCheck').disabled = false;
  const canvas = document.getElementById('voiceCanvas');
  if(canvas){ const ctx=canvas.getContext('2d'); ctx.clearRect(0,0,canvas.width,canvas.height); }
}

function playbackVoice(){
  if(!voiceAudioURL) return;
  const audio = new Audio(voiceAudioURL);
  const playBtn = document.getElementById('voicePlayBtn');
  if(playBtn){ playBtn.disabled=true; playBtn.textContent='🔊'; }
  audio.play();
  audio.onended = () => { if(playBtn){ playBtn.disabled=false; playBtn.textContent='▶️'; } };
}

function resetVoice(){
  if(isRecording) stopRecord();
  voiceTranscript = '';
  if(voiceAudioURL){ URL.revokeObjectURL(voiceAudioURL); voiceAudioURL=null; }
  const resEl = document.getElementById('voiceResult');
  if(resEl){ resEl.textContent='Belum ada hasil rekaman...'; resEl.style.fontStyle='italic'; resEl.style.color='var(--text-m,#888)'; }
  document.getElementById('voicePlayBtn').disabled = true;
  document.getElementById('voiceResetBtn').disabled = true;
  document.getElementById('voiceCheck').disabled = true;
  const hint = document.getElementById('voiceHint');
  if(hint) hint.textContent='Tekan 🎤 dan ucapkan kalimat di atas dengan jelas.';
  AudioFX.tick();
}

function checkVoice(){
  const q=Q.questions[Q.idx];
  const target=q.target.toLowerCase().replace(/[^a-z\s]/g,'').trim();
  const said=(voiceTranscript||'').toLowerCase().replace(/[^a-z\s]/g,'').trim();
  const tWords=target.split(/\s+/).filter(w=>w.length>2);
  const sWords=said.split(/\s+/);
  const matched=tWords.filter(w=>sWords.some(sw=>sw===w||sw.startsWith(w.slice(0,-1)))).length;
  const score=tWords.length>0?matched/tWords.length:0;
  const correct=score>=0.75;
  document.getElementById('voiceCheck').disabled=true;
  document.getElementById('voiceBtn').disabled=true;
  document.getElementById('voiceResetBtn').disabled=true;
  document.getElementById('voicePlayBtn').disabled=true;
  const pct=Math.round(score*100);
  showFeedback(correct,{...q,exp:(correct?`🎉 Bagus! Akurasi ~${pct}%. `:`❌ Akurasi ~${pct}%. Yang kamu ucapkan: "${said||'-'}". Coba lagi! `)+(q.exp||'')});
}

function skipVoice(){ const q=Q.questions[Q.idx]; showFeedback(false,{...q,exp:'Soal dilewati. '+q.exp}); }

/* ── MATCH PAIRS (quiz2 – drag garis SVG) ── */
let matchState = {
  leftItems: [], rightItems: [], lines: [],
  dragging: false, dragStartSide: null, dragStartIdx: null,
  dragStartX: 0, dragStartY: 0,
  svg: null, containerRect: null
};

function renderMatch(q, num) {
  matchState = { leftItems: [], rightItems: [], lines: [], dragging: false, svg: null };

  const leftShuffled = shuffle(q.pairs.map(p => p.left));
  const rightShuffled = shuffle(q.pairs.map(p => p.right));
  leftShuffled.forEach((val, i) => matchState.leftItems.push({ idx: i, val }));
  rightShuffled.forEach((val, i) => matchState.rightItems.push({ idx: i, val }));

  const c = document.getElementById('qContainer');

  const matchStyles = `
    <style>
      .match-container{position:relative;display:flex;justify-content:space-between;margin:32px 0;min-height:250px;}
      .match-col{display:flex;flex-direction:column;gap:16px;width:40%;z-index:2;}
      .match-card{background:#fff;border:2px solid var(--outline-variant,#cbd5e1);padding:16px;border-radius:14px;text-align:center;font-weight:700;cursor:pointer;box-shadow:0 4px 0 var(--outline-variant,#cbd5e1);transition:transform .1s;user-select:none;}
      .match-card:active{transform:translateY(4px);box-shadow:0 0 0 var(--outline-variant,#cbd5e1);}
      .match-card.connected{background:var(--surface-container,#f1f5f9);border-color:var(--primary);box-shadow:0 4px 0 var(--primary);color:var(--primary);}
      .match-svg{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;pointer-events:none;}
    </style>
  `;

  c.innerHTML = matchStyles + promptBox(q, num) + `
    <p style="color:var(--text-m,#888);margin-bottom:16px;font-size:.9rem;">💡 Tarik garis dari kartu kiri ke kartu kanan yang cocok.</p>
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
    <div style="display:flex;gap:12px;flex-wrap:wrap;">
      <button class="btn-primary" id="checkMatchBtn" onclick="checkMatchLines()" style="flex:1;">✅ Cek Jawaban</button>
      <button class="btn-secondary" id="resetMatchBtn" onclick="resetMatchLines()" style="flex:1;">↺ Reset Garis</button>
    </div>
  `;

  window._matchPairs = q.pairs;

  setTimeout(() => {
    matchState.svg = document.getElementById('connectSvg');
    const container = document.getElementById('matchConnectContainer');

    function startDrag(e, side, idx) {
      if (matchState.lines.some(l => (side==='left' && l.leftIdx===idx)||(side==='right' && l.rightIdx===idx))) return;
      const isTouch = e.type.includes('touch');
      if (!isTouch) e.preventDefault();
      matchState.dragging = true;
      matchState.dragStartSide = side;
      matchState.dragStartIdx = idx;
      const card = e.target.closest('.match-card');
      matchState.containerRect = container.getBoundingClientRect();
      const rect = card.getBoundingClientRect();
      matchState.dragStartX = rect.left + rect.width/2 - matchState.containerRect.left;
      matchState.dragStartY = rect.top + rect.height/2 - matchState.containerRect.top;
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
      drawTempLine(matchState.dragStartX, matchState.dragStartY, event.clientX - rect.left, event.clientY - rect.top);
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
          const leftIdx = startSide==='left' ? startIdx : targetIdx;
          const rightIdx = startSide==='right' ? startIdx : targetIdx;
          if (!matchState.lines.some(l => l.leftIdx===leftIdx || l.rightIdx===rightIdx)) {
            matchState.lines.push({ leftIdx, rightIdx, correct: null });
            document.querySelector(`#connectLeftCol .match-card[data-idx="${leftIdx}"]`).classList.add('connected');
            document.querySelector(`#connectRightCol .match-card[data-idx="${rightIdx}"]`).classList.add('connected');
            AudioFX.tick();
          }
        }
      }
      drawAllLines();
    }

    document.querySelectorAll('#connectLeftCol .match-card').forEach(card => {
      card.addEventListener('mousedown', e => startDrag(e, 'left', parseInt(card.dataset.idx)));
      card.addEventListener('touchstart', e => startDrag(e, 'left', parseInt(card.dataset.idx)), {passive: false});
    });
    document.querySelectorAll('#connectRightCol .match-card').forEach(card => {
      card.addEventListener('mousedown', e => startDrag(e, 'right', parseInt(card.dataset.idx)));
      card.addEventListener('touchstart', e => startDrag(e, 'right', parseInt(card.dataset.idx)), {passive: false});
    });

    window.addEventListener('resize', drawAllLines);
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
      const p1 = { x: r1.left + r1.width/2 - rect.left, y: r1.top + r1.height/2 - rect.top };
      const r2 = rightCard.getBoundingClientRect();
      const p2 = { x: r2.left + r2.width/2 - rect.left, y: r2.top + r2.height/2 - rect.top };
      const lineColor = line.correct===true ? 'var(--green-d,#16a34a)' : line.correct===false ? 'var(--red,#dc2626)' : 'var(--outline-variant,#94a3b8)';
      const lineEl = document.createElementNS('http://www.w3.org/2000/svg','line');
      lineEl.setAttribute('x1',p1.x); lineEl.setAttribute('y1',p1.y);
      lineEl.setAttribute('x2',p2.x); lineEl.setAttribute('y2',p2.y);
      lineEl.setAttribute('stroke',lineColor);
      lineEl.setAttribute('stroke-width','4');
      lineEl.setAttribute('stroke-linecap','round');
      matchState.svg.appendChild(lineEl);
    }
  }
}

function drawTempLine(x1, y1, x2, y2) {
  drawAllLines();
  const tempLine = document.createElementNS('http://www.w3.org/2000/svg','line');
  tempLine.setAttribute('x1',x1); tempLine.setAttribute('y1',y1);
  tempLine.setAttribute('x2',x2); tempLine.setAttribute('y2',y2);
  tempLine.setAttribute('stroke','var(--primary)');
  tempLine.setAttribute('stroke-width','4');
  tempLine.setAttribute('stroke-dasharray','8,8');
  matchState.svg.appendChild(tempLine);
}

function resetMatchLines() {
  matchState.lines = [];
  document.querySelectorAll('.match-card').forEach(card => card.classList.remove('connected'));
  if (matchState.svg) matchState.svg.innerHTML = '';
  document.getElementById('checkMatchBtn').disabled = false;
  AudioFX.click && AudioFX.click();
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
    showFeedback(false, { ...q, exp: 'Ada garis yang salah atau belum lengkap. Reset dan coba lagi! ' + (q.exp||'') });
  }
  document.getElementById('checkMatchBtn').disabled = true;
}

/* ── next / finish ── */
function nextQuestion(){
  document.getElementById('feedbackOverlay').classList.remove('active','wrong');
  Q.idx++;
  if(Q.idx >= Q.questions.length) finishQuiz();
  else renderQuestion();
}

function finishQuiz(){
  AudioFX.complete();
  const score=Q.score, max=Q.maxScore, pct=score/max;
  updateScore(Q.topic.id, score, max);
  const emoji=pct>=.9?'🏆':pct>=.7?'🎉':pct>=.5?'😊':'💪';
  const title=pct>=.9?'Luar Biasa!':pct>=.7?'Bagus Sekali!':pct>=.5?'Cukup Baik!':'Semangat Terus!';
  const msg=pct>=.9?'Nilai sempurna! Kamu benar-benar menguasai materi ini!':pct>=.7?'Kerja bagus! Terus belajar ya!':pct>=.5?'Lumayan! Coba ulangi untuk nilai lebih bagus!':'Jangan menyerah! Pelajari lagi dan coba lagi!';
  document.getElementById('resEmoji').textContent=emoji;
  document.getElementById('resTitle').textContent=title;
  document.getElementById('resPts').textContent=score;
  document.getElementById('resMax').textContent='dari '+max;
  document.getElementById('resMsg').textContent=msg;
  document.getElementById('resStars').textContent=pct>=.9?'⭐⭐⭐':pct>=.7?'⭐⭐':pct>=.5?'⭐':'';
  showScreen('screen-result');
}

function retryQuiz(){ startQuiz(Q.topic); }
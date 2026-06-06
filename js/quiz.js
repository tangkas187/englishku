// ===== QUIZ ENGINE – MC, Fill, Drag&Drop, Voice, Match =====
let Q = { topic:null, questions:[], idx:0, score:0, maxScore:0 };
function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

function startQuiz(topic){
  Q.topic=topic;
  Q.questions=shuffle([...topic.questions]);
  Q.idx=0; Q.score=0; Q.maxScore=topic.questions.length*10;
  document.getElementById('quizTitle').textContent=topic.name;
  document.getElementById('quizBadge').textContent='Kelas '+AppState.player.class;
  document.getElementById('qTot').textContent=Q.questions.length;
  document.getElementById('qScore').textContent=0;
  showScreen('quizScreen');
  renderQuestion();
}

function renderQuestion(){
  const q=Q.questions[Q.idx];
  const num=Q.idx+1, tot=Q.questions.length;
  document.getElementById('qNum').textContent=num;
  document.getElementById('qprogbar').style.width=((num-1)/tot*100)+'%';
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
  const cls={mc:'q-type-mc',fill:'q-type-fill',drag:'q-type-drag',voice:'q-type-voice',match:'q-type-match'};
  return `<span class="q-type-badge ${cls[t]||''}">${map[t]||t}</span>`;
}

function promptBox(q, num) {
  let imgHtml = '';
  if (q.img) {
    if (q.img.includes('assets/image/')) {
      imgHtml = `<div class="q-img"><img id="qImgEl_${num}" src="" style="display:none; max-height:150px; border-radius:12px; margin:0 auto; box-shadow:0 4px 10px rgba(0,0,0,0.1);"></div>`;
      compressAndShow(q.img, `qImgEl_${num}`);
    } else {
      imgHtml = `<div class="q-img">${q.img}</div>`;
    }
  }
  return `<div class="q-prompt"> ${typeLabel(q.type)} <span class="q-num">Soal ${num}</span> <div class="q-text">${q.q}</div> ${imgHtml} </div>`;
}

function compressAndShow(url, imgId) {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, 400 / img.width);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    const ctx = canvas.getContext('2d');
    
    // gambar ulang ke canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // pakai webp biar kompresi jalan tapi transparan tetap aman
    const compressedData = canvas.toDataURL('image/webp', 0.6);
    
    // logika log buat bukti kompresi tetep jalan
    const uncompressedData = canvas.toDataURL('image/png');
    const sizeAsli = (uncompressedData.length * 0.75 / 1024).toFixed(2);
    const sizeKompres = (compressedData.length * 0.75 / 1024).toFixed(2);
    const hemat = (100 - (sizeKompres / sizeAsli * 100)).toFixed(1);
    
    console.log(`🖼️ [KOMPRESI MULTIMEDIA] -> ${url}`);
    console.log(`   ▪ Mentah : ${sizeAsli} KB`);
    console.log(`   ▪ WebP (60%) : ${sizeKompres} KB`);
    console.log(`   ▪ Hemat : ${hemat}% 📉`);

    const imgEl = document.getElementById(imgId);
    if (imgEl) {
      imgEl.src = compressedData;
      imgEl.style.display = 'block';
    }
  };
  img.src = url;
}

function showFeedback(correct,q){
  if(correct){ Q.score+=10; AudioFX.correct(); }
  else { AudioFX.wrong(); }
  document.getElementById('qScore').textContent=Q.score;
  document.getElementById('tbScore').textContent=AppState.totalPoints+Q.score;
  const ov=document.getElementById('feedbackOverlay');
  const msgs_ok=['Benar! Hebat! 🎉','Keren banget! 🌟','Yes! Lanjut! ','Pintar sekali! 🧠'];
  document.getElementById('fbIcon').textContent=correct?'✅':'❌';
  document.getElementById('fbMsg').textContent=correct?msgs_ok[Math.floor(Math.random()*msgs_ok.length)]:'Yah, salah nih...';
  document.getElementById('fbMsg').style.color=correct?'var(--green-d)':'var(--red)';
  document.getElementById('fbExp').textContent=q.exp||'';
  ov.classList.remove('hidden');
}

/* ── MULTIPLE CHOICE ── */
function renderMC(q,num){
  const c=document.getElementById('qContainer');
  const letters=['A','B','C','D'];
  c.innerHTML=promptBox(q,num)+`<div class="choices" id="choices">${q.choices.map((ch,i)=>`<button class="choice-btn" data-i="${i}" onclick="pickMC(${i})"><span class="choice-ltr">${letters[i]}</span> <span>${ch}</span></button>`).join('')}</div>`;
}
function pickMC(i){
  const q=Q.questions[Q.idx];
  document.querySelectorAll('.choice-btn').forEach(b=>b.disabled=true);
  const correct=i===q.answer;
  document.querySelectorAll('.choice-btn')[i].classList.add(correct?'correct':'wrong');
  if(!correct) document.querySelectorAll('.choice-btn')[q.answer].classList.add('correct');
  showFeedback(correct,q);
}

/* ── FILL IN THE BLANK ── */
function renderFill(q,num){
  const c=document.getElementById('qContainer');
  const sentHTML=q.sentence.replace('___','<span class="blank-slot" id="blankSlot">___</span>');
  c.innerHTML=promptBox(q,num)+`<div class="fill-area"><div class="blank-sentence">${sentHTML}</div><div class="word-bank" id="wordBank">${shuffle(q.bank).map(w=>`<button class="w-chip" onclick="pickWord('${w}',this)">${w}</button>`).join('')}</div></div>`;
}
function pickWord(w,el){
  if(el.classList.contains('used')) return;
  const q=Q.questions[Q.idx];
  document.querySelectorAll('.w-chip').forEach(c=>{c.disabled=true;});
  el.classList.add('used');
  const slot=document.getElementById('blankSlot');
  slot.textContent=w;
  const correct=w.toLowerCase()===q.answer.toLowerCase();
  slot.classList.add(correct?'correct':'wrong');
  setTimeout(()=>showFeedback(correct,q),250);
}

/* ── DRAG & DROP ── */
let dragState = { dragging: null, answers: {} };

function renderDrag(q, num) {
  dragState = { dragging: null, answers: {} };
  q.zones.forEach(z => dragState.answers[z.id] = []);

  const c = document.getElementById('qContainer');
  c.innerHTML = promptBox(q, num) + `<div class="drag-section"><div class="drag-label">✋ Drag item ke kotak yang sesuai:</div><div class="drag-items" id="dragPool">${shuffle(q.items).map(it=>`<div class="drag-chip" id="chip_${it.id}" draggable="true" ondragstart="onDragStart('${it.id}')" ondragend="onDragEnd()" ontouchstart="touchStart(event,'${it.id}')" ontouchmove="touchMove(event)" ontouchend="touchEnd(event,'${it.id}')"><span class="drag-chip-icon">${it.label.split(' ')[0]}</span><span>${it.label.split(' ').slice(1).join(' ')}</span></div>`).join('')}</div></div><div class="drop-zones" id="dropZones">${q.zones.map(z=>`<div class="drop-zone" id="zone_${z.id}" ondragover="onDragOver(event)" ondrop="onDrop(event,'${z.id}')" ondragleave="onDragLeave(event)"><div class="dz-label">${z.label}</div><div class="dz-content" id="zc_${z.id}" style="display:flex;flex-wrap:wrap;gap:5px;justify-content:center;"></div><div class="dz-placeholder" id="zp_${z.id}">Taruh di sini</div></div>`).join('')}</div>
  <div style="display:flex; gap:10px; margin-top:1.2rem; width:100%;">
    <button class="btn-secondary" onclick="resetDrag()" style="flex:1;">Ulangi 🔄</button>
    <button class="btn-primary drag-submit" onclick="checkDrag()" style="flex:2;">Cek Jawaban ✓</button>
  </div>`;
}

function onDragStart(id) { dragState.dragging = id; document.getElementById('chip_' + id).classList.add('dragging'); AudioFX.tick(); }
function onDragEnd() { if (dragState.dragging) document.getElementById('chip_' + dragState.dragging)?.classList.remove('dragging'); }
function onDragOver(e) { e.preventDefault(); e.currentTarget.classList.add('over'); }
function onDragLeave(e) { e.currentTarget.classList.remove('over'); }
function onDrop(e, zoneId) { e.preventDefault(); e.currentTarget.classList.remove('over'); if (!dragState.dragging) return; placeChip(dragState.dragging, zoneId); dragState.dragging = null; }

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
  const el=document.elementFromPoint(t.clientX,t.clientY); const zone=el?.closest('.drop-zone'); 
  if(zone){ placeChip(id, zone.id.replace('zone_','')); } 
  else { document.getElementById('chip_'+id).style.opacity='1'; } 
  touchClone?.remove(); touchClone=null; touchItem=null; 
}

function placeChip(chipId, zoneId) {
  const chip = document.getElementById('chip_' + chipId);
  if (!chip) return;

  Object.keys(dragState.answers).forEach(z => {
    const arr = dragState.answers[z];
    const idx = arr.indexOf(chipId);
    if (idx !== -1) {
      arr.splice(idx, 1);
      updateZoneUI(z);
    }
  });

  if (dragState.answers[zoneId]) {
    dragState.answers[zoneId].push(chipId);
    updateZoneUI(zoneId);
  }

  chip.style.opacity = '.25';
  chip.style.pointerEvents = 'none';
}

function updateZoneUI(zoneId) {
  const zc = document.getElementById('zc_' + zoneId);
  const zp = document.getElementById('zp_' + zoneId);
  if (!zc || !zp) return;

  const chipsInZone = dragState.answers[zoneId];
  if (chipsInZone.length > 0) {
    zp.style.display = 'none';
    document.getElementById('zone_' + zoneId).classList.add('filled');
    zc.innerHTML = chipsInZone.map(id => {
      const c = document.getElementById('chip_' + id);
      return c ? `<div style="font-size:0.8rem; background:#fff; padding:3px 7px; border-radius:6px; border:1px solid #ccc;">${c.textContent.trim()}</div>` : '';
    }).join('');
  } else {
    zp.style.display = '';
    zc.innerHTML = '';
    document.getElementById('zone_' + zoneId).classList.remove('filled');
  }
}

function checkDrag() {
  const q = Q.questions[Q.idx];
  let correct = true;

  q.zones.forEach(z => {
    const zel = document.getElementById('zone_' + z.id);
    const expectedItems = q.items.filter(i => i.zone === z.id).map(i => i.id);
    const actualItems = dragState.answers[z.id] || [];
    const isZonePerfect = expectedItems.length === actualItems.length && expectedItems.every(id => actualItems.includes(id));

    if (zel) {
      zel.classList.remove('correct-dz', 'wrong-dz');
      zel.classList.add(isZonePerfect ? 'correct-dz' : 'wrong-dz');
    }
    if (!isZonePerfect) correct = false;
  });

  document.querySelector('.drag-submit').disabled = true;
  showFeedback(correct, q);
}

function resetDrag() {
  Object.keys(dragState.answers).forEach(z => {
    dragState.answers[z].forEach(chipId => {
      const chip = document.getElementById('chip_' + chipId);
      if (chip) {
        chip.style.opacity = '1';
        chip.style.pointerEvents = 'auto';
        document.getElementById('dragPool').appendChild(chip);
      }
    });
    dragState.answers[z] = [];
    updateZoneUI(z);
  });
}

/* ── VOICE / SPEECH ── */
let voiceRecognition=null, voiceTranscript='', isRecording=false;
let voiceAudioBlob=null, voiceAudioURL=null, voiceMediaRecorder=null;

function renderVoice(q,num){
  const hasSpeech=('webkitSpeechRecognition' in window)||('SpeechRecognition' in window);
  const c=document.getElementById('qContainer');
  voiceTranscript=''; isRecording=false; voiceAudioBlob=null;
  if(voiceAudioURL){ URL.revokeObjectURL(voiceAudioURL); voiceAudioURL=null; }

  c.innerHTML=promptBox(q,num)+`<div class="voice-area">
    <div class="voice-waveform" id="voiceWaveformWrap"><canvas id="voiceCanvas"></canvas></div>
    <div class="voice-target">"${q.target}"</div>
    ${hasSpeech?`
      <div class="voice-controls-row">
        <button class="voice-btn" id="voiceBtn" onclick="toggleRecord()" title="Rekam">🎤</button>
        <button class="voice-btn-sm" id="voicePlayBtn" onclick="playbackVoice()" title="Dengarkan" disabled>▶️</button>
        <button class="voice-btn-sm" id="voiceResetBtn" onclick="resetVoice()" title="Rekam Ulang" disabled>🔄</button>
      </div>
      <div class="voice-hint" id="voiceHint">Tekan 🎤 lalu ucapkan kalimat di atas dengan jelas</div>
      <div class="voice-transcript empty" id="voiceResult">Belum ada hasil rekaman...</div>
      <button class="btn-primary voice-check-btn" id="voiceCheck" onclick="checkVoice()" disabled>Cek Jawaban ✓</button>
    `:`<div class="voice-no-support">⚠️ Browser tidak mendukung Speech Recognition.<br>Coba pakai Chrome/Edge.<br><br>
      <button class="btn-primary" onclick="skipVoice()" style="max-width:260px">Lewati Soal ini →</button></div>`}
  </div>`;
}

function toggleRecord(){
  if(isRecording){ stopRecord(); return; }
  const resEl=document.getElementById('voiceResult');
  if(resEl){ resEl.textContent='Mendengarkan...'; resEl.className='voice-transcript'; }
  const playBtn=document.getElementById('voicePlayBtn');
  const resetBtn=document.getElementById('voiceResetBtn');
  const chkBtn=document.getElementById('voiceCheck');
  if(playBtn) playBtn.disabled=true;
  if(resetBtn) resetBtn.disabled=true;
  if(chkBtn) chkBtn.disabled=true;
  voiceTranscript='';

  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  voiceRecognition=new SR();
  voiceRecognition.lang='en-US';
  voiceRecognition.interimResults=true;
  voiceRecognition.continuous=false;
  voiceRecognition.maxAlternatives=3;

  voiceRecognition.onresult=e=>{
    let interim='', final='';
    for(let i=e.resultIndex;i<e.results.length;i++){
      if(e.results[i].isFinal) final+=e.results[i][0].transcript;
      else interim+=e.results[i][0].transcript;
    }
    voiceTranscript=final||interim;
    if(resEl){ resEl.textContent=voiceTranscript||'...'; resEl.classList.remove('empty'); }
  };
  voiceRecognition.onerror=e=>{ console.warn('Speech error:',e.error); stopRecord(); };
  voiceRecognition.onend=()=>stopRecord();
  voiceRecognition.start();
  isRecording=true;
  initVoiceWaveform();
  const btn=document.getElementById('voiceBtn');
  if(btn){ btn.classList.add('recording'); btn.textContent='⏹️'; btn.title='Stop Rekaman'; }
  const hint=document.getElementById('voiceHint');
  if(hint) hint.textContent='🔴 Sedang merekam... Tekan ⏹️ untuk berhenti';
  AudioFX.tick();
  _startMediaRecorder();
}

function _startMediaRecorder(){
  if(!navigator.mediaDevices) return;
  navigator.mediaDevices.getUserMedia({audio:true}).then(stream=>{
    voiceMediaRecorder=new MediaRecorder(stream);
    const chunks=[];
    voiceMediaRecorder.ondataavailable=e=>chunks.push(e.data);
    voiceMediaRecorder.onstop=()=>{
      stream.getTracks().forEach(t=>t.stop());
      voiceAudioBlob=new Blob(chunks,{type:'audio/webm'});
      if(voiceAudioURL) URL.revokeObjectURL(voiceAudioURL);
      voiceAudioURL=URL.createObjectURL(voiceAudioBlob);
      const playBtn=document.getElementById('voicePlayBtn');
      if(playBtn) playBtn.disabled=false;
    };
    voiceMediaRecorder.start();
  }).catch(()=>{}); 
}

function stopRecord(){
  stopVoiceWaveform();
  if(voiceRecognition){ try{ voiceRecognition.stop(); }catch(e){} }
  if(voiceMediaRecorder && voiceMediaRecorder.state==='recording'){ try{ voiceMediaRecorder.stop(); }catch(e){} }
  isRecording=false;
  const btn=document.getElementById('voiceBtn');
  if(btn){ btn.classList.remove('recording'); btn.textContent='🎤'; btn.title='Rekam'; }
  const hint=document.getElementById('voiceHint');
  if(hint) hint.textContent='Rekaman selesai. Dengarkan atau langsung cek jawaban.';
  const resetBtn=document.getElementById('voiceResetBtn');
  if(resetBtn) resetBtn.disabled=false;
  const chk=document.getElementById('voiceCheck');
  if(chk && voiceTranscript) chk.disabled=false;
}

function playbackVoice(){
  if(!voiceAudioURL) return;
  const audio=new Audio(voiceAudioURL);
  const playBtn=document.getElementById('voicePlayBtn');
  if(playBtn){ playBtn.disabled=true; playBtn.textContent='🔊'; }
  audio.play();
  audio.onended=()=>{ if(playBtn){ playBtn.disabled=false; playBtn.textContent='▶️'; } };
}

function resetVoice(){
  if(isRecording){ if(voiceRecognition) try{voiceRecognition.stop();}catch(e){} if(voiceMediaRecorder&&voiceMediaRecorder.state==='recording') try{voiceMediaRecorder.stop();}catch(e){} isRecording=false; stopVoiceWaveform(); }
  voiceTranscript='';
  if(voiceAudioURL){ URL.revokeObjectURL(voiceAudioURL); voiceAudioURL=null; }
  voiceAudioBlob=null;
  const resEl=document.getElementById('voiceResult');
  if(resEl){ resEl.textContent='Belum ada hasil rekaman...'; resEl.className='voice-transcript empty'; }
  const btn=document.getElementById('voiceBtn');
  if(btn){ btn.classList.remove('recording'); btn.textContent='🎤'; btn.disabled=false; }
  const playBtn=document.getElementById('voicePlayBtn');
  if(playBtn){ playBtn.disabled=true; playBtn.textContent='▶️'; }
  const resetBtn=document.getElementById('voiceResetBtn');
  if(resetBtn) resetBtn.disabled=true;
  const chk=document.getElementById('voiceCheck');
  if(chk) chk.disabled=true;
  const hint=document.getElementById('voiceHint');
  if(hint) hint.textContent='Tekan 🎤 lalu ucapkan kalimat di atas dengan jelas';
  AudioFX.tick();
}

function checkVoice(){
  const q=Q.questions[Q.idx];
  const target=q.target.toLowerCase().replace(/[^a-z\s]/g,'').trim();
  const said=(voiceTranscript||'').toLowerCase().replace(/[^a-z\s]/g,'').trim();

  const tWords=target.split(/\s+/).filter(w=>w.length>2);
  const sWords=said.split(/\s+/);
  const matched=tWords.filter(w=>sWords.some(sw=>sw===w||sw.startsWith(w.slice(0,-1)))).length;
  const score=tWords.length>0 ? matched/tWords.length : 0;
  const correct= score>=0.75;

  const chkEl=document.getElementById('voiceCheck');
  const micEl=document.getElementById('voiceBtn');
  if(chkEl) chkEl.disabled=true;
  if(micEl) micEl.disabled=true;
  const resetBtn=document.getElementById('voiceResetBtn');
  if(resetBtn) resetBtn.disabled=true;
  const playBtn=document.getElementById('voicePlayBtn');
  if(playBtn) playBtn.disabled=true;

  const pct=Math.round(score*100);
  showFeedback(correct,{...q, exp:(correct?`🎉 Bagus! Akurasi ~${pct}%. `:`❌ Akurasi ~${pct}%. Yang kamu ucapkan: "${said||'-'}". Coba lagi! `)+(q.exp||'')});
}

function skipVoice(){ const q=Q.questions[Q.idx]; showFeedback(false,{...q,exp:'Soal dilewati. '+q.exp}); }

/* ── MATCH PAIRS ── */
let matchState = { selected: null, side: null, val: null, pairs: [], colors: ['#FFCDD2', '#C8E6C9', '#BBDEFB', '#FFF9C4', '#E1BEE7', '#FFECB3'] };

function renderMatch(q, num) {
  matchState = { selected: null, side: null, val: null, pairs: [], colors: ['#FFCDD2', '#C8E6C9', '#BBDEFB', '#FFF9C4', '#E1BEE7', '#FFECB3'] };
  const leftShuffled = shuffle(q.pairs.map(p => p.left));
  const rightShuffled = shuffle(q.pairs.map(p => p.right));
  const c = document.getElementById('qContainer');
  
  c.innerHTML = promptBox(q, num) + `
    <div class="match-grid">
      <div>
        <div class="match-col-hdr">Kolom A</div>
        <div class="match-col" id="matchLeft">
          ${leftShuffled.map((l, i) => `<div class="match-item" id="ml_${i}" data-side="left" data-idx="${i}" data-val="${encodeURIComponent(l)}">${l}</div>`).join('')}
        </div>
      </div>
      <div>
        <div class="match-col-hdr">Kolom B</div>
        <div class="match-col" id="matchRight">
          ${rightShuffled.map((r, i) => `<div class="match-item" id="mr_${i}" data-side="right" data-idx="${i}" data-val="${encodeURIComponent(r)}">${r}</div>`).join('')}
        </div>
      </div>
    </div>
    <div class="match-hint" id="matchHint" style="text-align:center;font-size:.82rem;color:var(--text-m,#888);margin-top:.5rem">Pilih satu item di Kolom A, lalu pasangkan ke Kolom B (klik warna yang sama jika ingin membatalkan)</div>
    <button class="btn-primary" id="matchSubmit" onclick="checkMatch()" style="width:100%; margin-top:1rem;" disabled>Cek Jawaban ✓</button>
  `;
  
  window._matchPairs = q.pairs;
  c.querySelectorAll('.match-item').forEach(el => {
    el.addEventListener('click', () => {
      const side = el.dataset.side;
      const idx = parseInt(el.dataset.idx);
      const val = decodeURIComponent(el.dataset.val);
      handleMatchClick(side, idx, val, q);
    });
  });
}

function handleMatchClick(side, idx, val, q) {
  const elId = (side === 'left' ? 'ml' : 'mr') + '_' + idx;
  const el = document.getElementById(elId);

  if (el.classList.contains('paired')) {
    unpairMatch(elId);
    return;
  }

  AudioFX.tick();

  if (matchState.side === null) {
    matchState.selected = idx; matchState.side = side; matchState.val = val;
    el.classList.add('selected');
  } else if (matchState.side === side) {
    document.querySelectorAll('.match-item.selected').forEach(e => e.classList.remove('selected'));
    matchState.selected = idx; matchState.side = side; matchState.val = val;
    el.classList.add('selected');
  } else {
    const leftVal = side === 'right' ? matchState.val : val;
    const rightVal = side === 'right' ? val : matchState.val;
    const leftId = side === 'right' ? 'ml_' + matchState.selected : elId;
    const rightId = side === 'right' ? elId : 'mr_' + matchState.selected;

    const color = matchState.colors[matchState.pairs.length % matchState.colors.length];
    matchState.pairs.push({ leftVal, rightVal, leftId, rightId });

    const mlEl = document.getElementById(leftId);
    const mrEl = document.getElementById(rightId);
    mlEl.classList.remove('selected'); mrEl.classList.remove('selected');
    mlEl.classList.add('paired'); mrEl.classList.add('paired');
    mlEl.style.backgroundColor = color; mrEl.style.backgroundColor = color;
    mlEl.dataset.pairId = matchState.pairs.length - 1;
    mrEl.dataset.pairId = matchState.pairs.length - 1;

    matchState.selected = null; matchState.side = null; matchState.val = null;

    if (matchState.pairs.length === window._matchPairs.length) {
      document.getElementById('matchSubmit').disabled = false;
    }
  }
}

function unpairMatch(elId) {
  const el = document.getElementById(elId);
  const pairIdx = el.dataset.pairId;
  const pair = matchState.pairs[pairIdx];
  if (!pair) return;

  const mlEl = document.getElementById(pair.leftId);
  const mrEl = document.getElementById(pair.rightId);
  if (mlEl) { mlEl.classList.remove('paired'); mlEl.style.backgroundColor = ''; delete mlEl.dataset.pairId; }
  if (mrEl) { mrEl.classList.remove('paired'); mrEl.style.backgroundColor = ''; delete mrEl.dataset.pairId; }

  matchState.pairs.splice(pairIdx, 1);
  matchState.pairs.forEach((p, i) => {
    document.getElementById(p.leftId).dataset.pairId = i;
    document.getElementById(p.rightId).dataset.pairId = i;
  });
  document.getElementById('matchSubmit').disabled = true;
}

function checkMatch() {
  const q = Q.questions[Q.idx];
  let correct = true;
  matchState.pairs.forEach(p => {
    const isMatch = window._matchPairs.some(mp => mp.left === p.leftVal && mp.right === p.rightVal);
    if (!isMatch) correct = false;
  });
  
  document.getElementById('matchSubmit').disabled = true;
  document.querySelectorAll('.match-item').forEach(el => el.style.pointerEvents = 'none');
  showFeedback(correct, q);
}

/* ── next / finish ── */
function nextQuestion(){
  document.getElementById('feedbackOverlay').classList.add('hidden');
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
  document.getElementById('resEmoji').textContent=emoji; document.getElementById('resTitle').textContent=title;
  document.getElementById('resPts').textContent=score; document.getElementById('resMax').textContent='dari '+max;
  document.getElementById('resMsg').textContent=msg;
  document.getElementById('resStars').textContent=pct>=.9?'⭐⭐⭐':pct>=.7?'⭐⭐':pct>=.5?'⭐':'';
  showScreen('resultScreen'); setTimeout(onResultShown, 100);
}
function retryQuiz(){ startQuiz(Q.topic); }
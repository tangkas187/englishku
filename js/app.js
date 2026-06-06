const bgMusic = new Audio('assets/music/bgm.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.1; 

const muteBtn = document.createElement('button');
muteBtn.innerHTML = '🔊';
muteBtn.style.cssText = 'position:fixed; bottom:20px; left:20px; z-index:9999; font-size:1.5rem; background:#fff; border:2px solid #E2D9CE; border-radius:50%; width:50px; height:50px; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:center;';
muteBtn.onclick = () => {
  bgMusic.muted = !bgMusic.muted;
  muteBtn.innerHTML = bgMusic.muted ? '🔇' : '🔊';
};
document.body.appendChild(muteBtn);

// ===== APP CONTROLLER =====

// ===== APP CONTROLLER =====
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
function initLogin(){
  const nameInput=document.getElementById('inputName');
  const btnStart=document.getElementById('btnStart');
  let selClass=null;
  nameInput.addEventListener('input', check);
  document.querySelectorAll('.cls-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.cls-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      selClass=parseInt(btn.dataset.class);
      AudioFX.tick(); check();
    });
  });
  function check(){ btnStart.disabled=!(nameInput.value.trim().length>=2&&selClass); }
  btnStart.addEventListener('click',()=>{
    AppState.player.name=nameInput.value.trim();
    AppState.player.class=selClass;
    saveState(); AudioFX.click();
    initHome(); showScreen('homeScreen'); onHomeShown();
  });
}
function initHome(){
  const {name,class:cls}=AppState.player;
  document.getElementById('wcName').textContent=name;
  document.getElementById('tbName').textContent=name;
  document.getElementById('tbClass').textContent='Kelas '+cls;
  document.getElementById('tbScore').textContent=AppState.totalPoints;
  renderProgress(); renderTopics(); updateWelcomeStats();
}
function renderTopics(){
  const topics=TOPICS[AppState.player.class]||[];
  const grid=document.getElementById('topicGrid');
  grid.innerHTML='';
  topics.forEach((t,i)=>{
    const saved=getTopicScore(t.id);
    const done=saved && saved.completed;
    const card=document.createElement('div');
    card.className='topic-card';
    card.style.setProperty('--tc',t.color);
    card.style.animationDelay=(i*.07)+'s';
    card.innerHTML=`${done?'<span class="topic-done">✓ Lulus</span>':''}<span class="t-icon">${t.icon}</span><div class="t-name">${t.name}</div><div class="t-count">${t.questions.length} soal</div>${saved?`<div class="t-best">Best: ${saved.highScore}/${saved.maxScore} pts</div>`:''}`;
    card.addEventListener('click',()=>{ AudioFX.click(); startQuiz(t); });
    grid.appendChild(card);
  });
}
function renderProgress(){
  const topics=TOPICS[AppState.player.class]||[];
  const grid=document.getElementById('progressGrid');
  grid.innerHTML='';
  const attempted=topics.filter(t=>getTopicScore(t.id));
  if(!attempted.length){
    grid.innerHTML='<p style="color:var(--text-m);font-size:.88rem;grid-column:1/-1">Belum ada progres. Mulai kerjakan soal!</p>';
    return;
  }
  attempted.forEach((t,i)=>{
    const s=getTopicScore(t.id); if(!s) return;
    const pct=Math.round(s.highScore/s.maxScore*100);
    const card=document.createElement('div');
    card.className='prog-card'; card.style.animationDelay=(i*.05)+'s';
    card.innerHTML=`<div class="prog-title">${t.icon} ${t.name}</div><div class="prog-sub">Best: ${s.highScore}/${s.maxScore} pts · ${s.attempts}x dikerjakan</div><div class="mini-bar"><div class="mini-bar-fill" style="width:${pct}%"></div></div>`;
    grid.appendChild(card);
  });
}
function backToHome(){ initHome(); showScreen('homeScreen'); onHomeShown(); }
function logout(){
  if(confirm('Keluar? Data tersimpan dan bisa dilanjutkan lagi.')){
    clearCurrentUser(); // Reset memory state
    showScreen('loginScreen');
  }
}
// ===== BOOT =====
document.addEventListener('DOMContentLoaded',()=>{
  initState();
  if(AppState.player.name&&AppState.player.class){
    document.getElementById('inputName').value=AppState.player.name;
    const cb=document.querySelector(`.cls-btn[data-class="${AppState.player.class}"]`);
    if(cb){ cb.classList.add('active'); document.getElementById('btnStart').disabled=false; }
    setTimeout(()=>{ initHome(); showScreen('homeScreen'); onHomeShown(); },150);
  }
  initLogin();
});
function updateWelcomeStats() {
  const topics = TOPICS[AppState.player.class] || [];
  const done = topics.filter(t => { const s = getTopicScore(t.id); return s && s.completed; }).length;
  const el1 = document.getElementById('wcTopicsDone');
  const el2 = document.getElementById('wcTotalPts');
  if (el1) el1.textContent = `📚 ${done}/${topics.length} Topik`;
  if (el2) el2.textContent = `⭐ ${AppState.totalPoints} Poin`;
}
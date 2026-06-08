// ===== APP CONTROLLER (Full Fix Version) =====

function showScreen(id) {
    // Selalu tutup feedback overlay saat berpindah screen
    const overlay = document.getElementById('feedbackOverlay');
    if (overlay) overlay.classList.remove('active', 'wrong');

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    const bottomNav = document.querySelector('.bottom-nav');
    const topBarScore = document.querySelector('.top-bar .card');
    
    // Perbaikan: Sembunyikan navbar saat kuis agar user tidak bisa loncat menu
    if (id === 'screen-login' || id === 'screen-quiz') {
        if (bottomNav) bottomNav.style.display = 'none';
        if (id === 'screen-login' && topBarScore) topBarScore.style.display = 'none';
        else if (topBarScore) topBarScore.style.display = 'flex';
    } else {
        if (bottomNav) bottomNav.style.display = 'flex';
        if (topBarScore) topBarScore.style.display = 'flex';
    }
    
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    if (id === 'screen-home') document.querySelectorAll('.nav-item')[0].classList.add('active');
    if (id === 'screen-progress') document.querySelectorAll('.nav-item')[1].classList.add('active');
    
    window.scrollTo(0, 0);
}

function initLogin() {
    const nameInput = document.getElementById('inputName');

    // Clone tombol PERTAMA sebelum attach event apapun, cegah listener menumpuk saat logout-login
    const oldBtn = document.getElementById('btnStart');
    const btn = oldBtn.cloneNode(true);
    oldBtn.parentNode.replaceChild(btn, oldBtn);

    // Clone ulang cls-btn agar listener lama tidak menumpuk
    document.querySelectorAll('.cls-btn').forEach(b => {
        const fresh = b.cloneNode(true);
        b.parentNode.replaceChild(fresh, b);
    });

    // Reset state tombol kelas dan mulai
    document.querySelectorAll('.cls-btn').forEach(b => b.classList.remove('active'));
    btn.disabled = true;

    function check() {
        const activeBtn = document.querySelector('.cls-btn.active');
        btn.disabled = !(nameInput.value.trim().length >= 2 && activeBtn);
    }

    nameInput.addEventListener('input', check);
    document.querySelectorAll('.cls-btn').forEach(clsBtn => {
        clsBtn.addEventListener('click', () => {
            document.querySelectorAll('.cls-btn').forEach(b => b.classList.remove('active'));
            clsBtn.classList.add('active');
            if (typeof AudioFX !== 'undefined') AudioFX.tick();
            check();
        });
    });

    btn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const activeBtn = document.querySelector('.cls-btn.active');
        if (name && activeBtn) {
            const selClass = parseInt(activeBtn.dataset.class);
            loginUser(name, selClass);
            if (typeof AudioFX !== 'undefined') AudioFX.click();
            initHome();
            showScreen('screen-home');
        }
    });
}

function initHome() {
    const { name, class: cls } = AppState.player;
    const wcName = document.getElementById('wcName');
    if (wcName) wcName.textContent = name;
    
    // Paksa top bar update saat masuk home
    const tbScore = document.getElementById('tbScore');
    if (tbScore) tbScore.textContent = AppState.totalPoints || 0;
    
    renderTopics(); 
    renderProgress();
    updateWelcomeStats();
    
    if (typeof updateDashboardWidgets === 'function') {
        updateDashboardWidgets();
    }
}

function renderTopics(){
    const topics = TOPICS[AppState.player.class] || [];
    const grid = document.getElementById('topicGrid');
    grid.innerHTML = '';
    topics.forEach((t, i) => {
        const saved = getTopicScore(t.id);
        const done = saved && saved.completed;
        const card = document.createElement('div');
        card.className = 'adventure-card-new';
        card.style.animationDelay = (i * 0.07) + 's';
        card.innerHTML = `
            <div class="adventure-icon-box" style="background-color: ${t.color}33;">${t.icon}</div>
            <h4 class="headline-md" style="font-size: 20px; color: var(--primary-dark);">${t.name}</h4>
            <p class="label-sm" style="color: var(--on-surface-variant); margin-top: 8px;">${t.questions.length} Quests</p>
            ${saved ? `<div class="label-sm" style="margin-top: 12px; color: ${done ? 'var(--tertiary-dark)' : 'var(--secondary-dark)'};">${done ? '✅ Done' : `⭐ ${saved.highScore} pts`}</div>` : ''}
        `;
        card.onclick = () => { if(typeof AudioFX !== 'undefined') AudioFX.click(); startQuiz(t); };
        grid.appendChild(card);
    });
}

function updateWelcomeStats() {
    const totalPts = AppState.totalPoints || 0;
    const elPtsHome = document.getElementById('wcTotalPtsHome');
    const elStreak = document.getElementById('wcStreak'); 
    if (elPtsHome) elPtsHome.textContent = `${totalPts} Poin`;
    let totalAttempts = 0;
    Object.values(AppState.scores).forEach(s => totalAttempts += (s.attempts || 0));
    if (elStreak) elStreak.textContent = `${Math.min(totalAttempts, 7)} Hari`;
}

function renderProgress() {
    const topics = TOPICS[AppState.player.class] || [];
    
    let totalMax = topics.reduce((sum, t) => sum + (t.questions.length * 10), 0);
    let totalCurrent = AppState.totalPoints || 0;
    let overallPct = totalMax > 0 ? Math.round((totalCurrent / totalMax) * 100) : 0;
    
    let currentLevel = Math.floor(totalCurrent / 50) + 1;
    let totalAttempts = 0;
    let perfectScores = 0;
    let completedTopics = 0;
    
    Object.values(AppState.scores).forEach(s => {
        totalAttempts += s.attempts || 0;
        if (s.highScore === s.maxScore && s.maxScore > 0) perfectScores++;
        if (s.completed) completedTopics++;
    });

    let dayStreak = totalAttempts > 0 ? Math.min(totalAttempts, 7) : 0; 

    const progGreeting = document.getElementById('progGreeting');
    if (progGreeting) progGreeting.textContent = `Great Job, ${AppState.player.name}!`;
    
    const progAvatar = document.getElementById('progAvatar');
    if (progAvatar && AppState.player.name) {
        progAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(AppState.player.name)}&background=0ea5e9&color=fff&size=120&bold=true`;
    }
    
    const progTotalStars = document.getElementById('progTotalStars');
    if (progTotalStars) progTotalStars.textContent = totalCurrent;

    // Paksa update nilai Top Bar agar tersinkronisasi
    const tbScore = document.getElementById('tbScore');
    if (tbScore) tbScore.textContent = totalCurrent;
    
    const progPctText = document.getElementById('progPctText');
    const progBarFill = document.getElementById('progBarFill');
    if (progPctText) progPctText.textContent = `${overallPct}%`;
    if (progBarFill) progBarFill.style.width = `${overallPct}%`;
    
    const lvBadge = document.querySelector('.lv-badge');
    if (lvBadge) lvBadge.textContent = `Lv. ${currentLevel}`;
    
    const streakEl = document.querySelector('.streak-card .headline-lg, .streak-card .headline-xl');
    if (streakEl) streakEl.textContent = dayStreak;

    const achievementsContainer = document.querySelector('.achievements-grid');
    if (achievementsContainer) {
        const badges = [
            { id: 'grammar', title: 'Grammar Hero', desc: '1 Perfect Lesson', icon: 'menu_book', color: 'background: var(--primary-container); color: white;', unlocked: perfectScores >= 1 },
            { id: 'fast', title: 'Fast Learner', desc: '100 Total Stars', icon: 'bolt', color: 'background: var(--secondary); color: white;', unlocked: totalCurrent >= 100 },
            { id: 'word', title: 'Word Master', desc: '2 Topics Passed', icon: 'chrome_reader_mode', color: 'background: var(--tertiary); color: white;', unlocked: completedTopics >= 2 },
            { id: 'voyager', title: 'Daily Voyager', desc: 'Play 5 Times', icon: 'explore', color: 'background: var(--primary-container); color: white;', unlocked: totalAttempts >= 5 }
        ];

        achievementsContainer.innerHTML = badges.map(b => `
            <div class="achievement-card ${b.unlocked ? '' : 'locked'}">
                <div class="achievement-icon" style="${b.unlocked ? b.color : 'background: var(--surface-container-high); color: var(--outline-variant);'}">
                    <span class="material-icons-round">${b.unlocked ? b.icon : 'lock'}</span>
                </div>
                <h4 class="label-lg" style="${b.unlocked ? '' : 'color: var(--outline-variant);'}">${b.title}</h4>
                <p class="label-sm" style="color: var(--outline-variant); font-size: 11px; margin-top: 4px;">${b.desc}</p>
            </div>
        `).join('');
    }

    renderLeaderboardList(false);
}

let isLeaderboardExpanded = false;

function renderLeaderboardList(showAll) {
    const lbList = document.getElementById('progLeaderboardList');
    if (!lbList) return;

    const rankData = getLeaderboard();
    if (rankData.length === 0) {
        lbList.innerHTML = '<div class="lb-item"><p class="body-md">Belum ada penjelajah yang bermain.</p></div>';
        return;
    }
    
    let lbHtml = '';
    const displayData = showAll ? rankData : rankData.slice(0, 3);

    displayData.forEach((user, idx) => {
        const isMe = user.name === AppState.player.name;
        const rankClass = idx === 0 ? 'lb-rank gold' : 'lb-rank';
        const bgClass = isMe ? 'lb-item me' : 'lb-item';
        const nameDisplay = isMe ? `${user.name} (You)` : user.name;
        
        const colors = ['f43f5e', '8b5cf6', '0ea5e9', '10b981', 'f59e0b'];
        const bgColor = colors[user.name.length % colors.length];
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=${bgColor}&color=fff&size=48&bold=true`;
        
        lbHtml += `
            <div class="${bgClass}">
                <div class="${rankClass}">${idx === 0 ? '1' : idx + 1}</div>
                <img src="${avatarUrl}" class="lb-avatar" alt="Avatar">
                <div style="flex: 1;">
                    <div class="label-lg" style="color: ${isMe ? 'var(--primary-dark)' : 'var(--on-surface)'};">${nameDisplay}</div>
                    <div class="label-sm" style="color: var(--outline-variant); font-size: 11px; letter-spacing: 0.5px; margin-top: 2px;">${user.points} STARS</div>
                </div>
            </div>
        `;
    });

    lbList.innerHTML = lbHtml;
    
    const toggleBtn = document.getElementById('toggleRankBtn');
    if (toggleBtn) toggleBtn.onclick = toggleFullLeaderboard;
}

function toggleFullLeaderboard() {
    isLeaderboardExpanded = !isLeaderboardExpanded;
    renderLeaderboardList(isLeaderboardExpanded);
    
    const toggleBtn = document.getElementById('toggleRankBtn');
    if (toggleBtn) {
        toggleBtn.textContent = isLeaderboardExpanded ? "Show Top 3 Only" : "Show My Full Rank";
    }
    if (typeof AudioFX !== 'undefined') AudioFX.click();
}

function updateDashboardWidgets() {
    const topics = TOPICS[AppState.player.class] || [];
    
    const roadmapContainer = document.getElementById('dashRoadmap');
    if (roadmapContainer) {
        let activeFound = false;
        let roadmapHtml = '<div class="roadmap-line"></div>';
        
        topics.slice(0, 4).forEach((t, i) => {
            const score = getTopicScore(t.id);
            const isCompleted = score && score.completed;
            
            let statusClass = ''; let icon = ''; let colorStyle = '';

            if (isCompleted) {
                statusClass = 'node-done'; icon = 'check';
                colorStyle = 'color: var(--tertiary-dark); border-color: var(--tertiary-container);';
            } else if (!activeFound) {
                statusClass = 'node-active'; icon = 'play_arrow';
                colorStyle = 'color: var(--primary-dark); border-color: var(--primary-container);';
                activeFound = true; 
            } else {
                statusClass = 'node-locked'; icon = 'lock';
                colorStyle = 'color: var(--outline-variant); border-color: var(--surface-container-high);';
            }

            const position = i % 2 === 0 ? 'right' : 'left'; 
            const clickAction = statusClass !== 'node-locked' ? `onclick="startQuizById('${t.id}')" style="cursor: pointer;"` : '';

            roadmapHtml += `
                <div class="roadmap-node ${statusClass}" ${clickAction}>
                    <span class="material-icons-round">${icon}</span>
                    <div class="node-label ${position}" style="${colorStyle}">${t.name}</div>
                </div>
            `;
        });
        roadmapContainer.innerHTML = roadmapHtml;
    }

    const totalTopics = topics.length;
    const completedTopics = topics.filter(t => getTopicScore(t.id)?.completed).length;
    const goalPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    const lessonsLeft = totalTopics - completedTopics;

    const elGoalPct = document.getElementById('dashGoalPct');
    const elGoalBar = document.getElementById('dashGoalBar');
    const elGoalText = document.getElementById('dashGoalText');

    if (elGoalPct) elGoalPct.textContent = `${goalPct}%`;
    if (elGoalBar) elGoalBar.style.width = `${goalPct}%`;
    if (elGoalText) {
        elGoalText.textContent = lessonsLeft > 0 
            ? `Only ${lessonsLeft} more lesson(s) to reach your target!` 
            : 'Target achieved! Great job! 🎉';
    }

    const currentLevel = Math.floor((AppState.totalPoints || 0) / 50) + 1;
    const nextTargetLevel = Math.ceil((currentLevel + 0.1) / 5) * 5; 
    
    const rewards = {
        5: { name: 'Bronze Explorer', icon: 'stars' },
        10: { name: 'Space Explorer', icon: 'rocket_launch' },
        15: { name: 'Master Explorer', icon: 'diamond' },
        20: { name: 'Legendary Explorer', icon: 'local_fire_department' }
    };
    
    const nextReward = rewards[nextTargetLevel] || { name: 'Supreme Explorer', icon: 'workspace_premium' };

    const elRewardDesc = document.getElementById('dashRewardDesc');
    const elRewardIcon = document.getElementById('dashRewardIcon');

    if (elRewardDesc) elRewardDesc.textContent = `Unlock the "${nextReward.name}" badge at Level ${nextTargetLevel}.`;
    if (elRewardIcon) elRewardIcon.textContent = nextReward.icon;
}

function startQuizById(id) {
    const topics = TOPICS[AppState.player.class] || [];
    const topic = topics.find(t => t.id === id);
    if (topic) {
        if (typeof AudioFX !== 'undefined') AudioFX.click();
        startQuiz(topic);
    }
}

// ==========================================
// FUNGSI NAVIGASI YANG BENAR (Perbaikan Poin Nyangkut)
// ==========================================
function goToProgress() {
    if (typeof AudioFX !== 'undefined') AudioFX.click();
    renderProgress(); // PAKSA hitung nilai terbaru sebelum menampilkan layar!
    showScreen('screen-progress');
}

function backToHome() { 
    if (typeof AudioFX !== 'undefined') AudioFX.click();
    initHome(); 
    showScreen('screen-home'); 
}

function logout() {
    if (confirm('Keluar dari petualangan? Datamu aman tersimpan!')) {
        clearCurrentUser(); 
        
        // Reset quiz state agar tidak bocor ke sesi berikutnya
        if (typeof Q !== 'undefined') {
            Q.topic = null; Q.questions = []; Q.idx = 0; Q.score = 0; Q.maxScore = 0;
        }
        
        // Tutup overlay feedback jika masih terbuka
        const overlay = document.getElementById('feedbackOverlay');
        if (overlay) overlay.classList.remove('active', 'wrong');

        document.getElementById('inputName').value = '';
        document.querySelectorAll('.cls-btn').forEach(b => b.classList.remove('active'));
        document.getElementById('btnStart').disabled = true;
        
        const tbScore = document.getElementById('tbScore');
        if (tbScore) tbScore.textContent = '0';
        
        showScreen('screen-login');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initState();
    showScreen('screen-login');
    initLogin();
});
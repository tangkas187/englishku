// ===== STORAGE MODULE (Multi-User & Leaderboard Edition) =====
const STORAGE_KEY = 'lingokids_db'; // Menggunakan key baru agar bersih dari error lama

// Sistem Keamanan: XOR-based obfuscation
function encode(str) {
    const key = 'LingoKids2024';
    let result = '';
    for (let i = 0; i < str.length; i++) {
        result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result);
}

function decode(encoded) {
    try {
        const str = atob(encoded);
        const key = 'LingoKids2024';
        let result = '';
        for (let i = 0; i < str.length; i++) {
            result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return result;
    } catch (e) { return null; }
}

// Database Structure
let AppDB = {
    users: {} // Format: { "Alex": { class: 3, scores: {}, totalPoints: 100 } }
};
let AppState = { player: { name: '', class: 3 }, scores: {}, totalPoints: 0 }; // Pemain yang sedang aktif

const Storage = {
    save() {
        try {
            // Update skor pemain yang sedang aktif ke dalam Master DB
            if (AppState.player.name) {
                AppDB.users[AppState.player.name] = {
                    class: AppState.player.class,
                    scores: AppState.scores,
                    totalPoints: AppState.totalPoints
                };
            }
            const json = JSON.stringify(AppDB);
            localStorage.setItem(STORAGE_KEY, encode(json));
        } catch (e) { console.warn('Storage save failed:', e); }
    },
    load() {
        try {
            const encoded = localStorage.getItem(STORAGE_KEY);
            if (!encoded) return false;
            
            const decoded = decode(encoded);
            if (decoded) {
                AppDB = JSON.parse(decoded);
                if (!AppDB.users) AppDB.users = {};
                return true;
            }
        } catch (e) { console.warn('Storage load failed:', e); }
        return false;
    }
};

function initState() {
    Storage.load();
}

// Fungsi untuk menangani login multi-user
// Fungsi untuk menangani login multi-user & naik kelas
function loginUser(name, cls) {
    if (AppDB.users[name]) {
        // Jika nama sudah ada, muat data lamanya
        // PERBAIKAN: Gunakan 'cls' (pilihan baru di layar) bukan class dari DB lama
        AppState.player = { name: name, class: cls }; 
        AppState.scores = AppDB.users[name].scores || {};
        AppState.totalPoints = AppDB.users[name].totalPoints || 0;
        
        // Update kelas terbarunya ke dalam Master DB
        AppDB.users[name].class = cls;
    } else {
        // Jika nama belum ada, buat profil baru
        AppState.player = { name: name, class: cls };
        AppState.scores = {};
        AppState.totalPoints = 0;
    }
    Storage.save();
}

function saveState() { Storage.save(); }

function updateScore(topicId, score, maxScore) {
    const existing = AppState.scores[topicId] || { score: 0, attempts: 0, completed: false, highScore: 0 };
    const isImprovement = score > existing.highScore;
    
    AppState.scores[topicId] = { 
        score, 
        attempts: existing.attempts + 1, 
        completed: score >= Math.floor(maxScore * 0.6), 
        highScore: Math.max(existing.highScore, score), 
        maxScore 
    };
    
    // Hitung ulang total poin
    AppState.totalPoints = Object.values(AppState.scores).reduce((sum, s) => sum + (s.highScore || 0), 0);
    Storage.save(); // Otomatis simpan ke DB setiap selesai kuis
    return isImprovement;
}

function getTopicScore(topicId) { return AppState.scores[topicId] || null; }

function clearCurrentUser() { 
    AppState = { player: { name: '', class: 3 }, scores: {}, totalPoints: 0 }; 
}

// Fungsi mengambil data untuk Leaderboard UI
function getLeaderboard() {
    const rankData = [];
    for (const [name, data] of Object.entries(AppDB.users)) {
        rankData.push({ name: name, class: data.class, points: data.totalPoints });
    }
    // Urutkan dari poin tertinggi ke terendah
    return rankData.sort((a, b) => b.points - a.points);
}
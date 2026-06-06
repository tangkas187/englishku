// ===== STORAGE MODULE (Keamanan: Enkripsi data skor) =====
const STORAGE_KEY = 'englishku_v2';
// Simple XOR-based obfuscation
function encode(str) {
  const key = 'EnglishKu2024';
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result);
}
function decode(encoded) {
  try {
    const str = atob(encoded);
    const key = 'EnglishKu2024';
    let result = '';
    for (let i = 0; i < str.length; i++) {
      result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  } catch (e) { return null; }
}
// Compress score data using run-length-like encoding
// FIXED: Removed spaces inside regex which caused matching failure
function compressData(obj) {
  const json = JSON.stringify(obj);
  const compressed = json
    .replace(/"score":0/g, '"s":0')
    .replace(/"score":/g, '"s":')
    .replace(/"attempts":0/g, '"a":0')
    .replace(/"attempts":/g, '"a":')
    .replace(/"completed":false/g, '"c":0')
    .replace(/"completed":true/g, '"c":1');
  return compressed;
}
function decompressData(str) {
  const decompressed = str
    .replace(/"s":0/g, '"score":0')
    .replace(/"s":/g, '"score":')
    .replace(/"a":0/g, '"attempts":0')
    .replace(/"a":/g, '"attempts":')
    .replace(/"c":0/g, '"completed":false')
    .replace(/"c":1/g, '"completed":true');
  return decompressed;
}
const Storage = {
  save(data) {
    try {
      const compressed = compressData(data);
      const encoded = encode(compressed);
      localStorage.setItem(STORAGE_KEY, encoded);
      const checksum = this._checksum(compressed);
      localStorage.setItem(STORAGE_KEY + '_cs', checksum);
      return true;
    } catch(e) { console.warn('Storage save failed:', e); return false; }
  },
  load() {
    try {
      const encoded = localStorage.getItem(STORAGE_KEY);
      if (!encoded) return null;
      const decoded = decode(encoded);
      if (!decoded) return null;
      
      const savedChecksum = localStorage.getItem(STORAGE_KEY + '_cs');
      const currentChecksum = this._checksum(decoded);
      if (savedChecksum && savedChecksum !== currentChecksum) {
        console.warn('Data integrity check failed, resetting...');
        this.clear();
        return null;
      }
      const decompressed = decompressData(decoded);
      return JSON.parse(decompressed);
    } catch(e) { console.warn('Storage load failed:', e); return null; }
  },
  clear() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY + '_cs');
  },
  _checksum(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }
};
let AppState = { player: { name: '', class: 3 }, scores: {}, totalPoints: 0 };
function initState() {
  const saved = Storage.load();
  if (saved) { AppState = saved; }
}
function saveState() { Storage.save(AppState); }
function updateScore(topicId, score, maxScore) {
  const existing = AppState.scores[topicId] || { score: 0, attempts: 0, completed: false, highScore: 0 };
  const isImprovement = score > existing.highScore;
  AppState.scores[topicId] = { score, attempts: existing.attempts + 1, completed: score >= Math.floor(maxScore * 0.6), highScore: Math.max(existing.highScore, score), maxScore };
  AppState.totalPoints = Object.values(AppState.scores).reduce((sum, s) => sum + (s.highScore || 0), 0);
  saveState();
  return isImprovement;
}
function getTopicScore(topicId) { return AppState.scores[topicId] || null; }
function clearCurrentUser() { AppState = { player: { name: '', class: 3 }, scores: {}, totalPoints: 0 }; }
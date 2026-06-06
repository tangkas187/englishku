# EnglishKu – Worksheet Interaktif Bahasa Inggris SD

Web app worksheet interaktif Bahasa Inggris untuk kelas 3–6 SD.

## Cara Pakai
Buka `index.html` di browser (tidak perlu server). Semua fitur berjalan offline.

## Struktur File
```
english-worksheet/
├── index.html          # Halaman utama (semua screen)
├── css/
│   └── main.css        # Semua styling
└── js/
    ├── data.js         # Data soal semua kelas
    ├── storage.js      # Penyimpanan + enkripsi + kompresi
    ├── audio.js        # Audio feedback (Web Audio API)
    ├── quiz.js         # Engine quiz
    └── app.js          # Controller utama
```

## Fitur

### Materi per Kelas
| Kelas | Topik |
|-------|-------|
| 3 | Food & Drink, Daily Activity, Preposition |
| 4 | Transportation, Telling Time, Daily Schedule |
| 5 | Animals, Adjectives, Degree of Comparison |
| 6 | Future Tense, Announcement, Jobs & Professions |

### Tipe Soal
- **Multiple Choice** – Pilihan ganda dengan 4 opsi
- **Fill in the Blank** – Isi titik-titik dengan word bank

### Pemenuhan Poin Teknis
1. **Keamanan (Security)**
   - Data skor dienkripsi dengan XOR cipher sebelum disimpan di localStorage
   - Checksum MD-hash untuk verifikasi integritas data
   - Data tidak bisa dibaca/dimanipulasi langsung dari DevTools

2. **Kompresi (Compression)**
   - Data storage dikompresi dengan pattern substitution sebelum dienkripsi
   - Menghemat ~30–40% ukuran data di localStorage

3. **Signal Processing**
   - Audio feedback menggunakan **Web Audio API** (oscillator, gain node, envelope)
   - Suara benar = akord major ascending (C-E-G)
   - Suara salah = gelombang sawtooth menurun (disonan)
   - Suara selesai = scale mayor naik (fanfare)
   - Semua tone di-generate secara programatik (bukan file audio)

### Fitur Lainnya
- Login dengan nama & kelas
- Data progress tersimpan otomatis
- High score per topik
- Soal di-shuffle tiap sesi
- Animasi & transisi halus
- Responsive (mobile-friendly)
- Tidak butuh internet (offline-ready)

## Pengembangan Lanjutan
- Tambah soal drag & drop (sudah ada styling-nya di CSS)
- Integrasi dengan Google Classroom
- Leaderboard antar siswa
- Export nilai ke PDF

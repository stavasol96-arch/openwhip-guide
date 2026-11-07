# ⚡ Simulator Pecut AI (Safe Simulation Mode)

> **Murni Efek Visual & Audio Cambukan Realistis — 100% Tanpa Macro / Injeksi Teks ke Terminal!**  


---

## 🎯 Mengapa Versi Ini Dibuat?

Versi upstream asli dari OpenWhip memiliki fungsi macro yang menembakkan:
1. Keystroke `Ctrl+C` ke jendela yang sedang aktif.
2. Mengetikkan teks secara otomatis (`FASTER`, `Faster CLANKER`, `Speed it up clanker`).
3. Menekan `Enter`.

Jika Anda sedang menjalankan AI coding agent (seperti Claude Code, Hermes Agent, Aider, atau sesi terminal lainnya), injeksi teks tersebut **merusak tugas yang sedang diproses, membuang token yang sudah selesai, dan mengganggu pekerjaan Anda**.

**Versi Simulator Pecut AI ini memecahkan masalah tersebut:**
- ✅ **100% Efek Visual Asli:** Fisika rantai 28 segmen Verlet, kurva spline Catmull-Rom & Bézier, halo putih, dan gerak momentum.
- ✅ **100% Audio Asli:** 5 sampel audio lecutan cambuk asli (`sounds/A.mp3` - `sounds/E.mp3`) + Web Audio Synthesizer fallback.
- ✅ **100% Ikon Asli:** Menggunakan aset ikon bawaan (`icon/Template.png`, `icon.ico`, `AppIcon.icns`).
- 🛡️ **0% Injeksi Teks / Keyboard:** Seluruh kode `xdotool`, `osascript`, `keybd_event`, dan `koffi` telah dibersihkan total!
- 🌐 **Dua Cara Menjalankan:** Bisa dimainkan langsung di Web Browser (`index.html` / `server.js`) atau sebagai aplikasi desktop overlay (Electron).

---

## 🚀 Cara Menjalankan

### Cara 1: Mode Web Simulator (Paling Ringan & Instan)
Tanpa perlu menginstal Electron (~100MB), Anda bisa langsung membuka simulator di browser mana saja:

```bash
# Jalankan server lokal zero-dependency
npm run web
# atau:
node server.js
```

Lalu buka di browser Anda: **[http://localhost:3300](http://localhost:3300)**

*Fitur Web Simulator:*
- Tampilan HUD modern dengan penghitung total pecutan (*crack counter*).
- Live speedometer kecepatan ujung cambuk.
- Slider pengatur sensitivitas letupan (ambang kecepatan).
- Tombol Mute / Unmute suara & Reset cambuk.
- Partikel percikan api (*visual sparks*) saat cambuk meletup.

---

### Cara 2: Mode Desktop Overlay (Electron App)
Menjalankan cambuk transparan langsung di layar desktop Anda:

```bash
# 1. Install dependencies (hanya butuh Electron)
npm install

# 2. Jalankan aplikasi
npm start
```

> **Catatan Kompatibilitas:** Repo ini sudah dilengkapi script otomatis `scripts/ensure-electron.js` yang otomatis memperbaiki biner Electron jika ekstraksi terhambat (misalnya pada versi Node.js v26+ yang baru).

*Ikon cambuk akan muncul di System Tray:*
- **Klik ikon tray:** Memunculkan pecutan di layar (overlay transparan).
- **Gerakkan kursor cepat (flick):** Meletupkan cambuk dengan suara & efek visual.
- **Klik kiri di mana saja:** Menjatuhkan cambuk ke bawah layar (*drop gravity*).
- **Klik kanan tray:** Menu context untuk menyembunyikan overlay atau keluar (*Quit*).

---

## 📂 Struktur Repositori

```
.
├── icon/
│   ├── AppIcon.icns      # Ikon macOS
│   ├── icon.ico          # Ikon Windows
│   └── Template.png      # Ikon template RGBA 512x512
├── sounds/
│   ├── A.mp3             # Sampel suara cambuk 1
│   ├── B.mp3             # Sampel suara cambuk 2
│   ├── C.mp3             # Sampel suara cambuk 3
│   ├── D.mp3             # Sampel suara cambuk 4
│   └── E.mp3             # Sampel suara cambuk 5
├── scripts/
│   ├── ensure-electron.js # Helper verifikasi & perbaikan biner Electron
│   └── start-electron.js  # Runner Electron dengan deteksi display
├── index.html            # Web Simulator interaktif lengkap dengan HUD & kontrol
├── overlay.html          # Canvas desktop overlay untuk Electron
├── main.js               # Electron main process (Aman, tanpa xdotool / macro)
├── preload.js            # Secure IPC bridge
├── server.js             # Server HTTP Node.js zero-dependency untuk mode web
├── package.json          # Manifest project (tanpa koffi / native build)
└── README.md             # Dokumentasi utama proyek
```

---

## 📜 Lisensi & Atribusi

- Dilisensikan di bawah lisensi [MIT](LICENSE).
- Konsep dasar & aset asli terinspirasi dari proyek OpenWhip oleh [GitFrog1111](https://github.com/GitFrog1111/OpenWhip).
- Rekonstruksi & implementasi safe simulator oleh [Ebil-bot](https://github.com/Ebil-bot) (Dibuat dengan REA).

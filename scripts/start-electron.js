const { spawn } = require('child_process');
const path = require('path');
const { ensureElectron } = require('./ensure-electron');

async function main() {
  const ready = await ensureElectron();
  if (!ready) {
    console.error('\n❌ Biner Electron tidak dapat disiapkan.');
    console.log('💡 Kamu tetap bisa menggunakan Web Simulator tanpa Electron:');
    console.log('   npm run web (atau node server.js)\n');
    process.exit(1);
  }

  // Cek display di Linux
  if (process.platform === 'linux' && !process.env.DISPLAY && !process.env.WAYLAND_DISPLAY) {
    console.warn('\n⚠️ Tidak ada display graphical terdeteksi (DISPLAY/WAYLAND_DISPLAY kosong).');
    console.log('💡 Jika kamu menjalankan di terminal SSH tanpa GUI, jalankan mode Web Simulator:');
    console.log('   npm run web');
    console.log('   Lalu buka http://localhost:3300 di browser.\n');
  }

  const electronPath = require('electron');
  const appRoot = path.resolve(__dirname, '..');

  const child = spawn(electronPath, [appRoot, ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: { ...process.env },
  });

  child.on('error', (err) => {
    console.error('\n❌ Gagal memulai proses Electron:', err.message);
    console.log('💡 Coba mode Web Simulator yang tidak memerlukan Electron:');
    console.log('   npm run web\n');
    process.exit(1);
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
    } else {
      process.exit(code || 0);
    }
  });
}

main().catch((err) => {
  console.error('Fatal error saat startup:', err);
  process.exit(1);
});

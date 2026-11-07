const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function ensureElectron() {
  let electronPkgDir;
  try {
    electronPkgDir = path.dirname(require.resolve('electron/package.json', { paths: [__dirname, path.join(__dirname, '..')] }));
  } catch (e) {
    console.warn('[ensure-electron] Package "electron" belum terinstall. Jalankan "npm install" terlebih dahulu.');
    return false;
  }

  const pathTxt = path.join(electronPkgDir, 'path.txt');
  const distDir = path.join(electronPkgDir, 'dist');
  const platform = process.platform;
  const execName = platform === 'win32'
    ? 'electron.exe'
    : (platform === 'darwin' ? 'Electron.app/Contents/MacOS/Electron' : 'electron');
  const binaryPath = path.join(distDir, execName);

  // Periksa apakah path.txt sudah valid dan binari ada
  if (fs.existsSync(pathTxt) && fs.existsSync(binaryPath)) {
    try {
      const current = fs.readFileSync(pathTxt, 'utf8').trim();
      if (current === execName) {
        return true;
      }
    } catch (e) {}
  }

  console.log('[ensure-electron] 🔧 Memeriksa & memperbaiki instalasi biner Electron...');

  // Jika biner sudah ada di dist/ tapi path.txt hilang
  if (fs.existsSync(binaryPath)) {
    fs.writeFileSync(pathTxt, execName, 'utf8');
    console.log('[ensure-electron] ✅ Berhasil membuat path.txt untuk Electron.');
    return true;
  }

  // Jika biner belum terekstrak, download/ekstrak dari cache
  try {
    const { downloadArtifact } = require('@electron/get');
    const { version } = require(path.join(electronPkgDir, 'package.json'));
    const arch = process.arch;

    console.log(`[ensure-electron] 📦 Mengambil artefak Electron v${version} (${platform}-${arch})...`);
    const zipPath = await downloadArtifact({
      version,
      artifactName: 'electron',
      platform,
      arch,
    });

    console.log(`[ensure-electron] 📂 Mengekstrak ${zipPath} ke ${distDir}...`);
    fs.mkdirSync(distDir, { recursive: true });

    let unzipped = false;
    // Gunakan unzip sistem jika tersedia (lebih cepat & aman dari bug stream di Node 26)
    if (platform !== 'win32') {
      try {
        execSync(`unzip -q -o "${zipPath}" -d "${distDir}"`, { stdio: 'inherit' });
        unzipped = true;
      } catch (err) {
        // fallback ke extract-zip
      }
    }

    if (!unzipped) {
      const extract = require('extract-zip');
      await extract(zipPath, { dir: path.resolve(distDir) });
    }

    // Tulis path.txt tanpa newline
    fs.writeFileSync(pathTxt, execName, 'utf8');

    if (platform !== 'win32' && fs.existsSync(binaryPath)) {
      try {
        fs.chmodSync(binaryPath, 0o755);
      } catch (e) {}
    }

    console.log('[ensure-electron] ✅ Biner Electron berhasil diekstrak dan siap digunakan!');
    return true;
  } catch (err) {
    console.error('[ensure-electron] ❌ Gagal mempersiapkan biner Electron:', err.message);
    return false;
  }
}

if (require.main === module) {
  ensureElectron().then((success) => {
    if (!success) process.exit(1);
  });
}

module.exports = { ensureElectron };

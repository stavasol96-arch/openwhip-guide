const { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage, screen } = require('electron');
const path = require('path');
const fs = require('fs');

// ── Globals ─────────────────────────────────────────────────────────────────
let tray = null;
let overlay = null;
let overlayReady = false;
let spawnQueued = false;
let crackCounter = 0;

// ── Tray Icon ───────────────────────────────────────────────────────────────
function createTrayIconFallback() {
  const p = path.join(__dirname, 'icon', 'Template.png');
  if (fs.existsSync(p)) {
    const img = nativeImage.createFromPath(p);
    if (!img.isEmpty()) {
      if (process.platform === 'darwin') img.setTemplateImage(true);
      return img;
    }
  }
  return nativeImage.createEmpty();
}

async function tryIcnsTrayImage(icnsPath) {
  const size = { width: 64, height: 64 };
  try {
    const thumb = await nativeImage.createThumbnailFromPath(icnsPath, size);
    if (!thumb.isEmpty()) return thumb;
  } catch (e) {
    // ignore
  }
  return null;
}

async function getTrayIcon() {
  const iconDir = path.join(__dirname, 'icon');
  if (process.platform === 'win32') {
    const file = path.join(iconDir, 'icon.ico');
    if (fs.existsSync(file)) {
      const img = nativeImage.createFromPath(file);
      if (!img.isEmpty()) return img;
    }
    return createTrayIconFallback();
  }
  if (process.platform === 'darwin') {
    const file = path.join(iconDir, 'AppIcon.icns');
    if (fs.existsSync(file)) {
      const thumb = await tryIcnsTrayImage(file);
      if (thumb) return thumb;
    }
    return createTrayIconFallback();
  }
  // Linux & default
  return createTrayIconFallback();
}

// ── Overlay Window ──────────────────────────────────────────────────────────
function createOverlay() {
  const { bounds } = screen.getPrimaryDisplay();
  overlay = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    focusable: false,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  overlay.setAlwaysOnTop(true, 'screen-saver');
  overlayReady = false;
  overlay.loadFile('overlay.html');

  overlay.webContents.on('did-finish-load', () => {
    overlayReady = true;
    if (spawnQueued && overlay && overlay.isVisible()) {
      spawnQueued = false;
      overlay.webContents.send('spawn-whip');
    }
  });

  overlay.on('closed', () => {
    overlay = null;
    overlayReady = false;
    spawnQueued = false;
  });
}

function toggleOverlay() {
  if (overlay && overlay.isVisible()) {
    overlay.webContents.send('drop-whip');
    return;
  }
  if (!overlay) createOverlay();
  overlay.show();
  if (overlayReady) {
    overlay.webContents.send('spawn-whip');
  } else {
    spawnQueued = true;
  }
}

// ── IPC ─────────────────────────────────────────────────────────────────────
// Safe Simulator: purely visual and audio! NO keystrokes, NO macros, NO text output!
ipcMain.on('whip-crack', () => {
  crackCounter++;
  console.log(`[Pecut-AI Simulator] ⚡ WHIP CRACKED! (#${crackCounter}) - Pure simulation effect, no keystrokes sent.`);
});

ipcMain.on('hide-overlay', () => {
  if (overlay) overlay.hide();
});

// ── App Lifecycle ───────────────────────────────────────────────────────────
app.whenReady().then(async () => {
  const icon = await getTrayIcon();
  tray = new Tray(icon);
  tray.setToolTip('Simulator Pecut AI (Safe Simulation Mode)');

  const updateMenu = () => {
    const contextMenu = Menu.buildFromTemplate([
      { label: '⚡ Simulator Pecut AI (Versi Aman)', enabled: false },
      { label: `💥 Total Pecutan: ${crackCounter}`, enabled: false },
      { type: 'separator' },
      {
        label: 'Tampilkan / Lepas Pecutan',
        click: () => toggleOverlay(),
      },
      {
        label: 'Sembunyikan Overlay',
        click: () => {
          if (overlay) overlay.hide();
        },
      },
      { type: 'separator' },
      {
        label: 'Keluar (Quit)',
        click: () => app.quit(),
      },
    ]);
    tray.setContextMenu(contextMenu);
  };

  updateMenu();
  tray.on('click', () => {
    toggleOverlay();
    updateMenu();
  });

  console.log('[Pecut-AI Simulator] Berjalan di system tray! Klik ikon pecut untuk memunculkan cambuk.');
});

app.on('window-all-closed', (e) => {
  // Keep app active in tray until explicitly closed
  e.preventDefault();
});

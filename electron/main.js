import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    autoHideMenuBar: true
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('get-exports', async () => {
  const baseDir = app.isPackaged ? path.dirname(process.execPath) : process.cwd();
  const exportsDir = path.join(baseDir, 'exports');
  
  // Create if it doesn't exist
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
    // In dev, copy the public/data.json over if it exists just to help testing
    if (!app.isPackaged) {
      const defaultExport = path.join(process.cwd(), 'public', 'data', 'data.json');
      if (fs.existsSync(defaultExport)) {
        fs.copyFileSync(defaultExport, path.join(exportsDir, 'default_export.json'));
      }
    }
  }

  const files = fs.readdirSync(exportsDir);
  return files
    .filter(f => f.endsWith('.json'))
    .map(f => ({ name: f, path: path.join(exportsDir, f) }));
});

ipcMain.handle('read-export', async (event, filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading export", error);
    throw error;
  }
});

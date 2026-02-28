const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function filePath(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

function read(name, defaultValue = []) {
  ensureDataDir();
  const fp = filePath(name);
  if (!fs.existsSync(fp)) return defaultValue;
  try {
    const raw = fs.readFileSync(fp, 'utf8');
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function write(name, data) {
  ensureDataDir();
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { read, write, ensureDataDir };

const path = require('path');

function toStoragePath(filename, type = 'stories') {
  return path.join('storage', type, filename);
}

function resolveStoragePath(storedPath) {
  return path.join(process.cwd(), storedPath);
}

module.exports = { toStoragePath, resolveStoragePath };

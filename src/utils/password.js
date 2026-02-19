const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;

async function hashPassword(rawPassword) {
  return bcrypt.hash(rawPassword, SALT_ROUNDS);
}

async function comparePassword(rawPassword, hash) {
  return bcrypt.compare(rawPassword, hash);
}

module.exports = { hashPassword, comparePassword };

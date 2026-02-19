const pool = require('../config/db');

async function createUser({ name, email, passwordHash, role = 'reader' }) {
  const query = `
    INSERT INTO users (name, email, password_hash, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, is_suspended, created_at;
  `;
  const { rows } = await pool.query(query, [name, email, passwordHash, role]);
  return rows[0];
}

async function findUserByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];
}

async function getAllUsers() {
  const { rows } = await pool.query('SELECT id, name, email, role, is_suspended, created_at FROM users ORDER BY created_at DESC');
  return rows;
}

async function updateUserSuspension(userId, isSuspended) {
  const { rows } = await pool.query(
    'UPDATE users SET is_suspended = $2, updated_at = NOW() WHERE id = $1 RETURNING id, name, email, role, is_suspended',
    [userId, isSuspended]
  );
  return rows[0];
}

module.exports = {
  createUser,
  findUserByEmail,
  getAllUsers,
  updateUserSuspension
};

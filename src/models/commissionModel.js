const pool = require('../config/db');

async function getCurrentCommission() {
  const { rows } = await pool.query('SELECT * FROM commissions ORDER BY created_at DESC LIMIT 1');
  return rows[0];
}

async function setCommission(percent, adminId) {
  const { rows } = await pool.query(
    'INSERT INTO commissions (percent, updated_by) VALUES ($1, $2) RETURNING *',
    [percent, adminId]
  );
  return rows[0];
}

module.exports = { getCurrentCommission, setCommission };

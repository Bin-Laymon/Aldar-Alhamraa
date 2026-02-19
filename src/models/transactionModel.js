const pool = require('../config/db');

async function createTransaction({ orderId, userId, amount, provider = 'stripe', status = 'paid', providerRef }) {
  const { rows } = await pool.query(
    `INSERT INTO transactions (order_id, user_id, amount, provider, status, provider_reference)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [orderId, userId, amount, provider, status, providerRef]
  );
  return rows[0];
}

module.exports = { createTransaction };

const pool = require('../config/db');

async function createPendingPayoutsFromPaidOrders() {
  await pool.query(
    `INSERT INTO payouts (writer_id, amount, status)
     SELECT s.writer_id, SUM(o.writer_share), 'pending'
     FROM orders o
     JOIN stories s ON s.id = o.story_id
     WHERE o.status = 'paid'
       AND NOT EXISTS (
         SELECT 1 FROM transactions t WHERE t.order_id = o.id
       )
     GROUP BY s.writer_id
     ON CONFLICT DO NOTHING`
  );
}

async function listWriterPayouts(writerId) {
  const { rows } = await pool.query('SELECT * FROM payouts WHERE writer_id = $1 ORDER BY created_at DESC', [writerId]);
  return rows;
}

async function approvePayout(payoutId, adminId) {
  const { rows } = await pool.query(
    `UPDATE payouts
     SET status = 'approved', approved_by = $2, approved_at = NOW(), updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [payoutId, adminId]
  );
  return rows[0];
}

module.exports = { createPendingPayoutsFromPaidOrders, listWriterPayouts, approvePayout };

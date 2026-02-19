const pool = require('../config/db');

async function createOrder({ userId, storyId, amount, commissionPercent }) {
  const writerShare = amount * ((100 - commissionPercent) / 100);
  const platformShare = amount * (commissionPercent / 100);

  const { rows } = await pool.query(
    `INSERT INTO orders (user_id, story_id, amount, commission_percent, writer_share, platform_share, status)
     VALUES ($1,$2,$3,$4,$5,$6,'pending')
     RETURNING *`,
    [userId, storyId, amount, commissionPercent, writerShare, platformShare]
  );
  return rows[0];
}

async function markOrderPaid(orderId, paymentRef) {
  const { rows } = await pool.query(
    `UPDATE orders SET status = 'paid', payment_reference = $2, paid_at = NOW(), updated_at = NOW()
     WHERE id = $1 RETURNING *`,
    [orderId, paymentRef]
  );
  await pool.query('UPDATE stories SET purchase_count = purchase_count + 1 WHERE id = (SELECT story_id FROM orders WHERE id = $1)', [orderId]);
  return rows[0];
}

async function getOrderById(orderId) {
  const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
  return rows[0];
}

async function listReaderOrders(userId) {
  const { rows } = await pool.query(
    `SELECT o.*, s.title, s.cover_image_path
     FROM orders o
     JOIN stories s ON s.id = o.story_id
     WHERE o.user_id = $1
     ORDER BY o.created_at DESC`,
    [userId]
  );
  return rows;
}

async function listPlatformOrders() {
  const { rows } = await pool.query('SELECT * FROM orders WHERE status = $1', ['paid']);
  return rows;
}

async function incrementDownloadCount(orderId) {
  const { rows } = await pool.query(
    'UPDATE orders SET download_count = download_count + 1, updated_at = NOW() WHERE id = $1 RETURNING *',
    [orderId]
  );
  return rows[0];
}

module.exports = {
  createOrder,
  markOrderPaid,
  getOrderById,
  listReaderOrders,
  listPlatformOrders,
  incrementDownloadCount
};

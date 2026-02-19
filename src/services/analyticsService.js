const pool = require('../config/db');

async function getAdminSummary() {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM users) as total_users,
      (SELECT COUNT(*) FROM users WHERE role = 'writer') as total_writers,
      (SELECT COUNT(*) FROM stories WHERE status = 'approved') as approved_stories,
      (SELECT COALESCE(SUM(platform_share), 0) FROM orders WHERE status = 'paid') as platform_revenue,
      (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE status = 'paid') as gross_volume
  `;
  const { rows } = await pool.query(query);
  return rows[0];
}

async function getWriterDashboard(writerId) {
  const query = `
    SELECT
      COALESCE(SUM(o.amount), 0) as total_sales,
      COALESCE(SUM(o.writer_share), 0) as total_revenue,
      COALESCE((
        SELECT SUM(p.amount) FROM payouts p WHERE p.writer_id = $1 AND p.status = 'pending'
      ), 0) as pending_payouts
    FROM orders o
    JOIN stories s ON s.id = o.story_id
    WHERE s.writer_id = $1 AND o.status = 'paid'
  `;
  const { rows } = await pool.query(query, [writerId]);
  return rows[0];
}

module.exports = { getAdminSummary, getWriterDashboard };

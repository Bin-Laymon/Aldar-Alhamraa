const pool = require('../config/db');

async function addReview({ storyId, userId, rating, comment }) {
  const { rows } = await pool.query(
    `INSERT INTO reviews (story_id, user_id, rating, comment)
     VALUES ($1,$2,$3,$4)
     RETURNING *`,
    [storyId, userId, rating, comment]
  );
  return rows[0];
}

async function listReviews(storyId) {
  const { rows } = await pool.query(
    `SELECT r.*, u.name as reviewer_name
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE r.story_id = $1
     ORDER BY r.created_at DESC`,
    [storyId]
  );
  return rows;
}

module.exports = { addReview, listReviews };

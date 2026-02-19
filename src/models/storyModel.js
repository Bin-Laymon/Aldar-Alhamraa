const pool = require('../config/db');

async function createStory(payload) {
  const {
    writerId,
    title,
    description,
    category,
    price,
    coverImagePath,
    filePath,
    language = 'en',
    isFeatured = false
  } = payload;

  const { rows } = await pool.query(
    `INSERT INTO stories
      (writer_id, title, description, category, price, cover_image_path, file_path, language, is_featured)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [writerId, title, description, category, price, coverImagePath, filePath, language, isFeatured]
  );

  return rows[0];
}

async function updateStory(storyId, writerId, fields) {
  const allowed = ['title', 'description', 'category', 'price', 'is_featured'];
  const updates = [];
  const values = [];

  allowed.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      values.push(fields[key]);
      updates.push(`${key} = $${values.length}`);
    }
  });

  if (!updates.length) return null;

  values.push(storyId, writerId);
  const { rows } = await pool.query(
    `UPDATE stories SET ${updates.join(', ')}, updated_at = NOW()
     WHERE id = $${values.length - 1} AND writer_id = $${values.length}
     RETURNING *`,
    values
  );
  return rows[0];
}

async function deleteStory(storyId, writerId) {
  const { rowCount } = await pool.query('DELETE FROM stories WHERE id = $1 AND writer_id = $2', [storyId, writerId]);
  return rowCount > 0;
}

async function listMarketplaceStories(filters) {
  const values = [];
  const clauses = ['status = \'approved\''];

  if (filters.category) {
    values.push(filters.category);
    clauses.push(`category = $${values.length}`);
  }

  if (filters.maxPrice) {
    values.push(filters.maxPrice);
    clauses.push(`price <= $${values.length}`);
  }

  let orderBy = 'created_at DESC';
  if (filters.sort === 'popular') orderBy = 'purchase_count DESC';
  if (filters.sort === 'newest') orderBy = 'created_at DESC';

  const query = `
    SELECT s.*, u.name as writer_name,
      COALESCE(AVG(r.rating), 0) as avg_rating,
      COUNT(r.id) as review_count
    FROM stories s
    JOIN users u ON u.id = s.writer_id
    LEFT JOIN reviews r ON r.story_id = s.id
    WHERE ${clauses.join(' AND ')}
    GROUP BY s.id, u.name
    ORDER BY ${orderBy}
  `;

  const { rows } = await pool.query(query, values);
  return rows;
}

async function getStoryById(storyId) {
  const { rows } = await pool.query(
    `SELECT s.*, u.name as writer_name
     FROM stories s
     JOIN users u ON u.id = s.writer_id
     WHERE s.id = $1`,
    [storyId]
  );
  return rows[0];
}

async function listWriterStories(writerId) {
  const { rows } = await pool.query('SELECT * FROM stories WHERE writer_id = $1 ORDER BY created_at DESC', [writerId]);
  return rows;
}

async function moderateStory(storyId, status) {
  const { rows } = await pool.query(
    'UPDATE stories SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING *',
    [storyId, status]
  );
  return rows[0];
}

module.exports = {
  createStory,
  updateStory,
  deleteStory,
  listMarketplaceStories,
  getStoryById,
  listWriterStories,
  moderateStory
};

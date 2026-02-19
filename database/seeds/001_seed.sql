INSERT INTO users (id, name, email, password_hash, role)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Admin User', 'admin@aldar.com', '$2a$12$pbMIR6J1oQwFWv6vqk5M8OTlYbrj9H0NBi1M4lAu9ryROjWvYe4Ru', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'Nadia Writer', 'writer@aldar.com', '$2a$12$pbMIR6J1oQwFWv6vqk5M8OTlYbrj9H0NBi1M4lAu9ryROjWvYe4Ru', 'writer'),
  ('33333333-3333-3333-3333-333333333333', 'Omar Reader', 'reader@aldar.com', '$2a$12$pbMIR6J1oQwFWv6vqk5M8OTlYbrj9H0NBi1M4lAu9ryROjWvYe4Ru', 'reader')
ON CONFLICT (email) DO NOTHING;

INSERT INTO commissions (percent, updated_by)
VALUES (30, '11111111-1111-1111-1111-111111111111');

INSERT INTO stories
  (id, writer_id, title, description, category, language, price, cover_image_path, file_path, status, purchase_count, is_featured)
VALUES
  (
    '44444444-4444-4444-4444-444444444444',
    '22222222-2222-2222-2222-222222222222',
    'The Crimson Archive',
    'A fictional investigation dossier told through leaked memos.',
    'Investigation',
    'en',
    8.99,
    'storage/covers/sample-cover.jpg',
    'storage/stories/sample-story.pdf',
    'approved',
    12,
    TRUE
  )
ON CONFLICT (id) DO NOTHING;

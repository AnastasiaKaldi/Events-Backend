-- Wipe existing data to avoid duplicates
TRUNCATE TABLE event_attendees, events, users RESTART IDENTITY CASCADE;

-- Create two users: one staff and one normal user
INSERT INTO users (email, password, role)
VALUES 
  ('staff@example.com', '$2b$10$2RKpJSRCS0dZz6zzJT5ntOSQnU4RxZcaJfus3KyxWWqcTopKxxaSu', 'staff'), -- password: "staff123"
  ('user@example.com',  '$2b$10$O/XhsPMw3W2IviSOmnz5veHuLlhAcoz6EyoKQHtoXt5Wy.z.N1zzG', 'user');  -- password: "user123"

-- Create sample events by staff
INSERT INTO events (title, date, description, created_by)
VALUES 
  ('Tech Meetup', '2025-06-01 18:00:00', 'A gathering for tech enthusiasts.', 1),
  ('Art Expo', '2025-06-10 12:00:00', 'An exhibition of modern art.', 1);

-- Simulate a user joining an event
INSERT INTO event_attendees (user_id, event_id)
VALUES (2, 1);

-- 💣 Drop existing tables (reverse dependency order)
DROP TABLE IF EXISTS event_attendees;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;

-- 🧱 Create tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(10) CHECK (role IN ('user', 'staff')) NOT NULL
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    created_by INT NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    summary TEXT,
    datetime TEXT NOT NULL,
    location TEXT NOT NULL,
    overview TEXT,
    images JSONB,
    tickets JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_attendees (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    event_id INTEGER REFERENCES events(id),
    UNIQUE (user_id, event_id)
);

-- 👥 Seed staff and user
INSERT INTO users (email, password, first_name, last_name, role)
VALUES 
  ('staff@example.com', '$2b$10$2RKpJSRCS0dZz6zzJT5ntOSQnU4RxZcaJfus3KyxWWqcTopKxxaSu', 'Admin', 'User', 'staff'),
  ('user@example.com', '$2b$10$O/XhsPMw3W2IviSOmnz5veHuLlhAcoz6EyoKQHtoXt5Wy.z.N1zzG', 'Test', 'User', 'user');

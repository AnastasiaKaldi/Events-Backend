CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(10) CHECK (role IN ('user', 'staff')) NOT NULL
);
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  created_by INT NOT NULL,
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



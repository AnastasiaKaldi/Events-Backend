-- -- Wipe existing data to avoid duplicates
-- TRUNCATE TABLE event_attendees, events, users RESTART IDENTITY CASCADE;

-- -- Create two users: one staff and one normal user
-- INSERT INTO users (email, password, role)
-- VALUES 
--   ('staff@example.com', '$2b$10$2RKpJSRCS0dZz6zzJT5ntOSQnU4RxZcaJfus3KyxWWqcTopKxxaSu', 'staff'),
--   ('user@example.com',  '$2b$10$O/XhsPMw3W2IviSOmnz5veHuLlhAcoz6EyoKQHtoXt5Wy.z.N1zzG', 'user');

-- -- Create 12 detailed sample events by staff 
-- INSERT INTO events (title, image_url, description, date, created_by, things_to_know, category)
-- VALUES 
--   ('The Pines and the Mountains', 'https://images.unsplash.com/photo-1476362555312-ab9e108a0b7e?auto=format&fit=crop&w=1170&q=80', 'A tranquil escape to the woods with live folk music and nature walks.', '2025-06-15 18:00:00', 1, 'Wear comfortable shoes. Parking is limited.', 'Family Events'),
--   ('Tech Gala 2025', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1170&q=80', 'A gathering of tech enthusiasts, startups, and future-facing companies.', '2025-07-10 09:00:00', 1, 'Bring your student ID for discounts. Free Wi-Fi available.', 'Business'),
--   ('Family Day Festival', 'https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=1170&q=80', 'Games, crafts, food trucks, and music all day for kids and parents.', '2025-08-01 12:00:00', 2, 'No pets allowed. Bring sunscreen!', 'Family Events'),
--   ('Urban Culture Expo', 'https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=1170&q=80', 'Celebrate urban art, hip-hop, fashion, and street food.', '2025-09-10 14:00:00', 1, 'Graffiti workshop sign-up required. Wear old clothes.', 'Nightlife'),
--   ('Design Fest', 'https://images.unsplash.com/photo-1502767089025-6572583495b4?auto=format&fit=crop&w=1170&q=80', 'Interactive sessions with top designers, portfolio reviews, and showcases.', '2025-07-22 10:00:00', 1, 'Bring a printed version of your portfolio. Free goodies!', 'Hobbies'),
--   ('Innovators Meetup', 'https://images.unsplash.com/photo-1559027615-5b6f84f5b723?auto=format&fit=crop&w=1170&q=80', 'An intimate networking event for startup founders and product leaders.', '2025-07-28 17:30:00', 1, 'Light refreshments provided. RSVP required.', 'Business'),
--   ('Architectural Warfare', 'https://images.unsplash.com/photo-1496395031280-4201b0e022ca?auto=format&fit=crop&w=2070&q=80', 'Debate and critique between architectural schools over design visions.', '2025-08-03 13:00:00', 2, 'No flash photography. Bring student ID.', 'Hobbies'),
--   ('Jazz Under the Stars', 'https://images.unsplash.com/photo-1510081887155-56fe96846e71?auto=format&fit=crop&w=715&q=80', 'Live jazz in an outdoor amphitheater with food and wine pairings.', '2025-08-20 19:00:00', 2, 'Picnic blankets encouraged. No outside alcohol.', 'Music'),
--   ('Coding Mania', 'https://images.unsplash.com/photo-1511376777868-611b54f68947?auto=format&fit=crop&w=1170&q=80', '24-hour hackathon for students and young professionals.', '2025-09-05 08:00:00', 2, 'Bring your laptop and ID. Meals provided.', 'Hobbies'),
--   ('Art in Motion', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1170&q=80', 'Interactive installation art and performance from local creators.', '2025-09-12 11:00:00', 1, 'Some exhibits involve strobe lights. Arrive early.', 'Festivals'),
--   ('Ramen & Rhythm', 'https://images.unsplash.com/photo-1601311830977-cf3b8bd23403?auto=format&fit=crop&w=1170&q=80', 'Noodle tasting paired with live DJ sets in a night market atmosphere.', '2025-09-25 18:00:00', 1, 'Try all 7 ramen stalls to vote for your favorite.', 'Food & Drink'),
--   ('Festival of Lights', 'https://images.unsplash.com/photo-1571046219198-3d5c2a9ef5b6?auto=format&fit=crop&w=1170&q=80', 'A magical evening with lanterns, performances, and night-time crafts.', '2025-10-05 17:00:00', 1, 'Lanterns provided at entrance. Dress warmly.', 'Festivals');

-- -- Simulate a user joining the first event
-- INSERT INTO event_attendees (user_id, event_id)
-- VALUES (2, 1);

DROP TABLE IF EXISTS event_attendees;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;
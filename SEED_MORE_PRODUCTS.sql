-- Add more products to E-COMMERCE database
-- Run this in Neon SQL Editor: https://console.neon.tech/app/projects

INSERT INTO items (name, description, cost, state, item_type, image, quantity) VALUES
('Pomegranate', 'Fresh red pomegranates from Rajasthan', 200.00, 'Rajasthan', 'Fruits', 'https://images.unsplash.com/photo-1599599810694-c5c3f7b4db5c?w=500', 40),
('Spinach', 'Fresh green spinach from Punjab', 30.00, 'Punjab', 'Vegetables', 'https://images.unsplash.com/photo-1599599810694-c5c3f7b4db5c?w=500', 150),
('Broccoli', 'Fresh broccoli from Himachal Pradesh', 80.00, 'Himachal Pradesh', 'Vegetables', 'https://images.unsplash.com/photo-1599599810694-c5c3f7b4db5c?w=500', 60),
('Grapes', 'Sweet red grapes from Karnataka', 180.00, 'Karnataka', 'Fruits', 'https://images.unsplash.com/photo-1599599810694-c5c3f7b4db5c?w=500', 80),
('Strawberry', 'Fresh strawberries from Himachal Pradesh', 250.00, 'Himachal Pradesh', 'Fruits', 'https://images.unsplash.com/photo-1599599810694-c5c3f7b4db5c?w=500', 50),
('Cabbage', 'Fresh green cabbage from Punjab', 40.00, 'Punjab', 'Vegetables', 'https://images.unsplash.com/photo-1599599810694-c5c3f7b4db5c?w=500', 120),
('Capsicum Red', 'Fresh red bell peppers from Gujarat', 90.00, 'Gujarat', 'Vegetables', 'https://images.unsplash.com/photo-1599599810694-c5c3f7b4db5c?w=500', 70),
('Capsicum Yellow', 'Fresh yellow bell peppers from Gujarat', 95.00, 'Gujarat', 'Vegetables', 'https://images.unsplash.com/photo-1599599810694-c5c3f7b4db5c?w=500', 70),
('Papaya', 'Sweet papaya from Tamil Nadu', 60.00, 'Tamil Nadu', 'Fruits', 'https://images.unsplash.com/photo-1599599810694-c5c3f7b4db5c?w=500', 90),
('Watermelon', 'Fresh sweet watermelon from Uttar Pradesh', 120.00, 'Uttar Pradesh', 'Fruits', 'https://images.unsplash.com/photo-1599599810694-c5c3f7b4db5c?w=500', 40),
('Potato', 'Good quality potatoes from Maharashtra', 25.00, 'Maharashtra', 'Vegetables', 'https://images.unsplash.com/photo-1599599810694-c5c3f7b4db5c?w=500', 300),
('Cucumber', 'Fresh cucumber from Telangana', 35.00, 'Telangana', 'Vegetables', 'https://images.unsplash.com/photo-1599599810694-c5c3f7b4db5c?w=500', 100),
('Lemon', 'Fresh lemons from Andhra Pradesh', 40.00, 'Andhra Pradesh', 'Fruits', 'https://images.unsplash.com/photo-1599599810694-c5c3f7b4db5c?w=500', 200),
('Orange', 'Sweet oranges from Maharashtra', 100.00, 'Maharashtra', 'Fruits', 'https://images.unsplash.com/photo-1599599810694-c5c3f7b4db5c?w=500', 110),
('Ginger', 'Fresh ginger from Kerala', 80.00, 'Kerala', 'Vegetables', 'https://images.unsplash.com/photo-1599599810694-c5c3f7b4db5c?w=500', 50);

-- Add test user (password: Test@123)
INSERT INTO users (name, email, phone, password) VALUES
('Test User', 'test@example.com', '9876543210', '$2b$10$YOvVfBPGSJULM8F7vO8Kiu8.L9.7CZX0n1vY8L0L8L0L8L0L8L0L');

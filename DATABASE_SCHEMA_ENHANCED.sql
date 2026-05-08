-- E-COMMERCE DATABASE SCHEMA (PostgreSQL) - ENHANCED WITH CATEGORIES
-- Drop existing tables if needed (be careful in production!)
-- DROP TABLE IF EXISTS order_items CASCADE;
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS payments CASCADE;
-- DROP TABLE IF EXISTS cart CASCADE;
-- DROP TABLE IF EXISTS items CASCADE;
-- DROP TABLE IF EXISTS addresses CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS categories CASCADE;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table (NEW)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image VARCHAR(255),
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products/Items Table (UPDATED)
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    cost DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    discount INT DEFAULT 0,
    rating DECIMAL(3, 1) DEFAULT 4.5,
    reviews INT DEFAULT 0,
    image VARCHAR(255),
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    state VARCHAR(50),
    quantity INT DEFAULT 0,
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    delivery_address TEXT
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    item_id INT NOT NULL REFERENCES items(id),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Addresses Table
CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    proof_image VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart Table
CREATE TABLE IF NOT EXISTS cart (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id INT NOT NULL REFERENCES items(id),
    quantity INT DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, item_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_item_category ON items(category_id);
CREATE INDEX IF NOT EXISTS idx_item_state ON items(state);
CREATE INDEX IF NOT EXISTS idx_order_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_item_stock ON items(in_stock);

-- INSERT CATEGORIES
INSERT INTO categories (name, description, image, icon) VALUES
('Fashion', 'Clothing, accessories, and apparel', 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400', '👗'),
('Electronics', 'Phones, laptops, gadgets and more', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', '📱'),
('Groceries', 'Fresh fruits, vegetables, groceries', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', '🛒'),
('Home & Furniture', 'Furniture, decor, and home essentials', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', '🏠'),
('Sports & Outdoors', 'Sports equipment and outdoor gear', 'https://images.unsplash.com/photo-1552168324-d612d08db8c8?w=400', '⚽'),
('Books & Media', 'Books, music, movies, and games', 'https://images.unsplash.com/photo-150784272343-583f20270319?w=400', '📚'),
('Beauty & Personal Care', 'Skincare, makeup, and wellness', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400', '💄'),
('Toys & Games', 'Toys, games, and entertainment', 'https://images.unsplash.com/photo-1594787318286-3d835c1cabbb?w=400', '🎮');

-- INSERT FASHION PRODUCTS (15 items)
INSERT INTO items (name, description, cost, original_price, discount, rating, reviews, image, category_id, state, quantity, in_stock) VALUES
('Women Red Saree', 'Beautiful handcrafted cotton saree with traditional design', 899.00, 1299.00, 30, 4.8, 245, 'https://images.unsplash.com/photo-1581974851266-9c15ba65df4f?w=500', 1, 'Tamil Nadu', 50, TRUE),
('Men Formal Shirt', 'Premium cotton formal shirt for office wear', 649.00, 999.00, 35, 4.6, 182, 'https://images.unsplash.com/photo-1596399676397-491cfc857599?w=500', 1, 'Karnataka', 40, TRUE),
('Women Jeans', 'Slim fit stretchable denim jeans for women', 799.00, 1199.00, 33, 4.7, 156, 'https://images.unsplash.com/photo-1541099810657-40c76dcd34d0?w=500', 1, 'Delhi', 60, TRUE),
('Men T-Shirt Pack', 'Pack of 3 casual cotton t-shirts for men', 449.00, 699.00, 36, 4.5, 298, 'https://images.unsplash.com/photo-1518985506223-26cf1e6da213?w=500', 1, 'Maharashtra', 100, TRUE),
('Ethnic Kurta', 'Traditional ethnic kurta with embroidery', 1299.00, 1899.00, 32, 4.9, 324, 'https://images.unsplash.com/photo-1562871857-aa2e0ae4e5eb?w=500', 1, 'Rajasthan', 35, TRUE),
('Sports Leggings', 'High-waist yoga and sports leggings for women', 599.00, 899.00, 33, 4.7, 421, 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500', 1, 'Delhi', 75, TRUE),
('Denim Jacket', 'Casual blue denim jacket for all seasons', 1499.00, 2199.00, 32, 4.6, 267, 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500', 1, 'Karnataka', 45, TRUE),
('Printed Dress', 'Casual printed cotton dress for daily wear', 799.00, 1199.00, 33, 4.8, 189, 'https://images.unsplash.com/photo-1549887534-f3a9b52e614a?w=500', 1, 'Telangana', 55, TRUE),
('Polo Shirt', 'Comfortable polo shirt for casual and formal wear', 699.00, 1099.00, 36, 4.5, 167, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500', 1, 'Mumbai', 65, TRUE),
('Summer Shorts', 'Breathable cotton shorts for summer wear', 449.00, 699.00, 36, 4.6, 245, 'https://images.unsplash.com/photo-1506629082632-401ffad8d5d6?w=500', 1, 'Goa', 80, TRUE),
('Wedding Saree', 'Luxurious silk wedding saree with heavy zari work', 4999.00, 7999.00, 37, 4.9, 512, 'https://images.unsplash.com/photo-1540555700478-efb3f3aa319d?w=500', 1, 'Gujarat', 20, TRUE),
('Casual Blazer', 'Modern casual blazer for office and parties', 1999.00, 2999.00, 33, 4.7, 198, 'https://images.unsplash.com/photo-1505026986519-61ef32841b0b?w=500', 1, 'Delhi', 30, TRUE),
('Sports Jacket', 'Lightweight sports jacket for outdoor activities', 1299.00, 1899.00, 32, 4.6, 234, 'https://images.unsplash.com/photo-1539533857671-2900cecdc58d?w=500', 1, 'Himachal Pradesh', 40, TRUE),
('Summer Top', 'Sleeveless summer top for women', 399.00, 599.00, 33, 4.5, 156, 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500', 1, 'Kerala', 90, TRUE),
('Thermal Innerwear', 'Warm thermal innerwear for winter', 599.00, 899.00, 33, 4.7, 289, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 1, 'Himachal Pradesh', 70, TRUE);

-- INSERT ELECTRONICS PRODUCTS (15 items)
INSERT INTO items (name, description, cost, original_price, discount, rating, reviews, image, category_id, state, quantity, in_stock) VALUES
('iPhone 15 Pro', 'Latest Apple iPhone 15 Pro with A17 Pro chip', 129999.00, 159999.00, 19, 4.9, 1250, 'https://images.unsplash.com/photo-1592286927505-1def25e8500e?w=500', 2, 'Delhi', 15, TRUE),
('Samsung Galaxy S24', 'Flagship Samsung smartphone with 6.2" display', 89999.00, 119999.00, 25, 4.8, 856, 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500', 2, 'Karnataka', 20, TRUE),
('MacBook Air M2', 'Powerful laptop with M2 chip for professionals', 129999.00, 179999.00, 28, 4.9, 542, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', 2, 'Maharashtra', 10, TRUE),
('Dell XPS 13', 'Ultra-portable Dell laptop with Intel Core i7', 99999.00, 139999.00, 29, 4.7, 423, 'https://images.unsplash.com/photo-1588872657840-d5d517b00c58?w=500', 2, 'Delhi', 12, TRUE),
('Sony WH-1000XM5', 'Premium noise-cancelling wireless headphones', 29999.00, 39999.00, 25, 4.8, 678, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 2, 'Mumbai', 30, TRUE),
('iPad Air', '11-inch iPad Air tablet with M1 chip', 59999.00, 79999.00, 25, 4.8, 456, 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500', 2, 'Bangalore', 18, TRUE),
('Apple Watch Series 9', 'Advanced fitness and health smartwatch', 41999.00, 54999.00, 24, 4.7, 523, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 2, 'Chennai', 25, TRUE),
('Samsung Galaxy Tab', '10.9" tablet with Snapdragon processor', 39999.00, 49999.00, 20, 4.6, 289, 'https://images.unsplash.com/photo-1558089120-d27e3187b63b?w=500', 2, 'Hyderabad', 22, TRUE),
('Google Pixel 8', 'Google flagship phone with Tensor chip', 79999.00, 109999.00, 27, 4.8, 734, 'https://images.unsplash.com/photo-1511694712202-7d88d338546f?w=500', 2, 'Delhi', 16, TRUE),
('Canon EOS R50', 'Mirrorless camera for photography enthusiasts', 79999.00, 119999.00, 33, 4.7, 198, 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500', 2, 'Punjab', 8, TRUE),
('GoPro Hero 12', 'Action camera for adventure and sports', 49999.00, 69999.00, 29, 4.8, 312, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500', 2, 'Maharashtra', 12, TRUE),
('Nintendo Switch', 'Gaming console with detachable controllers', 34999.00, 44999.00, 22, 4.9, 892, 'https://images.unsplash.com/photo-1605559424843-9e4c3ff86b08?w=500', 2, 'Karnataka', 20, TRUE),
('Bose SoundLink', 'Portable Bluetooth speaker with premium sound', 19999.00, 29999.00, 33, 4.7, 456, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500', 2, 'Delhi', 35, TRUE),
('USB-C Hub', '7-in-1 USB-C hub with HDMI and USB ports', 2999.00, 4999.00, 40, 4.5, 234, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500', 2, 'Maharashtra', 100, TRUE),
('Wireless Charger', 'Fast wireless charging pad for devices', 1999.00, 3499.00, 43, 4.6, 567, 'https://images.unsplash.com/photo-1591290621749-41e6dfa0a33b?w=500', 2, 'Delhi', 80, TRUE);

-- INSERT GROCERY PRODUCTS (15 items)
INSERT INTO items (name, description, cost, original_price, discount, rating, reviews, image, category_id, state, quantity, in_stock) VALUES
('Fresh Mango - 1 Kg', 'Organic fresh mangoes from Alphonso variety', 299.00, 399.00, 25, 4.8, 345, 'https://images.unsplash.com/photo-1553279768-ad526a102395?w=500', 3, 'Maharashtra', 150, TRUE),
('Basmati Rice - 5 Kg', 'Premium basmati rice with long grains', 499.00, 699.00, 29, 4.7, 267, 'https://images.unsplash.com/photo-1599599810694-a5f8c6a1c7e7?w=500', 3, 'Punjab', 200, TRUE),
('Organic Wheat - 2 Kg', 'Natural organic whole wheat flour', 199.00, 299.00, 33, 4.6, 189, 'https://images.unsplash.com/photo-1520501087292-cf6d14e6e6f4?w=500', 3, 'Delhi', 180, TRUE),
('Green Apple - 1 Kg', 'Fresh crisp green apples from Himachal', 249.00, 349.00, 29, 4.8, 234, 'https://images.unsplash.com/photo-1584373603330-6ba2b11ec5b2?w=500', 3, 'Himachal Pradesh', 120, TRUE),
('Tomato - 1 Kg', 'Fresh red ripe tomatoes for cooking', 79.00, 129.00, 39, 4.5, 156, 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500', 3, 'Tamil Nadu', 300, TRUE),
('Carrot - 1 Kg', 'Orange crispy carrots from Punjab', 99.00, 149.00, 34, 4.7, 198, 'https://images.unsplash.com/photo-1585518419759-bab4be4c2d0a?w=500', 3, 'Punjab', 250, TRUE),
('Onion - 2 Kg', 'Good quality onions from Gujarat', 149.00, 249.00, 40, 4.6, 212, 'https://images.unsplash.com/photo-1587926591233-dfaf3ff41981?w=500', 3, 'Gujarat', 350, TRUE),
('Banana - 1 Kg', 'Golden fresh bananas from Karnataka', 69.00, 119.00, 42, 4.8, 289, 'https://images.unsplash.com/photo-1528761312658-3c1f00ca884d?w=500', 3, 'Karnataka', 280, TRUE),
('Milk - 500ml', 'Fresh pasteurized full cream milk', 49.00, 69.00, 29, 4.9, 534, 'https://images.unsplash.com/photo-1550583328-5bf4e6de8198?w=500', 3, 'Maharashtra', 400, TRUE),
('Honey - 500g', 'Pure raw honey direct from beekeepers', 599.00, 799.00, 25, 4.8, 423, 'https://images.unsplash.com/photo-1587049352495-f3b331b3a4e0?w=500', 3, 'Delhi', 100, TRUE),
('Olive Oil - 500ml', 'Extra virgin cold-pressed olive oil', 899.00, 1299.00, 31, 4.7, 267, 'https://images.unsplash.com/photo-1576098462620-f694e0e7ea0d?w=500', 3, 'Kerala', 80, TRUE),
('Nut Mix - 500g', 'Mixed nuts and dry fruits combo', 699.00, 999.00, 30, 4.8, 345, 'https://images.unsplash.com/photo-1585527881362-3f3d8c4d4e3b?w=500', 3, 'Rajasthan', 120, TRUE),
('Dark Chocolate', '85% dark chocolate bar - 100g', 299.00, 399.00, 25, 4.9, 456, 'https://images.unsplash.com/photo-1599599810694-a5f8c6a1c7e7?w=500', 3, 'Delhi', 150, TRUE),
('Organic Spinach - 500g', 'Fresh organic baby spinach leaves', 149.00, 249.00, 40, 4.7, 189, 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500', 3, 'Punjab', 200, TRUE),
('Ghee - 500ml', 'Pure cow ghee from organic farms', 799.00, 1099.00, 27, 4.8, 512, 'https://images.unsplash.com/photo-1587049352495-f3b331b3a4e0?w=500', 3, 'Rajasthan', 90, TRUE);

-- INSERT HOME & FURNITURE PRODUCTS (15 items)
INSERT INTO items (name, description, cost, original_price, discount, rating, reviews, image, category_id, state, quantity, in_stock) VALUES
('Sofa Set - 3 Seater', 'Modern fabric sofa set with cushions', 24999.00, 34999.00, 29, 4.8, 234, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', 4, 'Delhi', 8, TRUE),
('Dining Table', 'Wooden dining table for 6 people', 14999.00, 19999.00, 25, 4.7, 189, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500', 4, 'Karnataka', 12, TRUE),
('Bed Frame - King Size', 'Premium wooden king size bed frame', 19999.00, 29999.00, 33, 4.8, 267, 'https://images.unsplash.com/photo-1540932239986-310128078e92?w=500', 4, 'Maharashtra', 10, TRUE),
('Wardrobe', 'Large wooden wardrobe with mirror', 12999.00, 17999.00, 28, 4.6, 156, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 4, 'Delhi', 6, TRUE),
('Bookshelf', 'Modern 5-tier bookshelf for home library', 8999.00, 12999.00, 31, 4.7, 198, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500', 4, 'Tamil Nadu', 15, TRUE),
('Coffee Table', 'Glass top wooden coffee table', 7999.00, 11999.00, 33, 4.6, 134, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 4, 'Telangana', 20, TRUE),
('Wall Clock', 'Decorative wall clock with modern design', 1999.00, 3499.00, 43, 4.5, 289, 'https://images.unsplash.com/photo-1564429238817-393bd99ecd5b?w=500', 4, 'Delhi', 50, TRUE),
('Curtains - Set of 2', 'Heavy velvet curtains for bedroom', 2999.00, 4999.00, 40, 4.7, 212, 'https://images.unsplash.com/photo-1572032175914-e3acd53e7e34?w=500', 4, 'Maharashtra', 40, TRUE),
('Throw Pillow - Set of 4', 'Decorative throw pillows with covers', 1499.00, 2499.00, 40, 4.6, 178, 'https://images.unsplash.com/photo-1584100936595-07895acdc4ec?w=500', 4, 'Delhi', 60, TRUE),
('Desk Lamp', 'LED desk lamp with adjustable brightness', 1299.00, 2199.00, 41, 4.7, 145, 'https://images.unsplash.com/photo-1565636192335-14f0b2edf614?w=500', 4, 'Karnataka', 55, TRUE),
('Room Carpet', '5x7 feet wool carpet for living room', 5999.00, 8999.00, 33, 4.8, 267, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500', 4, 'Delhi', 18, TRUE),
('Mirror Cabinet', 'Bathroom mirror with storage cabinet', 3999.00, 5999.00, 33, 4.6, 189, 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500', 4, 'Maharashtra', 25, TRUE),
('Plant Pot Set', 'Ceramic plant pot set of 3 with stand', 1199.00, 1999.00, 40, 4.7, 234, 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500', 4, 'Delhi', 70, TRUE),
('Bed Sheets - Set', 'Cotton bed sheet set with pillow covers', 1599.00, 2599.00, 38, 4.8, 456, 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500', 4, 'Karnataka', 80, TRUE),
('Standing Lamp', 'Modern floor standing lamp with shade', 2499.00, 3999.00, 37, 4.6, 167, 'https://images.unsplash.com/photo-1534597239-e8f5b0a6c1b7?w=500', 4, 'Delhi', 30, TRUE);

-- INSERT SPORTS & OUTDOORS PRODUCTS (12 items)
INSERT INTO items (name, description, cost, original_price, discount, rating, reviews, image, category_id, state, quantity, in_stock) VALUES
('Cricket Bat - Wooden', 'Professional grade wooden cricket bat', 2999.00, 4999.00, 40, 4.8, 234, 'https://images.unsplash.com/photo-1624526267942-ab67cb1ef32c?w=500', 5, 'Delhi', 45, TRUE),
('Football', 'Professional size 5 football', 1499.00, 2499.00, 40, 4.7, 189, 'https://images.unsplash.com/photo-1579952547658-7a5b3b1d1e8f?w=500', 5, 'Karnataka', 60, TRUE),
('Tennis Racket', 'Lightweight tennis racket with cover', 3999.00, 5999.00, 33, 4.8, 267, 'https://images.unsplash.com/photo-1521885704737-286f3684f558?w=500', 5, 'Delhi', 30, TRUE),
('Yoga Mat', 'Non-slip yoga mat with carrying strap', 999.00, 1699.00, 41, 4.9, 512, 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500', 5, 'Maharashtra', 100, TRUE),
('Dumbbells Set - 20kg', 'Adjustable dumbbells set for home gym', 4999.00, 7999.00, 37, 4.8, 345, 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=500', 5, 'Delhi', 20, TRUE),
('Bicycle', 'Mountain bike with 21 gears', 9999.00, 14999.00, 33, 4.7, 234, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 5, 'Tamil Nadu', 12, TRUE),
('Skating Shoes - Roller', 'Professional roller skating shoes', 2499.00, 3999.00, 37, 4.6, 156, 'https://images.unsplash.com/photo-1571902202556-3c78c0a76a92?w=500', 5, 'Delhi', 35, TRUE),
('Tent - 4 Person', 'Double-layer camping tent', 3999.00, 5999.00, 33, 4.8, 289, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500', 5, 'Himachal Pradesh', 15, TRUE),
('Backpack', 'Large capacity travel backpack - 60L', 2999.00, 4999.00, 40, 4.7, 423, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 5, 'Delhi', 40, TRUE),
('Running Shoes', 'Professional running shoes with cushioning', 3499.00, 5499.00, 36, 4.8, 534, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 5, 'Maharashtra', 50, TRUE),
('Water Bottle', 'Insulated water bottle - 1 Liter', 1299.00, 1999.00, 35, 4.9, 678, 'https://images.unsplash.com/photo-1602143407151-7e06dc1bfdd0?w=500', 5, 'Delhi', 120, TRUE),
('Gym Bag', 'Durable polyester gym and sports bag', 1499.00, 2499.00, 40, 4.6, 267, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 5, 'Karnataka', 70, TRUE);

-- INSERT BOOKS & MEDIA PRODUCTS (12 items)
INSERT INTO items (name, description, cost, original_price, discount, rating, reviews, image, category_id, state, quantity, in_stock) VALUES
('The Midnight Library', 'Fiction novel by Matt Haig', 399.00, 599.00, 33, 4.8, 456, 'https://images.unsplash.com/photo-1507842714442-a8b72f1d0c90?w=500', 6, 'Delhi', 80, TRUE),
('Atomic Habits', 'Self-improvement book by James Clear', 399.00, 599.00, 33, 4.9, 1234, 'https://images.unsplash.com/photo-1495446815901-a7297e8b7f1f?w=500', 6, 'Karnataka', 100, TRUE),
('Sapiens', 'History of mankind by Yuval Noah Harari', 549.00, 799.00, 31, 4.8, 678, 'https://images.unsplash.com/photo-1507842714442-a8b72f1d0c90?w=500', 6, 'Delhi', 60, TRUE),
('The Psychology of Money', 'Financial psychology book', 399.00, 599.00, 33, 4.7, 345, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500', 6, 'Maharashtra', 70, TRUE),
('Wings of Fire Series', 'Fantasy novel series collection', 1999.00, 2799.00, 29, 4.9, 523, 'https://images.unsplash.com/photo-1516979187457-635ecca20380?w=500', 6, 'Delhi', 40, TRUE),
('The Great Gatsby', 'Classic novel by F. Scott Fitzgerald', 299.00, 449.00, 33, 4.8, 234, 'https://images.unsplash.com/photo-1507842714442-a8b72f1d0c90?w=500', 6, 'Karnataka', 100, TRUE),
('Spider-Man Comics', 'Latest Spider-Man comic collection', 499.00, 749.00, 33, 4.7, 289, 'https://images.unsplash.com/photo-1584768694675-c966549cb8d6?w=500', 6, 'Delhi', 50, TRUE),
('Metal Album - Metallica', 'Heavy metal music album CD', 399.00, 599.00, 33, 4.8, 178, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500', 6, 'Mumbai', 45, TRUE),
('English Grammar Book', 'Complete English grammar reference', 349.00, 549.00, 36, 4.6, 212, 'https://images.unsplash.com/photo-1507842714442-a8b72f1d0c90?w=500', 6, 'Delhi', 85, TRUE),
('Recipe Book - Indian Cuisine', 'Traditional Indian recipes collection', 499.00, 749.00, 33, 4.8, 267, 'https://images.unsplash.com/photo-1495635086269-490f3242f18f?w=500', 6, 'Delhi', 55, TRUE),
('Self-Help Collection', 'Bundle of top 5 self-help books', 1299.00, 1999.00, 35, 4.7, 189, 'https://images.unsplash.com/photo-1516979187457-635ecca20380?w=500', 6, 'Karnataka', 30, TRUE),
('Cooking Show DVD', 'Famous cooking show series DVD', 599.00, 899.00, 33, 4.6, 145, 'https://images.unsplash.com/photo-1533613220915-609f71a91335?w=500', 6, 'Delhi', 40, TRUE);

-- INSERT BEAUTY & PERSONAL CARE PRODUCTS (12 items)
INSERT INTO items (name, description, cost, original_price, discount, rating, reviews, image, category_id, state, quantity, in_stock) VALUES
('Face Cream - Day Care', 'SPF 30 day moisturizer for all skin types', 799.00, 1199.00, 33, 4.8, 456, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500', 7, 'Delhi', 100, TRUE),
('Sunscreen Lotion', 'SPF 50+ broad spectrum sunscreen', 599.00, 899.00, 33, 4.9, 678, 'https://images.unsplash.com/photo-1512207736139-7f3493e35cda?w=500', 7, 'Maharashtra', 120, TRUE),
('Lipstick - Red', 'Long-lasting matte red lipstick', 499.00, 799.00, 37, 4.7, 345, 'https://images.unsplash.com/photo-1571875257727-256c39da7aae?w=500', 7, 'Delhi', 80, TRUE),
('Foundation - Liquid', 'Full coverage liquid foundation', 799.00, 1199.00, 33, 4.8, 523, 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500', 7, 'Karnataka', 90, TRUE),
('Eye Makeup Set', 'Complete eye shadow and liner set', 1299.00, 1999.00, 35, 4.7, 267, 'https://images.unsplash.com/photo-1515562141207-6811bcb33ce7?w=500', 7, 'Delhi', 60, TRUE),
('Hair Oil - Coconut', 'Pure coconut hair oil for nourishment', 299.00, 499.00, 40, 4.8, 612, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500', 7, 'Tamil Nadu', 150, TRUE),
('Shampoo & Conditioner', 'Organic sulfate-free shampoo with conditioner', 599.00, 899.00, 33, 4.7, 489, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500', 7, 'Delhi', 110, TRUE),
('Face Pack - Mud Mask', 'Herbal mud mask for detoxification', 399.00, 699.00, 43, 4.8, 378, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500', 7, 'Rajasthan', 95, TRUE),
('Moisturizer - Night', 'Night repair moisturizer for dry skin', 899.00, 1299.00, 31, 4.7, 234, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500', 7, 'Delhi', 85, TRUE),
('Perfume - Floral', 'Long-lasting floral fragrance - 100ml', 1499.00, 2199.00, 32, 4.8, 456, 'https://images.unsplash.com/photo-1505252585461-04db1921b40f?w=500', 7, 'Maharashtra', 70, TRUE),
('Soap Bar - Organic', 'Natural organic bath soap pack of 5', 299.00, 499.00, 40, 4.9, 567, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500', 7, 'Kerala', 140, TRUE),
('Body Lotion', 'Moisturizing body lotion for all seasons', 599.00, 899.00, 33, 4.7, 345, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 7, 'Delhi', 100, TRUE);

-- INSERT TOYS & GAMES PRODUCTS (10 items)
INSERT INTO items (name, description, cost, original_price, discount, rating, reviews, image, category_id, state, quantity, in_stock) VALUES
('LEGO Building Set', 'Classic LEGO set with 500+ pieces', 1999.00, 2999.00, 33, 4.9, 678, 'https://images.unsplash.com/photo-1594787318286-3d835c1cabbb?w=500', 8, 'Delhi', 50, TRUE),
('Chess Set', 'Wooden deluxe chess board with pieces', 1499.00, 2199.00, 32, 4.8, 234, 'https://images.unsplash.com/photo-1579365080519-fcc292c6ff16?w=500', 8, 'Karnataka', 40, TRUE),
('Board Game - Monopoly', 'Classic Monopoly board game', 999.00, 1499.00, 33, 4.7, 345, 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500', 8, 'Delhi', 35, TRUE),
('Video Game - FIFA 24', 'Latest FIFA football game for console', 2999.00, 4499.00, 33, 4.8, 512, 'https://images.unsplash.com/photo-1605559424843-9e4c3ff86b08?w=500', 8, 'Maharashtra', 25, TRUE),
('Action Figure', 'Collectible superhero action figure', 799.00, 1199.00, 33, 4.7, 267, 'https://images.unsplash.com/photo-1594787318286-3d835c1cabbb?w=500', 8, 'Delhi', 60, TRUE),
('Toy Car Set', 'Die-cast toy car set collection', 1299.00, 1999.00, 35, 4.8, 289, 'https://images.unsplash.com/photo-1586625217261-1fe5d0cdc6a8?w=500', 8, 'Karnataka', 70, TRUE),
('Puzzle Game - 1000 Pieces', 'Complex jigsaw puzzle for adults', 499.00, 799.00, 37, 4.9, 456, 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500', 8, 'Delhi', 80, TRUE),
('Remote Control Drone', 'Mini quadcopter drone with camera', 3999.00, 5999.00, 33, 4.7, 378, 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500', 8, 'Delhi', 15, TRUE),
('Building Blocks', 'Magnetic building blocks for kids', 1599.00, 2399.00, 33, 4.8, 234, 'https://images.unsplash.com/photo-1594787318286-3d835c1cabbb?w=500', 8, 'Maharashtra', 45, TRUE),
('Card Game - Uno', 'Classic Uno card game family pack', 399.00, 599.00, 33, 4.9, 612, 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500', 8, 'Delhi', 100, TRUE);

-- E-COMMERCE DATABASE SCHEMA (PostgreSQL)
-- Create the database manually if needed:
-- CREATE DATABASE ecommerce_db;
-- \\c ecommerce_db

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

-- Products/Items Table
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    cost DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255),
    state VARCHAR(50),
    item_type VARCHAR(100),
    quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending'
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

-- Sample Product Data
INSERT INTO items (name, description, cost, state, item_type, image, quantity) VALUES
('Fresh Mango', 'Organic fresh mangoes from Maharashtra', 150.00, 'Maharashtra', 'Fruits', 'https://images.unsplash.com/photo-1553279768-ad526a102395?w=500', 50),
('Green Apple', 'Crisp green apples from Himachal', 120.00, 'Himachal Pradesh', 'Fruits', 'https://images.unsplash.com/photo-1584373603330-6ba2b11ec5b2?w=500', 30),
('Tomato', 'Fresh red tomatoes from Tamil Nadu', 40.00, 'Tamil Nadu', 'Vegetables', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500', 100),
('Carrot', 'Organic carrots from Punjab', 60.00, 'Punjab', 'Vegetables', 'https://images.unsplash.com/photo-1585518419759-bab4be4c2d0a?w=500', 75),
('Onion', 'Good quality onions from Gujarat', 50.00, 'Gujarat', 'Vegetables', 'https://images.unsplash.com/photo-1587926591233-dfaf3ff41981?w=500', 200),
('Banana', 'Golden bananas from Karnataka', 80.00, 'Karnataka', 'Fruits', 'https://images.unsplash.com/photo-1528761312658-3c1f00ca884d?w=500', 60);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_item_state ON items(state);
CREATE INDEX IF NOT EXISTS idx_item_type ON items(item_type);
CREATE INDEX IF NOT EXISTS idx_order_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart(user_id);

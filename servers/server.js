// server.js - Main Express Server
const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.options('*', cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Import database connection
const connection = require('./db');

// Helper function to get category icons
function getCategoryIcon(categoryName) {
    const icons = {
        'Fruits': '🍎',
        'Vegetables': '🥕',
        'Dairy': '🥛',
        'Meat': '🥩',
        'Bakery': '🍞',
        'Beverages': '🥤',
        'Snacks': '🍿',
        'Grains': '🌾',
        'Spices': '🌶️',
        'Electronics': '📱',
        'Clothing': '👕',
        'Books': '📚'
    };
    return icons[categoryName] || '📦';
}

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, '..', 'images')));

// FILE UPLOAD CONFIGURATION
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `paymentProof-${Date.now()}.${file.originalname.split('.').pop()}`);
    }
});
const upload = multer({ storage });

// Health Check
app.get('/', (req, res) => {
    res.json({ status: "Server is running!", timestamp: new Date() });
});

// ========== PRODUCTS API ==========

// Get all categories
app.get('/api/categories', (req, res) => {
    connection.query("SELECT id, name, description, image, icon FROM categories ORDER BY id", (err, results) => {
        if (err) {
            console.error("❌ Error fetching categories:", err.message);
            return res.json([]);
        }
        res.json(results || []);
    });
});

// Get products by category
app.get('/api/categories/:categoryId/products', (req, res) => {
    const categoryId = parseInt(req.params.categoryId, 10);
    if (Number.isNaN(categoryId)) {
        return res.status(400).json({ error: 'Invalid category ID' });
    }

    const sql = `
        SELECT id, name, description, cost, original_price, discount, rating, reviews, image, in_stock
        FROM items
        WHERE category_id = ? AND in_stock = TRUE
        ORDER BY discount DESC, rating DESC
        LIMIT 50
    `;
    connection.query(sql, [categoryId], (err, results) => {
        if (err) {
            console.error("❌ Error fetching category products:", err.message);
            const fallbackSql = `
                SELECT id, name, description, cost, image, in_stock
                FROM items
                WHERE category_id = ? AND in_stock = TRUE
                ORDER BY id DESC
                LIMIT 50
            `;
            connection.query(fallbackSql, [categoryId], (fallbackErr, fallbackResults) => {
                if (fallbackErr) {
                    return res.status(500).json({ error: "Category not found" });
                }
                res.json(fallbackResults || []);
            });
            return;
        }
        res.json(results || []);
    });
});

// Search products
app.get('/api/search', (req, res) => {
    const { q } = req.query;
    if (!q || q.length < 2) {
        return res.json([]);
    }
    
    const searchTerm = `%${q}%`;
    const sql = `
        SELECT id, name, description, cost, original_price, discount, rating, reviews, image, in_stock
        FROM items 
        WHERE (name ILIKE ? OR description ILIKE ?) AND in_stock = TRUE
        ORDER BY rating DESC, reviews DESC
        LIMIT 30
    `;
    connection.query(sql, [searchTerm, searchTerm], (err, results) => {
        if (err) {
            console.error("❌ Error searching products:", err.message);
            const fallbackSql = `
                SELECT id, name, description, cost, image, in_stock
                FROM items
                WHERE (name ILIKE ? OR description ILIKE ?) AND in_stock = TRUE
                ORDER BY id DESC
                LIMIT 30
            `;
            connection.query(fallbackSql, [searchTerm, searchTerm], (fallbackErr, fallbackResults) => {
                if (fallbackErr) {
                    return res.status(500).json({ error: "Search failed" });
                }
                res.json(fallbackResults || []);
            });
            return;
        }
        res.json(results || []);
    });
});

// Get all products (with pagination)
app.get('/api/items', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const sql = `
        SELECT id, name, description, cost, original_price, discount, rating, reviews, image, in_stock
        FROM items 
        WHERE in_stock = TRUE
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
    `;
    connection.query(sql, [limit, offset], (err, results) => {
        if (err) {
            console.error("❌ Error fetching items:", err.message);
            // Fallback to basic query if new columns don't exist
            const fallbackSql = "SELECT id, name, description, cost, image FROM items LIMIT 20";
            connection.query(fallbackSql, (fallbackErr, fallbackResults) => {
                if (fallbackErr) {
                    return res.status(500).json({ error: "Database error" });
                }
                res.json(fallbackResults || []);
            });
            return;
        }
        res.json(results || []);
    });
});

// Get single product by ID
app.get('/api/items/:id', (req, res) => {
    const sql = `
        SELECT i.*, c.name as category_name
        FROM items i
        LEFT JOIN categories c ON i.category_id = c.id
        WHERE i.id = ?
    `;
    connection.query(sql, [req.params.id], (err, results) => {
        if (err) {
            console.error("❌ Error fetching item:", err.message);
            // Fallback to simple query
            const fallbackSql = "SELECT * FROM items WHERE id = ?";
            connection.query(fallbackSql, [req.params.id], (fallbackErr, fallbackResults) => {
                if (fallbackErr || fallbackResults.length === 0) {
                    return res.status(404).json({ error: "Product not found" });
                }
                res.json(fallbackResults[0]);
            });
            return;
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(results[0]);
    });
});

// Get trending/featured products
app.get("/api/trending-products", (req, res) => {
    const sql = `
        SELECT id, name, cost, original_price, discount, rating, reviews, image
        FROM items 
        WHERE in_stock = TRUE AND reviews > 100
        ORDER BY rating DESC, reviews DESC
        LIMIT 12
    `;
    connection.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching trending products:", err.message);
            // Return top products by ID if new columns don't exist
            const fallbackSql = "SELECT id, name, cost, image FROM items ORDER BY id DESC LIMIT 12";
            connection.query(fallbackSql, (fallbackErr, fallbackResults) => {
                if (fallbackErr) {
                    return res.json([]);
                }
                res.json(fallbackResults || []);
            });
            return;
        }
        res.json(results || []);
    });
});

// Get discount/sale products
app.get("/api/sale-products", (req, res) => {
    const sql = `
        SELECT id, name, cost, original_price, discount, rating, reviews, image
        FROM items 
        WHERE in_stock = TRUE AND discount > 30
        ORDER BY discount DESC
        LIMIT 15
    `;
    connection.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching sale products:", err.message);
            // Return products if new columns don't exist
            const fallbackSql = "SELECT id, name, cost, image FROM items LIMIT 15";
            connection.query(fallbackSql, (fallbackErr, fallbackResults) => {
                if (fallbackErr) {
                    return res.json([]);
                }
                res.json(fallbackResults || []);
            });
            return;
        }
        res.json(results || []);
    });
});

// ========== USER AUTHENTICATION ==========

// User Registration
app.post('/api/register', async (req, res) => {
    const { name, email, phone, password } = req.body;
    
    if (!name || !email || !phone || !password) {
        return res.status(400).json({ success: false, message: "All fields are required!" });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?) RETURNING id";
        connection.query(sql, [name, email, phone, hashedPassword], (err, result) => {
            if (err) {
                console.error("❌ Error registering user:", err);
                if (err.code === '23505') {
                    return res.status(400).json({ success: false, message: "Email already registered!" });
                }
                return res.status(500).json({ success: false, message: "Database error" });
            }
            res.json({ success: true, message: "User registered successfully!", userId: result[0].id });
        });
    } catch (error) {
        console.error("❌ Error hashing password:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// User Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password required!" });
    }
    
    connection.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) {
            console.error("❌ Error fetching user:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }
        
        if (results.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid email or password!" });
        }
        
        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid email or password!" });
        }
        
        res.json({
            success: true,
            message: "Login successful!",
            user: { id: user.id, name: user.name, email: user.email, phone: user.phone }
        });
    });
});

// ========== CART API ==========

// Get cart items for user
app.get('/api/cart/:userId', (req, res) => {
    const sql = `
        SELECT c.id, i.id as item_id, i.name, i.cost, i.image, c.quantity
        FROM cart c
        JOIN items i ON c.item_id = i.id
        WHERE c.user_id = ?
    `;
    connection.query(sql, [req.params.userId], (err, results) => {
        if (err) {
            console.error("❌ Error fetching cart:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// Add to cart
app.post('/api/cart', (req, res) => {
    const { user_id, item_id, quantity } = req.body;
    
    if (!user_id || !item_id || !quantity) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    
    const sql = "INSERT INTO cart (user_id, item_id, quantity) VALUES (?, ?, ?) ON CONFLICT (user_id, item_id) DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity";
    connection.query(sql, [user_id, item_id, quantity], (err, result) => {
        if (err) {
            console.error("❌ Error adding to cart:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ success: true, message: "Item added to cart!" });
    });
});

// Remove from cart
app.delete('/api/cart/:cartId', (req, res) => {
    connection.query("DELETE FROM cart WHERE id = ?", [req.params.cartId], (err) => {
        if (err) {
            console.error("❌ Error removing from cart:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ success: true, message: "Item removed from cart!" });
    });
});

// ========== ORDERS API ==========

// Create order
app.post('/api/orders', async (req, res) => {
    const { user_id, total_amount, items, address } = req.body;

    if (!user_id || !total_amount || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sanitizedItems = items.map((item, index) => ({
        item_id: Number(item.item_id),
        quantity: Number(item.quantity),
        price: Number(item.cost)
    }));

    for (let i = 0; i < sanitizedItems.length; i += 1) {
        const item = sanitizedItems[i];
        if (!item.item_id || !item.quantity || !Number.isFinite(item.price)) {
            return res.status(400).json({ error: `Invalid order item at index ${i}` });
        }
    }

    const deliveryAddress = address
        ? (typeof address === 'string'
            ? address
            : `${address.street || ''}, ${address.city || ''}, ${address.state || ''}, ${address.postal_code || ''}`)
        : null;

    try {
        const orderSql = "INSERT INTO orders (user_id, total_amount, status, delivery_address) VALUES (?, ?, 'pending', ?) RETURNING id";
        const orderResult = await connection.query(orderSql, [user_id, total_amount, deliveryAddress]);
        const orderId = orderResult?.[0]?.id;

        if (!orderId) {
            throw new Error('Failed to create order record');
        }

        const itemSql = `INSERT INTO order_items (order_id, item_id, quantity, price) VALUES ${sanitizedItems.map(() => "(?, ?, ?, ?)").join(', ')}`;
        const itemValues = sanitizedItems.flatMap(item => [orderId, item.item_id, item.quantity, item.price]);

        await connection.query(itemSql, itemValues);
        await connection.query("DELETE FROM cart WHERE user_id = ?", [user_id]);

        return res.json({
            success: true,
            message: "Order created successfully!",
            orderId: orderId
        });
    } catch (err) {
        console.error("❌ Order creation failed:", err.message || err);
        return res.status(500).json({ error: "Database error", details: process.env.NODE_ENV === 'development' ? err.message : undefined });
    }
});

// Get user orders
app.get('/api/orders/:userId', (req, res) => {
    const sql = `
        SELECT o.id, o.order_date, o.total_amount, o.status,
               STRING_AGG(i.name, ', ') AS items, COUNT(oi.id) AS item_count
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN items i ON oi.item_id = i.id
        WHERE o.user_id = ?
        GROUP BY o.id, o.order_date, o.total_amount, o.status
        ORDER BY o.order_date DESC
    `;
    connection.query(sql, [req.params.userId], (err, results) => {
        if (err) {
            console.error("❌ Error fetching orders:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// Get detailed user orders with items and payment status
app.get('/api/user-orders/:userId', (req, res) => {
    const userId = req.params.userId;
    
    const sql = `
        SELECT 
            o.id, 
            o.order_date, 
            o.total_amount, 
            o.status,
            o.delivery_address,
            COALESCE(a.street || ', ' || a.city || ', ' || a.state || ', ' || a.postal_code, o.delivery_address) AS full_address,
            COALESCE(p.status, 'pending') AS payment_status,
            json_agg(
                json_build_object(
                    'id', oi.id,
                    'item_id', oi.item_id,
                    'name', i.name,
                    'quantity', oi.quantity,
                    'price', oi.price,
                    'image', i.image
                )
            ) AS items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN items i ON oi.item_id = i.id
        LEFT JOIN addresses a ON o.user_id = a.user_id AND a.is_default = TRUE
        LEFT JOIN payments p ON o.id = p.order_id
        WHERE o.user_id = ?
        GROUP BY o.id, o.order_date, o.total_amount, o.status, o.delivery_address, a.street, a.city, a.state, a.postal_code, p.status
        ORDER BY o.order_date DESC
    `;
    
    connection.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("❌ Error fetching detailed orders:", err.message);
            // Fallback to simpler query
            const fallbackSql = `
                SELECT 
                    o.id, 
                    o.order_date, 
                    o.total_amount, 
                    o.status,
                    o.delivery_address,
                    'pending' AS payment_status
                FROM orders o
                WHERE o.user_id = ?
                ORDER BY o.order_date DESC
            `;
            
            connection.query(fallbackSql, [userId], (fallbackErr, fallbackResults) => {
                if (fallbackErr) {
                    return res.status(500).json({ error: "Database error" });
                }
                
                // Fetch items for each order separately
                if (fallbackResults.length === 0) {
                    return res.json([]);
                }
                
                let processedOrders = 0;
                fallbackResults.forEach(order => {
                    const itemsSql = `
                        SELECT oi.id, oi.item_id, i.name, oi.quantity, oi.price, i.image
                        FROM order_items oi
                        JOIN items i ON oi.item_id = i.id
                        WHERE oi.order_id = ?
                    `;
                    
                    connection.query(itemsSql, [order.id], (itemErr, items) => {
                        order.items = items || [];
                        processedOrders++;
                        
                        if (processedOrders === fallbackResults.length) {
                            res.json(fallbackResults);
                        }
                    });
                });
            });
            return;
        }
        
        res.json(results);
    });
});

// ========== PAYMENT API ==========

// Upload payment proof
app.post('/api/payment', upload.single('proof'), (req, res) => {
    const { order_id, amount, payment_method } = req.body;
    
    if (!order_id || !amount) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    
    const proofPath = req.file ? `/uploads/${req.file.filename}` : null;
    const sql = "INSERT INTO payments (order_id, amount, payment_method, proof_image, status) VALUES (?, ?, ?, ?, 'pending')";
    
    connection.query(sql, [order_id, amount, payment_method, proofPath], (err, result) => {
        if (err) {
            console.error("❌ Error recording payment:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ success: true, message: "Payment recorded! Awaiting verification." });
    });
});

// ========== ADDRESS API ==========

// Add address
app.post('/api/addresses', (req, res) => {
    const { user_id, street, city, state, postal_code, country, is_default } = req.body;

    if (!user_id || !street || !city || !state || !postal_code) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const shouldDefault = Boolean(is_default);

    const insertAddress = (defaultFlag) => {
        const sql = "INSERT INTO addresses (user_id, street, city, state, postal_code, country, is_default) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id";
        connection.query(
            sql,
            [user_id, street, city, state, postal_code, country || 'India', defaultFlag ? 1 : 0],
            (err, result) => {
                if (err) {
                    console.error("❌ Error adding address:", err);
                    return res.status(500).json({ error: "Database error" });
                }
                res.json({ success: true, message: "Address added!", addressId: result[0].id });
            }
        );
    };

    const saveAddress = () => {
        if (shouldDefault) {
            connection.query("UPDATE addresses SET is_default = FALSE WHERE user_id = ?", [user_id], (err) => {
                if (err) {
                    console.error("❌ Error clearing default addresses:", err);
                    return res.status(500).json({ error: "Database error" });
                }
                insertAddress(true);
            });
        } else {
            connection.query("SELECT COUNT(*) AS count FROM addresses WHERE user_id = ?", [user_id], (err, result) => {
                if (err) {
                    console.error("❌ Error checking existing addresses:", err);
                    return res.status(500).json({ error: "Database error" });
                }
                const addressCount = result[0]?.count || 0;
                insertAddress(addressCount === 0);
            });
        }
    };

    saveAddress();
});

// Get user addresses
app.get('/api/addresses/:userId', (req, res) => {
    connection.query(
        "SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC",
        [req.params.userId],
        (err, results) => {
            if (err) {
                console.error("❌ Error fetching addresses:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.json(results);
        }
    );
});

// ========== ERROR HANDLING ==========
app.use((err, req, res, next) => {
    console.error("❌ Unhandled Error:", err);
    res.status(500).json({ error: "Internal server error" });
});

// ========== START SERVER ==========
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

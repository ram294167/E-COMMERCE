// server.js
const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'Client')));
// Import the shared DB connection from db.js
const connection = require('./db');

// Serve static files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, '..', 'images')));



// Mount Order Routes
const orderRoutes = require('./routes/orderRoutes');
app.use(orderRoutes);

// --------------------
// Other Routes and Endpoints
// --------------------

// Test Route
app.get('/', (req, res) => {
    res.send("Server is running!");
});

// Fetch Unique States from `items` Table
app.get('/api/states', (req, res) => {
    connection.query("SELECT DISTINCT state FROM items", (err, results) => {
        if (err) {
            console.error("❌ Error fetching states:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results.map(row => ({ name: row.state })));
    });
});

// Fetch Unique Item Types from `items` Table
app.get('/api/item-types', (req, res) => {
    connection.query("SELECT DISTINCT item_type FROM items", (err, results) => {
        if (err) {
            console.error("❌ Error fetching item types:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results.map(row => ({ name: row.item_type })));
    });
});

// Fetch Products Based on State & Item Type
app.get('/api/items', (req, res) => {
    const { state, itemType } = req.query;
    let query = "SELECT id, name, description, cost, image FROM items WHERE 1=1";
    let params = [];
    if (state) {
        query += " AND state = ?";
        params.push(state);
    }
    connection.query(query, params, (err, results) => {
        if (err) {
            console.error("❌ Error fetching items:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// User Registration
app.post('/api/register', async (req, res) => {
    console.log("Incoming request body:", req.body);
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
        return res.status(400).json({ success: false, message: "All fields are required!" });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)";
        connection.query(sql, [name, email, phone, hashedPassword], (err, result) => {
            if (err) {
                console.error("❌ Error inserting user:", err);
                return res.status(500).json({ success: false, message: "Database error" });
            }
            res.json({ success: true, message: "User registered successfully!" });
        });
    } catch (error) {
        console.error("❌ Error hashing password:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// User Login
app.post("/api/login", (req, res) => {
    const { emailOrPhone, password } = req.body;
    if (!emailOrPhone || !password) {
        return res.status(400).json({ success: false, message: "All fields are required!" });
    }
    const sql = "SELECT * FROM users WHERE email = ? OR phone = ?";
    connection.query(sql, [emailOrPhone, emailOrPhone], async (err, results) => {
        if (err) {
            console.error("❌ Login Error:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }
        if (results.length === 0) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        res.json({ success: true, message: "Login successful!" ,userId:user.id});
    });
});

// Fetch Recently Added Products
app.get("/api/recent-products", (req, res) => {
    const sql = "SELECT id, name, image FROM items ORDER BY id DESC LIMIT 6 ";
    connection.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching recent products:", err);
            return res.status(500).json({ success: false, message: "Error fetching recent products", error: err });
        }
        res.json(results);
    });
});

app.get("/api/recent", (req, res) => {
    const sql = "SELECT id, name, image FROM items ORDER BY id ASC LIMIT 8";
    connection.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching recent products:", err);
            return res.status(500).json({ success: false, message: "Error fetching recent products", error: err });
        }
        res.json(results);
    });
});


// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

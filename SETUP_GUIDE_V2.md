# E-Commerce Store - Enhanced Version Setup Guide

## 🎉 New Features

### ✨ What's New:
- **8 Product Categories** (Fashion, Electronics, Groceries, Home & Furniture, Sports, Books, Beauty, Toys)
- **100+ High-Quality Products** with ratings, reviews, and discounts
- **Modern Flipkart-like UI** with improved design and user experience
- **Product Search** functionality
- **Category Filtering** and browsing
- **Trending Products** section
- **Sale/Discount Products** section
- **Better Product Cards** with ratings, reviews, original prices, and discounts
- **Improved Shopping Cart** with better layout
- **Responsive Design** for mobile devices

## 📦 Database Setup

### Step 1: Run Database Migration

If you're using PostgreSQL, run the enhanced schema:

```bash
# Option A: Using psql client
psql -U postgres -d ecommerce_db -f DATABASE_SCHEMA_ENHANCED.sql

# Option B: Using PgAdmin or similar tool
# Copy the contents of DATABASE_SCHEMA_ENHANCED.sql and execute in your SQL editor
```

**Note:** If you have existing data, you may want to:
1. Backup your current database
2. Create a new database or drop tables first
3. Then run the enhanced schema

### Step 2: Verify Database

Check that categories table has data:

```sql
SELECT * FROM categories;
SELECT COUNT(*) as total_products FROM items;
```

You should see:
- 8 categories (Fashion, Electronics, Groceries, etc.)
- 100+ products across all categories

## 🚀 Backend Setup

### Update Server Environment Variables

Make sure your `.env` file in the `/servers` directory has:

```
DB_HOST=localhost
DB_USER=postgres
DB_PASS=your_password
DB_NAME=ecommerce_db
DB_PORT=5432
PORT=5000
```

### Server API Endpoints (New)

The following new endpoints are available:

- `GET /api/categories` - Get all product categories
- `GET /api/categories/:categoryId/products` - Get products in a category
- `GET /api/search?q=query` - Search products
- `GET /api/trending-products` - Get trending products
- `GET /api/sale-products` - Get discounted products
- `GET /api/items` - Get all products (with pagination)

## 🎨 Frontend Setup

### Step 1: Update Environment File

Verify your `Client/.env` file:

```
VITE_API_URL=https://e-commerce-cokz.onrender.com
```

### Step 2: Install Dependencies

```bash
cd Client
npm install
```

### Step 3: Run Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📱 Features Guide

### Home Page
- **Banner:** Welcome message and call-to-action
- **Category Grid:** Browse products by category
- **Trending Section:** Highest-rated products
- **Sale Section:** Products with big discounts
- **All Products:** Browse complete catalog

### Search Functionality
- Search by product name or description
- Real-time search as you type
- Filters products instantly

### Product Cards
- Product image
- Discount badge (% off)
- Star rating and review count
- Original price (with strikethrough)
- Current price with discount
- "Add to Cart" button

### Shopping Cart
- View all cart items
- Update quantities
- Remove items
- Order summary with:
  - Subtotal
  - Shipping (Free)
  - Discount (5%)
  - Total amount

### Categories Available
1. 👗 **Fashion** - Clothing, sarees, shirts, jeans
2. 📱 **Electronics** - Phones, laptops, tablets, accessories
3. 🛒 **Groceries** - Fresh fruits, vegetables, oils, honey
4. 🏠 **Home & Furniture** - Sofas, tables, beds, decor
5. ⚽ **Sports & Outdoors** - Equipment, gym gear, bicycles
6. 📚 **Books & Media** - Books, comics, music albums
7. 💄 **Beauty & Personal Care** - Skincare, makeup, perfume
8. 🎮 **Toys & Games** - Toys, games, puzzles, drones

## 🔧 Customization

### Modify Product Data

To add/modify products, update the SQL in `DATABASE_SCHEMA_ENHANCED.sql`:

```sql
INSERT INTO items (name, description, cost, original_price, discount, rating, reviews, image, category_id, state, quantity, in_stock) 
VALUES ('Product Name', 'Description', 999.00, 1499.00, 33, 4.8, 150, 'image_url', 2, 'Delhi', 50, TRUE);
```

### Modify Categories

To add new categories:

```sql
INSERT INTO categories (name, description, image, icon) 
VALUES ('Category Name', 'Description', 'image_url', '🎯');
```

## 📊 Product Database Structure

Each product now includes:
- `name` - Product title
- `description` - Product details
- `cost` - Current selling price
- `original_price` - Original/MRP
- `discount` - Discount percentage
- `rating` - Average rating (1-5)
- `reviews` - Number of reviews
- `image` - Product image URL
- `category_id` - Category reference
- `quantity` - Stock quantity
- `in_stock` - Availability status

## 🎯 Sample Products by Category

### Fashion (15 products)
- Women Red Saree ₹899 (30% off)
- Men Formal Shirt ₹649 (35% off)
- Women Jeans ₹799 (33% off)
- And 12 more...

### Electronics (15 products)
- iPhone 15 Pro ₹129,999 (19% off)
- Samsung Galaxy S24 ₹89,999 (25% off)
- MacBook Air M2 ₹129,999 (28% off)
- And 12 more...

### Groceries (15 products)
- Fresh Mango ₹299 (25% off)
- Basmati Rice ₹499 (29% off)
- Organic Wheat ₹199 (33% off)
- And 12 more...

... and many more products across all categories!

## 🚀 Deployment

### Deploy to Vercel (Frontend)

```bash
cd Client
npm run build
vercel deploy
```

### Deploy to Render (Backend)

1. Push changes to GitHub
2. Go to Render.com
3. Connect your repository
4. Set environment variables
5. Deploy

## 📋 Troubleshooting

### Products Not Showing
- Verify database connection
- Check API endpoint in browser: `http://localhost:5000/api/categories`
- Check browser console for errors

### Categories Not Displaying
- Run: `SELECT * FROM categories;` in PostgreSQL
- Verify 8 categories exist

### Search Not Working
- Check API: `http://localhost:5000/api/search?q=phone`
- Verify product names in database

### Styling Issues
- Clear browser cache
- Run: `npm run dev` again
- Check CSS file was updated

## 📞 Support

For issues or questions about specific features, check:
1. Browser Console (F12) for errors
2. Server logs in terminal
3. Database queries in PostgreSQL client

## 🎓 Next Steps

1. ✅ Run database migration (DATABASE_SCHEMA_ENHANCED.sql)
2. ✅ Update environment variables
3. ✅ Start backend server
4. ✅ Start frontend development server
5. ✅ Test categories, search, and products
6. ✅ Deploy to production

---

**Version:** 2.0 - Enhanced E-Commerce Platform
**Last Updated:** May 2026

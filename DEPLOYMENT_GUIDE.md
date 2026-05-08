# E-Commerce Application - Complete Setup & Deployment Guide

## 📋 Project Overview

A full-stack e-commerce application with:
- **Frontend**: React + Vite (Vercel deployable)
- **Backend**: Node.js + Express REST API
- **Database**: MySQL (with support for cloud databases)
- **Features**: Product browsing, cart, orders, user auth, payment tracking

---

## 🚀 LOCAL DEVELOPMENT SETUP

### Prerequisites
- Node.js 16+ and npm
- MySQL server running locally
- Git

### Step 1: Database Setup

1. **Create the database:**
   ```bash
   mysql -u root -p < DATABASE_SCHEMA.sql
   ```
   Enter your MySQL root password when prompted.

2. **Verify database creation:**
   ```bash
   mysql -u root -p
   USE ecommerce_db;
   SHOW TABLES;
   EXIT;
   ```

### Step 2: Backend Setup

```bash
# Navigate to project root
cd E-COMMERCE

# Copy environment file
cp .env.example .env

# Update .env with your credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASS=your_mysql_password
# DB_NAME=ecommerce_db
# PORT=5000

# Install dependencies
npm install

# Start backend server
npm run dev
# Server runs on http://localhost:5000
```

### Step 3: Frontend Setup

```bash
# Navigate to client folder
cd Client

# Copy environment file
cp .env.example .env
# VITE_API_URL=http://localhost:5000

# Install dependencies
npm install

# Start frontend dev server
npm run dev
# Client runs on http://localhost:5173
```

---

## 🌐 DEPLOYMENT TO VERCEL

### For Frontend (React App)

1. **Build the frontend:**
   ```bash
   cd Client
   npm run build
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Select `Client` folder as root directory
   - Add environment variable:
     ```
     VITE_API_URL=https://your-backend-url.com
     ```
   - Click "Deploy"

3. **Your frontend is now live!**

### For Backend (Node.js API) - Two Options:

#### Option A: Deploy Backend to Render.com with PostgreSQL (Free Tier Available)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Add E-Commerce backend"
   git push origin main
   ```

2. **Create Render Account:**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub
   - Click "New" → "Web Service"
   - Connect your GitHub repo
   - Select the main branch

3. **Configure on Render:**
   - **Root Directory:** `E-COMMERCE`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     ```
     PORT=10000
     NODE_ENV=production
     DB_HOST=your_postgres_host
     DB_USER=your_postgres_user
     DB_PASS=your_postgres_password
     DB_NAME=ecommerce_db
     DB_PORT=5432
     FRONTEND_URL=https://your-vercel-frontend.vercel.app
     DB_SSL=true
     ```
   - Click "Create Web Service"

4. **Run the PostgreSQL schema:**
   - Use `DATABASE_SCHEMA_POSTGRES.sql` to create tables.
   - If you are using Render's managed Postgres, connect with psql or a GUI and run the file.

5. **Your backend is now live at:** `https://your-app-name.onrender.com`

#### Option B: Use Cloud Database (Recommended)

**MongoDB Atlas (Free 512MB)**

1. **Create MongoDB Atlas Account:**
   - Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
   - Sign up (free tier available)
   - Create a cluster
   - Create a database user
   - Get connection string

2. **Update Backend to Use MongoDB:**
   - Install MongoDB driver: `npm install mongoose`
   - Replace MySQL with Mongoose connection in server.js
   - Update DATABASE_SCHEMA.sql to MongoDB schema

3. **Or Use MySQL Cloud Service:**
   - **PlanetScale** (MySQL): Free tier at [planetscale.com](https://planetscale.com)
   - **Aiven** (MySQL): Free tier at [aiven.io](https://aiven.io)
   - **AWS RDS** (MySQL): Free tier available

---

## 🗄️ DATABASE CONFIGURATION FOR DEPLOYMENT

### Cloud MySQL Options:

#### 1. PlanetScale (Easiest - Free)
```bash
# 1. Create account at planetscale.com
# 2. Create a database
# 3. Click "Connect" → copy connection string
# 4. Update .env:
DB_HOST=aws.connect.psdb.cloud
DB_USER=your_username
DB_PASS=your_password
DB_NAME=ecommerce_db
DB_PORT=3306
```

#### 2. AWS RDS (Free Tier)
```bash
# Free for 12 months for new AWS accounts
# 1. Go to AWS Console → RDS
# 2. Create MySQL database
# 3. Copy endpoint as DB_HOST
# 4. Allow inbound connections (security groups)
```

#### 3. Aiven (Free tier)
```bash
# 1. Sign up at aiven.io
# 2. Create MySQL service
# 3. Copy connection details
```

---

## 🔧 ENVIRONMENT VARIABLES CHECKLIST

### Backend (.env)
```
# Development
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=ecommerce_db
DB_PORT=3306
FRONTEND_URL=http://localhost:5173

# Production (Render/Vercel)
PORT=3000
NODE_ENV=production
DB_HOST=aws.connect.psdb.cloud
DB_USER=prod_user
DB_PASS=prod_password
DB_NAME=ecommerce_db
DB_PORT=3306
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Frontend (.env)
```
# Development
VITE_API_URL=http://localhost:5000

# Production
VITE_API_URL=https://your-backend.onrender.com
```

---

## 📊 API ENDPOINTS

### Products
- `GET /api/items` - Get all products
- `GET /api/items/:id` - Get product by ID
- `GET /api/states` - Get unique states
- `GET /api/item-types` - Get product categories
- `GET /api/recent-products` - Get latest 6 products

### Auth
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Cart
- `GET /api/cart/:userId` - Get user's cart
- `POST /api/cart` - Add to cart
- `DELETE /api/cart/:cartId` - Remove from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/:userId` - Get user's orders

### Payments
- `POST /api/payment` - Upload payment proof

### Addresses
- `POST /api/addresses` - Add address
- `GET /api/addresses/:userId` - Get user's addresses

---

## 🧪 TESTING THE APPLICATION

### Local Testing
```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
cd Client && npm run dev

# Open browser
http://localhost:5173
```

### Test API Endpoints
```bash
# Using curl or Postman
curl http://localhost:5000/api/items

# Register test user
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","phone":"1234567890","password":"password123"}'
```

---

## 🐛 TROUBLESHOOTING

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306

Solution:
1. Check MySQL is running: sudo service mysql status
2. Verify DB credentials in .env
3. Ensure database exists: mysql -u root -p < DATABASE_SCHEMA.sql
```

### Frontend Can't Connect to Backend
```
Error: CORS error or 404

Solution:
1. Ensure backend is running on :5000
2. Check VITE_API_URL in frontend .env
3. Update FRONTEND_URL in backend .env
4. Restart both servers
```

### Port Already in Use
```
# Kill process using port 5000
lsof -i :5000
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

---

## 📝 DEPLOYMENT CHECKLIST

- [ ] Database schema created in cloud
- [ ] Backend deployed to Render/Railway/Vercel
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS properly configured
- [ ] API endpoints working
- [ ] Images loading correctly
- [ ] Payment upload working
- [ ] User registration/login working
- [ ] Cart functionality working
- [ ] Order creation working

---

## 🔐 Security Tips

1. **Never commit .env to GitHub:**
   ```bash
   echo ".env" >> .gitignore
   ```

2. **Use strong passwords** for database users

3. **Enable HTTPS** on production

4. **Validate all inputs** on backend

5. **Use HTTPS only for API calls** in production

6. **Set CORS properly:**
   ```javascript
   cors({ origin: 'https://your-frontend.vercel.app' })
   ```

---

## 📞 SUPPORT

For issues:
1. Check logs: `npm run dev` shows detailed errors
2. Verify .env files are correct
3. Ensure all dependencies are installed
4. Check database connectivity
5. Review API responses in browser DevTools

---

## 🎉 You're Ready!

Your e-commerce app is now:
- ✅ Fully functional locally
- ✅ Database connected
- ✅ Ready for production deployment
- ✅ Scalable and maintainable

Start the app and test all features before final deployment!

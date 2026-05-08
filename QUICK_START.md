# 🚀 Quick Start Guide

Get your E-Commerce app running in 5 minutes!

## Step 1: Setup Database (2 min)

```bash
# Open MySQL
mysql -u root -p

# Run the schema file
mysql -u root -p < DATABASE_SCHEMA.sql

# Verify
mysql -u root -p
USE ecommerce_db;
SHOW TABLES;
```

## Step 2: Configure Environment (1 min)

```bash
# Copy env file
cp .env.example .env

# Edit .env with your MySQL password
DB_PASS=your_mysql_password
```

## Step 3: Install Dependencies (1 min)

```bash
# Backend
npm install

# Frontend
cd Client
npm install
cd ..
```

## Step 4: Run Application (1 min)

**Terminal 1 - Backend:**
```bash
npm run dev
# Wait for: ✅ Server running on port 5000
```

**Terminal 2 - Frontend:**
```bash
cd Client
npm run dev
# Click link or go to http://localhost:5173
```

## 5️⃣ Done! Start Shopping! 🛍️

### Test the App:
1. Click "Login/Register"
2. Register with email/phone/password
3. Browse products
4. Add items to cart
5. Checkout with address
6. Upload payment proof

## 📝 Important Files

| File | Purpose |
|------|---------|
| `DATABASE_SCHEMA.sql` | Database structure + sample data |
| `.env` | Database credentials |
| `Client/.env` | API URL configuration |
| `DEPLOYMENT_GUIDE.md` | Deploy to Vercel & cloud |

## ❓ Common Issues

### MySQL Error?
```bash
# Check MySQL is running
sudo service mysql status

# Start MySQL
sudo service mysql start
```

### Port 5000 in use?
```bash
PORT=5001 npm run dev
```

### Can't connect to DB?
```bash
# Verify credentials in .env
# Run schema file again
mysql -u root -p < DATABASE_SCHEMA.sql
```

## 🎯 Next Steps

1. ✅ Test locally (current step)
2. 📚 Read `DEPLOYMENT_GUIDE.md` for production
3. 🌐 Deploy frontend to Vercel
4. 🖥️ Deploy backend to Render.com
5. 🗄️ Use cloud database (PlanetScale/AWS RDS)

## 🔗 Useful Links

- **Local App:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Deployment:** See DEPLOYMENT_GUIDE.md
- **Database Schema:** DATABASE_SCHEMA.sql

---

**Everything working?** Great! Explore the DEPLOYMENT_GUIDE for production setup.

**Having issues?** Check the error message and see DEPLOYMENT_GUIDE troubleshooting section.

# E-Commerce Application

A full-stack e-commerce application built with React, Node.js, Express, and MySQL.

## 🎯 Features

- ✅ User Registration & Login with password hashing
- ✅ Product Catalog with filtering by state and category
- ✅ Shopping Cart with add/remove/quantity management
- ✅ Checkout process with address collection
- ✅ Payment proof upload system
- ✅ Order tracking and history
- ✅ Responsive design for mobile and desktop
- ✅ Fallback images for all products
- ✅ Production-ready deployment setup

## 📁 Project Structure

```
E-COMMERCE/
├── Client/                          # React Frontend
│   ├── src/
│   │   ├── App.jsx                 # Main component
│   │   ├── App.css                 # Global styles
│   │   ├── components/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Auth.jsx
│   │   │   └── Checkout.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
├── servers/                         # Node.js Backend
│   ├── server.js                   # Main Express app
│   ├── db.js                       # Database connection
│   ├── routes/
│   │   └── orderRoutes.js
│   └── uploads/                    # Payment proof uploads
├── images/                         # Product images (fallback)
├── DATABASE_SCHEMA.sql            # Database schema & sample data
├── DEPLOYMENT_GUIDE.md            # Complete deployment instructions
├── .env.example                   # Backend environment template
├── package.json                   # Backend dependencies
└── README.md                      # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MySQL database
- npm or yarn

### Installation

1. **Clone and setup:**
```bash
cd E-COMMERCE

# Install backend dependencies
npm install

# Install frontend dependencies
cd Client
npm install
cd ..
```

2. **Database Setup:**
```bash
# Copy environment file
cp .env.example .env

# Update .env with your MySQL credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASS=your_password

# Create database and tables
mysql -u root -p < DATABASE_SCHEMA.sql
```

3. **Run Application:**

Terminal 1 - Backend:
```bash
npm run dev
# Server runs on http://localhost:5000
```

Terminal 2 - Frontend:
```bash
cd Client
npm run dev
# App runs on http://localhost:5173
```

## 📊 Database Schema

### Tables
- **users** - User accounts with password hashing
- **items** - Product catalog with images and pricing
- **cart** - Shopping cart items
- **orders** - Customer orders
- **order_items** - Items in each order
- **addresses** - Delivery addresses
- **payments** - Payment proofs and status

See `DATABASE_SCHEMA.sql` for complete schema with sample data.

## 🔐 Authentication

- Password hashing with bcrypt
- Email-based login
- Session stored in browser localStorage
- JWT-ready architecture

## 📦 API Endpoints

### Products
- `GET /api/items` - All products with optional filters
- `GET /api/items/:id` - Single product
- `GET /api/states` - Available states
- `GET /api/item-types` - Product categories

### Authentication
- `POST /api/register` - New user registration
- `POST /api/login` - User login

### Shopping
- `GET /api/cart/:userId` - User's cart
- `POST /api/cart` - Add to cart
- `DELETE /api/cart/:cartId` - Remove from cart
- `POST /api/orders` - Create order
- `GET /api/orders/:userId` - Order history

### Addresses & Payments
- `POST /api/addresses` - Save address
- `GET /api/addresses/:userId` - User's addresses
- `POST /api/payment` - Upload payment proof

## 🎨 UI Components

- **ProductCard** - Display individual products
- **Cart** - Shopping cart with quantity management
- **Auth** - Login and registration forms
- **Checkout** - Two-step checkout (address + payment)

## 🖼️ Image Handling

- Each product has an image URL from online sources
- Automatic fallback to Unsplash if image fails to load
- Supports both local and external image sources

## 🌐 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import repo on Vercel
3. Set `VITE_API_URL` environment variable
4. Deploy

### Backend (Render.com)
1. Push to GitHub
2. Create new Web Service on Render
3. Set environment variables
4. Deploy

### Database
- Use cloud MySQL service (PlanetScale, AWS RDS, Aiven)
- Update DB credentials in environment variables
- Run `DATABASE_SCHEMA.sql` on cloud database

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

## 🧪 Testing

### Test User Credentials
```
Email: test@example.com
Password: password123
```

Create via `/api/register` endpoint

### Test Product Data
Database includes 6 sample products:
- Fresh Mango (₹150)
- Green Apple (₹120)
- Tomato (₹40)
- Carrot (₹60)
- Onion (₹50)
- Banana (₹80)

## 🛠️ Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=ecommerce_db
DB_PORT=3306
FRONTEND_URL=http://localhost:5173
```

### Frontend (Client/.env)
```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=E-Commerce Store
```

## 🐛 Troubleshooting

**Port already in use:**
```bash
lsof -i :5000  # Find process
kill -9 <PID>  # Kill it
```

**Database connection error:**
- Verify MySQL is running
- Check credentials in .env
- Ensure database exists

**CORS errors:**
- Verify FRONTEND_URL in backend .env
- Check API_URL in frontend .env
- Ensure both servers are running

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 768px, 1024px
- Touch-friendly buttons and inputs
- Optimized for all screen sizes

## 🔒 Security Features

- Password hashing with bcrypt
- SQL injection prevention
- CORS protection
- Input validation
- Error handling
- Environment variables for secrets

## 📈 Performance

- Lazy loading images
- CSS Grid for responsive layout
- Optimized database queries
- Indexed database tables
- Minified production builds

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 📞 Support

For issues or questions:
1. Check `DEPLOYMENT_GUIDE.md`
2. Review error messages in console
3. Verify environment variables
4. Check database connectivity

---

**Happy Shopping!** 🛍️

Built with ❤️ for seamless e-commerce experience

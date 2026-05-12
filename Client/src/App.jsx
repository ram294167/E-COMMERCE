import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import Auth from './components/Auth';
import Checkout from './components/Checkout';
import OrderTracking from './components/OrderTracking';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesRes, productsRes, trendingRes, saleRes] = await Promise.all([
          axios.get(`${API_URL}/api/categories`),
          axios.get(`${API_URL}/api/items`),
          axios.get(`${API_URL}/api/trending-products`),
          axios.get(`${API_URL}/api/sale-products`)
        ]);
        
        setCategories(categoriesRes.data);
        setAllProducts(productsRes.data);
        setDisplayProducts(productsRes.data);
        setTrendingProducts(trendingRes.data);
        setSaleProducts(saleRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Load user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Handle category click
  const handleCategoryClick = async (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/categories/${categoryId}/products`);
      setDisplayProducts(response.data);
      setCurrentPage('home');
    } catch (error) {
      console.error('Error fetching category products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (query) => {
    setSearchQuery(query);
    setSelectedCategory(null);

    if (!query || query.length < 2) {
      setDisplayProducts(allProducts);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/search`, { params: { q: query } });
      setDisplayProducts(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show all products
  const handleShowAll = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setDisplayProducts(allProducts);
  };

  const selectedCategoryObj = categories.find(category => category.id === selectedCategory);

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCart([]);
    setCurrentPage('home');
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 onClick={() => { setCurrentPage('home'); handleShowAll(); }} style={{ cursor: 'pointer' }}>
            🛍️ ShopHub
          </h1>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products, brands, and more..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <nav className="nav">
            <button 
              onClick={() => setCurrentPage('home')}
              className={currentPage === 'home' ? 'active' : ''}
            >
              Home
            </button>

            <button 
              onClick={() => setCurrentPage('cart')}
              className={currentPage === 'cart' ? 'active' : ''}
            >
              🛒 Cart
              {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </button>

            {user && (
              <button 
                onClick={() => setCurrentPage('orders')}
                className={currentPage === 'orders' ? 'active' : ''}
              >
                📦 Orders
              </button>
            )}

            {user ? (
              <div className="user-info">
                <span className="user-name">👤 {user.name}</span>
                <button onClick={handleLogout} style={{ color: '#ef4444' }}>Logout</button>
              </div>
            ) : (
              <button 
                onClick={() => setCurrentPage('auth')}
                className={currentPage === 'auth' ? 'active' : ''}
              >
                Login
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="main">
        {loading && <div className="loading">⏳ Loading awesome products...</div>}

        {currentPage === 'home' && !loading && (
          <div className="home">
            {/* Categories Section */}
            {!selectedCategory && !searchQuery && (
              <div className="categories-section">
                <h2 className="section-title">📂 Shop by Category</h2>
                <div className="categories-grid">
                  {categories.map(category => (
                    <div
                      key={category.id}
                      className="category-card"
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <img src={category.image} alt={category.name} />
                      <div className="icon">{category.icon}</div>
                      <h3>{category.name}</h3>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Products */}
            {!selectedCategory && !searchQuery && trendingProducts.length > 0 && (
              <div className="products-section">
                <h2 className="section-title">⭐ Trending Now</h2>
                <div className="products-grid">
                  {trendingProducts.slice(0, 8).map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sale Products */}
            {!selectedCategory && !searchQuery && saleProducts.length > 0 && (
              <div className="products-section">
                <h2 className="section-title">🔥 Great Deals & Offers</h2>
                <div className="products-grid">
                  {saleProducts.slice(0, 8).map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Main Products Grid */}
            {(selectedCategory || searchQuery) && (
              <div className="products-section">
                <div className="products-header">
                  <h2 className="section-title">
                    {searchQuery
                      ? `🔍 Search Results for "${searchQuery}"`
                      : selectedCategoryObj
                        ? `📦 Products in ${selectedCategoryObj.name}`
                        : '📦 Products'
                    }
                  </h2>
                  {selectedCategory && (
                    <button className="back-button" onClick={handleShowAll}>
                      ← Back to categories
                    </button>
                  )}
                </div>
                {displayProducts.length === 0 ? (
                  <p style={{ textAlign: 'center', padding: '2rem', color: '#878787' }}>
                    No products found. Try searching for something else!
                  </p>
                ) : (
                  <div className="products-grid">
                    {displayProducts.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {!selectedCategory && !searchQuery && displayProducts.length > 0 && (
              <div className="products-section">
                <h2 className="section-title">📦 All Products</h2>
                <div className="products-grid">
                  {displayProducts.slice(0, 12).map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentPage === 'cart' && !loading && (
          user ? (
            <Cart
              cart={cart}
              onRemove={handleRemoveFromCart}
              user={user}
              onCheckout={() => setCurrentPage('checkout')}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <h2>Please login to view your cart</h2>
              <button 
                onClick={() => setCurrentPage('auth')}
                style={{
                  marginTop: '1rem',
                  padding: '0.8rem 1.5rem',
                  background: '#2874f0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Login Now
              </button>
            </div>
          )
        )}

        {currentPage === 'checkout' && user && !loading && (
          <Checkout
            cart={cart}
            user={user}
            onSuccess={() => {
              setCart([]);
              setCurrentPage('home');
            }}
            apiUrl={API_URL}
          />
        )}

        {currentPage === 'auth' && !user && !loading && (
          <Auth onLogin={handleLogin} apiUrl={API_URL} />
        )}

        {currentPage === 'orders' && user && !loading && (
          <OrderTracking user={user} />
        )}
      </main>

      <footer style={{ background: '#2874f0', color: 'white', textAlign: 'center', padding: '2rem', marginTop: '2rem' }}>
        <p>&copy; 2024 ShopHub. All rights reserved. | Your trusted online shopping destination</p>
      </footer>
    </div>
  );
}

export default App;

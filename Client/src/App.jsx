import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import Auth from './components/Auth';
import Checkout from './components/Checkout';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/items`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // Load user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

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
          <h1 onClick={() => setCurrentPage('home')} style={{ cursor: 'pointer' }}>
            🛍️ E-Commerce Store
          </h1>
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
              Cart ({cart.length})
            </button>
            {user ? (
              <>
                <span className="user-name">Hi, {user.name}!</span>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <button 
                onClick={() => setCurrentPage('auth')}
                className={currentPage === 'auth' ? 'active' : ''}
              >
                Login/Register
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="main">
        {loading && <div className="loading">Loading...</div>}

        {currentPage === 'home' && (
          <div className="home">
            <h2>Featured Products</h2>
            <div className="products-grid">
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        )}

        {currentPage === 'cart' && user && (
          <Cart 
            cart={cart}
            onRemove={handleRemoveFromCart}
            user={user}
            onCheckout={() => setCurrentPage('checkout')}
          />
        )}

        {currentPage === 'checkout' && user && (
          <Checkout 
            cart={cart}
            user={user}
            onSuccess={() => {
              setCart([]);
              setCurrentPage('home');
            }}
          />
        )}

        {currentPage === 'auth' && !user && (
          <Auth onLogin={handleLogin} apiUrl={API_URL} />
        )}
      </main>

      <footer className="footer">
        <p>&copy; 2024 E-Commerce Store. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;

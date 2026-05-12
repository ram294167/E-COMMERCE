import React, { useState } from 'react';

const Cart = ({ cart, onRemove, user, onCheckout }) => {
  const [quantities, setQuantities] = useState(
    cart.reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})
  );

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity > 0) {
      setQuantities({ ...quantities, [productId]: newQuantity });
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.cost * quantities[item.id]), 0);
  const fallbackImage = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop';

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>🛒 Your cart is empty</h2>
        <p style={{ color: '#878787', marginTop: '1rem', fontSize: '1.05rem' }}>
          Start shopping to add items to your cart!
        </p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-items">
        <h2>🛒 Shopping Cart ({cart.length} items)</h2>

        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">
              <img
                src={item.image || fallbackImage}
                alt={item.name}
                onError={(e) => e.target.src = fallbackImage}
              />
            </div>

            <div className="cart-item-details">
              <h3 className="cart-item-name">{item.name}</h3>
              <div className="cart-item-price">
                ₹{item.cost.toLocaleString('en-IN')}
              </div>

              <div className="quantity-control">
                <button
                  type="button"
                  className="quantity-btn"
                  disabled={quantities[item.id] <= 1}
                  onClick={() => updateQuantity(item.id, quantities[item.id] - 1)}
                >
                  ➖
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantities[item.id]}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10) || 1)}
                  className="quantity-input"
                />
                <button
                  type="button"
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, quantities[item.id] + 1)}
                >
                  ➕
                </button>
              </div>

              <button className="remove-btn" onClick={() => onRemove(item.id)}>
                Remove from Cart
              </button>
            </div>

            <div style={{ textAlign: 'right', fontWeight: '700', fontSize: '1.1rem' }}>
              ₹{(item.cost * quantities[item.id]).toLocaleString('en-IN')}
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Order Summary</h3>

        <div className="summary-item">
          <span>Subtotal ({cart.length} items)</span>
          <span>₹{total.toLocaleString('en-IN')}</span>
        </div>

        <div className="summary-item">
          <span>Shipping</span>
          <span style={{ color: '#10b981' }}>FREE</span>
        </div>

        <div className="summary-item">
          <span>Discount</span>
          <span style={{ color: '#10b981' }}>-₹{(total * 0.05).toLocaleString('en-IN')}</span>
        </div>

        <div className="summary-total">
          <span>Total Amount</span>
          <span>₹{(total * 0.95).toLocaleString('en-IN')}</span>
        </div>

        <button className="btn-checkout" onClick={onCheckout}>
          ✓ Proceed to Checkout
        </button>

        <p style={{ fontSize: '0.85rem', color: '#878787', marginTop: '1rem', textAlign: 'center' }}>
          Cash on Delivery Available | Secure Checkout
        </p>
      </div>
    </div>
  );
};

export default Cart;

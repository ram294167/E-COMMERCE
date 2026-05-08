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
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Start shopping to add items to your cart!</p>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <img 
              src={item.image || fallbackImage} 
              alt={item.name}
              onError={(e) => e.target.src = fallbackImage}
            />
            <div className="item-details">
              <h4>{item.name}</h4>
              <p>Price: ₹{item.cost}</p>
            </div>
            <div className="item-quantity">
              <button onClick={() => updateQuantity(item.id, quantities[item.id] - 1)}>-</button>
              <span>{quantities[item.id]}</span>
              <button onClick={() => updateQuantity(item.id, quantities[item.id] + 1)}>+</button>
            </div>
            <div className="item-total">
              ₹{item.cost * quantities[item.id]}
            </div>
            <button 
              className="btn-remove"
              onClick={() => onRemove(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Total: ₹{total.toFixed(2)}</h3>
        <button className="btn-checkout" onClick={onCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;

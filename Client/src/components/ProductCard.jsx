import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  const fallbackImage = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop';

  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={product.image || fallbackImage} 
          alt={product.name}
          onError={(e) => e.target.src = fallbackImage}
        />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="description">{product.description}</p>
        <div className="product-footer">
          <span className="price">₹{product.cost}</span>
          <button 
            className="btn-add-to-cart"
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

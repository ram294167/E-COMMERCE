import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  const fallbackImage = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop';

  const renderStars = (rating) => {
    const stars = '⭐'.repeat(Math.floor(rating));
    return stars;
  };

  const currentPrice = product.cost || product.original_price || 0;
  const originalPrice = product.original_price || currentPrice;
  const discount = product.discount || 0;

  return (
    <div className="product-card">
      <div className="product-image">
        <img
          src={product.image || fallbackImage}
          alt={product.name}
          onError={(e) => e.target.src = fallbackImage}
        />
        {discount > 0 && (
          <span className="product-badge">{discount}% OFF</span>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        {product.rating && product.reviews && (
          <div className="product-rating">
            <span className="stars">{renderStars(product.rating)}</span>
            <span className="rating-value">{product.rating}</span>
            <span className="review-count">({product.reviews})</span>
          </div>
        )}

        <div className="product-price">
          <span className="current-price">₹{currentPrice.toLocaleString('en-IN')}</span>
          {originalPrice > currentPrice && (
            <>
              <span className="original-price">₹{originalPrice.toLocaleString('en-IN')}</span>
              {discount > 0 && <span className="discount-tag">{discount}% off</span>}
            </>
          )}
        </div>

        <button
          className="btn-add-to-cart"
          onClick={() => onAddToCart(product)}
        >
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

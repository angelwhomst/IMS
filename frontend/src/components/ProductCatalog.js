import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom for navigation
import "./ProductCatalog.css"; // Import CSS for the product catalog

const ProductCatalog = () => {
  return (
    <div>
      <br></br>
      <br></br>
      <h1 className="catalog-header">Shoe Collection</h1>
      <br></br>

      {/* Image Grid for Product Links */}
      <div className="image-grid">
        <Link to="/mens-leather-shoes" className="image-link">
          <div className="image-item">
            <img
              src="https://ottoshoes.com.ph/cdn/shop/files/10500295Black2_540x.jpg?v=1722291562"
              alt="Black Men’s Leather Shoes"
              className="image"
            />
            <p className="image-text">Men’s Leather Shoes</p>
          </div>
        </Link>

        <Link to="/womens-leather-shoes" className="image-link">
          <div className="image-item">
            <img
              src="https://ottoshoes.com.ph/cdn/shop/files/20500353BlackSnake2_540x.jpg?v=1723183776"
              alt="Black Snake Women’s Leather Shoes"
              className="image"
            />
            <p className="image-text">Women’s Leather Shoes</p>
          </div>
        </Link>

        <Link to="/boys-leather-shoes" className="image-link">
          <div className="image-item">
            <img
              src="https://ottoshoes.com.ph/cdn/shop/files/31700011Black2_540x.jpg?v=1722469947"
              alt="Black Boy’s Leather Shoes"
              className="image"
            />
            <p className="image-text">Boy’s Leather Shoes</p>
          </div>
        </Link>

        <Link to="/girls-leather-shoes" className="image-link">
          <div className="image-item">
            <img
              src="https://ottoshoes.com.ph/cdn/shop/files/41700008Black2_540x.jpg?v=1721202573"
              alt="Black Girl’s Leather Shoes"
              className="image"
            />
            <p className="image-text">Girl’s Leather Shoes</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductCatalog;

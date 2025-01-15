import React, { useState } from "react";
import "./EmployeeSales.css";

const EmployeeSales = () => {
  const [products] = useState([
    // Women's Leather Shoes
    { productName: "Isabella", price: "$75.00", category: "Women's Leather Shoes", size: "7", image: "https://via.placeholder.com/150" },
    { productName: "Sophia", price: "$80.00", category: "Women's Leather Shoes", size: "8", image: "https://via.placeholder.com/150" },
    { productName: "Olivia", price: "$85.00", category: "Women's Leather Shoes", size: "9", image: "https://via.placeholder.com/150" },
    { productName: "Emma", price: "$70.00", category: "Women's Leather Shoes", size: "6", image: "https://via.placeholder.com/150" },

    // Men's Leather Shoes
    { productName: "Michael", price: "$85.00", category: "Men's Leather Shoes", size: "9", image: "https://via.placeholder.com/150" },
    { productName: "David", price: "$90.00", category: "Men's Leather Shoes", size: "10", image: "https://via.placeholder.com/150" },
    { productName: "James", price: "$95.00", category: "Men's Leather Shoes", size: "11", image: "https://via.placeholder.com/150" },
    { productName: "John", price: "$100.00", category: "Men's Leather Shoes", size: "12", image: "https://via.placeholder.com/150" },

    // Boys' Leather Shoes
    { productName: "Oliver", price: "$45.00", category: "Boys' Leather Shoes", size: "6", image: "https://via.placeholder.com/150" },
    { productName: "Liam", price: "$50.00", category: "Boys' Leather Shoes", size: "7", image: "https://via.placeholder.com/150" },
    { productName: "Ethan", price: "$55.00", category: "Boys' Leather Shoes", size: "8", image: "https://via.placeholder.com/150" },
    { productName: "Mason", price: "$60.00", category: "Boys' Leather Shoes", size: "9", image: "https://via.placeholder.com/150" },

    // Girls' Leather Shoes
    { productName: "Emma", price: "$60.00", category: "Girls' Leather Shoes", size: "5", image: "https://via.placeholder.com/150" },
    { productName: "Ava", price: "$65.00", category: "Girls' Leather Shoes", size: "6", image: "https://via.placeholder.com/150" },
    { productName: "Sophia", price: "$70.00", category: "Girls' Leather Shoes", size: "7", image: "https://via.placeholder.com/150" },
    { productName: "Mia", price: "$75.00", category: "Girls' Leather Shoes", size: "8", image: "https://via.placeholder.com/150" },
    // ... other products
  ]);

  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category

  // Get all unique categories from products
  const categories = [...new Set(products.map((product) => product.category))];

  const addToCart = (product) => {
    const existing = cart.find((item) => item.productName === product.productName);
    setCart(
      existing
        ? cart.map((item) => (item.productName === product.productName ? { ...item, quantity: item.quantity + 1 } : item))
        : [...cart, { ...product, quantity: 1 }]
    );
  };

  const updateQuantity = (name, quantity) => {
    setCart(cart.map((item) => (item.productName === name ? { ...item, quantity: Math.max(quantity, 1) } : item)));
  };

  const removeItem = (name) => {
    setCart(cart.filter((item) => item.productName !== name));
  };

  const clearCart = () => setCart([]);

  const calculateTotal = () => cart.reduce((total, item) => total + parseFloat(item.price.slice(1)) * item.quantity, 0);

  return (
    <div className="employee-sales-container">
      <div className="employee-sales-products-container">
        <div className="employee-sales-category-dropdown">
          <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <h2 className="employee-sales-category-header">{selectedCategory || "All Products"}</h2>

        <div className="employee-sales-products-grid">
          {products
            .filter((product) => selectedCategory === "" || product.category === selectedCategory)
            .map((product, index) => (
              <div key={index} className="employee-sales-product-card">
                <img src={product.image} alt={product.productName} />
                <h3 className="employee-sales-product-name">{product.productName}</h3>
                <p className="employee-sales-product-price">{product.price}</p>
                <button
                  className="employee-sales-add-to-cart-btn"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
        </div>
      </div>

      <div className="employee-sales-order-summary">
        <h2 className="employee-sales-summary-header">Order Summary</h2>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {/* Header for Order Summary */}
            <div className="employee-sales-order-summary-header">
              <span>Name</span>
              <span>Size</span>
              <span>Category</span>
              <span>Quantity</span>
              <span>Price</span>
            </div>

            {cart.map((item, index) => (
              <div key={index} className="employee-sales-order-item">
                <span className="employee-sales-item-name">{item.productName}</span>

                <div className="employee-sales-item-size">
                  <input type="text" placeholder={item.size} readOnly />
                </div>

                <div className="employee-sales-item-category">
                  <input type="text" placeholder={item.category} readOnly />
                </div>

                <div className="employee-sales-item-quantity">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.productName, +e.target.value)}
                  />
                </div>

                <span className="employee-sales-item-price" style={{ marginLeft: "auto", marginRight: "20px" }}>
                  {`$${(parseFloat(item.price.slice(1)) * item.quantity).toFixed(2)}`}
                </span>

                <button className="employee-sales-remove-btn" onClick={() => removeItem(item.productName)}>
                  Remove
                </button>
              </div>
            ))}
          </>
        )}

        <div className="employee-sales-total">
          <span>Total:</span>
          <span>${calculateTotal().toFixed(2)}</span>
        </div>
        <div className="employee-sales-buttons">
          <button className="employee-sales-clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
          <button className="employee-sales-checkout-btn">Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSales;
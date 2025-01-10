import React, { useState } from "react";
import "./EmployeeSales.css";

const EmployeeSales = () => {
  const [products] = useState([
    // Women's Leather Shoes
    { productName: "Isabella", price: "$75.00", category: "Women's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Sophia", price: "$80.00", category: "Women's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Emma", price: "$85.00", category: "Women's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Olivia", price: "$90.00", category: "Women's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Amelia", price: "$65.00", category: "Women's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Charlotte", price: "$70.00", category: "Women's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Ava", price: "$75.00", category: "Women's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Mia", price: "$60.00", category: "Women's Leather Shoes", image: "https://via.placeholder.com/150" },

    // Men's Leather Shoes
    { productName: "Ethan", price: "$85.00", category: "Men's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Mason", price: "$90.00", category: "Men's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "James", price: "$95.00", category: "Men's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Logan", price: "$80.00", category: "Men's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Alexander", price: "$88.00", category: "Men's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Jackson", price: "$75.00", category: "Men's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Lucas", price: "$85.00", category: "Men's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Henry", price: "$90.00", category: "Men's Leather Shoes", image: "https://via.placeholder.com/150" },

    // Girl's Leather Shoes
    { productName: "Sophia", price: "$50.00", category: "Girl's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Emily", price: "$55.00", category: "Girl's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Ava", price: "$52.00", category: "Girl's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Luna", price: "$58.00", category: "Girl's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Zoe", price: "$60.00", category: "Girl's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Chloe", price: "$53.00", category: "Girl's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Ella", price: "$54.00", category: "Girl's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Grace", price: "$56.00", category: "Girl's Leather Shoes", image: "https://via.placeholder.com/150" },

    // Boy's Leather Shoes
    { productName: "Liam", price: "$65.00", category: "Boy's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Noah", price: "$68.00", category: "Boy's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Oliver", price: "$72.00", category: "Boy's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "William", price: "$70.00", category: "Boy's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Benjamin", price: "$75.00", category: "Boy's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Jack", price: "$80.00", category: "Boy's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Michael", price: "$78.00", category: "Boy's Leather Shoes", image: "https://via.placeholder.com/150" },
    { productName: "Elijah", price: "$77.00", category: "Boy's Leather Shoes", image: "https://via.placeholder.com/150" },
  ]);

  const [cart, setCart] = useState([]);

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
        {["Women's Leather Shoes", "Men's Leather Shoes", "Girl's Leather Shoes", "Boy's Leather Shoes"].map(
          (category) => (
            <div key={category}>
              <h2 className="employee-sales-category-header">{category}</h2>
              <div className="employee-sales-products-grid">
                {products
                  .filter((product) => product.category === category)
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
          )
        )}
      </div>

      <div className="employee-sales-order-summary">
        <h2 className="employee-sales-summary-header">Order Summary</h2>
        {cart.length === 0 ? (
  <p>Your cart is empty.</p>
) : (
  cart.map((item, index) => (
    <div key={index} className="employee-sales-order-item">
      <span className="employee-sales-item-name">{item.productName}</span>
      
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
  ))
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

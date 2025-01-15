import React, { useState, useEffect } from "react";
import axios from "axios";
import * as Yup from 'yup'; // for validation
import "./EmployeeSales.css";

const EmployeeSales = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    setCategories([
      "All Categories",
      "Women's Leather Shoes",
      "Men's Leather Shoes",
      "Boys' Leather Shoes",
      "Girls' Leather Shoes",
    ]);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Unauthorized: No access token found.");
        return;
      }

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/employee-sales/sales/products?category=${encodeURIComponent(
            selectedCategory
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched products:", response.data.products); // Log the products to debug  
        setProducts(response.data.products || []);
        setError(null);
      } catch (error) {
        if (error.response?.status === 401) {
          setError("Unauthorized: Please log in.");
        } else {
          setError("Failed to fetch products.");
        }
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.productName === product.productName);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productName === product.productName
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          size: product.size || "Unknown Size",
          category: product.category || "Unknown Category",
          quantity: 1,
          price: typeof product.price === "string"
            ? parseFloat(product.price.replace(/[^\d.-]/g, "")) 
            : product.price,
        },
      ]);
    }
  };
  

  const updateCategory = (name, newCategory) => {
    setCart(cart.map((item) =>
      item.productName === name ? { ...item, category: newCategory } : item
    ));
  };

  const updateQuantity = (name, quantity) => {
    if (quantity < 1) return; // Prevent quantity from dropping below 1
    setCart(cart.map((item) => (item.productName === name ? { ...item, quantity } : item)));
  };

  const removeItem = (name) => {
    setCart(cart.filter((item) => item.productName !== name));
  };

  const clearCart = () => setCart([]);

  const calculateTotal = () =>
    cart.reduce((total, item) => {
      // Ensure price is a number
      const price = typeof item.price === "string"
        ? parseFloat(item.price.replace(/[^\d.-]/g, "")) // Remove non-numeric characters if price is a string
        : item.price;
  
      return total + price * item.quantity;
    }, 0);

  const checkoutSchema = Yup.object().shape({
    cart: Yup.array().of(
      Yup.object().shape({
        productName: Yup.string().required("Product name is required."),
        category: Yup.string().required("Category is required."),
        size: Yup.string().required("Size is required."),
        quantity: Yup.number().min(1, "Quantity must be at least 1").required("Quantity is required."),
      })
    ).min(1, "Your cart cannot be empty."),
  }); //

  // Function to send the cart data to the backend /sales/cart endpoint
  const saveCartToBackend = async () => {  
    const token = localStorage.getItem("access_token");  
    if (!token) {  
        setError("Unauthorized: No access token found.");  
        return;  
    }  

    try {  
        // Send each cart item to the backend  
        for (const item of cart) {  
            await axios.post(  
                "http://127.0.0.1:8000/employee-sales/sales/cart",  
                {  
                    productName: item.productName,  
                    category: item.category,  
                    size: item.size,  
                    quantity: item.quantity,  
                    price: parseFloat(item.price), // Ensure price is a number  
                },  
                {  
                    headers: {  
                        Authorization: `Bearer ${token}`,  
                    },  
                }  
            );  
        }  
        setError(null); // Clear previous errors  
    } catch (error) {  
        console.error("Error saving cart:", error);  
        setError("Failed to save cart to the backend.");  
    }  
};  

const handleCheckout = async () => {  
  const token = localStorage.getItem("access_token");  
  if (!token) {  
      setError("Unauthorized: No access token found.");  
      return;  
  }  

  if (cart.length === 0) {  
      setError("Your cart is empty. Please add items to your cart.");  
      return;  
  }  

  const checkoutData = {  
      cart: cart.map(({ productName, category, size, quantity, price }) => ({  
          productName,  
          category,  
          size,  
          quantity,  
          price: parseFloat(price), // Ensure price is a number  
      })),  
  };  

  try {  
      // Validate cart using Yup schema  
      await checkoutSchema.validate(checkoutData, { abortEarly: false });  

      // First, send the cart to the backend /sales/cart  
      await saveCartToBackend();  

      // Then, proceed with the checkout request  
      const response = await axios.post(  
          "http://127.0.0.1:8000/employee-sales/sales/checkout",  
          checkoutData,  
          {  
              headers: {  
                  Authorization: `Bearer ${token}`,  
              },  
          }  
      );  

      setSuccessMessage(response.data.message || "Checkout successful!");  
      setCart([]); // Clear the cart after successful checkout  
      setError(null);  
  } catch (error) {  
      if (error.name === "ValidationError") {  
          setError(error.errors.join(", "));  
      } else if (error.response?.status === 401) {  
          setError("Unauthorized: Please log in.");  
      } else if (error.response?.status === 400) {  
          setError(error.response.data.detail || "Checkout failed.");  
      } else {  
          setError("An error occurred during checkout.");  
      }  
  }  
};
  

  return (
    <div className="employee-sales-container">
      <div className="employee-sales-products-container">
      <div className="employee-sales-category-dropdown">
  <select
    onChange={(e) => {
      e.preventDefault(); // Prevent default browser behavior
      setSelectedCategory(e.target.value);
    }}
    value={selectedCategory}
  >
    {categories.map((category) => (
      <option key={category} value={category}>
        {category}
      </option>
    ))}
  </select>
</div>


        <h2 className="employee-sales-category-header">{selectedCategory}</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="employee-sales-products-grid">
          {products.map((product, index) => (
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

        {successMessage && <div className="success-message">{successMessage}</div>}

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
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
                  <input
                    type="text"
                    value={item.category}
                    
                  />
                </div>
                <div className="employee-sales-item-quantity">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.productName, +e.target.value)}
                  />
                </div>
                <span className="employee-sales-item-price">
                  {`₱${(parseFloat(item.price) * item.quantity).toFixed(2)}`}
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
          <span>₱{calculateTotal().toFixed(2)}</span>
        </div>
        <div className="employee-sales-buttons">
          <button className="employee-sales-clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
          <button className="employee-sales-checkout-btn" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSales;

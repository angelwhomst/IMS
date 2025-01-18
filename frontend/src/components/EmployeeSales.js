<<<<<<< HEAD
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
=======
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
>>>>>>> IMS-DASH/master
  };

  const removeItem = (name) => {
    setCart(cart.filter((item) => item.productName !== name));
  };

  const clearCart = () => setCart([]);

<<<<<<< HEAD
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
  
=======
  const calculateTotal = () => cart.reduce((total, item) => total + parseFloat(item.price.slice(1)) * item.quantity, 0);
>>>>>>> IMS-DASH/master

  return (
    <div className="employee-sales-container">
      <div className="employee-sales-products-container">
<<<<<<< HEAD
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
=======
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
>>>>>>> IMS-DASH/master
        </div>
      </div>

      <div className="employee-sales-order-summary">
        <h2 className="employee-sales-summary-header">Order Summary</h2>

<<<<<<< HEAD
        {successMessage && <div className="success-message">{successMessage}</div>}

=======
>>>>>>> IMS-DASH/master
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
<<<<<<< HEAD
=======
            {/* Header for Order Summary */}
>>>>>>> IMS-DASH/master
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
<<<<<<< HEAD
                <div className="employee-sales-item-size">
                  <input type="text" placeholder={item.size} readOnly />
                </div>
                <div className="employee-sales-item-category">
                  <input
                    type="text"
                    value={item.category}
                    
                  />
                </div>
=======

                <div className="employee-sales-item-size">
                  <input type="text" placeholder={item.size} readOnly />
                </div>

                <div className="employee-sales-item-category">
                  <input type="text" placeholder={item.category} readOnly />
                </div>

>>>>>>> IMS-DASH/master
                <div className="employee-sales-item-quantity">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.productName, +e.target.value)}
                  />
                </div>
<<<<<<< HEAD
                <span className="employee-sales-item-price">
                  {`₱${(parseFloat(item.price) * item.quantity).toFixed(2)}`}
                </span>
=======

                <span className="employee-sales-item-price" style={{ marginLeft: "auto", marginRight: "20px" }}>
                  {`$${(parseFloat(item.price.slice(1)) * item.quantity).toFixed(2)}`}
                </span>

>>>>>>> IMS-DASH/master
                <button className="employee-sales-remove-btn" onClick={() => removeItem(item.productName)}>
                  Remove
                </button>
              </div>
            ))}
          </>
        )}

        <div className="employee-sales-total">
          <span>Total:</span>
<<<<<<< HEAD
          <span>₱{calculateTotal().toFixed(2)}</span>
=======
          <span>${calculateTotal().toFixed(2)}</span>
>>>>>>> IMS-DASH/master
        </div>
        <div className="employee-sales-buttons">
          <button className="employee-sales-clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
<<<<<<< HEAD
          <button className="employee-sales-checkout-btn" onClick={handleCheckout}>
            Checkout
          </button>
=======
          <button className="employee-sales-checkout-btn">Checkout</button>
>>>>>>> IMS-DASH/master
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default EmployeeSales;
=======
export default EmployeeSales;
>>>>>>> IMS-DASH/master

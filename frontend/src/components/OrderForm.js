import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrderForm.css";
import AddNewAddressModal from "./AddNewAddressModal";

const OrderForm = () => {
    const [products, setProducts] = useState([]); // Stores product names
    const [sizes, setSizes] = useState([]);
    const [warehouse, setWarehouse] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [recipientName, setRecipientName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
  
    // Placeholder product image
    const imageSrc = "https://via.placeholder.com/150";
  
    // Retrieve token from localStorage
    const getToken = () => localStorage.getItem("access_token");
  
    // Fetch product names
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const token = getToken();
          const response = await axios.get("http://127.0.0.1:8000/purchase-order/product-names", {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          if (response.status === 200 && Array.isArray(response.data)) {
            setProducts(response.data); // Only product names
          } else {
            setProducts([]);
            setError("Invalid product data received.");
          }
        } catch (error) {
          setProducts([]);
          setError("Error fetching products.");
          console.error("Error fetching products:", error);
        }
      };
  
      fetchProducts();
    }, []);
  
    // Fetch warehouse address
    useEffect(() => {
      const fetchWarehouse = async () => {
        try {
          const token = getToken();
          const response = await axios.get("http://127.0.0.1:8000/purchase-order/warehouse-address", {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          if (response.status === 200) {
            setWarehouse(response.data);
            setDeliveryAddress(response.data.address);
          } else {
            setWarehouse(null);
            setError("Invalid warehouse data received.");
          }
        } catch (error) {
          setWarehouse(null);
          setError("Error fetching warehouse data.");
          console.error("Error fetching warehouse data:", error);
        }
      };
  
      fetchWarehouse();
    }, []);
  
    // Handle product selection & fetch sizes
    const handleProductChange = async (event) => {
      const selectedProductName = event.target.value;
      setSelectedProduct(selectedProductName);
      setSelectedSize(""); // Reset size when product changes
  
      if (!selectedProductName) {
        setSizes([]);
        return;
      }
  
      try {
        const token = getToken();
        const response = await axios.get(
          `http://127.0.0.1:8000/purchase-order/get-product-sizes/${encodeURIComponent(selectedProductName)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        if (response.status === 200 && Array.isArray(response.data.sizes)) {
          setSizes(response.data.sizes);
        } else {
          setSizes([]);
        }
      } catch (error) {
        setSizes([]);
        console.error("Error fetching product sizes:", error);
      }
    };
  
    // Handle form submission
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      if (!selectedProduct || !selectedSize || !quantity || !recipientName || !phoneNumber || !email || !deliveryAddress) {
        setError("Please fill in all required fields.");
        return;
      }
  
      try {
        const token = getToken();
        
        // Fetch product details separately (if needed)
        const response = await axios.get(
          `http://127.0.0.1:8000/purchase-order/get-product-details/${encodeURIComponent(selectedProduct)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        if (response.status !== 200) {
          setError("Error fetching product details.");
          return;
        }
  
        const productDetails = response.data;
  
        const orderData = {
          productName: selectedProduct,  // This is @productName
          productID: productDetails.productID, // If backend requires it
          size: selectedSize,
          category: productDetails.category,
          quantity: quantity,
          warehouseID: warehouse ? warehouse.warehouseID : null,
          warehouseName: warehouse ? warehouse.warehouseName : "",
          building: warehouse ? warehouse.building : "",
          street: warehouse ? warehouse.street : "",
          barangay: warehouse ? warehouse.barangay : "",
          city: warehouse ? warehouse.city : "",
          country: warehouse ? warehouse.country : "",
          zipcode: warehouse ? warehouse.zipcode : "",
          userID: localStorage.getItem("user_id"),
        };
  
        const orderResponse = await axios.post(
          "http://127.0.0.1:8000/create-purchase-order",
          orderData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        if (orderResponse.status === 200) {
          alert("Order submitted successfully!");
          setSelectedProduct("");
          setSelectedSize("");
          setQuantity(1);
          setDeliveryAddress("");
          setRecipientName("");
          setPhoneNumber("");
          setEmail("");
        } else {
          setError("Failed to submit order.");
        }
      } catch (error) {
        setError("Error submitting order.");
        console.error("Error submitting order:", error);
      }
    };
  
  

  return (
    <div className="order-form-container">
      <div className="order-form">
        <h2 className="form-title">Order Form</h2>

        {/* Product Image */}
        <div className="product-image-container">
          <img src={imageSrc} alt="Product" className="product-image" />
        </div>

        {/* Product Dropdown */}
        <div className="form-group">
          <label>Product Name</label>
          <select value={selectedProduct} onChange={handleProductChange}>
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product.productID} value={product.productName}>
                {product.productName}
              </option>
            ))}
          </select>
        </div>

        {/* Product Size */}
        <div className="form-group">
          <label>Product Size</label>
          <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
            <option value="">Select Size</option>
            {sizes.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div className="form-group">
          <label>Quantity</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} min="1" />
        </div>

        {/* Delivery Address */}
        <div className="form-group">
          <label>Delivery Address</label>
          <input type="text" value={deliveryAddress} readOnly />
        </div>

        {/* Recipient Details */}
        <div className="form-group">
          <label>Recipient Name</label>
          <input type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Enter Recipient Name" />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Enter Phone Number" />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email Address" />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn" onClick={handleSubmit}>
          Submit Order
        </button>
      </div>
    </div>
  );
};

export default OrderForm;

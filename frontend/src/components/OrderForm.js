import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderForm.css';
import AddNewAddressModal from './AddNewAddressModal';

const OrderForm = () => {
  const [productName, setProductName] = useState("");
  const [productSize, setProductSize] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [products, setProducts] = useState([]);
  const [productSizes, setProductSizes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchWarehouses();
    fetchCurrentUser();
}, []);

const fetchProducts = async () => {
  try {
    const token = localStorage.getItem("access_token"); // Get token
    if (!token) {
      console.error("No access token found.");
      return;
    }

   const response = await axios.get("https://ims-wc58.onrender.com/purchase-order/dropdown-data/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setProducts(response.data.products);
  } catch (err) {
    console.error("Error fetching products:", err);
  }
};

const fetchWarehouses = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No access token found.");
      return;
    }

    const response = await axios.get("https://ims-wc58.onrender.com/purchase-order/dropdown-data/warehouses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setWarehouses(response.data.warehouses);
  } catch (err) {
    console.error("Error fetching warehouses:", err);
  }
};

const fetchProductSizes = async (selectedProductName) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No access token found.");
      return;
    }

    const response = await axios.get(`https://ims-wc58.onrender.com/purchase-order/get-product-sizes/${selectedProductName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setProductSizes(response.data.sizes);
  } catch (err) {
    console.error("Error fetching product sizes:", err);
  }
};

const fetchCurrentUser = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No access token found.");
      return;
    }

    const response = await axios.get("https://ims-wc58.onrender.com/purchase-order/current-user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setCurrentUser(response.data);
  } catch (err) {
    console.error("Error fetching current user:", err);
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!currentUser) {
    setError("Please login to place an order.");
    return;
  }

  const selectedWarehouseData = warehouses.find(w => w.warehouseName === selectedWarehouse);
  if (!selectedWarehouseData) {
    setError("Please select a valid warehouse.");
    return;
  }

  const payload = {
    productName,
    size: productSize,
    category: productCategory,
    quantity,
    warehouseName: selectedWarehouseData.warehouseName,
    building: selectedWarehouseData.fullAddress.split(", ")[0],
    street: selectedWarehouseData.fullAddress.split(", ")[1],
    barangay: selectedWarehouseData.fullAddress.split(", ")[2],
    city: selectedWarehouseData.fullAddress.split(", ")[3],
    country: selectedWarehouseData.fullAddress.split(", ")[4],
    zipcode: selectedWarehouseData.fullAddress.split(", ")[5],
    userID: currentUser.userID,
  };

  try {
    const token = localStorage.getItem("access_token"); // Get latest token
    if (!token) {
      console.error("No access token found.");
      setError("Authentication error. Please login again.");
      return;
    }

    const response = await axios.post(
    "https://ims-wc58.onrender.com/purchase-order/create-purchase-order",
   // "http://127.0.0.1:8000/purchase-order/create-purchase-order",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert("Purchase order created successfully!");
  } catch (err) {
    console.error("Error creating purchase order:", err);
    setError("Failed to create purchase order. Please check your inputs.");
  }
};


return (
  <div className="order-form-container">
      <div className="order-form">
          <h2 className="form-title">Order Form</h2>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="form-group">
              <label>Product Name</label>
              <select value={productName} onChange={(e) => {
              const selectedProduct = e.target.value;
    setProductName(selectedProduct);
    fetchProductSizes(selectedProduct);
}}>
    <option value="">Select a product</option>
    {products.map((product, index) => (
        <option key={index} value={product}>{product}</option>
    ))}
</select>

          </div>

          <div className="form-group">
              <label>Product Size</label>
              <select value={productSize} onChange={(e) => setProductSize(e.target.value)}>
                  <option value="">Select Size</option>
                  {productSizes.map((size, index) => (
                      <option key={index} value={size}>{size}</option>
                  ))}
              </select>
          </div>


          {/* Product Category Dropdown */}
          <div className="form-group">
                    <label>Product Category</label>
                    <select value={productCategory} onChange={(e) => setProductCategory(e.target.value)}>
                        <option value="">Select Category</option>
                        <option value="Men's Leather Shoes">Men's Leather Shoes</option>
                        <option value="Women's Leather Shoes">Women's Leather Shoes</option>
                        <option value="Boy's Leather Shoes">Boys' Leather Shoes</option>
                        <option value="Girl's Leather Shoes">Girls' Leather Shoes</option>
                    </select>
                </div>

          <div className="form-group">
              <label>Quantity</label>
              <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, e.target.value))}
                  min="1"
              />
          </div>

          <div className="form-group">
              <label>Warehouse</label>
              <select value={selectedWarehouse} onChange={(e) => setSelectedWarehouse(e.target.value)}>
                  <option value="">Select Warehouse</option>
                  {warehouses.map((warehouse, index) => (
                      <option key={index} value={warehouse.warehouseName}>
                          {warehouse.warehouseName} - {warehouse.fullAddress}
                      </option>
                  ))}
              </select>
          </div>

          <button type="submit" className="submit-btn" onClick={handleSubmit}>
              Submit Order
          </button>
      </div>

      {currentUser && (
          <p style={{ marginTop: "20px" }}>
              Logged in as: <strong>{currentUser.firstName} {currentUser.lastName}</strong>
          </p>
      )}
  </div>
);
};

export default OrderForm;
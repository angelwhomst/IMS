import React, { useState } from "react";
import axios from "axios";
import "./AddProductForm.css";

const AddProductForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    category: "",
    size: "",
    threshold: "",
    quantity: "",
    reorder: "",
    maxStockLevel: "",
    minStockLevel: "",
    image: null,
  });

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [sizeEntered, setSizeEntered] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "size" && value !== "") {
      setSizeEntered(true);
    } else if (name === "size" && value === "") {
      setSizeEntered(false);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB limit

    if (file && file.type.startsWith("image/")) {
      if (file.size > MAX_FILE_SIZE) {
        alert("File size exceeds the 5MB limit.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.onerror = () => {
        alert("Error reading the file.");
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    const allFieldsFilled = Object.values(formData).every(
      (value) => value !== "" && value !== null
    );

    if (!allFieldsFilled) {
      setShowErrorModal(true);
      return;
    }

    const payload = {
      productName: formData.productName,
      productDescription: formData.description,
      unitPrice: parseFloat(formData.price), // Ensure price is a float
      category: formData.category,
      size: formData.size,
      threshold: formData.threshold ? parseInt(formData.threshold, 10) : null, // Convert to integer
      quantity: parseInt(formData.quantity, 10), // Convert to integer
      reorderLevel: parseInt(formData.reorder, 10), // Convert to integer
      maxStockLevel: parseInt(formData.maxStockLevel, 10), // Convert to integer
      minStockLevel: parseInt(formData.minStockLevel, 10), // Convert to integer
      image: formData.image, // Base64 string
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://127.0.0.1:8000/ims/products",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Product added successfully");
      onSubmit();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <div className="addproduct-modal-overlay">
      <div className="addproduct-modal-content">
        <button className="addproduct-close-btn" onClick={onClose}>
          X
        </button>
        <h2 className="addproduct-h2">Add Product</h2>
        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className="addproduct-image-upload">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <div className="addproduct-image-placeholder">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Product"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              ) : (
                <p>Upload Image</p>
              )}
            </div>
          </div>

          {/* Product Fields */}
          <div className="addproduct-form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Enter product name"
            />
          </div>

          <div className="addproduct-form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
            />
          </div>

          <div className="addproduct-form-group">
            <label>Price (PHP)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
            />
          </div>

          <div className="addproduct-form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="Men's Leather Shoes">Men's Leather Shoes</option>
              <option value="Women's Leather Shoes">Women's Leather Shoes</option>
              <option value="Girl's Leather Shoes">Girls Leather Shoes</option>
              <option value="Boy's Leather Shoes">Boys Leather Shoes</option>
            </select>
          </div>

          <div className="addproduct-form-group">
            <label>Size</label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
              placeholder="Enter size"
            />
          </div>

          {sizeEntered && (
            <>
              <div className="addproduct-form-group">
                <label>Threshold</label>
                <input
                  type="number"
                  name="threshold"
                  value={formData.threshold}
                  onChange={handleChange}
                  placeholder="Enter threshold"
                />
              </div>
              <div className="addproduct-form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Enter quantity"
                />
              </div>
              <div className="addproduct-form-group">
                <label>Reorder</label>
                <input
                  type="number"
                  name="reorder"
                  value={formData.reorder}
                  onChange={handleChange}
                  placeholder="Enter reorder amount"
                />
              </div>
              <div className="addproduct-form-group">
                <label>Maximum Stock Level</label>
                <input
                  type="number"
                  name="maxStockLevel"
                  value={formData.maxStockLevel}
                  onChange={handleChange}
                  placeholder="Enter Maximum Stock Level"
                />
              </div>
              <div className="addproduct-form-group">
                <label>Minimum Stock Level</label>
                <input
                  type="number"
                  name="minStockLevel"
                  value={formData.minStockLevel}
                  onChange={handleChange}
                  placeholder="Enter Minimum Stock Level"
                />
              </div>
            </>
          )}

          <button type="submit" className="addproduct-submit-btn">
            Add Product
          </button>
        </form>
      </div>

      {showErrorModal && (
        <div className="addproduct-modal-overlay">
          <div className="addproduct-modal-content">
            <h2>Missing Fields</h2>
            <p>All fields are required. Please fill in all the fields.</p>
            <button className="addproduct-submit-btn" onClick={closeErrorModal}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductForm;
import React, { useState } from "react";
<<<<<<< HEAD
=======
import axios from "axios";
>>>>>>> IMS-DASH/master
import "./AddProductForm.css";

const AddProductForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    category: "",
<<<<<<< HEAD
    supplier: "",
=======
>>>>>>> IMS-DASH/master
    size: "",
    threshold: "",
    quantity: "",
    reorder: "",
<<<<<<< HEAD
=======
    maxStockLevel: "",
    minStockLevel: "",
>>>>>>> IMS-DASH/master
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
<<<<<<< HEAD
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

=======
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
>>>>>>> IMS-DASH/master
    const allFieldsFilled = Object.values(formData).every(
      (value) => value !== "" && value !== null
    );

    if (!allFieldsFilled) {
      setShowErrorModal(true);
      return;
    }

<<<<<<< HEAD
    const formattedPrice = `₱${parseFloat(formData.price).toFixed(2)}`;
    const updatedFormData = { ...formData, price: formattedPrice };

    onSubmit(updatedFormData);

    setFormData({
      productName: "",
      description: "",
      price: "",
      category: "",
      supplier: "",
      size: "",
      threshold: "",
      quantity: "",
      reorder: "",
      image: null,
    });

    onClose();
  };

  const closeErrorModal = () => setShowErrorModal(false);
=======
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
>>>>>>> IMS-DASH/master

  return (
    <div className="addproduct-modal-overlay">
      <div className="addproduct-modal-content">
        <button className="addproduct-close-btn" onClick={onClose}>
          X
        </button>
        <h2 className="addproduct-h2">Add Product</h2>
        <form onSubmit={handleSubmit}>
<<<<<<< HEAD
          <div className="addproduct-form-group">
            <label>Product Image</label>
            <div className="addproduct-image-upload">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <div className="addproduct-image-placeholder">
                {formData.image ? (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Product"
                  />
                ) : (
                  <p>Upload Image</p>
                )}
              </div>
=======
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
>>>>>>> IMS-DASH/master
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
              <option value="men">Men's Leather Shoes</option>
              <option value="women">Women's Leather Shoes</option>
              <option value="girls">Girls Leather Shoes</option>
              <option value="boys">Boys Leather Shoes</option>
            </select>
          </div>

          <div className="addproduct-form-group">
<<<<<<< HEAD
            <label>Supplier</label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              placeholder="Enter supplier name"
            />
          </div>

          <div className="addproduct-form-group">
=======
>>>>>>> IMS-DASH/master
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
<<<<<<< HEAD
=======
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
>>>>>>> IMS-DASH/master
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

import React, { useState } from "react";
import "./AddProductForm.css"; 

const AddProductForm = ({ isOpen, onClose, onSubmit }) => {
  // State for the form fields
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    category: "",
    supplier: "", // Added supplier field
    image: null,
  });

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [products, setProducts] = useState([]); // State to store the added products

  if (!isOpen) return null; // Don't render modal if it's not open

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevState) => ({ ...prevState, image: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if all fields are filled
    const allFieldsFilled = Object.values(formData).every(
      (value) => value !== "" && value !== null
    );

    if (!allFieldsFilled) {
      setShowErrorModal(true); // Show error modal if fields are missing
      return;
    }

    // Format price to PHP (Peso)
    const formattedPrice = `₱${parseFloat(formData.price).toFixed(2)}`;
    const updatedFormData = { ...formData, price: formattedPrice };

    // Send the updated form data back to the parent component
    onSubmit(updatedFormData);

    // Add the product to the state (this simulates adding the product to a list)
    setProducts((prevProducts) => [...prevProducts, updatedFormData]);

    // Reset the form data
    setFormData({
      productName: "",
      description: "",
      price: "",
      category: "",
      supplier: "", // Reset supplier
      image: null,
    });

    onClose(); // Close modal after form submission
  };

  const closeErrorModal = () => setShowErrorModal(false);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <br />
        <h2>Add Product</h2>
        <br />
        <form onSubmit={handleSubmit}>
          {/* Product Image */}
          <div className="form-group">
            <label>Product Image</label>
            <div className="image-upload">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <div className="image-placeholder">
                {formData.image ? (
                  <img src={URL.createObjectURL(formData.image)} alt="Product" />
                ) : (
                  <p>Upload Image</p>
                )}
              </div>
            </div>
          </div>

          {/* Product Name */}
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Enter product name"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
            />
          </div>

          {/* Price */}
          <div className="form-group">
            <label>Price (PHP)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
            />
          </div>

          {/* Category */}
          <div className="form-group">
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

          {/* Supplier */}
          <div className="form-group">
            <label>Supplier</label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              placeholder="Enter supplier name"
            />
          </div>

          <button type="submit" className="submit-btn">
            Add Product
          </button>
        </form>
      </div>

      {showErrorModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Missing Fields</h2>
            <p>All fields are required. Please fill in all the fields.</p>
            <button className="submit-btn" onClick={closeErrorModal}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductForm;

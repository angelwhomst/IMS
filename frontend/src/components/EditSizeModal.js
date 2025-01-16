import React, { useState } from "react";
import "./EditSizeModal.css";

const EditSizeModal = ({ product, selectedSize, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    size: selectedSize?.size || "",
    quantity: selectedSize?.quantity || "", // Use selected size quantity
    threshold: selectedSize?.threshold || "",  // Use selected size threshold
    reorderQuantity: selectedSize?.reorderQuantity || "",  // Use selected size reorder quantity
    photo: product?.photo || "",  // Default to existing photo URL or path
  });

  // Debugging form data initialization
  console.log('Form Data:', formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    onSave(formData); // Save changes
    onClose(); // Close modal
  };

  if (!product || !selectedSize) return null; // Ensure both product and selectedSize are available

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <h2>Edit Product Size</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Image</label>
            <div className="image-placeholder">
              {formData.photo ? (
                <img src={formData.photo} alt="Product" />
              ) : (
                <p>No Image Available</p>
              )}
            </div>
          </div>

          <div className="form-scroll-container">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
              />
            </div>

            <div className="form-group">
              <label>Price</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
              />
            </div>

            <div className="form-group">
              <label>Selected Size</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="Enter size"
              />
            </div>

            <div className="form-group">
              <label>Quantity Available</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
              />
            </div>

            {/* Threshold and Reorder Quantity fields */}
            <div className="form-group">
              <label>Threshold</label>
              <input
                type="number"
                name="threshold"
                value={formData.threshold}
                onChange={handleChange}
                placeholder="Enter threshold"
              />
            </div>

            <div className="form-group">
              <label>Reorder Quantity</label>
              <input
                type="number"
                name="reorderQuantity"
                value={formData.reorderQuantity}
                onChange={handleChange}
                placeholder="Enter reorder quantity"
              />
            </div>

            <button type="submit" className="submit-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSizeModal;

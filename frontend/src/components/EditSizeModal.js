import React, { useState } from "react";
import "./EditSizeModal.css";

const EditSizeModal = ({ product, selectedSize, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    size: selectedSize || "",
    quantity: product?.quantity || "",
    threshold: product?.threshold || "",  // Added threshold field
    reorderQuantity: product?.reorderQuantity || "",  // Added reorderQuantity field
    photo: product?.photo || null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevState) => ({ ...prevState, photo: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Save changes
    onClose(); // Close modal
  };

  if (!product) return null;

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
            <div className="image-upload">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <div className="image-placeholder">
                {formData.photo ? (
                  <img
                    src={
                      typeof formData.photo === "string"
                        ? formData.photo
                        : URL.createObjectURL(formData.photo)
                    }
                    alt="Product"
                  />
                ) : (
                  <p>No Image Uploaded</p>
                )}
              </div>
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

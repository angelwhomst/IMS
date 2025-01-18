import React, { useState } from "react";
<<<<<<< HEAD
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
=======
import axios from "axios";
import "./EditSizeModal.css";

const EditSizeModal = ({ selectedSize, productName, productDescription, unitPrice, category, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    size: selectedSize.size,
    threshold: selectedSize.threshold,
    reorderLevel: selectedSize.reorderQuantity,
    maxQuantity: selectedSize.maxQuantity,
    minQuantity: selectedSize.minQuantity,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare the payload for the API request
      const payload = {
        productName,
        productDescription,
        size: selectedSize.size,
        category,
        unitPrice,
        newSize: formData.size,
        minStockLevel: parseInt(formData.minQuantity),
        maxStockLevel: parseInt(formData.maxQuantity),
        reorderLevel: parseInt(formData.reorderLevel),
        threshold: parseInt(formData.threshold),
      };

      // Send a PUT request to the backend API
      const response = await axios.put("/ims/products/update", payload);

      // Handle successful update
      console.log(response.data.message);
      onSave(formData); // Update parent state if needed
      onClose();
    } catch (err) {
      console.error("Error updating product:", err.response?.data?.detail || err.message);
      setError(err.response?.data?.detail || "An error occurred while updating the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editsize-modal-overlay">
      <div className="editsize-modal-content">
        <button className="editsize-close-btn" onClick={onClose}>
          X
        </button>
        <h2 className="editsize-h2">Edit Size</h2>
        {error && <p className="error-message">{error}</p>}
        <form>
          <div className="editsize-form-group">
            <label>Size</label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
            />
          </div>

          <div className="editsize-form-group">
            <label>Threshold</label>
            <input
              type="number"
              name="threshold"
              value={formData.threshold}
              onChange={handleChange}
            />
          </div>

          <div className="editsize-form-group">
            <label>Reorder Level</label>
            <input
              type="number"
              name="reorderLevel"
              value={formData.reorderLevel}
              onChange={handleChange}
            />
          </div>

          <div className="editsize-form-group">
            <label>Maximum Quantity</label>
            <input
              type="number"
              name="maxQuantity"
              value={formData.maxQuantity}
              onChange={handleChange}
            />
          </div>

          <div className="editsize-form-group">
            <label>Minimum Stock Level</label>
            <input
              type="number"
              name="minQuantity"
              value={formData.minQuantity}
              onChange={handleChange}
            />
          </div>

          <button
            type="button"
            className="editsize-save-btn"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
>>>>>>> IMS-DASH/master
        </form>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default EditSizeModal;
=======
export default EditSizeModal;
>>>>>>> IMS-DASH/master

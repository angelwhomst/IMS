import React, { useState } from "react";
import "./EditSizeModal.css";

const EditSizeModal = ({ selectedSize, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    size: selectedSize.size,
    threshold: selectedSize.threshold,
    quantity: selectedSize.quantity,
    reorderLevel: selectedSize.reorderQuantity,
    maxQuantity: selectedSize.maxQuantity,
    minQuantity: selectedSize.minQuantity,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="addproduct-modal-overlay">
      <div className="addproduct-modal-content">
        <button className="addproduct-close-btn" onClick={onClose}>
          X
        </button>
        <h2 className="addproduct-h2">Edit Size</h2>
        <form>
          <div className="addproduct-form-group">
            <label>Size</label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
            />
          </div>

          <div className="addproduct-form-group">
            <label>Threshold</label>
            <input
              type="number"
              name="threshold"
              value={formData.threshold}
              onChange={handleChange}
            />
          </div>

          <div className="addproduct-form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
          </div>

          <div className="addproduct-form-group">
            <label>Reorder Level</label>
            <input
              type="number"
              name="reorderLevel"
              value={formData.reorderLevel}
              onChange={handleChange}
            />
          </div>

          <div className="addproduct-form-group">
            <label>Maximum Quantity</label>
            <input
              type="number"
              name="maxQuantity"
              value={formData.maxQuantity}
              onChange={handleChange}
            />
          </div>

          <div className="addproduct-form-group">
            <label>Minimum Stock Level</label>
            <input
              type="number"
              name="minQuantity"
              value={formData.minQuantity}
              onChange={handleChange}
            />
          </div>

          <button type="button" className="addproduct-save-btn" onClick={handleSave}>
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSizeModal;

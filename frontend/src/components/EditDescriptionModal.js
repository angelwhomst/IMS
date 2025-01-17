import React, { useState } from "react";
import "./EditDescriptionModal.css";

const EditDescriptionModal = ({ product, onClose }) => {
  const [editedProduct, setEditedProduct] = useState({
    productName: product.productName,
    productDescription: product.productDescription,
    unitPrice: product.unitPrice,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Logic to save the edited product, this could be sending the data to an API
    console.log("Edited Product:", editedProduct);
    // Close the modal after saving
    onClose();
  };

  return (
    <div className="edit-description-modal-overlay">
      <div className="edit-description-modal-content">
        <button className="edit-description-close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Edit Product</h2>
        <div className="edit-description-form">
          <label>
            Product Name:
            <input
              type="text"
              name="productName"
              value={editedProduct.productName}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Description:
            <textarea
              name="productDescription"
              value={editedProduct.productDescription}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Price:
            <input
              type="number"
              name="unitPrice"
              value={editedProduct.unitPrice}
              onChange={handleInputChange}
            />
          </label>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditDescriptionModal;

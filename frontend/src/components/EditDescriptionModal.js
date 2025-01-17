// EditDescriptionModal.js
import React, { useState } from "react";
import "./EditDescriptionModal.css";

const EditDescriptionModal = ({ product = {}, category = "", onClose }) => {
  const [editedProduct, setEditedProduct] = useState({
    productName: product.productName || "",
    productDescription: product.productDescription || "",
    unitPrice: product.unitPrice || 0,
    category: category || "",
    image: product.image_path || "", // Default to an empty string if no image
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditedProduct((prevState) => ({
          ...prevState,
          image: event.target.result, // Base64 encoded string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log("Edited Product:", editedProduct);
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
            Image:
            <div className="image-upload-container">
              {editedProduct.image && (
                <img
                  src={editedProduct.image}
                  alt="Product"
                  className="edit-product-image"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </label>
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
          <label>
            Category:
            <input
              type="text"
              name="category"
              value={editedProduct.category}
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

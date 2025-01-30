import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./EditDescriptionModal.css";

const BASE_URL = "https://ims-wc58.onrender.com";


const EditDescriptionModal = ({
  product = {},
  productName,
  productDescription,
  unitPrice,
  category,
  onClose,
  onSave,
}) => {
  const [editedProduct, setEditedProduct] = useState({
    newProductName: "",
    newProductDescription: "",
    newUnitPrice: 0,
    newCategory: "",
    newImage: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setEditedProduct({
      newProductName: product.productName || productName || "",
      newProductDescription: product.productDescription || productDescription || "",
      newUnitPrice: product.unitPrice || unitPrice || 0,
      newCategory: product.category || category || "",
      newImage: product.image_path || "",
    });
  }, [product, productName, productDescription, unitPrice, category]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditedProduct((prevState) => ({
      ...prevState,
      [name]: name === "newUnitPrice" ? parseFloat(value) || 0 : value,
    }));

    console.log("Updated product input:", { name, value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProduct((prevState) => ({
          ...prevState,
          newImage: reader.result,
        }));
        console.log("Image uploaded:", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    console.log("Save button clicked");

    const updatedProduct = {
      productName: product.productName,
      productDescription: product.productDescription,
      category: product.category,
      unitPrice: product.unitPrice,
      newProductName: editedProduct.newProductName || product.productName,
      newProductDescription: editedProduct.newProductDescription || product.productDescription,
      newCategory: editedProduct.newCategory || product.category,
      newUnitPrice: parseFloat(editedProduct.newUnitPrice).toFixed(2) || product.unitPrice,
      newImage: editedProduct.newImage || product.image_path,
    };

    console.log("Sending updated product to parent:", updatedProduct);

    if (
      !updatedProduct.newProductName ||
      !updatedProduct.newProductDescription ||
      !updatedProduct.newUnitPrice ||
      !updatedProduct.newCategory
    ) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Unauthorized: No access token found.");
      }

      const response = await axios.put(`${BASE_URL}/ims/products/update-details`, updatedProduct, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API response:", response);

      if (response.data.error) {
        setErrorMessage(response.data.error); // Show validation error message
        return;
      }

      if (onSave && typeof onSave === "function") {
        onSave(updatedProduct);
      }
      onClose();
    } catch (error) {
      if (error.response) {
        console.error("Error details:", error.response.data);
        if (error.response.status === 422) {
          alert(`Validation Error: ${error.response.data.message || "Please check the fields."}`);
        } else if (error.response.status === 401) {
          alert("Unauthorized: Please log in again.");
          window.location.href = "/login";
        } else {
          alert("An error occurred while updating the product.");
        }
      } else {
        console.error("Error during product update:", error);
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="edit-description-modal-overlay">
      <div className="edit-description-modal-content">
        <button className="edit-description-close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Edit Product</h2>
        <div className="edit-description-form">
          {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message */}
          <label>
            Image:
            <div className="image-upload-container">
              {editedProduct.newImage && (
                <img src={editedProduct.newImage} alt="Product" className="edit-product-image" />
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </label>
          <label>
            Product Name:
            <input
              type="text"
              name="newProductName"
              value={editedProduct.newProductName}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Description:
            <textarea
              name="newProductDescription"
              value={editedProduct.newProductDescription}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Price:
            <input
              type="number"
              name="newUnitPrice"
              value={editedProduct.newUnitPrice}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Category:
            <input
              type="text"
              name="newCategory"
              value={editedProduct.newCategory}
              onChange={handleInputChange}
            />
          </label>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

EditDescriptionModal.propTypes = {
  product: PropTypes.object,
  productName: PropTypes.string,
  productDescription: PropTypes.string,
  unitPrice: PropTypes.number,
  category: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditDescriptionModal;
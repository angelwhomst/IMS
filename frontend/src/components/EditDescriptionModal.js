import React, { useState, useEffect } from "react";  
import PropTypes from "prop-types";  
import axios from "axios";  
import "./EditDescriptionModal.css";  

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
    productName: product.productName || productName || "",  
    productDescription: product.productDescription || productDescription || "",  
    unitPrice: product.unitPrice || unitPrice || 0,  
    category: product.category || category || "",  
    image: product.image_path || "",  
  });  

  useEffect(() => {  
    console.log("Category received in useEffect:", category);  
    console.log("Product category:", product.category);  
  
    setEditedProduct({  
      productName: product.productName || productName || "",  
      productDescription: product.productDescription || productDescription || "",  
      unitPrice: product.unitPrice || unitPrice || 0,  
      category: product.category || category || "",  
      image: product.image_path || "",  
    });  
  }, [product, productName, productDescription, unitPrice, category]);  

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
      reader.onloadend = () => {  
        setEditedProduct((prevState) => ({  
          ...prevState,  
          image: reader.result,  
        }));  
      };  
      reader.readAsDataURL(file);  
    }  
  };  

  const handleSave = async () => {  
    console.log("onSave prop:", onSave); // Debugging  

    if (typeof onSave !== "function") {  
      console.error("Error: onSave is not a function");  
      alert("An error occurred: onSave is not a function.");  
      return;  
    }  

    if (  
      !editedProduct.productName ||  
      !editedProduct.productDescription ||  
      !editedProduct.unitPrice ||  
      !editedProduct.category  
    ) {  
      alert("Please fill out all fields.");  
      return;  
    }  

    const updatedProduct = {  
      productName: product.productName,  
      productDescription: product.productDescription,  
      category: category,  
      unitPrice: product.unitPrice,  
      newProductName: editedProduct.productName.trim(),  
      newProductDescription: editedProduct.productDescription.trim(),  
      newCategory: editedProduct.category.trim(),  
      newUnitPrice: parseFloat(editedProduct.unitPrice),  
      newImage: editedProduct.image,  
    };  

    console.log("Payload:", updatedProduct);  

    try {  
      const token = localStorage.getItem("access_token");  
      if (!token) {  
        throw new Error("Unauthorized: No access token found.");  
      }  

      const response = await axios.put(`/ims/products/update-details`, updatedProduct, {  
        headers: {  
          "Content-Type": "application/json",  
          Authorization: `Bearer ${token}`, // Add the access token here  
        },  
      });  
      console.log("Server Response:", response.data);  
      onSave(updatedProduct);  
      onClose();  
    } catch (error) {  
      console.error("Error updating product:", error);  
      alert("An error occurred while updating the product.");  
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
              <input type="file" accept="image/*" onChange={handleFileChange} />
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

// Define PropTypes for type checking
EditDescriptionModal.propTypes = {
  product: PropTypes.object,
  productName: PropTypes.string,
  productDescription: PropTypes.string,
  unitPrice: PropTypes.number,
  category: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired, // Ensure onSave is a function
};

export default EditDescriptionModal;

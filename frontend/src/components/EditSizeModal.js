import React, { useState, useEffect } from "react";  
import axios from "axios";  
import "./EditSizeModal.css";  

const EditSizeModal = ({ selectedSize, productName, productDescription, unitPrice, category, onClose, onSave }) => {  
  const [formData, setFormData] = useState({  
    size: '',  
    threshold: '',  
    reorderLevel: '',  
    maxQuantity: '',  
    minQuantity: '',  
    newSize: '',  
    newminStockLevel: '',  
    newmaxStockLevel: '',  
    newreorderLevel: '',  
    newthreshold: '',  
  });  

  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState(null);  

  // Update formData whenever selectedSize prop changes
  useEffect(() => {
    if (selectedSize) {
      setFormData({  
        size: selectedSize.size,  
        threshold: selectedSize.threshold,  
        reorderLevel: selectedSize.reorderQuantity,  
        maxQuantity: selectedSize.maxQuantity,  
        minQuantity: selectedSize.minQuantity,  
        newSize: selectedSize.size,  
        newminStockLevel: selectedSize.minQuantity,  
        newmaxStockLevel: selectedSize.maxQuantity,  
        newreorderLevel: selectedSize.reorderQuantity,  
        newthreshold: selectedSize.threshold,  
      });
    }
  }, [selectedSize]); // Dependency array ensures this only runs when selectedSize changes

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
        minStockLevel: parseInt(formData.minQuantity),  
        maxStockLevel: parseInt(formData.maxQuantity),  
        reorderLevel: parseInt(formData.reorderLevel),  
        threshold: parseInt(formData.threshold),  
        newSize: formData.newSize,  
        newminStockLevel: parseInt(formData.newminStockLevel),  
        newmaxStockLevel: parseInt(formData.newmaxStockLevel),  
        newreorderLevel: parseInt(formData.newreorderLevel),  
        newthreshold: parseInt(formData.newthreshold),  
      };  

      console.log("Sending data:", payload);

      // Retrieve the access token  
      const token = localStorage.getItem("access_token");  

      // Send a PUT request to the backend API with the token in headers  
      const response = await axios.post("/ims/products/update", payload, {  
        headers: {  
          Authorization: `Bearer ${token}`, // Add the access token here  
        },  
      });  

      // Handle successful update  
      console.log("Response data:", response.data.message);  
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
              name="newSize"
              value={formData.newSize}
              onChange={handleChange}
            />
          </div>

          <div className="editsize-form-group">
            <label>Threshold</label>
            <input
              type="number"
              name="newthreshold"
              value={formData.newthreshold}
              onChange={handleChange}
            />
          </div>

          <div className="editsize-form-group">
            <label>Reorder Level</label>
            <input
              type="number"
              name="newreorderLevel"
              value={formData.newreorderLevel}
              onChange={handleChange}
            />
          </div>

          <div className="editsize-form-group">
            <label>Maximum Quantity</label>
            <input
              type="number"
              name="newmaxStockLevel"
              value={formData.newmaxStockLevel}
              onChange={handleChange}
            />
          </div>

          <div className="editsize-form-group">
            <label>Minimum Stock Level</label>
            <input
              type="number"
              name="newminStockLevel"
              value={formData.newminStockLevel}
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
        </form>
      </div>
    </div>
  );
};

export default EditSizeModal;
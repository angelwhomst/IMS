import React, { useState } from "react";  
import axios from "axios";  
import "./AddSizeModal.css";  

const BASE_URL = "https://ims-wc58.onrender.com";

const AddSizeModal = ({ productName, productDescription, unitPrice, category, onClose, onSave }) => {  
  const [formData, setFormData] = useState({  
    size: '',  
    threshold: '',  
    reorderLevel: '',  
    maxQuantity: '',  
    minQuantity: '',  
    quantity: '',  
  });  

  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState(null);  
  const [formErrors, setFormErrors] = useState({});  

  // Form validation function  
  const validateForm = () => {  
    console.log("Validating form data:", formData); // Log the form data for validation  
    const errors = {};  
    if (!formData.size) errors.size = "Size is required.";  
    if (!formData.threshold || isNaN(formData.threshold) || formData.threshold <= 0)  
      errors.threshold = "Threshold should be a positive number.";  
    if (!formData.reorderLevel || isNaN(formData.reorderLevel) || formData.reorderLevel <= 0)  
      errors.reorderLevel = "Reorder Level should be a positive number.";  
    if (!formData.maxQuantity || isNaN(formData.maxQuantity) || formData.maxQuantity <= 0)  
      errors.maxQuantity = "Maximum Quantity should be a positive number.";  
    if (!formData.minQuantity || isNaN(formData.minQuantity) || formData.minQuantity <= 0)  
      errors.minQuantity = "Minimum Stock Level should be a positive number.";  
    if (!formData.quantity || isNaN(formData.quantity) || formData.quantity <= 0)  
      errors.quantity = "Quantity should be a positive number.";  

    console.log("Validation errors:", errors); // Log validation errors  
    return errors;  
  };  

  // Handle form data changes  
  const handleChange = (e) => {  
    const { name, value } = e.target;  
    console.log(`Field changed: ${name}, New value: ${value}`); // Log field changes  
    setFormData((prev) => ({ ...prev, [name]: value }));  
  };  

  // Handle form submission  
  const handleSave = async () => {  
    console.log("Submitting form with data:", formData); // Log form submission data  
    setLoading(true);  
    setError(null);  
    const errors = validateForm();  
    if (Object.keys(errors).length > 0) {  
      setFormErrors(errors);  
      setLoading(false);  
      return;  
    }  

    try {  
      const payload = {  
        productName,  
        productDescription,  
        size: formData.size,  
        category,  
        unitPrice: parseFloat(unitPrice),  
        minStockLevel: parseInt(formData.minQuantity),  
        maxStockLevel: parseInt(formData.maxQuantity),  
        reorderLevel: parseInt(formData.reorderLevel),  
        threshold: parseInt(formData.threshold),  
        quantity: parseInt(formData.quantity),  
      };  

      console.log("Payload being sent to backend:", payload); // Log the payload  

      // Retrieve the access token  
      const token = localStorage.getItem("access_token");  

      // Make POST request to the backend with the token in headers  
      const response = await axios.post(`${BASE_URL}/ims/products/add-size`, payload, {  
        headers: {  
          Authorization: `Bearer ${token}`, // Add the access token here  
        },  
      });  
      console.log("Response from backend:", response.data); // Log backend response  

      // Update parent state if needed and reset the form  
      onSave(formData);  
      setFormData({ size: '', threshold: '', reorderLevel: '', maxQuantity: '', minQuantity: '', quantity: '' });  
      console.log("Form reset and closing modal."); // Log modal reset and close  
      onClose();  
    } catch (err) {  
      console.error("Error adding new product size:", err.response?.data?.detail || err.message); // Log errors  
      setError(err.response?.data?.detail || "An error occurred while adding the new product size.");  
    } finally {  
      setLoading(false);  
      console.log("Loading state set to false."); // Log loading state  
    }  
  };  

  return (
    <div className="addproduct-modal-overlay">
      <div className="addproduct-modal-content">
        <button className="addproduct-close-btn" onClick={onClose}>X</button>
        <h2 className="addproduct-h2">Add Size</h2>
        {error && <p className="error-message">{error}</p>}
        <form>
          {/* Size Input */}
          <div className="addproduct-form-group">
            <label>Size</label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
              required
            />
            {formErrors.size && <p className="error-message">{formErrors.size}</p>}
          </div>

          {/* Threshold Input */}
          <div className="addproduct-form-group">
            <label>Threshold</label>
            <input
              type="number"
              name="threshold"
              value={formData.threshold}
              onChange={handleChange}
              required
            />
            {formErrors.threshold && <p className="error-message">{formErrors.threshold}</p>}
          </div>

          {/* Reorder Level Input */}
          <div className="addproduct-form-group">
            <label>Reorder Level</label>
            <input
              type="number"
              name="reorderLevel"
              value={formData.reorderLevel}
              onChange={handleChange}
              required
            />
            {formErrors.reorderLevel && <p className="error-message">{formErrors.reorderLevel}</p>}
          </div>

          {/* Maximum Quantity Input */}
          <div className="addproduct-form-group">
            <label>Maximum Quantity</label>
            <input
              type="number"
              name="maxQuantity"
              value={formData.maxQuantity}
              onChange={handleChange}
              required
            />
            {formErrors.maxQuantity && <p className="error-message">{formErrors.maxQuantity}</p>}
          </div>

          {/* Minimum Quantity Input */}
          <div className="addproduct-form-group">
            <label>Minimum Stock Level</label>
            <input
              type="number"
              name="minQuantity"
              value={formData.minQuantity}
              onChange={handleChange}
              required
            />
            {formErrors.minQuantity && <p className="error-message">{formErrors.minQuantity}</p>}
          </div>

          {/* Quantity Input */}
          <div className="addproduct-form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
            {formErrors.quantity && <p className="error-message">{formErrors.quantity}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            className="addsize-submit-btn"
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

export default AddSizeModal;
import React, { useState, useEffect } from 'react';
import './EditProductForm.css';

const EditProductForm = ({ product, onClose }) => {
  const [productData, setProductData] = useState(product);
  const [size, setSize] = useState([]); // Initialize size as an empty array

  // Fetch product size from the backend
  useEffect(() => {
    if (productData) {
      const fetchSize = async () => {
        try {
          const response = await fetch(`/ims/products/size?productName=${productData.productName}&unitPrice=${productData.unitPrice}&productDescription=${productData.productDescription || ''}`);
          if (response.ok) {
            const data = await response.json();
            // Check if `data.size` is an array, and handle it accordingly
            if (Array.isArray(data.size)) {
              setSize(data.size); // Set the size as an array
            } else {
              setSize([]); // If it's not an array, set an empty array
              console.error('Size data is not an array');
            }
          } else {
            setSize([]); // Set to an empty array if the response is not ok
            console.error('Product size not found');
          }
        } catch (error) {
          setSize([]); // Set to an empty array in case of an error
          console.error('Error fetching size:', error);
        }
      };
      fetchSize();
    }
  }, [productData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSizeClick = (selectedSize) => {
    setProductData((prevData) => ({
      ...prevData,
      selectedSize, // Update product data with the selected size
    }));
  };

  if (!productData) return <p>Loading...</p>;

  return (
    <div className="edit-product-form">
      {/* Close Button */}
      <button className="close-button" onClick={onClose}>X</button>

      <div className="scrollable-container">
        {/* Photo Section */}
        <div className="photo-section">
          <div className="photo-placeholder">
            {productData.image_path ? <img src={productData.image_path} alt={productData.productName} /> : 'No Photo Available'}
          </div>
        </div>

        {/* Details Section */}
        <div className="details-section">
          <div className="details">
            <p><strong>PRODUCT NAME:</strong>
              <input
                type="text"
                name="productName"
                value={productData.productName}
                onChange={handleInputChange}
              />
            </p>
            <p><strong>DESCRIPTION:</strong>
              <textarea
                name="productDescription"
                value={productData.productDescription}
                onChange={handleInputChange}
              />
            </p>
            <p><strong>PRICE:</strong>
              <input
                type="number"
                name="unitPrice"
                value={productData.unitPrice}
                onChange={handleInputChange}
              />
            </p>
            <p><strong>SIZE:</strong></p>
            {size.length > 0 ? (
              <div className="size-options">
                {size.map((sizeItem, index) => (
                  <button
                    key={index}
                    className="size-button"
                    onClick={() => handleSizeClick(sizeItem)}
                  >
                    {sizeItem.size}
                  </button>
                ))}
              </div>
            ) : (
              <p>Loading sizes...</p>
            )}
          </div>
        </div>

        {/* Size Details Section */}
        {productData.selectedSize && (
          <div className="quantity-threshold-section">
            <p><strong>Selected Size:</strong> {productData.selectedSize.size}</p>
            <p><strong>Quantity Available:</strong> {productData.selectedSize.quantity}</p>
            <p><strong>Min Quantity:</strong> {productData.selectedSize.minQuantity}</p>
            <p><strong>Max Quantity:</strong> {productData.selectedSize.maxQuantity}</p>
            <p><strong>Reorder Quantity:</strong> {productData.reorderQuantity}</p>
          </div>
        )}

        {/* Action Buttons Section */}
        <div className="actions-section">
          <button className="action-button save-button" onClick={() => onClose(productData)}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductForm;

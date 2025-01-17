import React, { useState, useEffect } from 'react';
import './EditProductForm.css';
import EditSizeModal from './EditSizeModal';

const EditProductForm = ({ product, category, onClose }) => {
  const [productData, setProductData] = useState(product);
  const [size, setSize] = useState([]);
  const [sizeVariants, setSizeVariants] = useState([]);
  const [selectedSizeDetails, setSelectedSizeDetails] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [error, setError] = useState(null);

  // Fetch sizes
  useEffect(() => {
    if (productData) {
      console.log('Product Data:', productData); // Debug log
      console.log('Category:', category); // Debug log

      const fetchSize = async () => {
        try {
          const categoryParam = category || 'Uncategorized';
          const url = `/ims/products/size?productName=${productData.productName}&unitPrice=${productData.unitPrice}&productDescription=${productData.productDescription}&category=${categoryParam}`;
          console.log("Fetching sizes from:", url);  // Log URL

          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data.size)) {
              setSize(data.size);
            } else {
              setSize([]);
              setError("Invalid size data received.");
              console.error('Size data is not an array');
            }
          } else {
            setSize([]);
            setError("Failed to fetch product size.");
            console.error('Product size not found');
          }
        } catch (error) {
          setSize([]);
          setError("An error occurred while fetching product size.");
          console.error('Error fetching size:', error);
        }
      };
      fetchSize();
    }
  }, [productData, category]);

  // Fetch size variants
  useEffect(() => {
    if (productData) {
      console.log('Product Data:', productData); // Debug log
      console.log('Category:', category); // Debug log

      const fetchSizeVariants = async () => {
        try {
          // Correcting the URL by adding backticks for string interpolation
          const response = await fetch(
            `/ims/products/size_variants?productName=${encodeURIComponent(productData.productName)}&unitPrice=${productData.unitPrice}&productDescription=${encodeURIComponent(productData.productDescription || '')}&category=${encodeURIComponent(category)}`
          );
  
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) {
              setSizeVariants(data); // Set the fetched size variants
            } else {
              setSizeVariants([]);
              console.error('Size data is not an array');
            }
          } else {
            setSizeVariants([]);
            console.error('Product size variants not found');
          }
        } catch (error) {
          setSizeVariants([]);
          console.error('Error fetching size variants:', error);
        }
      };
      fetchSizeVariants();
    }
  }, [productData, category]);
  

  const handleSizeClick = (selectedSize) => {
    setProductData((prevData) => ({
      ...prevData,
      selectedSize,
    }));

    const sizeDetails = size.find((item) => item.size === selectedSize.size);
    setSelectedSizeDetails(sizeDetails || null);
  };

  const handleDeleteSize = (sizeToDelete) => {
    const updatedSize = size.filter((sizeItem) => sizeItem.size !== sizeToDelete.size);
    setSize(updatedSize);
    setSelectedSizeDetails(null); // Clear selected size details
  };

  const handleSaveSize = (updatedSizeDetails) => {
    const updatedSize = size.map((sizeItem) =>
      sizeItem.size === selectedSizeDetails.size ? { ...sizeItem, ...updatedSizeDetails } : sizeItem
    );
    setSize(updatedSize);
    setSelectedSizeDetails(updatedSizeDetails);
  };

  const handleAddSize = () => {
    const newSize = {
      size: 'New Size',
      threshold: 0,
      quantity: 0,
      reorderLevel: 0,
      maxQuantity: 0,
      minimumStockLevel: 0,
    };
    setSize((prevSize) => [...prevSize, newSize]);
  };

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
            <p><strong>PRODUCT NAME:</strong> {productData.productName}</p>
            <p><strong>DESCRIPTION:</strong> {productData.productDescription}</p>
            <p><strong>PRICE:</strong> {productData.unitPrice}</p>
          </div>
        </div>

        {/* Size Section */}
        <div className="size-options">
          {size.map((sizeItem, index) => (
            <button key={index} className="size-button" onClick={() => handleSizeClick(sizeItem)}>
              {sizeItem.size}
            </button>
          ))}
        </div>

        {/* Action Buttons Section */}
        <div className="actions-section">
          <button className="action-button save-button" onClick={() => setEditModalOpen(true)}>EDIT</button>
          <button className="action-button delete-button" onClick={() => handleDeleteSize(selectedSizeDetails)}>DELETE</button>
          <button className="action-button add-size-button" onClick={handleAddSize}>ADD SIZE</button>
        </div>

        {/* Size Information */}
        {selectedSizeDetails && (
          <div className="size-details">
            <h4>Selected Size Details</h4>
            <p><strong>Threshold:</strong> {selectedSizeDetails.threshold}</p>
            <p><strong>Quantity:</strong> {selectedSizeDetails.quantity}</p>
            <p><strong>Reorder Level:</strong> {selectedSizeDetails.reorderQuantity}</p>
            <p><strong>Maximum Stock Level:</strong> {selectedSizeDetails.maxQuantity}</p>
            <p><strong>Minimum Stock Level:</strong> {selectedSizeDetails.minQuantity}</p>
          </div>
        )}

        {/* Table Section */}
        <div className="table-section">
          <h3>Size Information</h3>
          <table className="size-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Barcode</th>
                <th>Product Code</th>
              </tr>
            </thead>
            <tbody>
              {sizeVariants.length > 0 ? (
                sizeVariants.map((variant, index) => (
                  <tr key={index}>
                    <td>{variant.size}</td>
                    <td>{variant.barcode || 'N/A'}</td>
                    <td>{variant.productCode || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">Loading size variants...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}
      </div>

      {/* Edit Size Modal */}
      {isEditModalOpen && selectedSizeDetails && (
        <EditSizeModal
        selectedSize={selectedSizeDetails}
        productName={productData.productName}
        productDescription={productData.productDescription}
        unitPrice={productData.unitPrice}
        category={category}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveSize}
        />
      )}
    </div>
  );
};

export default EditProductForm;

import React, { useState, useEffect } from 'react';  
import axios from 'axios'; // Import Axios  
import './EditProductForm.css';  
import EditSizeModal from './EditSizeModal';  
import AddSizeModal from './AddSizeModal'; // Import the AddSizeModal component  

const EditProductForm = ({ product, category, onClose }) => {  
  const [productData, setProductData] = useState(product);  
  const [size, setSize] = useState([]);  
  const [sizeVariants, setSizeVariants] = useState([]);  
  const [selectedSizeDetails, setSelectedSizeDetails] = useState(null);  
  const [isEditModalOpen, setEditModalOpen] = useState(false);  
  const [isAddSizeModalOpen, setAddSizeModalOpen] = useState(false); // Add state for AddSizeModal visibility  
  const [error, setError] = useState(null);  

  // Fetch sizes  
  useEffect(() => {  
    if (productData) {  
      const fetchSize = async () => {  
        try {  
          const categoryParam = category || 'Uncategorized';  
          const url = `https://ims-wc58.onrender.com/ims/products/sizes?productName=${productData.productName}&unitPrice=${productData.unitPrice}&productDescription=${productData.productDescription}&category=${categoryParam}`;  
          
          const token = localStorage.getItem("access_token"); // Retrieve the token  

          const response = await axios.get(url, {  
            headers: {  
              Authorization: `Bearer ${token}`, // Use the token in the request header  
            },  
          });  

          if (response.status === 200 && Array.isArray(response.data.size)) {  
            setSize(response.data.size);  
          } else {  
            setSize([]);  
            setError("Invalid size data received.");  
          }  
        } catch (error) {  
          setSize([]);  
          setError("An error occurred while fetching product size.");  
          console.error("Error fetching sizes:", error); // Debug log  
        }  
      };  
      fetchSize();  
    }  
  }, [productData, category]);  

  // Fetch size variants  
  useEffect(() => {  
    if (productData) {  
      const fetchSizeVariants = async () => {  
        try {  
          const token = localStorage.getItem("access_token"); // Retrieve the token  
          const response = await axios.get(  
            `/ims/products/size_variants?productName=${encodeURIComponent(productData.productName)}&unitPrice=${productData.unitPrice}&productDescription=${encodeURIComponent(productData.productDescription || '')}&category=${encodeURIComponent(category)}`,  
            {  
              headers: {  
                Authorization: `Bearer ${token}`, // Use the token in the request header  
              },  
            }  
          );  

          if (response.status === 200 && Array.isArray(response.data)) {  
            setSizeVariants(response.data);  
          } else {  
            setSizeVariants([]);  
          }  
        } catch (error) {  
          setSizeVariants([]);  
          console.error("Error fetching size variants:", error); // Debug log  
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
    console.log("Opening Add Size Modal"); // Debug log for opening Add Size modal  
    setAddSizeModalOpen(true); // Open AddSizeModal  
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

      {/* Add Size Modal */}
      {isAddSizeModalOpen && (
        <AddSizeModal
          onClose={() => {
            console.log("Closing Add Size Modal"); // Debug log for closing Add Size modal
            setAddSizeModalOpen(false); // Close modal on close
          }}
          onSave={(newSize) => {
            console.log("Saving New Size:", newSize); // Debug log when new size is saved
            setSize((prevSize) => [...prevSize, newSize]); // Add the new size
            setAddSizeModalOpen(false); // Close the modal after saving
          }}
          productName={productData.productName}
          productDescription={productData.productDescription}
          unitPrice={productData.unitPrice}
          category="Men's Leather Shoes"  
          image_path
        />
      )}
    </div>
  );
};

export default EditProductForm;
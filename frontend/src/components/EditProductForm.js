import React, { useState, useEffect } from 'react';
import './EditProductForm.css';
import EditSizeModal from './EditSizeModal';

const EditProductForm = ({ onClose }) => {
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    const fetchProductData = async () => {
      const productData = {
        name: 'KIM',
        description: 'Stylish shoes for all occasions',
        price: 1000,
        quantity: 9,
        threshold: 5, // Added threshold field
        reorderQuantity: 10, // Added reorderQuantity field
        sizes: [6, 7, 8, 9, 10], // Ensure sizes are always an array
        photo: 'https://via.placeholder.com/300x200',
      };
      setProduct(productData);
    };

    fetchProductData();
  }, []);

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  const handleDeleteSize = () => {
    if (selectedSize) {
      const updatedSizes = product.sizes.filter((size) => size !== selectedSize);
      setProduct((prevProduct) => ({
        ...prevProduct,
        sizes: updatedSizes,
      }));
      setSelectedSize(null);
    }
  };

  const handleEditClick = () => {
    if (selectedSize) {
      setIsModalOpen(true); // Open the modal
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal
  };

  if (!product) return <p>Loading...</p>;

  const generateTableData = () => {
    if (!selectedSize) return [];
    const tableData = [];
    for (let i = 1; i <= product.quantity; i++) {
      tableData.push({
        barcode: `BARCODE-${selectedSize}-${i}`,
        productCode: `CODE-${selectedSize}-${i}`,
      });
    }
    return tableData;
  };

  const selectedSizeInfo = selectedSize ? (
    <div>
      <p><strong>Selected Size:</strong> {selectedSize}</p>
      <p><strong>Quantity Available:</strong> {product.quantity}</p>
    </div>
  ) : (
    <p>Select a size to see details</p>
  );

  return (
    <div className="edit-product-form">
      <button className="close-button" onClick={onClose}>X</button>
      <div className="scrollable-container">
        <div className="photo-section">
          <div className="photo-placeholder">
            {product.photo ? <img src={product.photo} alt="Product" /> : 'No Photo Available'}
          </div>
        </div>

        <div className="details-section">
          <div className="details">
            <p><strong>PRODUCT NAME:</strong> {product.name}</p>
            <p><strong>DESCRIPTION:</strong> {product.description}</p>
            <p><strong>PRICE:</strong> {product.price}</p>
            <p><strong>SIZE:</strong></p>
            <div className="size-options">
              {/* Check if product.sizes is defined before rendering */}
              {product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0 ? (
                product.sizes.map((size, index) => (
                  <button
                    key={index}
                    className="size-button"
                    onClick={() => handleSizeClick(size)}
                  >
                    {size}
                  </button>
                ))
              ) : (
                <p>No sizes available</p>
              )}
            </div>
          </div>
        </div>

        <div className="size-info-section">
          <h3>Size Details</h3>
          {selectedSizeInfo}
        </div>

        {/* Threshold and Reorder Quantity Section (Above Barcode & Product Code) */}
        {selectedSize && (
          <div className="quantity-threshold-section">
            <p><strong>Threshold:</strong> {product.threshold}</p>
            <p><strong>Reorder Quantity:</strong> {product.reorderQuantity}</p>
          </div>
        )}

        {/* Barcode & Product Code Section */}
        {selectedSize && (
          <div className="barcode-table-section">
            <h3>Barcode & Product Code for Size {selectedSize}</h3>
            <table className="barcode-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Barcode</th>
                  <th>Product Code</th>
                </tr>
              </thead>
              <tbody>
                {generateTableData().map((data, index) => (
                  <tr key={index}>
                    <td>{selectedSize}</td>
                    <td>{data.barcode}</td>
                    <td>{data.productCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="actions-section">
          <button className="action-button delete-button" onClick={handleDeleteSize}>DELETE</button>
          <button className="action-button edit-button" onClick={handleEditClick}>EDIT</button>
        </div>
      </div>

      {isModalOpen && (
        <EditSizeModal
          product={product}
          selectedSize={selectedSize}
          onClose={handleModalClose}
          onSave={(updatedProductData) => {
            setProduct(updatedProductData); // Handle saving changes
            handleModalClose(); // Close modal after saving
          }}
        />
      )}
    </div>
  );
};

export default EditProductForm;

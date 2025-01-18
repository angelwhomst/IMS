import React, { useState, useEffect } from 'react';
import './EditProductForm.css';
import EditSizeModal from './EditSizeModal';
<<<<<<< HEAD

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
=======
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
          const url = `/ims/products/size?productName=${productData.productName}&unitPrice=${productData.unitPrice}&productDescription=${productData.productDescription}&category=${categoryParam}`;

          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data.size)) {
              setSize(data.size);
            } else {
              setSize([]);
              setError("Invalid size data received.");
            }
          } else {
            setSize([]);
            setError("Failed to fetch product size.");
          }
        } catch (error) {
          setSize([]);
          setError("An error occurred while fetching product size.");
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
          const response = await fetch(
            `/ims/products/size_variants?productName=${encodeURIComponent(productData.productName)}&unitPrice=${productData.unitPrice}&productDescription=${encodeURIComponent(productData.productDescription || '')}&category=${encodeURIComponent(category)}`
          );

          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) {
              setSizeVariants(data);
            } else {
              setSizeVariants([]);
            }
          } else {
            setSizeVariants([]);
          }
        } catch (error) {
          setSizeVariants([]);
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
          category="men"  
          image_path
>>>>>>> IMS-DASH/master
        />
      )}
    </div>
  );
};

export default EditProductForm;

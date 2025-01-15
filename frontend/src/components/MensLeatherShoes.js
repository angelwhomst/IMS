import React, { useState, useEffect } from "react";
import "./MensLeatherShoes.css";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm"; // Import EditProductForm

const MensLeatherShoes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null); // State for product to edit
  const [error, setError] = useState(null); // State for error handling

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const addProduct = (product) => setProducts([...products, product]);

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const deleteProduct = () => {
    setProducts(products.filter((p) => p !== productToDelete));
    closeDeleteModal();
  };

  const openEditProduct = (product) => {
    setProductToEdit(product); // Set the product to edit
  };

  const closeEditProduct = () => setProductToEdit(null); // Close the EditProductForm

  // Fetch products from the API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/ims/products/Mens-Leather-Shoes");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data); // Update state with the fetched products
      } catch (error) {
        console.error(error);
        setError("Could not fetch products. Please try again later.");
      }
    };
    fetchProducts();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <div className="mens-catalog-products-container">
      <h1 className="mens-catalog-header">Men’s Leather Shoes</h1>
      <button className="mens-catalog-add-product-btn" onClick={openModal}>
        Add Product
      </button>

      {/* AddProductForm Modal */}
      <AddProductForm
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={addProduct}
      />

      {/* Error Handling UI */}
      {error && <div className="error-message">{error}</div>}

      <div className="mens-catalog-products-grid">
        {/* Mapping through products to display in grid */}
        {products.map((product, index) => (
          <div key={index} className="mens-catalog-product-card">
            {/* Displaying product image */}
            <img
              src={product.image_path} // Assuming the API response includes image_path
              alt={product.productName}
              onClick={() => openEditProduct(product)} // Pass the product to open the EditProductForm
            />
            <div className="mens-catalog-product-info">
              <h3>{product.productName}</h3>
              <p>{product.productDescription}</p>
              <p>Price: ${product.unitPrice}</p> {/* Assuming unitPrice is numeric */}
            </div>
            <div className="mens-catalog-product-actions">
              <button
                className="mens-catalog-delete-btn"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  openDeleteModal(product);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EditProductForm Modal */}
      {productToEdit && (
        <EditProductForm
          product={productToEdit} // Pass the product to EditProductForm
          onClose={closeEditProduct} // Close the form
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="mens-catalog-modal-overlay">
          <div className="mens-catalog-modal-content">
            <button
              className="mens-catalog-close-btn"
              onClick={closeDeleteModal}
            >
              &times;
            </button>
            <h2>
              Are you sure you want to delete "{productToDelete?.productName}"?
            </h2>
            <div className="mens-catalog-modal-actions">
              <button
                className="mens-catalog-confirm-btn"
                onClick={deleteProduct}
              >
                Yes
              </button>
              <button
                className="mens-catalog-cancel-btn"
                onClick={closeDeleteModal}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MensLeatherShoes;

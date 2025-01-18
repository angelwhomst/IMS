import React, { useState, useEffect } from "react";
import "./GirlsLeatherShoes.css"; // Create separate styles for Girl'sLeatherShoes
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm"; 

const GirlsLeatherShoes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
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

  const openEditProduct = (product) => setProductToEdit(product);
  const closeEditProduct = () => setProductToEdit(null);

  // Fetch products from the API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/ims/products/Girls-Leather-Shoes");
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
    <div className="girls-catalog-products-container">
      <h1 className="girls-catalog-header">Girl’s Leather Shoes</h1>
      <button className="girls-catalog-add-product-btn" onClick={openModal}>
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

      <div className="girls-catalog-products-grid">
        {/* Mapping through products to display in grid */}
        {products.map((product, index) => (
          <div key={index} className="girls-catalog-product-card">
            <img
              src={product.image_path} // Assuming the API response includes image_path
              alt={product.productName}
              onClick={() => openEditProduct(product)} // Open the EditProductForm on click
            />
            <div className="girls-catalog-product-info">
              <h3>{product.productName}</h3>
              <p>{product.productDescription}</p>
              <p>Price: ${product.unitPrice}</p> {/* Assuming unitPrice is numeric */}
            </div>
            <div className="girls-catalog-product-actions">
              <button
                className="girls-catalog-delete-btn"
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
        <div className="girls-catalog-modal-overlay">
          <div className="girls-catalog-modal-content">
            <button
              className="girls-catalog-close-btn"
              onClick={closeDeleteModal}
            >
              &times;
            </button>
            <h2>
              Are you sure you want to delete "{productToDelete?.productName}"?
            </h2>
            <div className="girls-catalog-modal-actions">
              <button
                className="girls-catalog-confirm-btn"
                onClick={deleteProduct}
              >
                Yes
              </button>
              <button
                className="girls-catalog-cancel-btn"
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

export default GirlsLeatherShoes;
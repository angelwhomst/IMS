import React, { useState } from "react";
import "./MensLeatherShoes.css";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm"; // Import the EditProductForm

const MensLeatherShoes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Add Product modal state
  const [products, setProducts] = useState([]); // State for products
  const [isEditMode, setIsEditMode] = useState(false); // Track Edit mode
  const [productToEdit, setProductToEdit] = useState(null); // Product being edited
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Delete Confirmation modal
  const [productToDelete, setProductToDelete] = useState(null); // Product to delete

  // Open Add Product Modal
  const openModal = () => {
    setIsModalOpen(true);
    setIsEditMode(false); // Ensure it's Add mode
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setProductToEdit(null);
  };

  // Add or Update Product
  const addProduct = (product) => {
    if (isEditMode) {
      const updatedProducts = products.map((p) =>
        p === productToEdit ? product : p
      );
      setProducts(updatedProducts);
    } else {
      setProducts([...products, product]);
    }
    closeModal();
  };

  // Open Edit Product Modal
  const openEditModal = (product) => {
    setProductToEdit(product);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  // Close Delete Confirmation Modal
  const closeDeleteModal = () => {
    setProductToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // Delete Product
  const deleteProduct = () => {
    setProducts(products.filter((p) => p !== productToDelete));
    closeDeleteModal();
  };

  return (
    <div className="products-container">
      <h1 className="catalog-header">Men’s Leather Shoes</h1>
      <button className="add-product-btn" onClick={openModal}>
        Add Product
      </button>

      {/* Conditionally render Add or Edit Product Form */}
      {isModalOpen && (
        isEditMode ? (
          <EditProductForm
            isOpen={isModalOpen}
            onClose={closeModal}
            onSubmit={addProduct}
            initialData={productToEdit} // Pass product data for Edit
          />
        ) : (
          <AddProductForm
            isOpen={isModalOpen}
            onClose={closeModal}
            onSubmit={addProduct}
            initialData={productToEdit} // Pass product data for Add
          />
        )
      )}

      {/* Product Grid */}
      <div className="products-grid">
        {products.map((product, index) => (
          <div key={index} className="product-card">
            <img
              src={URL.createObjectURL(product.image)}
              alt={product.productName}
            />
            <div className="product-info">
              <h3>{product.productName}</h3>
              <p>{product.description}</p>
              <p>Price: {product.price}</p>
            </div>
            <div className="product-actions">
              <button
                className="edit-btn"
                onClick={() => openEditModal(product)}
              >
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => openDeleteModal(product)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={closeDeleteModal}>
              &times;
            </button>
            <h2>
              Are you sure you want to delete "{productToDelete?.productName}"?
            </h2>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={deleteProduct}>
                Yes
              </button>
              <button className="cancel-btn" onClick={closeDeleteModal}>
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

import React, { useState } from "react";
import "./GirlsLeatherShoes.css";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm";

const GirlsLeatherShoes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for Add/Edit Product modal
  const [products, setProducts] = useState([]); // State for storing products
  const [isEditMode, setIsEditMode] = useState(false); // Track Edit mode
  const [productToEdit, setProductToEdit] = useState(null); // Product to edit
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for Delete Confirmation modal
  const [productToDelete, setProductToDelete] = useState(null); // Store the product to delete

  // Open Add Product modal
  const openModal = () => {
    setIsEditMode(false); // Set to Add mode
    setIsModalOpen(true);
  };

  // Open Edit Product modal
  const openEditModal = (product) => {
    setIsEditMode(true); // Set to Edit mode
    setProductToEdit(product); // Pass the product to edit
    setIsModalOpen(true);
  };

  // Close Add/Edit Product modal
  const closeModal = () => {
    setIsModalOpen(false);
    setProductToEdit(null); // Clear edit data
  };

  // Add or Update Product
  const addProduct = (product) => {
    if (isEditMode) {
      // Update existing product
      const updatedProducts = products.map((p) =>
        p === productToEdit ? product : p
      );
      setProducts(updatedProducts);
    } else {
      // Add new product
      setProducts([...products, product]);
    }
    closeModal();
  };

  // Open Delete Confirmation modal
  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  // Close Delete Confirmation modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  // Delete the product
  const deleteProduct = () => {
    setProducts(products.filter((p) => p !== productToDelete));
    closeDeleteModal();
  };

  return (
    <div className="products-container">
      <h1 className="catalog-header">Girl’s Leather Shoes</h1>

      {/* Button to trigger Add Product modal */}
      <button className="add-product-btn" onClick={openModal}>
        Add Product
      </button>

      {/* Add or Edit Product Form Modal */}
      {isEditMode ? (
        <EditProductForm
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={addProduct}
          initialData={productToEdit} // Pass product data for editing
        />
      ) : (
        <AddProductForm
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={addProduct}
        />
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

export default GirlsLeatherShoes;

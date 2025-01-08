import React, { useState } from "react";
import "./BoysLeatherShoes.css";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm"; // Import EditProductForm

const BoysLeatherShoes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for Add Product modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for Edit Product modal
  const [products, setProducts] = useState([]); // State for products
  const [productToEdit, setProductToEdit] = useState(null); // Product being edited
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Delete Confirmation Modal state
  const [productToDelete, setProductToDelete] = useState(null); // Product to delete

  // Open Add Product Modal
  const openAddModal = () => {
    setIsModalOpen(true);
  };

  // Close Add Product Modal
  const closeAddModal = () => {
    setIsModalOpen(false);
  };

  // Add Product
  const addProduct = (product) => {
    setProducts([...products, product]);
    closeAddModal();
  };

  // Open Edit Product Modal
  const openEditModal = (product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };

  // Close Edit Product Modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setProductToEdit(null);
  };

  // Update Product
  const updateProduct = (updatedProduct) => {
    const updatedProducts = products.map((p) =>
      p === productToEdit ? updatedProduct : p
    );
    setProducts(updatedProducts);
    closeEditModal();
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
      <h1 className="catalog-header">Boy’s Leather Shoes</h1>
      <button className="add-product-btn" onClick={openAddModal}>
        Add Product
      </button>

      {/* Add Product Form */}
      <AddProductForm
        isOpen={isModalOpen}
        onClose={closeAddModal}
        onSubmit={addProduct}
      />

      {/* Edit Product Form */}
      {isEditModalOpen && (
        <EditProductForm
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSubmit={updateProduct}
          initialData={productToEdit}
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

export default BoysLeatherShoes;

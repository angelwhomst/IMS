import React, { useState } from "react";
import "./GirlsLeatherShoes.css"; // Create separate styles for Girl'sLeatherShoes
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm"; 

const GirlsLeatherShoes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null); 

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

  return (
    <div className="girls-catalog-products-container">
      <h1 className="girls-catalog-header">Girl’s Leather Shoes</h1>
      <button className="girls-catalog-add-product-btn" onClick={openModal}>
        Add Product
      </button>

      <AddProductForm
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={addProduct}
      />

      <div className="girls-catalog-products-grid">
        {products.map((product, index) => (
          <div key={index} className="girls-catalog-product-card">
            <img
              src={URL.createObjectURL(product.image)}
              alt={product.productName}
              onClick={() => openEditProduct(product)} 
            />
            <div className="girls-catalog-product-info">
              <h3>{product.productName}</h3>
              <p>{product.description}</p>
              <p>Price: {product.price}</p>
            </div>
            <div className="girls-catalog-product-actions">
              <button
                className="girls-catalog-delete-btn"
                onClick={(e) => {
                  e.stopPropagation(); 
                  openDeleteModal(product);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {productToEdit && (
        <EditProductForm
          product={productToEdit} 
          onClose={closeEditProduct} 
        />
      )}

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

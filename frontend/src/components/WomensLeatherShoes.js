<<<<<<< HEAD
import React, { useState } from "react";
import "./WomensLeatherShoes.css"; // Create separate styles for Women'sLeatherShoes
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm"; 
=======
import React, { useState, useEffect } from "react";
import "./WomensLeatherShoes.css";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm";
>>>>>>> IMS-DASH/master

const WomensLeatherShoes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
<<<<<<< HEAD
  const [productToEdit, setProductToEdit] = useState(null); 
=======
  const [productToEdit, setProductToEdit] = useState(null);
  const [error, setError] = useState(null);
>>>>>>> IMS-DASH/master

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

<<<<<<< HEAD
  const openEditProduct = (product) => setProductToEdit(product); 
  const closeEditProduct = () => setProductToEdit(null); 
=======
  const openEditProduct = (product) => setProductToEdit(product);
  const closeEditProduct = () => setProductToEdit(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/ims/products/Womens-Leather-Shoes");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
        setError("Could not fetch products. Please try again later.");
      }
    };
    fetchProducts();
  }, []);
>>>>>>> IMS-DASH/master

  return (
    <div className="womens-catalog-products-container">
      <h1 className="womens-catalog-header">Women’s Leather Shoes</h1>
      <button className="womens-catalog-add-product-btn" onClick={openModal}>
        Add Product
      </button>

      <AddProductForm
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={addProduct}
      />

<<<<<<< HEAD
=======
      {error && <div className="error-message">{error}</div>}

>>>>>>> IMS-DASH/master
      <div className="womens-catalog-products-grid">
        {products.map((product, index) => (
          <div key={index} className="womens-catalog-product-card">
            <img
<<<<<<< HEAD
              src={URL.createObjectURL(product.image)}
              alt={product.productName}
              onClick={() => openEditProduct(product)} 
            />
            <div className="womens-catalog-product-info">
              <h3>{product.productName}</h3>
              <p>{product.description}</p>
              <p>Price: {product.price}</p>
=======
              src={product.image_path}
              alt={product.productName}
              onClick={() => openEditProduct(product)}
            />
            <div className="womens-catalog-product-info">
              <h3>{product.productName}</h3>
              <p>{product.productDescription}</p>
              <p>Price: ${product.unitPrice}</p>
>>>>>>> IMS-DASH/master
            </div>
            <div className="womens-catalog-product-actions">
              <button
                className="womens-catalog-delete-btn"
                onClick={(e) => {
<<<<<<< HEAD
                  e.stopPropagation(); 
=======
                  e.stopPropagation();
>>>>>>> IMS-DASH/master
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
<<<<<<< HEAD
          product={productToEdit} 
          onClose={closeEditProduct} 
=======
          product={productToEdit}
          onClose={closeEditProduct}
>>>>>>> IMS-DASH/master
        />
      )}

      {isDeleteModalOpen && (
        <div className="womens-catalog-modal-overlay">
          <div className="womens-catalog-modal-content">
            <button
              className="womens-catalog-close-btn"
              onClick={closeDeleteModal}
            >
              &times;
            </button>
            <h2>
              Are you sure you want to delete "{productToDelete?.productName}"?
            </h2>
            <div className="womens-catalog-modal-actions">
              <button
                className="womens-catalog-confirm-btn"
                onClick={deleteProduct}
              >
                Yes
              </button>
              <button
                className="womens-catalog-cancel-btn"
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

export default WomensLeatherShoes;

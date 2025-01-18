<<<<<<< HEAD
import React, { useState } from "react";
import "./MensLeatherShoes.css"; // Create separate styles for MensLeatherShoes
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm";
=======
import React, { useState, useEffect } from "react";
import "./MensLeatherShoes.css";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm";
import EditDescriptionModal from "./EditDescriptionModal";
>>>>>>> IMS-DASH/master

const MensLeatherShoes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
<<<<<<< HEAD
=======
  const [error, setError] = useState(null);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
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
  const openEditDescription = (product) => {
    setProductToEdit({ product, category: "men" });
    setIsDescriptionModalOpen(true);
    setIsProductFormOpen(false);
  };

  const openEditProduct = (product) => {
    setProductToEdit({ product, category: "men" });
    setIsProductFormOpen(true);
    setIsDescriptionModalOpen(false);
  };

  const closeEditProduct = () => {
    setProductToEdit(null);
    setIsProductFormOpen(false);
  };

  const closeEditDescription = () => {
    setProductToEdit(null);
    setIsDescriptionModalOpen(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/ims/products/Mens-Leather-Shoes");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();

        // Remove duplicates based on productName, productDescription, and unitPrice
        const uniqueProducts = data.filter((product, index, self) => 
          index === self.findIndex((p) => (
            p.productName === product.productName &&
            p.productDescription === product.productDescription &&
            p.unitPrice === product.unitPrice
          ))
        );

        setProducts(uniqueProducts);
      } catch (error) {
        console.error(error);
        setError("Could not fetch products. Please try again later.");
      }
    };

    fetchProducts();
  }, []);
>>>>>>> IMS-DASH/master

  return (
    <div className="mens-catalog-products-container">
      <h1 className="mens-catalog-header">Men’s Leather Shoes</h1>
      <button className="mens-catalog-add-product-btn" onClick={openModal}>
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
      <div className="mens-catalog-products-grid">
        {products.map((product, index) => (
          <div key={index} className="mens-catalog-product-card">
            <img
<<<<<<< HEAD
              src={URL.createObjectURL(product.image)}
=======
              src={product.image_path}
>>>>>>> IMS-DASH/master
              alt={product.productName}
              onClick={() => openEditProduct(product)}
            />
            <div className="mens-catalog-product-info">
              <h3>{product.productName}</h3>
<<<<<<< HEAD
              <p>{product.description}</p>
              <p>Price: {product.price}</p>
            </div>
            <div className="mens-catalog-product-actions">
              <button
=======
              <p>{product.productDescription}</p>
              <p>Price: ${product.unitPrice}</p>
            </div>

            <div className="mens-catalog-product-actions">
              <button
                className="mens-catalog-edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  openEditDescription(product);
                }}
              >
                Edit
              </button>
              <button
>>>>>>> IMS-DASH/master
                className="mens-catalog-delete-btn"
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

<<<<<<< HEAD
      {productToEdit && (
        <EditProductForm
          product={productToEdit}
=======
      {isProductFormOpen && productToEdit && (
        <EditProductForm
          product={productToEdit.product}
          category={productToEdit.category}
>>>>>>> IMS-DASH/master
          onClose={closeEditProduct}
        />
      )}

<<<<<<< HEAD
=======
      {isDescriptionModalOpen && productToEdit && (
        <EditDescriptionModal
          product={productToEdit.product}
          category={productToEdit.category}
          image={productToEdit.product.image_path}
          onClose={closeEditDescription}
        />
      )}

>>>>>>> IMS-DASH/master
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

<<<<<<< HEAD
export default MensLeatherShoes;
=======
export default MensLeatherShoes;
>>>>>>> IMS-DASH/master

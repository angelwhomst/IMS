import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WomensLeatherShoes.css";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm";

const WomensLeatherShoes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access_token"); // retrieves token

  const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000", 
    headers: {
      Authorization: `Bearer ${token}`, // attaches token to every request
    },
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const addProduct = async (product) => {
    try {
      const response = await axiosInstance.post("/ims/products", product);
      setProducts([...products, response.data]);
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Could not add product. Please try again.");
    }
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const deleteProduct = async () => {
    try {
      await axiosInstance.delete(`/ims/products/${productToDelete.id}`);
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Could not delete product. Please try again.");
    }
  };

  const openEditProduct = (product) => setProductToEdit(product);
  const closeEditProduct = () => setProductToEdit(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) {
        setError("Unauthorized: No access token found.");
        return;
      }

      try {
        const response = await axiosInstance.get("/ims/products/Womens-Leather-Shoes");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Could not fetch products. Please try again later.");
      }
    };

    fetchProducts();
  }, []);

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

      {error && <div className="error-message">{error}</div>}

      <div className="womens-catalog-products-grid">
        {products.map((product, index) => (
          <div key={index} className="womens-catalog-product-card">
            <img
              src={product.image_path}
              alt={product.productName}
              onClick={() => openEditProduct(product)}
            />
            <div className="womens-catalog-product-info">
              <h3>{product.productName}</h3>
              <p>{product.productDescription}</p>
              <p>Price: ${product.unitPrice}</p>
            </div>
            <div className="womens-catalog-product-actions">
              <button
                className="womens-catalog-delete-btn"
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
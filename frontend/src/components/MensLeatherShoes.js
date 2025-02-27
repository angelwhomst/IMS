import React, { useState, useEffect } from "react";  
import "./MensLeatherShoes.css";  
import axios from "axios";  
import AddProductForm from "./AddProductForm";  
import EditProductForm from "./EditProductForm";  
import EditDescriptionModal from "./EditDescriptionModal";  


const BASE_URL = "https://ims-wc58.onrender.com";

const MensLeatherShoes = () => {  
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [products, setProducts] = useState([]);  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);  
  const [productToDelete, setProductToDelete] = useState(null);  
  const [productToEdit, setProductToEdit] = useState(null);  
  const [error, setError] = useState(null);  
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);  
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);  

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

  const deleteProduct = async () => {
    if (!productToDelete) return;
  
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Unauthorized: No access token found.");
      return;
    }
  
    try {
      const productName = productToDelete.productName;
      const category = "Men's Leather Shoes"; 
  
      console.log(`Sending request to soft-delete product with the following data: {productName: '${productName}', category: '${category}'}`);
  
      const response = await axios.patch(
        `${BASE_URL}/ims/products/soft-delete?productName=${productName}&category=${category}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log(response.data);
  
      // Remove deleted product from state
      setProducts(products.filter((p) => p.productName !== productName));
  
      closeDeleteModal();
    } catch (error) {
      console.error("Error while deleting product:", error);
      setError("Could not delete product. Please try again later.");
    }
  };
  
  const openEditDescription = (product) => {
    setProductToEdit({
      product,
      category: "Men's Leather Shoes",
      productName: product.productName, // Send productName to modal
      productDescription: product.productDescription, // Send productDescription to modal
      unitPrice: product.unitPrice, // Send unitPrice to modal
    });
    setIsDescriptionModalOpen(true);
    setIsProductFormOpen(false);
  };

  const openEditProduct = (product) => {
    setProductToEdit({
      product,
      category: "Men's Leather Shoes",
      productName: product.productName, // Send productName to form
      productDescription: product.productDescription, // Send productDescription to form
      unitPrice: product.unitPrice, // Send unitPrice to form
    });
    setIsProductFormOpen(true);
    setIsDescriptionModalOpen(false);
  }; 

  const closeEditProduct = () => {  
    setProductToEdit(null);  
    setIsProductFormOpen(false);  
  };  

  const closeEditDescription = async () => {  
    setProductToEdit(null);  
    setIsDescriptionModalOpen(false);

    // Re-fetch products to reflect changes after closing the modal
    await fetchProducts();
  };  

  const fetchProducts = async () => {  
    const token = localStorage.getItem("access_token");  
    if (!token) {  
      setError("Unauthorized: No access token found.");  
      return;  
    }  

    try {  
      const response = await axios.get(`${BASE_URL}/ims/products/Mens-Leather-Shoes`, {  
        headers: {  
          Authorization: `Bearer ${token}`  
        }  
      });  

      // Log the response data to inspect it
      console.log(response.data);

      // Remove duplicates based on productName, productDescription, and unitPrice  
      const uniqueProducts = response.data.filter((product, index, self) =>   
        index === self.findIndex((p) => (  
          p.productName === product.productName &&  
          p.productDescription === product.productDescription &&  
          p.unitPrice === product.unitPrice  
        ))  
      );  

      // Ensure the fetched data is not null or undefined
      setProducts(uniqueProducts.filter(product => product && product.productName));
    } catch (error) {  
      console.error(error);  
      setError("Could not fetch products. Please try again later.");  
    }  
  };  

  useEffect(() => {  
    fetchProducts();  
  }, []);  

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

      {error && <div className="error-message">{error}</div>}

      <div className="mens-catalog-products-grid">
        {products.map((product, index) => {
          if (!product || !product.productName) {
            // Skip rendering this product if it's undefined or doesn't have a name
            return null;
          }

          const imagePath = product?.image_path || '../assets/mens-default.png';

          return (
            <div key={index} className="mens-catalog-product-card">
              <img
                src={imagePath}  // Ensure fallback image if image_path is undefined
                alt={product.productName}
                onClick={() => openEditProduct(product)}
              />
              <div className="mens-catalog-product-info">
                <h3>{product.productName}</h3>
                <p>{product.productDescription}</p>
                <p>Price: ₱{product.unitPrice}</p>
              </div>

              <div className="mens-catalog-product-actions">
                <button
                  className="mens-catalog-edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Edit button clicked for:", product.productName); // Add this console log
                    openEditDescription(product);
                  }}
                >
                  Edit
                </button>
                <button
                  className="mens-catalog-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Delete button clicked for:", product.productName);
                    openDeleteModal(product);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isProductFormOpen && productToEdit && (
        <EditProductForm
          product={productToEdit.product}
          category={productToEdit.category}
          onClose={closeEditProduct}
        />
      )}

      {isDescriptionModalOpen && productToEdit && (
        <EditDescriptionModal
          product={productToEdit.product}
          category={productToEdit.category}
          image={productToEdit.product.image_path}
          onClose={closeEditDescription}
        />
      )}

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
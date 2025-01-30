import React, { useState, useEffect } from "react";  
import "./WomensLeatherShoes.css";  
import axios from "axios";  
import AddProductForm from "./AddProductForm";  
import EditProductForm from "./EditProductForm";  
import EditDescriptionModal from "./EditDescriptionModal";  

const BASE_URL = "https://ims-wc58.onrender.com";

const WomensLeatherShoes = () => {  
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [products, setProducts] = useState([]);  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);  
  const [productToDelete, setProductToDelete] = useState(null);  
  const [productToEdit, setProductToEdit] = useState(null);  
  const [error, setError] = useState(null);  
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);  
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);  

  const openModal = () => {  
    console.log("Opening Add Product Modal");
    setIsModalOpen(true);  
  };  

  const closeModal = () => setIsModalOpen(false);  

  const addProduct = (product) => setProducts([...products, product]);  

  const openDeleteModal = (product) => {  
    console.log("Opening Delete Modal for Product:", product);
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
      const category = "Women's Leather Shoes"; 
  
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
  
      setProducts(products.filter((p) => p.productName !== productName));
  
      closeDeleteModal();
    } catch (error) {
      console.error("Error while deleting product:", error);
      setError("Could not delete product. Please try again later.");
    }
  };

  const openEditDescription = (product) => {  
    console.log("Opening Edit Description Modal for Product:", product);
    setProductToEdit({ product, category: "Women's Leather Shoes" });  
    setIsDescriptionModalOpen(true);  
    setIsProductFormOpen(false);  
  };  

  const openEditProduct = (product) => {  
    console.log("Opening Edit Product Modal for Product:", product);
    setProductToEdit({ product, category: "Women's Leather Shoes" });  
    setIsProductFormOpen(true);  
    setIsDescriptionModalOpen(false);  
  };  

  const closeEditProduct = () => {  
    setProductToEdit(null);  
    setIsProductFormOpen(false);
    fetchProducts();  // Re-fetch the products after closing the edit product modal
  };  

  const closeEditDescription = () => {
    if (productToEdit) {
      console.log("Saving edited product data:", productToEdit);
      handleSaveProduct(productToEdit);  // Save the edited product data
    }
  
    fetchProducts();  // Re-fetch the products after closing the description modal
  
    setProductToEdit(null);  // Clear the productToEdit state
    setIsDescriptionModalOpen(false);  // Close the modal
  };

  const fetchProducts = async () => {  
    const token = localStorage.getItem("access_token");  
    if (!token) {  
      setError("Unauthorized: No access token found.");  
      return;  
    }  

    try {  
      const response = await axios.get(`${BASE_URL}/ims/products/Womens-Leather-Shoes`, {  
        headers: {  
          Authorization: `Bearer ${token}`  
        }  
      });  

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

  useEffect(() => {  
    console.log("Updated products state:", products);
  }, [products]);

  const handleSaveProduct = (updatedProduct) => {
    console.log("Received updated product:", updatedProduct);
    setProducts((prevProducts) => 
      prevProducts.map((product) => 
        product.productName === updatedProduct.productName 
          ? { ...product, ...updatedProduct } 
          : product
      )
    );
  };

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
        {products.map((product, index) => {
          if (!product || !product.productName) {
            return null;
          }

          const imagePath = product?.image_path || '../assets/womens-default.png';

          return (
            <div key={index} className="womens-catalog-product-card">
              <img
                src={imagePath} 
                alt={product.productName}
                onClick={() => openEditProduct(product)}
              />
              <div className="womens-catalog-product-info">
                <h3>{product.productName}</h3>
                <p>{product.productDescription}</p>
                <p>Price: ₱{product.unitPrice}</p>
              </div>

              <div className="womens-catalog-product-actions">
                <button
                  className="womens-catalog-edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditDescription(product);
                  }}
                >
                  Edit
                </button>
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
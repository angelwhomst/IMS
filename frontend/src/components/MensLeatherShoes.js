import React, { useState, useEffect } from "react";
import "./MensLeatherShoes.css";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm"; // Import EditProductForm
import EditDescriptionModal from "./EditDescriptionModal"; // Import EditDescriptionModal

const MensLeatherShoes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null); // State for product to edit
  const [error, setError] = useState(null); // State for error handling
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false); // New state for EditDescriptionModal
  const [isProductFormOpen, setIsProductFormOpen] = useState(false); // State for EditProductForm modal

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

  const openEditDescription = (product) => {
    setProductToEdit({ product, category: 'men' }); // Pass category along with the product
    setIsDescriptionModalOpen(true); // Open the EditDescriptionModal
    setIsProductFormOpen(false); // Close the EditProductForm if it's open
    console.log('Product description to edit:', { product, category: 'men' });
  };

  const openEditProduct = (product) => {
    setProductToEdit({ product, category: 'men' }); // Pass category along with the product
    setIsProductFormOpen(true); // Open the EditProductForm
    setIsDescriptionModalOpen(false); // Close the EditDescriptionModal if it's open
    console.log('Product to edit:', { product, category: 'men' });
  };

  const closeEditProduct = () => {
    setProductToEdit(null); // Close the EditProductForm
    setIsProductFormOpen(false); // Ensure the EditProductForm is closed
  };

  const closeEditDescription = () => {
    setProductToEdit(null); // Close the EditDescriptionModal
    setIsDescriptionModalOpen(false); // Ensure the EditDescriptionModal is closed
  };

  // Fetch products from the API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/ims/products/Mens-Leather-Shoes");
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
    <div className="mens-catalog-products-container">
      <h1 className="mens-catalog-header">Men’s Leather Shoes</h1>
      <button className="mens-catalog-add-product-btn" onClick={openModal}>
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

      <div className="mens-catalog-products-grid">
        {/* Mapping through products to display in grid */}
        {products.map((product, index) => (
          <div key={index} className="mens-catalog-product-card">
            {/* Displaying product image */}
            <img
              src={product.image_path} // Assuming the API response includes image_path
              alt={product.productName}
              onClick={() => openEditProduct(product)} // Open EditProductForm on image click
            />
            <div className="mens-catalog-product-info">
              <h3>{product.productName}</h3>
              <p>{product.productDescription}</p>
              <p>Price: ${product.unitPrice}</p> {/* Assuming unitPrice is numeric */}
            </div>
            
            <div className="mens-catalog-product-actions">
              {/* Edit Button */}
              <button
                className="mens-catalog-edit-btn"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  openEditDescription(product); // Open EditDescriptionModal on Edit button click
                }}
              >
                Edit 
              </button>
              
              {/* Delete Button */}
              <button
                className="mens-catalog-delete-btn"
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
      {isProductFormOpen && productToEdit && (
        <EditProductForm
          product={productToEdit.product} // Pass the product to EditProductForm
          category={productToEdit.category} // Pass the category to EditProductForm
          onClose={closeEditProduct} // Close the form
        />
      )}

      {/* EditDescriptionModal */}
      {isDescriptionModalOpen && productToEdit && (
        <EditDescriptionModal
          product={productToEdit.product} // Pass the product to EditDescriptionModal
          onClose={closeEditDescription} // Close the description modal
        />
      )}

      {/* Delete Confirmation Modal */}
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

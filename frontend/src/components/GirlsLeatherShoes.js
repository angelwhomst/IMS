import React, { useState, useEffect } from "react";
import "./GirlsLeatherShoes.css";
import axios from "axios";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm";
import EditDescriptionModal from "./EditDescriptionModal";

const GirlsLeatherShoes = () => {
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
      const category = "Girl's Leather Shoes";

      console.log(`Sending request to soft-delete product with the following data: {productName: '${productName}', category: '${category}'}`);

      const response = await axios.patch(
        `/ims/products/soft-delete?productName=${productName}&category=${category}`, // Send data as query params
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
    console.log("Opening Edit Description Modal for Product:", product);
    setProductToEdit({ product, category: "Girl's Leather Shoes" });
    setIsDescriptionModalOpen(true);
    setIsProductFormOpen(false);
  };

  const openEditProduct = (product) => {
    console.log("Opening Edit Product Modal for Product:", product);
    setProductToEdit({ product, category: "Girl's Leather Shoes" });
    setIsProductFormOpen(true);
    setIsDescriptionModalOpen(false);
  };

  const closeEditProduct = () => {
    setProductToEdit(null);
    setIsProductFormOpen(false);
    refreshProducts();  // Refresh product list after closing the edit modal
  };

  const closeEditDescription = () => {
    setProductToEdit(null);
    setIsDescriptionModalOpen(false);
    refreshProducts();  // Refresh product list after closing the edit modal
  };

  const refreshProducts = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Unauthorized: No access token found.");
      return;
    }

    try {
      const response = await axios.get("/ims/products/Girls-Leather-Shoes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    const fetchProducts = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Unauthorized: No access token found.");
        return;
      }

      try {
        const response = await axios.get("/ims/products/Girls-Leather-Shoes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

    fetchProducts();
  }, []);  // Fetch products when the component mounts

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

      {error && <div className="error-message">{error}</div>}

      <div className="girls-catalog-products-grid">
        {products.map((product, index) => {
          if (!product || !product.productName) {
            // Skip rendering this product if it's undefined or doesn't have a name
            return null;
          }

          const imagePath = product?.image_path || '../assets/girls-default.png';

          return (
            <div key={index} className="girls-catalog-product-card">
              <img
                src={imagePath}  // Ensure fallback image if image_path is undefined
                alt={product.productName}
                onClick={() => openEditProduct(product)}
              />
              <div className="girls-catalog-product-info">
                <h3>{product.productName}</h3>
                <p>{product.productDescription}</p>
                <p>Price: ₱{product.unitPrice}</p>
              </div>

              <div className="girls-catalog-product-actions">
                <button
                  className="girls-catalog-edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditDescription(product);
                  }}
                >
                  Edit
                </button>
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
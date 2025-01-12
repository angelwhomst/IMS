import React, { useState } from "react";
import "./Products.css";
import AddProductsForm from "./AddProductsForm";

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const addProduct = (newProduct) => {
    const productWithImageURL = {
      ...newProduct,
      imageURL: newProduct.image ? URL.createObjectURL(newProduct.image) : null,
    };
    setProducts((prevState) => [...prevState, productWithImageURL]);
  };

  const editProduct = (index) => {
    setEditIndex(index);
    setEditedProduct({ ...products[index] });
  };

  const saveEditedProduct = () => {
    const updatedProducts = [...products];
    updatedProducts[editIndex] = editedProduct;
    setProducts(updatedProducts);
    setEditIndex(null);
    setEditedProduct({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const deleteProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  return (
    <div className="products-container">
     
      <button className="add-product-btn" onClick={openModal}>
        Add Product
      </button>

      {isModalOpen && (
        <AddProductsForm onClose={closeModal} addProduct={addProduct} />
      )}

      <div className="products-grid">
        {products.map((product, index) => (
          <div className="product-card" key={index}>
            <img
              src={product.imageURL || "placeholder.png"}
              alt={product.productName}
              className="product-image"
            />
            <div className="product-details">
              <h3>{product.productName}</h3>
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
              <p>Category: {product.category}</p>
              <p>Stock: {product.stockAvailable}</p>
            </div>
            <div className="product-actions">
              {editIndex === index ? (
                <div className="edit-actions">
                  <input
                    type="text"
                    name="productName"
                    value={editedProduct.productName || ""}
                    onChange={handleInputChange}
                    placeholder="Edit product name"
                  />
                  <button onClick={saveEditedProduct}>Save</button>
                </div>
              ) : (
                <>
                  <button onClick={() => editProduct(index)}>Edit</button>
                  <button onClick={() => deleteProduct(index)}>Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
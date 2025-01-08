import React, { useState } from "react";
import "./EditProductForm.css"; // Import the updated CSS for the EditProductForm modal

const EditProductForm = ({ isOpen, onClose, onSubmit, product }) => {
  const [formData, setFormData] = useState({
    productName: product?.productName || "",
    description: product?.description || "",
    price: product?.price || "",
    category: product?.category || "",
    supplier: product?.supplier || "",
    image: product?.image || null,
  });

  const [sizes, setSizes] = useState(product?.sizes || []);
  const [newSize, setNewSize] = useState("");
  const [sizeDetails, setSizeDetails] = useState(product?.sizeDetails || {});

  const [showErrorModal, setShowErrorModal] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevState) => ({ ...prevState, image: file }));
  };

  const handleAddSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setSizeDetails({
        ...sizeDetails,
        [newSize]: { threshold: "", stockAvailable: "", reorderQuantity: "" },
      });
      setNewSize("");
    }
  };

  const handleSizeDetailChange = (size, field, value) => {
    setSizeDetails((prevState) => ({
      ...prevState,
      [size]: { ...prevState[size], [field]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const allFieldsFilled =
      Object.values(formData).every((value) => value !== "" && value !== null) &&
      sizes.length > 0;

    if (!allFieldsFilled) {
      setShowErrorModal(true);
      return;
    }

    const formattedPrice = `₱${parseFloat(formData.price).toFixed(2)}`;
    const updatedFormData = {
      ...formData,
      price: formattedPrice,
      sizes,
      sizeDetails,
    };

    onSubmit(updatedFormData);
    onClose();
  };

  const closeErrorModal = () => setShowErrorModal(false);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <h2>Edit Product</h2>
        <form onSubmit={handleSubmit}>
          {/* Product Image */}
          <div className="form-group">
            <label>Product Image</label>
            <div className="image-upload">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <div className="image-placeholder">
                {formData.image ? (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Product"
                  />
                ) : (
                  <p>Upload Image</p>
                )}
              </div>
            </div>
          </div>

          {/* Other Form Fields */}
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Enter product name"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
            />
          </div>

          <div className="form-group">
            <label>Price (PHP)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="men">Men's Leather Shoes</option>
              <option value="women">Women's Leather Shoes</option>
              <option value="girls">Girls Leather Shoes</option>
              <option value="boys">Boys Leather Shoes</option>
            </select>
          </div>

          <div className="form-group">
            <label>Supplier</label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              placeholder="Enter supplier name"
            />
          </div>

          {/* Size Management */}
          <div className="form-group">
            <label>Sizes</label> {/* Updated label text */}
            <div className="size-input">
              <input
                type="text"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="Enter new size"
              />
              <button
                type="button"
                onClick={handleAddSize}
                className="add-size-btn"
              >
                Add Size
              </button>
            </div>
          </div>

          <div className="sizes">
            {sizes.map((size) => (
              <div key={size} className="size-container">
                <button
                  type="button"
                  className="size-btn"
                  onClick={() =>
                    setSizeDetails((prev) => ({
                      ...prev,
                      [size]: { ...prev[size], expanded: !prev[size]?.expanded },
                    }))
                  }
                >
                  {size}
                </button>
                {sizeDetails[size]?.expanded && (
                  <div className="size-details">
                    <div className="form-group">
                      <label>Threshold</label>
                      <input
                        type="number"
                        value={sizeDetails[size].threshold}
                        onChange={(e) =>
                          handleSizeDetailChange(size, "threshold", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Stock Available</label>
                      <input
                        type="number"
                        value={sizeDetails[size].stockAvailable}
                        onChange={(e) =>
                          handleSizeDetailChange(size, "stockAvailable", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Re-Order Quantity</label>
                      <input
                        type="number"
                        value={sizeDetails[size].reorderQuantity}
                        onChange={(e) =>
                          handleSizeDetailChange(size, "reorderQuantity", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button type="submit" className="submit-btn">
            Edit Product
          </button>
        </form>

        {showErrorModal && (
          <div className="error-modal-overlay">
            <div className="error-modal-content">
              <h2>Missing Fields</h2>
              <p>All fields are required. Please fill in all the fields.</p>
              <button className="submit-btn" onClick={closeErrorModal}>
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProductForm;

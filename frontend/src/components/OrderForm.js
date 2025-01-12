import React, { useState } from 'react';
import './OrderForm.css';
import AddNewAddressModal from './AddNewAddressModal'; // Import Add New Address Modal

const OrderForm = () => {
    const [productName, setProductName] = useState('');
    const [productSize, setProductSize] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [showSavedAddressModal, setShowSavedAddressModal] = useState(false);
    const [showAddNewAddressModal, setShowAddNewAddressModal] = useState(false);
    const [imageSrc, setImageSrc] = useState('/path/to/placeholder-image.jpg'); // Placeholder image path

    const handleQuantityChange = (e) => {
        const value = Math.max(1, e.target.value); // Ensure quantity doesn't go below 1
        setQuantity(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic
        console.log('Form submitted:', {
            productName, productSize, productCategory, quantity, price, deliveryAddress, recipientName, phoneNumber, email
        });
    };

    const handleProductChange = (e) => {
        setProductName(e.target.value);
        // Update product image based on selected product
        if (e.target.value === 'Product A') {
            setImageSrc('/path/to/product-a-image.jpg');
        } else if (e.target.value === 'Product B') {
            setImageSrc('/path/to/product-b-image.jpg');
        } else if (e.target.value === 'Product C') {
            setImageSrc('/path/to/product-c-image.jpg');
        } else {
            setImageSrc('/path/to/placeholder-image.jpg');
        }
    };

    const handleAddNewAddress = () => {
        setShowAddNewAddressModal(true);
    };

    return (
        <div className="order-form-container">
            <div className="order-form">
                <h2 className="form-title">Order Form</h2>

                {/* Image Placeholder */}
                <div className="product-image-container">
                    <img src={imageSrc} alt="Product" className="product-image" />
                </div>

                <div className="form-group">
                    <label>Product Name</label>
                    <select value={productName} onChange={handleProductChange}>
                        <option value="">Select Product</option>
                        <option value="Product A">Product A</option>
                        <option value="Product B">Product B</option>
                        <option value="Product C">Product C</option>
                        {/* Add more product options */}
                    </select>
                </div>

                {/* Product Size for Shoe Sizes */}
                <div className="form-group">
                    <label>Product Size (Shoe Size)</label>
                    <select value={productSize} onChange={(e) => setProductSize(e.target.value)}>
                        <option value="">Select Size</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        {/* Add more shoe sizes if needed */}
                    </select>
                </div>

                {/* Product Category Dropdown */}
                <div className="form-group">
                    <label>Product Category</label>
                    <select value={productCategory} onChange={(e) => setProductCategory(e.target.value)}>
                        <option value="">Select Category</option>
                        <option value="mens_leather_shoes">Men's Leather Shoes</option>
                        <option value="womens_leather_shoes">Women's Leather Shoes</option>
                        <option value="boys_leather_shoes">Boys' Leather Shoes</option>
                        <option value="girls_leather_shoes">Girls' Leather Shoes</option>
                        {/* Add more categories if needed */}
                    </select>
                </div>

                <div className="form-group">
                    <label>Quantity</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                    />
                </div>
        

                {/* Delivery Address Dropdown with Add New Address */}
                <div className="form-group">
                    <label>Delivery Address</label>
                    <select value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)}>
                        <option value="">Select Address</option>
                        <option value="123 Main St">123 Main St, City, Country</option>
                        <option value="456 Oak Ave">456 Oak Ave, City, Country</option>
                        <option value="789 Pine Rd">789 Pine Rd, City, Country</option>
                        <option value="add_new">Add New Address</option>
                    </select>
                    {deliveryAddress === 'add_new' && (
                        <button type="button" className="add-new-address-btn" onClick={handleAddNewAddress}>
                            Add New Address
                        </button>
                    )}
                </div>

                <div className="form-group">
                    <label>Recipient Name</label>
                    <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Enter Recipient Name"
                    />
                </div>

                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter Phone Number"
                    />
                </div>

                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter Email Address"
                    />
                </div>

                <button type="submit" className="submit-btn" onClick={handleSubmit}>Submit Order</button>
            </div>

            {/* Add New Address Modal */}
            {showAddNewAddressModal && (
                <AddNewAddressModal
                    onClose={() => setShowAddNewAddressModal(false)}
                />
            )}

            {/* Saved Address Modal */}
            {showSavedAddressModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Saved Addresses</h3>
                        <ul>
                            <li>123 Main St, City, Country</li>
                            <li>456 Oak Ave, City, Country</li>
                            <li>789 Pine Rd, City, Country</li>
                            {/* Add saved addresses from backend here */}
                        </ul>
                        <button onClick={() => setShowSavedAddressModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderForm;

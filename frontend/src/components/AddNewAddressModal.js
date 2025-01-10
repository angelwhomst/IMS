import React, { useState } from 'react';
import './AddNewAddressModal.css';

const AddNewAddressModal = ({ onClose }) => {
    const [address, setAddress] = useState({
        country: '',
        province: '',
        city: '',
        barangay: '',
        street: '',
        block: '',
        houseNumber: '',
        zipCode: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress({
            ...address,
            [name]: value
        });
    };

    const handleAddAddress = () => {
        // Handle adding the new address logic
        console.log('New Address:', address);
        onClose(); // Close modal after adding address
    };

    return (
        <div className="addnewaddress-modal">
            <div className="addnewaddress-modal-content">
                <button onClick={onClose} className="addnewaddress-close-btn">X</button>
                <h3>Add New Address</h3>
                <div className="addnewaddress-form-group">
                    <label>Country</label>
                    <input
                        type="text"
                        name="country"
                        value={address.country}
                        onChange={handleChange}
                        placeholder="Enter country"
                    />
                </div>
                <div className="addnewaddress-form-group">
                    <label>Province</label>
                    <input
                        type="text"
                        name="province"
                        value={address.province}
                        onChange={handleChange}
                        placeholder="Enter province"
                    />
                </div>
                <div className="addnewaddress-form-group">
                    <label>City/Municipality</label>
                    <input
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleChange}
                        placeholder="Enter city/municipality"
                    />
                </div>
                <div className="addnewaddress-form-group">
                    <label>Barangay</label>
                    <input
                        type="text"
                        name="barangay"
                        value={address.barangay}
                        onChange={handleChange}
                        placeholder="Enter barangay"
                    />
                </div>
                <div className="addnewaddress-form-group">
                    <label>Street</label>
                    <input
                        type="text"
                        name="street"
                        value={address.street}
                        onChange={handleChange}
                        placeholder="Enter street"
                    />
                </div>
                <div className="addnewaddress-form-group">
                    <label>Block</label>
                    <input
                        type="text"
                        name="block"
                        value={address.block}
                        onChange={handleChange}
                        placeholder="Enter block"
                    />
                </div>
                <div className="addnewaddress-form-group">
                    <label>House Number</label>
                    <input
                        type="text"
                        name="houseNumber"
                        value={address.houseNumber}
                        onChange={handleChange}
                        placeholder="Enter house number"
                    />
                </div>
                <div className="addnewaddress-form-group">
                    <label>ZIP Code</label>
                    <input
                        type="text"
                        name="zipCode"
                        value={address.zipCode}
                        onChange={handleChange}
                        placeholder="Enter ZIP code"
                    />
                </div>
                <button onClick={handleAddAddress} className="addnewaddress-submit-btn">Add Address</button>
            </div>
        </div>
    );
};

export default AddNewAddressModal;

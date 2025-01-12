import React from 'react';
import './ConfirmationModal.css'; // Correctly import the CSS file

const ConfirmationModal = ({ isOpen, onClose, onConfirm, productName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2 className="modal-title">Confirm Deletion</h2>
        <p className="modal-text">
          Are you sure you want to delete "<strong>{productName}</strong>"? This action cannot be undone.
        </p>
        <div className="modal-footer">
          <button onClick={onConfirm} className="delete-btn">
            Delete
          </button>
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

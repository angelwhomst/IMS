import React from 'react';
import './LogoutModal.css';  // Import custom CSS for styling

const LogoutModal = ({ isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Are you sure you want to logout?</h3>
        <div className="modal-actions">
          <button className="btn-no" onClick={onClose}>No</button>
          <button className="btn-yes" onClick={onLogout}>Yes</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;

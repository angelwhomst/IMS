import React from "react";
import "./SavedAddress.css"; // Import the modal CSS for styling

const SavedAddress = ({ closeModal }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Saved Address</h2>
        <p>Here you can select a saved address for delivery or enter a new one.</p>
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};

export default SavedAddress;

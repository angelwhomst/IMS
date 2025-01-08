import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./EmployeeNavBar.css";

const EmployeeNavBar = ({ onLogout }) => {
  const [menuActive, setMenuActive] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleMobileMenu = () => {
    setMenuActive(!menuActive);
  };

  const openLogoutModal = () => {
    setIsLogoutModalOpen(true); // Open logout confirmation modal
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false); // Close logout confirmation modal
  };

  const handleLogout = () => {
    onLogout(); // Call the onLogout prop to update the authentication state
    navigate("/"); // Redirect to the login page after logout
    closeLogoutModal(); // Close the logout modal after confirming logout
  };

  const handleCancelLogout = () => {
    closeLogoutModal(); // Close the logout modal when "No" is clicked
  };

  return (
    <header>
      <a href="#" className="logo-holder">
        <div className="logo"></div>
        <div className="logo-text">StepSync</div>
      </a>
      <nav>
        <ul id="menu" className={`menu ${menuActive ? "active" : ""}`}>
          <li>
            <Link to="/Sales">Sales</Link> {/* Link to Sales */}
          </li>
          <li>
            <Link to="/History">History</Link> {/* Link to History */}
          </li>
        </ul>

        <button className="mobile-toggle" onClick={toggleMobileMenu}>
          {menuActive ? (
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              width="24"
              height="24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              width="24"
              height="24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                d="M5 7h14M5 12h14M5 17h10"
              />
            </svg>
          )}
        </button>

        <div className="user-notification-icons">
          {/* Logout Button */}
          <button className="logout-icon" onClick={openLogoutModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M13 3a1 1 0 0 1 1 1v4h2V4a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v16a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3v-4h-2v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7ZM16 16l4-4-4-4v3H8v2h8v3Z" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="logout-modal">
          <div className="logout-modal-content">
            <h3>Are you sure you want to log out?</h3>
            <button className="btn btn-confirm" onClick={handleLogout}>
              Yes
            </button>
            <button className="btn btn-cancel" onClick={handleCancelLogout}>
              No
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default EmployeeNavBar;

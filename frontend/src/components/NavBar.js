import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for client-side navigation
import { useNavigate } from "react-router-dom";
import "./NavBar.css";
import AdminTool from "./AdminTool"; // Import AdminTool component

const NavBar = ({ onLogout }) => {
  const [menuActive, setMenuActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for Admin Tool
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // Modal state for logout confirmation
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleMobileMenu = () => {
    setMenuActive(!menuActive);
  };

  const openAdminToolModal = () => {
    setIsModalOpen(true); // Open the modal when the user icon is clicked
  };

  const closeAdminToolModal = () => {
    setIsModalOpen(false); // Close the modal
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
            <Link to="/Dashboard">Dashboard</Link> {/* Changed to Link */}
          </li>
          <li>
            <Link to="/ProductCatalog">Product Catalog</Link> {/* Changed to Link */}
          </li>
          <li>
            <Link to="/OrderAndRequest">Order & Request</Link> {/* Changed to Link */}
          </li>
          <li>
            <Link to="/Sales">Sales</Link> {/* Changed to Link */}
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
          <button className="notification-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="notification-icon-svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 10c0-4.418-3.582-8-8-8s-8 3.582-8 8c0 3.314-2 6.174-4.857 7.439.309.537.857.961 1.572 1.039 2.726.156 5.216 1.736 5.216 3.527 0 1.189.91 2.163 2.083 2.163h4.122c1.172 0 2.083-.974 2.083-2.163 0-1.791 2.49-3.371 5.216-3.527.715-.078 1.263-.502 1.572-1.039C20 16.174 18 13.314 18 10z"
              />
            </svg>
          </button>

          {/* Admin Tool Button */}
          <button className="user-icon" onClick={openAdminToolModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 12c-5.523 0-10 4.477-10 10h2a8 8 0 0 1 16 0h2c0-5.523-4.477-10-10-10z" />
            </svg>
          </button>

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
      {isModalOpen && <AdminTool closeModal={closeAdminToolModal} />}

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

export default NavBar;
 
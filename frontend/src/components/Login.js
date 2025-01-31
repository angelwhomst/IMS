import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin, onRoleSelect }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const navigate = useNavigate(); // React Router v6 hook

  // Regex for validating password (min 8 characters, at least one number, one uppercase, and one special character)
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password
    if (!passwordRegex.test(password)) {
      setPasswordError("Password must be at least 8 characters, include one uppercase letter, one number, and one special character.");
      setIsModalVisible(true); // Show the modal if validation fails
      return; // Prevent form submission if password is invalid
    }

    setPasswordError(""); // Clear any previous errors
    setIsModalVisible(false); // Hide the modal if validation is passed

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await axios.post(
        "https://ims-wc58.onrender.com/auth/token",
        formData, // Correctly formatted form data
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const { access_token } = response.data; // Extract token from response

      if (!access_token) {
        throw new Error("Token not received from server.");
      }

      // Store token in localStorage
      localStorage.setItem("access_token", access_token);

      // Decode token to extract user role
      const decodedToken = jwtDecode(access_token);
      console.log("Decoded Token:", decodedToken); // Debugging

      const role = decodedToken.role || "user"; // Default to 'user' if no role is present

      // Call parent callbacks
      onLogin(role);
      if (typeof onRoleSelect === "function") {
        onRoleSelect(role);
      } else {
        console.warn("onRoleSelect is not a function or missing.");
      }

      // Redirect based on role
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials. Please try again.");
    }
  };

  // Modal component
  const ErrorModal = ({ message, onClose }) => {
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close-btn" onClick={onClose}>&times;</span>
          <p>{message}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="login-container">
      <div className="blur-bg"></div>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <p className="login-description">Please log in to your account</p>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-btn">
          Log In
        </button>
      </form>

      {/* Show the modal if password is invalid */}
      {isModalVisible && <ErrorModal message={passwordError} onClose={() => setIsModalVisible(false)} />}
    </div>
  );
};

export default Login;

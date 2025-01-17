import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin, onRoleSelect }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Use the navigate hook from React Router v6

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', 
        },
        body: new URLSearchParams({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data); // Log the response data to inspect

        const { access_token } = data;

        // Store token in localStorage
        localStorage.setItem('access_token', access_token);

        // Decode the token and extract the role
        const decodedToken = jwtDecode(access_token);
        console.log('Decoded Token:', decodedToken); // Log decoded token to inspect its content

        // Ensure the decoded token contains the 'role' attribute
        const role = decodedToken.role;

        // Call the onLogin callback with the role
        onLogin(role);

        // Call onRoleSelect if it's passed as a prop
        if (onRoleSelect && typeof onRoleSelect === 'function') {
          onRoleSelect(role); // Only call if it's a valid function
        } else {
          console.warn('onRoleSelect is not a function or not passed as prop');
        }
        // Redirect to dashboard after successful login
        navigate('/dashboard');
      } else {
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while logging in.');
    }
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
    </div>
  );
};

export default Login;
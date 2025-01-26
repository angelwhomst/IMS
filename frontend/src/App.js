import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import NavBar from "./components/NavBar";
import EmployeeNavBar from "./components/EmployeeNavBar";
import Dashboard from "./components/Dashboard";
import Sales from "./components/Sales";
import EmployeeSales from "./components/EmployeeSales";
import EmployeeHistory from "./components/EmployeeHistory";
import ProductCatalog from "./components/ProductCatalog";
import OrderAndRequest from "./components/OrderAndRequest";
import Login from "./components/Login";
import MensLeatherShoes from "./components/MensLeatherShoes";
import WomensLeatherShoes from "./components/WomensLeatherShoes";
import BoysLeatherShoes from "./components/BoysLeatherShoes";
import GirlsLeatherShoes from "./components/GirlsLeatherShoes";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    checkAuth(); // run authentication check on page load
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get("https://ims-wc58.onrender.com/auth/users/me/", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });

      if (response.status === 200) {
        const userData = response.data;
        setRole(userData.userRole);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      setIsAuthenticated(false);
      setRole("");
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post("https://ims-wc58.onrender.com/auth/token", credentials, {
        withCredentials: true,
      });

      if (response.status === 200 && response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token); // Store token
        await checkAuth(); // Verify authentication and set role
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token'); // Remove token on logout
    setIsAuthenticated(false);
    setRole("");
  };

  return (
    <Router>
      {/* Conditionally render navbar based on role */}
      {isAuthenticated && role === "admin" && <NavBar onLogout={handleLogout} />}
      {isAuthenticated && role === "employee" && <EmployeeNavBar onLogout={handleLogout} />}

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              role === "admin" ? <Navigate to="/Dashboard" /> : <Navigate to="/EmployeeSales" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route path="/Dashboard" element={isAuthenticated && role === "admin" ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/EmployeeSales" element={isAuthenticated && role === "employee" ? <EmployeeSales /> : <Navigate to="/" />} />
        <Route path="/EmployeeHistory" element={isAuthenticated && role === "employee" ? <EmployeeHistory /> : <Navigate to="/" />} />
        <Route path="/Sales" element={isAuthenticated ? <Sales /> : <Navigate to="/" />} />
        <Route path="/ProductCatalog" element={isAuthenticated ? <ProductCatalog /> : <Navigate to="/" />} />
        <Route path="/OrderAndRequest" element={isAuthenticated ? <OrderAndRequest /> : <Navigate to="/" />} />
        <Route path="/mens-leather-shoes" element={<MensLeatherShoes />} />
        <Route path="/womens-leather-shoes" element={<WomensLeatherShoes />} />
        <Route path="/boys-leather-shoes" element={<BoysLeatherShoes />} />
        <Route path="/girls-leather-shoes" element={<GirlsLeatherShoes />} />
      </Routes>
    </Router>
  );
}

export default App;

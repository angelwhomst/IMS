import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import Sales from './components/Sales';
import EmployeeSales from './components/EmployeeSales'; // New import for Employee Sales
import EmployeeHistory from './components/EmployeeHistory'; // New import for Employee History
import ProductCatalog from './components/ProductCatalog';
import OrderAndRequest from './components/OrderAndRequest';
import Login from './components/Login';
import EmployeeNavBar from './components/EmployeeNavBar'; // New import for EmployeeNavBar
import MensLeatherShoes from './components/MensLeatherShoes'; // Men's Leather Shoes Page
import WomensLeatherShoes from './components/WomensLeatherShoes'; // Women's Leather Shoes Page
import BoysLeatherShoes from './components/BoysLeatherShoes'; // Boys' Leather Shoes Page
import GirlsLeatherShoes from './components/GirlsLeatherShoes'; // Girls' Leather Shoes Page

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');

  const handleLogin = (userRole) => {
    setRole(userRole);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole('');
  };

  return (
    <Router>
      {/* Conditionally render the Admin NavBar or Employee NavBar based on the role */}
      {isAuthenticated && role === 'admin' && <NavBar onLogout={handleLogout} />}
      {isAuthenticated && role === 'employee' && <EmployeeNavBar onLogout={handleLogout} />} {/* Only show EmployeeNavBar for employees */}

      {/* Application Routes */}
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? (role === 'admin' ? <Navigate to="/Dashboard" /> : <Navigate to="/EmployeeSales" />) : <Login onLogin={handleLogin} />} 
        />
        <Route path="/Dashboard" element={isAuthenticated && role === 'admin' ? <Dashboard /> : <Navigate to="/" />} />

        {/* Employee Routes */}
        <Route path="/EmployeeSales" element={isAuthenticated && role === 'employee' ? <EmployeeSales /> : <Navigate to="/" />} />
        <Route path="/EmployeeHistory" element={isAuthenticated && role === 'employee' ? <EmployeeHistory /> : <Navigate to="/" />} />

        {/* Other Routes */}
        <Route path="/Sales" element={isAuthenticated ? <Sales /> : <Navigate to="/" />} />
        <Route path="/ProductCatalog" element={isAuthenticated ? <ProductCatalog /> : <Navigate to="/" />} />
        <Route path="/OrderAndRequest" element={isAuthenticated ? <OrderAndRequest /> : <Navigate to="/" />} />

        {/* Product Routes */}
        <Route path="/mens-leather-shoes" element={<MensLeatherShoes />} />
        <Route path="/womens-leather-shoes" element={<WomensLeatherShoes />} />
        <Route path="/boys-leather-shoes" element={<BoysLeatherShoes />} />
        <Route path="/girls-leather-shoes" element={<GirlsLeatherShoes />} />
      </Routes>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import "./EmployeeHistory.css"; // Make sure to import the CSS file

const EmployeeHistory = () => {
  // State to hold the history data fetched from the backend
  const [historyData, setHistoryData] = useState([]);

  // Updated placeholder history data with product code, size, and price
  const placeholderData = [
    { productName: "Bella", productCode: "B123", size: "7", price: 100, category: "Women's Leather Shoes", totalQuantity: 50, date: "2024-12-01" },
    { productName: "Camila", productCode: "C124", size: "8", price: 120, category: "Women's Leather Shoes", totalQuantity: 30, date: "2024-12-02" },
    { productName: "Valent", productCode: "V125", size: "9", price: 130, category: "Women's Leather Shoes", totalQuantity: 20, date: "2024-12-03" },
    { productName: "Lucia", productCode: "L126", size: "10", price: 140, category: "Footwear", totalQuantity: 40, date: "2024-12-04" },
    { productName: "Mateo", productCode: "M127", size: "11", price: 150, category: "Men's Leather Shoes", totalQuantity: 60, date: "2024-12-05" },
  ];

  // Fetch history data from the backend (replace this part with actual API call later)
  useEffect(() => {
    // Simulate a backend fetch with a timeout
    setTimeout(() => {
      setHistoryData(placeholderData); // Replace with actual data from backend
    }, 1000); // Delay to simulate data loading
  }, []);

  return (
    <div className="employee-history-page">
      {/* History header */}
      <h1>Employee Activity History</h1>
      
      {/* Table for Backend Data */}
      <div className="table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Product Code</th>
              <th>Size</th>
              <th>Price</th>
              <th>Category</th>
              <th>Total Quantity Sold</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {/* Placeholder rows */}
            {historyData.length === 0 ? (
              <tr>
                <td colSpan="7" className="placeholder">
                  Loading data...
                </td>
              </tr>
            ) : (
              historyData.map((history, index) => (
                <tr key={index}>
                  <td>{history.productName}</td>
                  <td>{history.productCode}</td>
                  <td>{history.size}</td>
                  <td>${history.price}</td>
                  <td>{history.category}</td>
                  <td>{history.totalQuantity}</td>
                  <td>{history.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeHistory;

import React, { useEffect, useState } from "react";
import "./Sales.css"; // Make sure to import the CSS file

const Sales = () => {
  // State to hold the sales data fetched from the backend
  const [salesData, setSalesData] = useState([]);

  // Placeholder sales data (you can remove this once the backend data is available)
  const placeholderData = [
    { productName: "Product 1", category: "Category A", totalQuantity: 50, date: "2024-12-01" },
    { productName: "Product 2", category: "Category B", totalQuantity: 30, date: "2024-12-02" },
    { productName: "Product 3", category: "Category C", totalQuantity: 20, date: "2024-12-03" },
    { productName: "Product 4", category: "Category A", totalQuantity: 40, date: "2024-12-04" },
    { productName: "Product 5", category: "Category B", totalQuantity: 60, date: "2024-12-05" },
    // Placeholder data ends here
  ];

  // Fetch sales data from the backend (replace this part with actual API call later)
  useEffect(() => {
    // Simulate a backend fetch with a timeout
    setTimeout(() => {
      setSalesData(placeholderData); // Replace with actual data from backend
    }, 1000); // Delay to simulate data loading
  }, []);

  return (
    <div className="sales-page">
      {/* Sales header */}
      <h1>Sales</h1> {/* Added header for the Sales page */}
      
      {/* Table Placeholder for Backend Data */}
      <div className="table-container">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Total Quantity Sold</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {/* Placeholder rows */}
            {salesData.length === 0 ? (
              <tr>
                <td colSpan="4" className="placeholder">
                  Loading data...
                </td>
              </tr>
            ) : (
              salesData.map((sale, index) => (
                <tr key={index}>
                  <td>{sale.productName}</td>
                  <td>{sale.category}</td>
                  <td>{sale.totalQuantity}</td>
                  <td>{sale.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;

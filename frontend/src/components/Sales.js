import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Sales.css"; 

const Sales = () => {
  // state to hold the sales data fetched from the backend
  const [salesData, setSalesData] = useState([]);
  const [error, setError] = useState(null);

  // fetch sales data from the backend
  useEffect(() => {
    const fetchSalesData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Unauthorized: No access token found");
        return;
      }

      try
      {
        const response = await axios.get("/employee-sales/sales/data", {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        setSalesData(response.data["Sales History"]);
        setError(null);
      } catch (error){
        console.error("Error fetching sales data:", error);
        setError("Failed to fetch sales data.");
      }
    };

    fetchSalesData();
  }, []); // run once on component mount

  return (
    <div className="sales-page">
      {/* Sales header */}
      <h1>Sales</h1> {/* Header for the Sales page */}
      
      {/* Table Placeholder for Backend Data */}
      <div className="table-container">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Size</th>
              <th>Total Quantity Sold</th>
              <th>Total Amount</th> 
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan="6" className="error">
                  {error}
                </td>
              </tr>
            ) : salesData.length === 0 ? (
              <tr>
                <td colSpan="6" className="placeholder">
                  Loading data...
                </td>
              </tr>
            ) : (
              salesData.map((sale, index) => (
                <tr key={index}>
                  <td>{sale["Product Name"]}</td>
                  <td>{sale.Category}</td>
                  <td>{sale.Size}</td>
                  <td>{sale["Total Quantity Sold"]}</td>
                  <td>₱{sale["Total Amount"]}</td> 
                  <td>{sale["Sales Date"]}</td>
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

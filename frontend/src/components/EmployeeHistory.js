import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EmployeeHistory.css";

const EmployeeHistory = () => {
  // State to hold the history data fetched from the backend
  const [historyData, setHistoryData] = useState([]);
  const [error, setError] = useState(null);

 
  // fetch history data from the backend
  useEffect(() => {
    const fetchHistoryData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Unauthorized: No access token found.");
        return;
      }

      try {
        const response = await axios.get("/employee-sales/sales/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHistoryData(response.data["Employee Sales History"]);
        setError(null);
      } catch (error){
        console.error("Error fetching sales history:", error);
        setError("Failed to fetch sales history.");
      }
    };

    fetchHistoryData();
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
                  <td>{history["Product Name"]}</td>  
                  <td>{history["Size"]}</td>  
                  <td>₱{history["Total Amount"]}</td>  
                  <td>{history["Category"]}</td>  
                  <td>{history["Total Quantity Sold"]}</td>  
                  <td>{history["Sales Date"]}</td>
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

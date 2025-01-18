import React, { useEffect, useState } from "react";
<<<<<<< HEAD
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
=======
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
>>>>>>> IMS-DASH/master

  return (
    <div className="sales-page">
      {/* Sales header */}
<<<<<<< HEAD
      <h1>Sales</h1> {/* Header for the Sales page */}
=======
      <h1>Sales</h1> {/* Added header for the Sales page */}
>>>>>>> IMS-DASH/master
      
      {/* Table Placeholder for Backend Data */}
      <div className="table-container">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
<<<<<<< HEAD
              <th>Size</th>
              <th>Total Quantity Sold</th>
              <th>Total Amount</th> 
=======
              <th>Total Quantity Sold</th>
>>>>>>> IMS-DASH/master
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
<<<<<<< HEAD
            {error ? (
              <tr>
                <td colSpan="6" className="error">
                  {error}
                </td>
              </tr>
            ) : salesData.length === 0 ? (
              <tr>
                <td colSpan="6" className="placeholder">
=======
            {/* Placeholder rows */}
            {salesData.length === 0 ? (
              <tr>
                <td colSpan="4" className="placeholder">
>>>>>>> IMS-DASH/master
                  Loading data...
                </td>
              </tr>
            ) : (
              salesData.map((sale, index) => (
                <tr key={index}>
<<<<<<< HEAD
                  <td>{sale["Product Name"]}</td>
                  <td>{sale.Category}</td>
                  <td>{sale.Size}</td>
                  <td>{sale["Total Quantity Sold"]}</td>
                  <td>₱{sale["Total Amount"]}</td> 
                  <td>{sale["Sales Date"]}</td>
=======
                  <td>{sale.productName}</td>
                  <td>{sale.category}</td>
                  <td>{sale.totalQuantity}</td>
                  <td>{sale.date}</td>
>>>>>>> IMS-DASH/master
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

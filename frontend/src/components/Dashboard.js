import React, { useState, useEffect } from "react";
import axios from "axios";  // Import axios to make API requests
import "./Dashboard.css";

const BASE_URL = "https://ims-wc58.onrender.com";

const Dashboard = () => {
  const [orderCount, setOrderCount] = useState(0);  // State to hold order count
  const [deliveredCount, setDeliveredCount] = useState(0);  // State to hold delivered count
  const [productCount, setProductCount] = useState(0);  // State to hold product count
  const [error, setError] = useState(null);  // State to hold error message

  useEffect(() => {
    // Fetch all counts from the API on component mount
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem("access_token");  // Get the token from localStorage

        if (!token) {
          setError("No token found in localStorage");
          return;
        }

        // Fetch total order count
        const orderResponse = await axios.get(
          `${BASE_URL}/dashboard/orders/last30days/count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,  // Add Authorization header
            },
          }
        );
        setOrderCount(orderResponse.data.orderCount);  // Set the fetched order count

        // Fetch delivered order count
        const deliveredResponse = await axios.get(
          `${BASE_URL}/dashboard/orders/delivered/last30days/count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,  // Add Authorization header
            },
          }
        );
        setDeliveredCount(deliveredResponse.data.deliveredOrderCount);  // Set the fetched delivered count

        // Fetch total product count
        const productResponse = await axios.get(
          `${BASE_URL}/dashboard/products/count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,  // Add Authorization header
            },
          }
        );
        setProductCount(productResponse.data["Total Products"]);  // Set the fetched product count
      } catch (err) {
        setError("Error fetching data: " + err.message);  // Handle errors
      }
    };

    fetchCounts();  // Call the function to fetch the counts
  }, []);  // Empty dependency array ensures this runs once on mount

  return (
    <div className="dashboard-main">
      {/* Dashboard Summary Section */}
      <section className="dashboard-summary">
        <div className="dashboard-card">
          <h2 className="dashboard-summary-card-title">Orders</h2>
          <p>{error ? error : orderCount}</p>  {/* Display order count or error message */}
        </div>
        <div className="dashboard-card">
          <h2 className="dashboard-summary-card-title">Delivered</h2>
          <p>{error ? error : deliveredCount}</p>  {/* Display delivered count or error message */}
        </div>
        <div className="dashboard-card">
          <h2 className="dashboard-summary-card-title">Total Product</h2>
          <p>{error ? error : productCount}</p>  {/* Display product count or error message */}
        </div>
        <div className="dashboard-card">
          <h2 className="dashboard-summary-card-title">Revenue</h2>
          <p>₱10,000</p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

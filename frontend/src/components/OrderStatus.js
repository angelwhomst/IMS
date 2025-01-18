import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrderStatus.css";

const OrderStatus = () => {
  const [status, setStatus] = useState("All");
  const [orders, setOrders] = useState([]); // state to hold fetched orders

  //function to fetch orders from the backend
  const fetchOrders = async () => {
    try {
      const endpoint =
        status === "All"
          ? "/receive-orders/all-orders"
          : `/receive-orders/${status}-orders`;

      const response = await axios.get(endpoint);

      const dataKey =
        status === "All" ? "All order status" : `${status} orders`;
      setOrders(response.data[dataKey] || []);
    } catch (error) {
      console.error("Error fetching orders: ", error);
    }
  };

  useEffect(() => {
    fetchOrders(); //fetch orders when the component mounts or status changes
  }, [status]);

  const handleDropdownChange = (e) => {
    setStatus(e.target.value);
  };

  return (
    <div>
      {/* Display Selected Status */}
      <div className="header-container">
        <h3 className="order-status-header">Selected Status: {status}</h3>
        {/* Status Dropdown */}
        <div className="dropdown-container">
          <select
            id="status-select"
            className="dropdown"
            value={status}
            onChange={handleDropdownChange}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Rejected">Rejected</option>
            <option value="To Ship">To Ship</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Render filtered cards */}
      {orders.map((order) => (
        <div key={order.id} className="card">
          <img src="https://via.placeholder.com/60" alt="Product" />
          <div className="card-details">
            <p className="product-name">{order["Product Name"] || "Unknown"}</p>
            <p className="category">{order.Category || "Uncategorized"}</p>
            <p><strong>Size:</strong> {order.Size || "N/A"}</p>
            <p><strong>Quantity:</strong> {order.Quantity || "N/A"}</p>
            <p><strong>Total Price:</strong> ₱{order["Total Price"] || "N/A"}</p>
            <p
              className={`order-status ${
                order.Status
                  ? order.Status.toLowerCase().replace(" ", "-")
                  : "unknown-status"
              }`}
            >
              Status: {order.Status || "Unknown"}
            </p>
            <p className="date"><strong>Date:</strong> {order.Date || "N/A"}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStatus;

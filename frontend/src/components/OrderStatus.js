<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import axios from "axios";
=======
import React, { useState } from "react";
>>>>>>> IMS-DASH/master
import "./OrderStatus.css";

const OrderStatus = () => {
  const [status, setStatus] = useState("All");
<<<<<<< HEAD
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
=======

  // Sample data for the orders
  const orders = [
    { id: 1, name: "Widget A", size: "Medium", quantity: 2, price: "$25.00", status: "Shipped" },
    { id: 2, name: "Widget B", size: "Large", quantity: 1, price: "$40.00", status: "To Shipped" },
    { id: 3, name: "Widget C", size: "Small", quantity: 5, price: "$10.00", status: "Received" },
    { id: 4, name: "Widget D", size: "Medium", quantity: 3, price: "$30.00", status: "Shipped" },
    { id: 5, name: "Widget E", size: "Large", quantity: 4, price: "$45.00", status: "To Shipped" },
    { id: 6, name: "Widget A", size: "Medium", quantity: 2, price: "$25.00", status: "Shipped" },
    { id: 7, name: "Widget B", size: "Large", quantity: 1, price: "$40.00", status: "To Shipped" },
    { id: 8, name: "Widget C", size: "Small", quantity: 5, price: "$10.00", status: "Received" },
    { id: 9, name: "Widget D", size: "Medium", quantity: 3, price: "$30.00", status: "Shipped" },
    { id: 10, name: "Widget E", size: "Large", quantity: 4, price: "$45.00", status: "To Shipped" },
  ];

  // Filter orders based on the selected status
  const filteredOrders = orders.filter(order => status === "All" || order.status === status);
>>>>>>> IMS-DASH/master

  const handleDropdownChange = (e) => {
    setStatus(e.target.value);
  };

  return (
    <div>
<<<<<<< HEAD
      {/* Display Selected Status */}
      <div className="header-container">
        <h3 className="order-status-header">Selected Status: {status}</h3>
        {/* Status Dropdown */}
=======

      {/* Display Selected Status and align it to the left */}
      <div className="header-container">
        <h3 className="order-status-header">Selected Status: {status}</h3>

        {/* Select Status Label and Dropdown */}
>>>>>>> IMS-DASH/master
        <div className="dropdown-container">
          <select
            id="status-select"
            className="dropdown"
            value={status}
            onChange={handleDropdownChange}
          >
            <option value="All">All</option>
<<<<<<< HEAD
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Rejected">Rejected</option>
            <option value="To Ship">To Ship</option>
            <option value="Delivered">Delivered</option>
=======
            <option value="Shipped">Shipped</option>
            <option value="To Shipped">To Shipped</option>
            <option value="Received">Received</option>
>>>>>>> IMS-DASH/master
          </select>
        </div>
      </div>

      {/* Render filtered cards */}
<<<<<<< HEAD
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
=======
      {filteredOrders.map(order => (
        <div key={order.id} className="card">
          {/* Image placeholder on the left */}
          <img
            src="https://via.placeholder.com/60"
            alt="Product"
          />
          <div className="card-details">
            <p className="product-name">{order.name}</p>
            <p>Size: {order.size}</p>
            <p>Quantity: {order.quantity}</p>
            <p>Price: {order.price}</p>
            <p className={`order-status ${order.status.toLowerCase().replace(' ', '-')}`}>
              Status: {order.status}
            </p>
>>>>>>> IMS-DASH/master
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStatus;

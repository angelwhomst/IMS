import React, { useState } from "react";
import "./OrderStatus.css";

const OrderStatus = () => {
  const [status, setStatus] = useState("All");

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

  const handleDropdownChange = (e) => {
    setStatus(e.target.value);
  };

  return (
    <div>

      {/* Display Selected Status and align it to the left */}
      <div className="header-container">
        <h3 className="order-status-header">Selected Status: {status}</h3>

        {/* Select Status Label and Dropdown */}
        <div className="dropdown-container">
          <select
            id="status-select"
            className="dropdown"
            value={status}
            onChange={handleDropdownChange}
          >
            <option value="All">All</option>
            <option value="Shipped">Shipped</option>
            <option value="To Shipped">To Shipped</option>
            <option value="Received">Received</option>
          </select>
        </div>
      </div>

      {/* Render filtered cards */}
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStatus;

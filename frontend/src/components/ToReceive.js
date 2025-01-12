import React from "react";
import "./ToReceive.css";

const ToReceive = () => {
  // Sample data for the orders
  const orders = [
    { id: 1, name: "Widget A", size: "Medium", quantity: 2, price: "$25.00" },
    { id: 2, name: "Widget B", size: "Large", quantity: 1, price: "$40.00" },
    { id: 3, name: "Widget C", size: "Small", quantity: 5, price: "$10.00" },
    { id: 4, name: "Widget D", size: "Medium", quantity: 3, price: "$30.00" },
    { id: 5, name: "Widget E", size: "Large", quantity: 4, price: "$45.00" },
  ];

  const handleReceivedClick = (id) => {
    console.log(`Order ${id} marked as received`);
  };

  return (
    <div>
      {/* Red Header with 'To Receive' */}
      <h1 className="to-receive-header">To Receive</h1>

      {/* Render cards for orders */}
      {orders.map((order) => (
        <div key={order.id} className="card">
          {/* Image placeholder */}
          <img src="https://via.placeholder.com/60" alt="Product" />
          <div className="card-details">
            <p className="product-name">{order.name}</p>
            <p>Size: {order.size}</p>
            <p>Quantity: {order.quantity}</p>
            <p>Price: {order.price}</p>

            {/* Received Button */}
            <button
              className="received-button"
              onClick={() => handleReceivedClick(order.id)}
            >
              RECEIVED
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToReceive;

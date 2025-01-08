import React from "react";
import "./Completed.css";

const Completed = () => {
  // Sample data for the completed orders
  const orders = [
    { id: 1, name: "Widget A", size: "Medium", quantity: 2, price: "$25.00" },
    { id: 2, name: "Widget B", size: "Large", quantity: 1, price: "$40.00" },
    { id: 3, name: "Widget C", size: "Small", quantity: 5, price: "$10.00" },
    { id: 4, name: "Widget D", size: "Medium", quantity: 3, price: "$30.00" },
    { id: 5, name: "Widget E", size: "Large", quantity: 4, price: "$45.00" },
  ];

  const handleBuyAgain = (id) => {
    console.log(`Order ${id} - Buy Again clicked`);
  };

  const handleReturn = (id) => {
    console.log(`Order ${id} - Return clicked`);
  };

  return (
    <div>
      {/* Header with 'Completed' */}
      <h1 className="completed-header">Completed</h1>

      {/* Render cards for completed orders */}
      {orders.map((order) => (
        <div key={order.id} className="card">
          {/* Image placeholder */}
          <img src="https://via.placeholder.com/60" alt="Product" />
          <div className="card-details">
            <p className="product-name">{order.name}</p>
            <p>Size: {order.size}</p>
            <p>Quantity: {order.quantity}</p>
            <p>Price: {order.price}</p>
          </div>

          {/* Buttons: Buy Again and Return */}
          <div className="card-buttons">
            <button
              className="buy-again-button"
              onClick={() => handleBuyAgain(order.id)}
            >
              Buy Again
            </button>
            <button
              className="return-button"
              onClick={() => handleReturn(order.id)}
            >
              Return
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Completed;

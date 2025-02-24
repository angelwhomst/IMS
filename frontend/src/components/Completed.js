import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Completed.css";

const Completed = () => {
  const [orders, setOrders] = useState([]);

  // Fetch orders with 'Received' status
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("https://ims-wc58.onrender.com/receive-orders/Received-orders");
        setOrders(response.data["Received orders"]);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

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
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.id} className="card">
            {/* Image placeholder */}
            <img src="https://via.placeholder.com/60" alt="Product" />
            <div className="card-details">
              <p className="product-name">{order["Product Name"] || "Unknown"}</p>
              <p><strong>Size:</strong> {order.Size || "N/A"}</p>
              <p><strong>Quantity:</strong> {order.Quantity || "N/A"}</p>
              <p><strong>Total Price:</strong> ₱{order["Total Price"] || "N/A"}</p>
              {/* Add additional buttons or actions if necessary */}
              {/* <button onClick={() => handleBuyAgain(order.id)}>Buy Again</button>
              <button onClick={() => handleReturn(order.id)}>Return</button> */}
            </div>
          </div>
        ))
      ) : (
        <p>No completed orders found.</p>
      )}
    </div>
  );
};

export default Completed;

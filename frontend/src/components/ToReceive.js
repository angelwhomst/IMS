import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ToReceive.css";

const ToReceive = () => {
  const [orders, setOrders] = useState([]); // State to store fetched orders
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log("Fetching orders...");
        const response = await axios.get("https://ims-wc58.onrender.com/receive-orders/ims/variants/delivered");
        console.log("Fetched orders:", response.data.delivered_orders); // Log the fetched orders
        setOrders(response.data.delivered_orders); // Store fetched orders in state
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchOrders();
  }, []); // Empty dependency array means this runs only once when the component mounts

  // Function to handle marking an order as received
  const handleReceivedClick = async (orderId) => {
    if (!orderId) {
      console.error("Order ID is undefined or missing.");
      return; // Prevent further execution if `orderId` is invalid
    }

    try {
      console.log("Sending order ID:", orderId); // Log the order ID
      const response = await axios.post(
        "https://ims-wc58.onrender.com/receive-orders/ims/orders/mark-received",
        { order_id: orderId },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Order marked as received:", response.data.message); // Log success message
      // Update the UI after marking as received
      setOrders((prevOrders) => prevOrders.filter((order) => order.order_id !== orderId));
    } catch (error) {
      console.error(
        "Error marking the order as received:",
        error.response?.data?.detail || error.message
      );
    }
  };

  if (loading) {
    return <p>Loading orders...</p>; // Show loading text while fetching data
  }

  return (
    <div>
      {/* Red Header with 'To Receive' */}
      <h1 className="to-receive-header">To Receive</h1>

      {/* Render cards for orders */}
      {orders.length > 0 ? (
        orders.map((order) => {
          console.log("Order ID:", order.order_id); // Debugging: log each order ID
          return (
            <div key={order.order_id} className="card"> {/* Using order_id as key */}
              {/* Image placeholder */}
              <img src="https://via.placeholder.com/60" alt="Product" />
              <div className="card-details">
                <p className="product-name">{order.product_name}</p>
                <p>Size: {order.size}</p>
                <p>Quantity: {order.quantity}</p>
                <p>Price: {order.total_price}</p>

                {/* Received Button */}
                <button
                  className="received-button"
                  onClick={() => handleReceivedClick(order.order_id)} // Pass order_id here
                >
                  RECEIVED
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <p>No delivered orders found.</p>
      )}
    </div>
  );
};

export default ToReceive;
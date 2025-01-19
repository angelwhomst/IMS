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
        const response = await axios.get('/receive-orders/ims/variants/delivered');
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

    const handleReceivedClick = async (orderId) => {
      console.log("Sending order ID:", orderId);  // Log the order ID to confirm it's being passed
      try {
        const response = await axios.post(
          '/receive-orders/ims/variants/mark-received', 
          { order_id: orderId },
          { headers: { 'Content-Type': 'application/json' } }
        );
        console.log("Order marked as received:", response.data.message); // Log the success message
        // Optionally, update the UI after marking as received
        setOrders((prevOrders) => prevOrders.filter(order => order.order_id !== orderId)); // Remove the marked order
      } catch (error) {
        console.error("Error marking the order as received:", error.response?.data?.detail || error.message);
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
        orders.map((order) => (
          <div key={order.order_id} className="card">  {/* Using order_id as key */}
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
                onClick={() => handleReceivedClick(order.order_id)}  // Pass order_id here
              >
                RECEIVED
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No delivered orders found.</p>
      )}
    </div>
  );
};

export default ToReceive;

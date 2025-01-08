// OrderAndRequest.js
import React, { useState } from "react";
import OrderForm from "./OrderForm"; // Importing OrderForm Component
import OrderStatus from "./OrderStatus"; // Importing OrderStatus Component
import ToReceive from "./ToReceive"; // Importing ToReceive Component
import Returned from "./Returned"; // Importing Returned Component
import Completed from "./Completed"; // Importing Completed Component
import "./OrderAndRequest.css"; // Link to CSS file for styling the navigation bar

const OrderAndRequest = () => {
  const [activeContent, setActiveContent] = useState("Order Form");

  const handleOptionClick = (option) => {
    setActiveContent(option);
  };

  const renderContent = () => {
    switch (activeContent) {
      case "Order Form":
        return <OrderForm />;
      case "Order Status":
        return <OrderStatus />;
      case "To Receive":
        return <ToReceive />;
      case "Returned":
        return <Returned />;
      case "Completed":
        return <Completed />;
      default:
        return <div>Select an option to display content</div>;
    }
  };

  return (
    <div>
      {/* Navigation Bar */}
      <div className="nav-bar">
        <ul className="nav-options">
          <li onClick={() => handleOptionClick("Order Form")}>
            <i className="fas fa-file-alt"></i> {/* Order Form Icon */}
            Order Form
          </li>
          <li onClick={() => handleOptionClick("Order Status")}>
            <i className="fas fa-search"></i> {/* Order Status Icon */}
            Order Status
          </li>
          <li onClick={() => handleOptionClick("To Receive")}>
            <i className="fas fa-box-open"></i> {/* To Receive Icon */}
            To Receive
          </li>
          <li onClick={() => handleOptionClick("Returned")}>
            <i className="fas fa-undo"></i> {/* Returned Icon */}
            Returned
          </li>
          <li onClick={() => handleOptionClick("Completed")}>
            <i className="fas fa-check"></i> {/* Completed Icon */}
            Completed
          </li>
        </ul>
      </div>

      {/* Dynamic Content */}
      <div className="content">{renderContent()}</div>
    </div>
  );
};

export default OrderAndRequest;
  
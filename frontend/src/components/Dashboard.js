import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-main">
      {/* Dashboard Summary Section */}
      <section className="dashboard-summary">
        <div className="dashboard-card">
          <h2 className="dashboard-summary-card-title">Orders</h2>
          <p>150</p>
        </div>
        <div className="dashboard-card">
          <h2 className="dashboard-summary-card-title">Delivered</h2>
          <p>120</p>
        </div>
        <div className="dashboard-card">
          <h2 className="dashboard-summary-card-title">Total Stocks Available</h2>
          <p>500</p>
        </div>
        <div className="dashboard-card">
          <h2 className="dashboard-summary-card-title">Revenue</h2>
          <p>$10,000</p>
        </div>
      </section>

      {/* Recent Activities Section */}
      <section className="dashboard-recent-activities">
        <h2>Recent Activities</h2>
        <ul>
          <li className="activity-item">
            <span className="activity-icon">📦</span>
            <div className="activity-details">
              <p>Order #1023 delivered successfully.</p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </li>
          <li className="activity-item">
            <span className="activity-icon">🔄</span>
            <div className="activity-details">
              <p>Stock replenishment completed.</p>
              <span className="activity-time">1 day ago</span>
            </div>
          </li>
          <li className="activity-item">
            <span className="activity-icon">⚠️</span>
            <div className="activity-details">
              <p>Threshold alert triggered for Item #45.</p>
              <span className="activity-time">3 days ago</span>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;

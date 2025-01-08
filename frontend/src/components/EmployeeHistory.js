import React, { useState, useEffect } from 'react';

const EmployeeHistory = () => {
  const [history, setHistory] = useState([]);

  // Fetch history data (This is a sample, you can replace it with actual data from an API or database)
  useEffect(() => {
    const fetchHistoryData = () => {
      setHistory([
        { id: 1, activity: 'Completed order #1023', date: '2 hours ago' },
        { id: 2, activity: 'Restocked leather shoes', date: '1 day ago' },
        { id: 3, activity: 'Received stock replenishment', date: '3 days ago' },
      ]);
    };

    fetchHistoryData();
  }, []);

  return (
    <div className="employee-history">
      <h2>Activity History</h2>
      <ul>
        {history.map((item) => (
          <li key={item.id}>
            {item.activity} <span>{item.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeHistory;

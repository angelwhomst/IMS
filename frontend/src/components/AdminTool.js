import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import axios from "axios"; // Import axios for API calls
import "./AdminTool.css"; // Import the updated CSS file

const AdminTool = ({ closeModal }) => {
  const [employees, setEmployees] = useState([]);
  const [employeeFirstName, setEmployeeFirstName] = useState("");
  const [employeeLastName, setEmployeeLastName] = useState("");
  const [employeeUsername, setEmployeeUsername] = useState("");
  const [employeePassword, setEmployeePassword] = useState("");
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken")); // Store JWT token

  useEffect(() => {
    // Fetch employee list when component mounts
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/employees/list-employee-accounts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error.response?.data || error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (employeeFirstName && employeeLastName && employeeUsername && employeePassword) {
      const newEmployee = {
        firstName: employeeFirstName,
        lastName: employeeLastName,
        username: employeeUsername,
        password: employeePassword,
      };
      
      if (editingEmployeeId) {
        await updateEmployee(editingEmployeeId, newEmployee);
      } else {
        await createEmployee(newEmployee);
      }
      // Clear input fields
      setEmployeeFirstName("");
      setEmployeeLastName("");
      setEmployeeUsername("");
      setEmployeePassword("");
      setEditingEmployeeId(null); // Reset editing mode
    }
  };

  const createEmployee = async (newEmployee) => {
    try {
      await axios.post('/employees/create', newEmployee, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchEmployees(); // Re-fetch employee list
    } catch (error) {
      console.error("Error creating employee:", error.response?.data || error);
    }
  };

  const updateEmployee = async (id, updatedEmployee) => {
    try {
      await axios.put(`/employees/update/${id}`, updatedEmployee, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchEmployees(); // Re-fetch employee list
    } catch (error) {
      console.error("Error updating employee:", error.response?.data || error);
    }
  };

  const handleEditClick = (id) => {
    const employeeToEdit = employees.find((emp) => emp.userID === id);
    if (employeeToEdit) {
      setEmployeeFirstName(employeeToEdit.firstName);
      setEmployeeLastName(employeeToEdit.lastName);
      setEmployeeUsername(employeeToEdit.username);
      setEmployeePassword(employeeToEdit.password);
      setEditingEmployeeId(id); // Set to editing mode
    }
  };

  const handleDeleteClick = (id) => {
    setEmployeeToDelete(id);
    setShowConfirmationModal(true); // Show confirmation modal
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteEmployee(employeeToDelete);
      setShowConfirmationModal(false);
      setEmployeeToDelete(null); // Reset the state
    } catch (error) {
      console.error("Error deleting employee:", error.response?.data || error);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`/employees/delete/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchEmployees(); // Re-fetch employee list
    } catch (error) {
      console.error("Error deleting employee:", error.response?.data || error);
    }
  };

  const handleDeleteCancel = () => {
    setShowConfirmationModal(false);
    setEmployeeToDelete(null); // Reset the state
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content">
        <button className="admin-close-btn" onClick={closeModal}>
          &times;
        </button>

        <h2>{editingEmployeeId ? "Edit Employee" : "Add Employee"}</h2>
        <div className="admin-modal-body">
          <form className="admin-form" onSubmit={handleFormSubmit}>
            <input
              type="text"
              placeholder="First Name"
              value={employeeFirstName}
              onChange={(e) => setEmployeeFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={employeeLastName}
              onChange={(e) => setEmployeeLastName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              value={employeeUsername}
              onChange={(e) => setEmployeeUsername(e.target.value)}
            />
            <div className="admin-password-container">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                value={employeePassword}
                onChange={(e) => setEmployeePassword(e.target.value)}
              />
              <span className="admin-eye-icon" onClick={togglePasswordVisibility}>
                {passwordVisible ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            <button type="submit" className="save-changes">
              {editingEmployeeId ? "Save Changes" : "Add Employee"}
            </button>
          </form>
          <div className="employee-card">
            <h3>Employee List</h3>
            <ul className="admin-ul">
              {employees.map((emp) => (
                <li key={emp.userID}>
                  <span>
                    First Name: <strong>{emp.firstName}</strong>
                  </span>
                  <span>
                    Last Name: <strong>{emp.lastName}</strong>
                  </span>
                  <span className="username">Username: {emp.username}</span>
                  <div className="buttons">
                    <button className="delete-btn" onClick={() => handleDeleteClick(emp.userID)}>
                      Delete
                    </button>
                    <button className="edit-btn" onClick={() => handleEditClick(emp.userID)}>
                      Edit
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="confirmation-modal">
          <div className="confirmation-modal-content">
            <h3>Are you sure you want to delete this employee?</h3>
            <button className="btn btn-confirm" onClick={handleDeleteConfirm}>
              Yes
            </button>
            <button className="btn btn-cancel" onClick={handleDeleteCancel}>
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTool;

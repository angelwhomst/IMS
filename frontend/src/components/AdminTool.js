import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import "./AdminTool.css"; // Import the updated CSS file

const AdminTool = ({ closeModal }) => {
  const [employees, setEmployees] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");
  const [employeeUsername, setEmployeeUsername] = useState("");
  const [employeePassword, setEmployeePassword] = useState("");
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (employeeName && employeeRole && employeeUsername && employeePassword) {
      if (editingEmployeeId) {
        setEmployees((prevEmployees) =>
          prevEmployees.map((emp) =>
            emp.id === editingEmployeeId
              ? {
                  ...emp,
                  name: employeeName,
                  role: employeeRole,
                  username: employeeUsername,
                  password: employeePassword,
                }
              : emp
          )
        );
        setEditingEmployeeId(null); // Reset editing mode
      } else {
        setEmployees([ 
          ...employees, 
          { 
            id: Date.now(), // Unique id 
            name: employeeName, 
            role: employeeRole, 
            username: employeeUsername, 
            password: employeePassword, 
          } 
        ]);
      }
      // Clear input fields
      setEmployeeName("");
      setEmployeeRole("");
      setEmployeeUsername("");
      setEmployeePassword("");
    }
  };

  const handleEditClick = (id) => {
    const employeeToEdit = employees.find((emp) => emp.id === id);
    if (employeeToEdit) {
      setEmployeeName(employeeToEdit.name);
      setEmployeeRole(employeeToEdit.role);
      setEmployeeUsername(employeeToEdit.username);
      setEmployeePassword(employeeToEdit.password);
      setEditingEmployeeId(id); // Set to editing mode
    }
  };

  const handleDeleteClick = (id) => {
    setEmployeeToDelete(id);
    setShowConfirmationModal(true); // Show confirmation modal
  };

  const handleDeleteConfirm = () => {
    setEmployees((prevEmployees) =>
      prevEmployees.filter((emp) => emp.id !== employeeToDelete)
    );
    setShowConfirmationModal(false);
    setEmployeeToDelete(null); // Reset the state
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
              placeholder="Name"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Role"
              value={employeeRole}
              onChange={(e) => setEmployeeRole(e.target.value)}
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
                <li key={emp.id}>
                  <span>Name: <strong>{emp.name}</strong></span>
                  <span className="role">Role: {emp.role}</span>
                  <span className="username">Username: {emp.username}</span>
                  <div className="buttons">
                    <button className="delete-btn" onClick={() => handleDeleteClick(emp.id)}>
                      Delete
                    </button>
                    <button className="edit-btn" onClick={() => handleEditClick(emp.id)}>
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
            <button
              className="btn btn-confirm"
              onClick={handleDeleteConfirm}
            >
              Yes
            </button>
            <button
              className="btn btn-cancel"
              onClick={handleDeleteCancel}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTool;

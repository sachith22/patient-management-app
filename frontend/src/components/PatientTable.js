import React, { useState } from 'react';
import Swal from 'sweetalert2';

function PatientTable({
  patients,
  onEdit,
  onDelete,
  onUpdate,
  currentPage,
  totalPages,
  fetchPatients,
  searchTerm,
  setSearchTerm,
  pageSize,
}) {
  const [editRow, setEditRow] = useState(null);
  const [editData, setEditData] = useState({});
  const [errors, setErrors] = useState({});
  const [viewPatient, setViewPatient] = useState(null);

  // Start editing
  const startEdit = (p) => {
    setEditRow(p.id);
    setEditData({ ...p });
    setErrors({});
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!editData.firstName?.trim()) errs.firstName = 'First name is required';
    if (!editData.lastName?.trim()) errs.lastName = 'Last name is required';
    if (!editData.address?.trim()) errs.address = 'Address is required';
    if (!editData.city?.trim()) errs.city = 'City is required';
    if (!editData.state?.trim()) errs.state = 'State is required';
    if (!editData.zipCode?.trim()) errs.zipCode = 'Zip Code is required';
    if (!editData.phoneNumber?.trim()) errs.phoneNumber = 'Phone number is required';
    else if (!/^\+?\d{7,15}$/.test(editData.phoneNumber)) errs.phoneNumber = 'Invalid phone number';
    if (!editData.email?.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) errs.email = 'Invalid email';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const saveEdit = async () => {
    if (validate()) {
      await onUpdate(editData);
      setEditRow(null);
    }
  };

  const confirmDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This patient will be permanently deleted!',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });
    if (result.isConfirmed) {
      await onDelete(id);
    }
  };

  return (
    <div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <div className="table-responsive">
          <table className="table table-striped table-hover table-sm">
            <thead className="table-light">
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th>Zip</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  {editRow === p.id ? (
                    <>
                      {['firstName','lastName','address','city','state','zipCode','phoneNumber','email'].map((f) => (
                        <td key={f}>
                          <input
                            name={f}
                            value={editData[f] || ''}
                            onChange={handleChange}
                            className={`form-control ${errors[f] ? 'is-invalid' : ''}`}
                          />
                          {errors[f] && <div className="invalid-feedback">{errors[f]}</div>}
                        </td>
                      ))}
                      <td>
                        <button className="btn btn-success btn-sm me-1" onClick={saveEdit}>Save</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditRow(null)}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{p.firstName}</td>
                      <td>{p.lastName}</td>
                      <td>{p.address}</td>
                      <td>{p.city}</td>
                      <td>{p.state}</td>
                      <td>{p.zipCode}</td>
                      <td>{p.phoneNumber}</td>
                      <td>{p.email}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-info btn-sm" onClick={() => setViewPatient(p)}>View</button>
                          <button className="btn btn-warning btn-sm" onClick={() => startEdit(p)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(p.id)}>Delete</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => fetchPatients(currentPage - 1, searchTerm)}>Previous</button>
          </li>
          {[...Array(totalPages)].map((_, i) => (
            <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
              <button className="page-link" onClick={() => fetchPatients(i, searchTerm)}>{i + 1}</button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => fetchPatients(currentPage + 1, searchTerm)}>Next</button>
          </li>
        </ul>
      </nav>
      {/* Modal */}
      {viewPatient && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content shadow-lg rounded-3">

              {/* Modal Header */}
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Patient Details</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setViewPatient(null)}
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>First Name:</strong> {viewPatient.firstName}
                  </li>
                  <li className="list-group-item">
                    <strong>Last Name:</strong> {viewPatient.lastName}
                  </li>
                  <li className="list-group-item">
                    <strong>Address:</strong> {viewPatient.address}
                  </li>
                  <li className="list-group-item">
                    <strong>City:</strong> {viewPatient.city}
                  </li>
                  <li className="list-group-item">
                    <strong>State:</strong> {viewPatient.state}
                  </li>
                  <li className="list-group-item">
                    <strong>Zip Code:</strong> {viewPatient.zipCode}
                  </li>
                  <li className="list-group-item">
                    <strong>Phone:</strong> {viewPatient.phoneNumber}
                  </li>
                  <li className="list-group-item">
                    <strong>Email:</strong> {viewPatient.email}
                  </li>
                </ul>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setViewPatient(null)}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientTable;

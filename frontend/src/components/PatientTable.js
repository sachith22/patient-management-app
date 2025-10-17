import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function PatientTable({ patients, onUpdate, onDelete, rowsPerPage = 5 }) {
  const [editRow, setEditRow] = useState(null);
  const [editData, setEditData] = useState({});
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState(patients);
  const [viewPatient, setViewPatient] = useState(null);

  useEffect(() => {
    const filtered = patients.filter(p =>
      Object.values(p).some(
        val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredPatients(filtered);
    setCurrentPage(1);
  }, [searchTerm, patients]);

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
    if (!editData.phoneNumber?.trim()) {
      errs.phoneNumber = 'Phone number is required';
    } else if (!/^\+?\d{7,15}$/.test(editData.phoneNumber)) {
      errs.phoneNumber = 'Invalid phone number';
    }
    if (!editData.email?.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      errs.email = 'Invalid email address';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const saveEdit = () => {
    if (validate()) {
      onUpdate(editData);
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
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      onDelete(id);
      Swal.fire('Deleted!', 'Patient has been deleted.', 'success');
    }
  };

  const totalPages = Math.ceil(filteredPatients.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="container">
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table wrapper with horizontal and vertical scroll */}
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
                <th>Zip Code</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.map((p) => (
                <tr key={p.id}>
                  {editRow === p.id ? (
                    <>
                      <td><input name="firstName" value={editData.firstName || ''} onChange={handleChange} className="form-control" /></td>
                      <td><input name="lastName" value={editData.lastName || ''} onChange={handleChange} className="form-control" /></td>
                      <td><input name="address" value={editData.address || ''} onChange={handleChange} className="form-control" /></td>
                      <td><input name="city" value={editData.city || ''} onChange={handleChange} className="form-control" /></td>
                      <td><input name="state" value={editData.state || ''} onChange={handleChange} className="form-control" /></td>
                      <td><input name="zipCode" value={editData.zipCode || ''} onChange={handleChange} className="form-control" /></td>
                      <td><input name="phoneNumber" value={editData.phoneNumber || ''} onChange={handleChange} className="form-control" /></td>
                      <td><input name="email" value={editData.email || ''} onChange={handleChange} className="form-control" /></td>
                      <td>
                        <div className="d-flex flex-nowrap">
                          <button className="btn btn-success btn-sm me-1" onClick={saveEdit}>Save</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => setEditRow(null)}>Cancel</button>
                        </div>
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
                        <div className="d-flex flex-nowrap">
                          <button className="btn btn-info btn-sm me-1" onClick={() => setViewPatient(p)}>View</button>
                          <button className="btn btn-warning btn-sm me-1" onClick={() => startEdit(p)}>Edit</button>
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
        <ul className="pagination mt-2">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Previous</button>
          </li>
          {[...Array(totalPages)].map((_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next</button>
          </li>
        </ul>
      </nav>

      {/* Modal */}
      {viewPatient && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Patient Details</h5>
                <button type="button" className="btn-close" onClick={() => setViewPatient(null)}></button>
              </div>
              <div className="modal-body">
                <p><strong>First Name:</strong> {viewPatient.firstName}</p>
                <p><strong>Last Name:</strong> {viewPatient.lastName}</p>
                <p><strong>Address:</strong> {viewPatient.address}</p>
                <p><strong>City:</strong> {viewPatient.city}</p>
                <p><strong>State:</strong> {viewPatient.state}</p>
                <p><strong>Zip Code:</strong> {viewPatient.zipCode}</p>
                <p><strong>Phone:</strong> {viewPatient.phoneNumber}</p>
                <p><strong>Email:</strong> {viewPatient.email}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setViewPatient(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientTable;

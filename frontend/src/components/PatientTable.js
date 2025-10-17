import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function PatientTable({ patients, onUpdate, onDelete, rowsPerPage = 5 }) {
  const [editRow, setEditRow] = useState(null);
  const [editData, setEditData] = useState({});
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState(patients);

  // Filter patients on search
  useEffect(() => {
    const filtered = patients.filter(p =>
      Object.values(p).some(
        val =>
          val &&
          val.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredPatients(filtered);
    setCurrentPage(1); // reset to first page when search changes
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
      //icon: 'warning',
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

  // Pagination logic
  const totalPages = Math.ceil(filteredPatients.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div>
      {/* Search Input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Scrollable Table */}
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <table className="table table-striped table-hover">
          <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
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
                    <td>
                      <input
                        name="firstName"
                        value={editData.firstName || ''}
                        onChange={handleChange}
                        className="form-control"
                      />
                      {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
                    </td>
                    <td>
                      <input
                        name="lastName"
                        value={editData.lastName || ''}
                        onChange={handleChange}
                        className="form-control"
                      />
                      {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
                    </td>
                    <td>
                      <input
                        name="address"
                        value={editData.address || ''}
                        onChange={handleChange}
                        className="form-control"
                      />
                      {errors.address && <small className="text-danger">{errors.address}</small>}
                    </td>
                    <td>
                      <input
                        name="city"
                        value={editData.city || ''}
                        onChange={handleChange}
                        className="form-control"
                      />
                      {errors.city && <small className="text-danger">{errors.city}</small>}
                    </td>
                    <td>
                      <input
                        name="state"
                        value={editData.state || ''}
                        onChange={handleChange}
                        className="form-control"
                      />
                      {errors.state && <small className="text-danger">{errors.state}</small>}
                    </td>
                    <td>
                      <input
                        name="phoneNumber"
                        value={editData.phoneNumber || ''}
                        onChange={handleChange}
                        className="form-control"
                      />
                      {errors.phoneNumber && <small className="text-danger">{errors.phoneNumber}</small>}
                    </td>
                    <td>
                      <input
                        name="email"
                        value={editData.email || ''}
                        onChange={handleChange}
                        className="form-control"
                      />
                      {errors.email && <small className="text-danger">{errors.email}</small>}
                    </td>
                    <td>
                      <button className="btn btn-success btn-sm" onClick={saveEdit}>Save</button>
                      <button className="btn btn-secondary btn-sm ms-2" onClick={() => setEditRow(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{p.firstName}</td>
                    <td>{p.lastName}</td>
                    <td>{p.address}</td>
                    <td>{p.city}</td>
                    <td>{p.state}</td>
                    <td>{p.phoneNumber}</td>
                    <td>{p.email}</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => startEdit(p)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(p.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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
    </div>
  );
}

export default PatientTable;

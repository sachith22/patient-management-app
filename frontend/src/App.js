import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import PatientForm from './components/PatientForm';
import PatientTable from './components/PatientTable';
import './components/styles.css';

function App() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(5);
  const [sortField] = useState('id');
  const [sortDir] = useState('desc'); // descending to show newest first
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch patients with pagination, search, sort
  const fetchPatients = async (page = 0, search = '') => {
    try {
      const res = await axios.get(
        `/patient?page=${page}&size=${pageSize}&sort=${sortField},${sortDir}&search=${search}`
      );
      setPatients(res.data.content);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.number);
    } catch (err) {
      console.error('Error fetching patients:', err);
      Swal.fire('Error', 'Failed to load patients', 'error');
    }
  };

  useEffect(() => {
    fetchPatients(0, searchTerm);
  }, [searchTerm]);

  // Handle add or update patient
  const handleSave = async (patient) => {
    try {
      if (patient.id) {
        await axios.put(`/patient/${patient.id}`, patient);
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `Patient ${patient.firstName} ${patient.lastName} updated successfully.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await axios.post('/patient', patient);
        Swal.fire({
          icon: 'success',
          title: 'Saved!',
          text: `Patient ${patient.firstName} ${patient.lastName} added successfully.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }

      // Refresh first page (newest record shows first)
      await fetchPatients(0, searchTerm);
      setSelectedPatient(null);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    }
  };

  // Handle delete patient
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/patient/${id}`);
      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'Patient deleted successfully.',
        timer: 1500,
        showConfirmButton: false,
      });

      // Refresh current page
      const newPage = currentPage >= totalPages - 1 ? totalPages - 1 : currentPage;
      await fetchPatients(Math.max(newPage, 0), searchTerm);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Error deleting patient', 'error');
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Patient Management Dashboard</h2>
      <PatientForm onSave={handleSave} selectedPatient={selectedPatient} />
      <PatientTable
        patients={patients}
        onEdit={setSelectedPatient}
        onDelete={handleDelete}
        onUpdate={handleSave}
        currentPage={currentPage}
        totalPages={totalPages}
        fetchPatients={fetchPatients}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        pageSize={pageSize}
      />
    </div>
  );
}

export default App;

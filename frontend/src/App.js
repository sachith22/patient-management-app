import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PatientForm from './components/PatientForm';
import PatientTable from './components/PatientTable';
import './components/styles.css';

function App() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const fetchPatients = async () => {
    try {
      const res = await axios.get('/patient');
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSave = async (patient) => {
    try {
      if (patient.id) {
        await axios.put(`/patient/${patient.id}`, patient);
      } else {
        await axios.post('/patient', patient);
      }
      setSelectedPatient(null);
      fetchPatients();
    } catch (err) {
      console.error(err);
      alert('Error saving patient: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/patient/${id}`);
      fetchPatients();
    } catch (err) {
      console.error(err);
      alert('Error deleting patient');
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Patient Management Dashboard</h2>
      <PatientForm onSave={handleSave} selectedPatient={selectedPatient} />
      <PatientTable patients={patients} onEdit={setSelectedPatient} onDelete={handleDelete} onUpdate={handleSave}/>
    </div>
  );
}

export default App;

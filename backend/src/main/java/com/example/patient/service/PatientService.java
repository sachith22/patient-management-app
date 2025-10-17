package com.example.patient.service;

import com.example.patient.entity.Patient;
import com.example.patient.exception.ResourceNotFoundException;
import com.example.patient.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository repo;

    public PatientService(PatientRepository repo) {
        this.repo = repo;
    }

    public List<Patient> findAll() {
        return repo.findAll();
    }

    public Patient findById(Long id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
    }

    public Patient create(Patient p) {
        p.setId(null);
        return repo.save(p);
    }

    public Patient update(Long id, Patient incoming) {
        Patient existing = findById(id);
        existing.setFirstName(incoming.getFirstName());
        existing.setLastName(incoming.getLastName());
        existing.setAddress(incoming.getAddress());
        existing.setCity(incoming.getCity());
        existing.setState(incoming.getState());
        existing.setZipCode(incoming.getZipCode());
        existing.setPhoneNumber(incoming.getPhoneNumber());
        existing.setEmail(incoming.getEmail());
        return repo.save(existing);
    }

    public void delete(Long id) {
        Patient existing = findById(id);
        repo.delete(existing);
    }
}

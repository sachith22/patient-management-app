package com.example.patient.service;

import com.example.patient.dto.PatientDTO;
import com.example.patient.dto.PatientMapper;
import com.example.patient.entity.Patient;
import com.example.patient.exception.ResourceNotFoundException;
import com.example.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository repo;

    public List<Patient> findAll() {
        return repo.findAll();
    }

    public Page<PatientDTO> getAllPatients(Pageable pageable) {
        return repo.findAll(pageable)
                .map(this::convertToDTO);
    }

    private PatientDTO convertToDTO(Patient patient) {
        return new PatientDTO(
                patient.getId(),
                patient.getFirstName(),
                patient.getLastName(),
                patient.getAddress(),
                patient.getCity(),
                patient.getState(),
                patient.getZipCode(),
                patient.getPhoneNumber(),
                patient.getEmail()
        );
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

    public long countAllPatients() {
        return repo.count();
    }

    public Page<PatientDTO> searchPatients(String search, Pageable pageable) {
        return repo.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                        search, search, pageable)
                .map(PatientMapper::toDTO);
    }
}

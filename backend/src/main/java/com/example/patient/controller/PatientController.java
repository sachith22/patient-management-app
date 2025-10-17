package com.example.patient.controller;

import com.example.patient.entity.Patient;
import com.example.patient.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/patient")
@CrossOrigin(origins = "http://localhost:8080")
public class PatientController {

    private final PatientService service;

    public PatientController(PatientService service) {
        this.service = service;
    }

    @GetMapping
    public List<Patient> listAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Patient getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<Patient> create(@Valid @RequestBody Patient patient) {
        Patient created = service.create(patient);
        return ResponseEntity.created(URI.create("/patient/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public Patient update(@PathVariable Long id, @Valid @RequestBody Patient patient) {
        return service.update(id, patient);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

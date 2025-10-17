package com.example.patient.controller;

import com.example.patient.entity.Patient;
import com.example.patient.service.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/patient")
@CrossOrigin(origins = "http://localhost:8080")
@Tag(name = "Patient Controller", description = "Patient CRUD operations")
public class PatientController {

    private final PatientService service;

    public PatientController(PatientService service) {
        this.service = service;
    }

    @Operation(summary = "Get all patients")
    @GetMapping
    public List<Patient> listAll() {
        return service.findAll();
    }

    @Operation(summary = "Get patient by ID")
    @GetMapping("/{id}")
    public Patient getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @Operation(summary = "Create a new patient")
    @PostMapping
    public ResponseEntity<Patient> create(@Valid @RequestBody Patient patient) {
        Patient created = service.create(patient);
        return ResponseEntity.created(URI.create("/patient/" + created.getId())).body(created);
    }

    @Operation(summary = "Update an existing patient")
    @PutMapping("/{id}")
    public Patient update(@PathVariable Long id, @Valid @RequestBody Patient patient) {
        return service.update(id, patient);
    }

    @Operation(summary = "Delete patient by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

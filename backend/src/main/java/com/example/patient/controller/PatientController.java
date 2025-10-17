package com.example.patient.controller;

import com.example.patient.dto.PatientDTO;
import com.example.patient.entity.Patient;
import com.example.patient.service.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/patient")
@CrossOrigin(origins = "http://localhost:8080")
@Tag(name = "Patient Controller", description = "Patient CRUD operations")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService service;

    @Operation(summary = "Get all patients")
    @GetMapping
    public ResponseEntity<Page<PatientDTO>> listAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,asc") String[] sort,
            @RequestParam(defaultValue = "") String search) {

        Sort.Direction sortDirection = sort[1].equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort[0]));

        Page<PatientDTO> patients;
        if (search.isEmpty()) {
            patients = service.getAllPatients(pageable);
        } else {
            patients = service.searchPatients(search, pageable);
        }

        return ResponseEntity.ok(patients);
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

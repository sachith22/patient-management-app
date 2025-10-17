package com.example.patient.dto;

import com.example.patient.entity.Patient;

public class PatientMapper {

        // Convert Patient entity → PatientDTO
        public static PatientDTO toDTO(Patient patient) {
            if (patient == null) return null;

            PatientDTO dto = new PatientDTO();
            dto.setId(patient.getId());
            dto.setFirstName(patient.getFirstName());
            dto.setLastName(patient.getLastName());
            dto.setEmail(patient.getEmail());
            dto.setPhoneNumber(patient.getPhoneNumber());
            dto.setAddress(patient.getAddress());
            dto.setCity(patient.getCity());
            dto.setState(patient.getState());
            dto.setZipCode(patient.getZipCode());
            return dto;
        }

        // Convert PatientDTO → Patient entity
        public static Patient toEntity(PatientDTO dto) {
            if (dto == null) return null;

            Patient patient = new Patient();
            patient.setId(dto.getId());
            patient.setFirstName(dto.getFirstName());
            patient.setLastName(dto.getLastName());
            patient.setEmail(dto.getEmail());
            patient.setPhoneNumber(dto.getPhoneNumber());
            patient.setAddress(dto.getAddress());
            patient.setCity(dto.getCity());
            patient.setState(dto.getState());
            patient.setZipCode(dto.getZipCode());
            return patient;
        }
}

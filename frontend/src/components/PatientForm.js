import React, { useEffect, useState } from "react";

function PatientForm({ onSave, selectedPatient }) {
  const [patient, setPatient] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedPatient) setPatient(selectedPatient);
  }, [selectedPatient]);

  const validate = (field, value) => {
    let msg = "";

    switch (field) {
      case "firstName":
      case "lastName":
      case "address":
      case "city":
      case "state":
        if (!value.trim()) msg = "This field is required.";
        break;

      case "email":
        if (!value) msg = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          msg = "Invalid email format.";
        break;

      case "phoneNumber":
        if (value && !/^[0-9+\-() ]{6,20}$/.test(value))
          msg = "Invalid phone number.";
        break;

      case "zipCode":
        if (value && !/^\d+$/.test(value)) msg = "ZIP must be numeric.";
        break;

      default:
        break;
    }

    return msg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });

    // Validate live as user types
    setErrors({ ...errors, [name]: validate(name, value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields before saving
    const newErrors = {};
    Object.keys(patient).forEach((key) => {
      const err = validate(key, patient[key]);
      if (err) newErrors[key] = err;
    });

    setErrors(newErrors);

    // Stop submission if any errors exist
    if (Object.keys(newErrors).length > 0) return;

    onSave(patient);

    // Reset form
    setPatient({
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      email: "",
    });
    setErrors({});
  };

  return (
    <form className="mb-4" onSubmit={handleSubmit}>
      <div className="row g-3">
        {Object.keys(patient).map((key) => (
          <div className="col-md-3" key={key}>
            <input
              name={key}
              value={patient[key]}
              onChange={handleChange}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              className={`form-control ${errors[key] ? "is-invalid" : ""}`}
            />
            {errors[key] && (
              <div className="invalid-feedback">{errors[key]}</div>
            )}
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3" type="submit">
        {patient.id ? "Update" : "Add"} Patient
      </button>
    </form>
  );
}

export default PatientForm;

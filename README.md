## Patient Management App

A full-stack **Patient Management System** built with **Spring Boot (Java)** for the backend and **React.js** for the frontend.  
The application allows users to manage patients (add, edit, delete, and view), with pagination and validation features.

---

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.6
- Spring Web
- Spring Data JPA
- PostgreSQL
- Lombok
- Maven

### Frontend
- React 18.2
- Axios
- Bootstrap 5.3
- React Router DOM

## Project Structure

      patient-management-app/
      │
      ├── backend/
      │ ├── src/
      │ ├── pom.xml
      │ └── target/patient-management-app-0.0.1-SNAPSHOT.jar
      │
      ├── frontend/
      │ ├── src/
      │ ├── package.json
      │ └── build/ (generated after npm run build)
      │
      └── README.md
   
## Setup Instructions

### 1. Setup Database (Windows)

1. Create the database:
      ```bash
      psql -U postgres -c "CREATE DATABASE patientdb;"

Update backend/src/main/resources/application.properties or set environment variables accordingly.

### 2. Database Configuration

The backend reads DB settings from:
backend/src/main/resources/application.properties

Default values (change as needed):

      spring.datasource.url=jdbc:postgresql://localhost:5432/patientdb
      spring.datasource.username=postgres
      spring.datasource.password=postgres

### 3. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   
2. Build the Spring Boot JAR:
   ```bash
   mvn clean package

### 4. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend

2. Install dependencies:
   ```bash
   npm install

### 5. Integrate Frontend with Backend

To serve React app from Spring Boot (single deployable JAR):

1. Build the React app: (This will automatically copy the build output to backend static resources)
   ```bash
   cd frontend
   npm run build

2. Rebuild the backend:
   ```bash
   cd backend
   mvn clean package

3. Run:
   ```bash
   java -jar target/patient-management-app-0.0.1-SNAPSHOT.jar

#### Access:

Frontend: http://localhost:8080/dashboard

API: http://localhost:8080/patient

## API Endpoints

| Method |    Endpoint    |        Description |
| :--- |:--------------:|-------------------:|
| GET |    /patient    |   Get all patients |
| GET | /patient/{id}  |  Get patient by ID |
| POST |    /patient    |  Add a new patient |
| PUT | /patient/{id}  |     Update patient |
| DELETE | /patient/{id}  |     Delete patient |

#### 1. Get all patients
      curl -X GET http://localhost:8080/patient
   
#### 2. Get patient by ID
    curl -X GET http://localhost:8080/patient/1

#### 3. Create new patient
      curl -X POST http://localhost:8080/patient \
           -H "Content-Type: application/json" \
           -d '{
                 "firstName": "John",
                 "lastName": "Doe",
                 "address": "123 Main St",
                 "city": "Colombo",
                 "state": "Western",
                 "phoneNumber": "+94771234567",
                 "email": "john.doe@example.com"
               }'

#### 4. Update patient
      curl -X PUT http://localhost:8080/patient/1 \
           -H "Content-Type: application/json" \
           -d '{
                 "firstName": "Updated",
                 "lastName": "Name",
                 "city": "Kandy",
                 "state": "Central",
                 "phoneNumber": "+94771234568",
                 "email": "updated@example.com"
               }'

#### 5. Delete patient
      curl -X DELETE http://localhost:8080/patient/1

## Features

* CRUD operations for Patients
* Inline editing and saving directly to the database
* Pagination support
* Input validation for forms
* Fancy confirmation dialog for delete action

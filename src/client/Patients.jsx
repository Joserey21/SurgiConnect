import { useState } from "react";

function Patients() {
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Maria Lopez",
      procedure: "Knee Arthroscopy",
      language: "Spanish",
      surgeryDate: "2026-03-28",
      status: "Post-Op",
      notes: "Patient uploaded recovery photo and asked about pain level.",
    },
    {
      id: 2,
      name: "John Smith",
      procedure: "Shoulder Repair",
      language: "English",
      surgeryDate: "2026-03-30",
      status: "Pre-Op",
      notes: "Pre-op instructions sent. Waiting for confirmation.",
    },
    {
      id: 3,
      name: "Ana Garcia",
      procedure: "ACL Reconstruction",
      language: "Spanish",
      surgeryDate: "2026-04-01",
      status: "Recovered",
      notes: "Patient completed follow-up and recovery looks good.",
    },
  ]);

  const [selectedPatient, setSelectedPatient] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pre-Op":
        return "#f59e0b";
      case "In Surgery":
        return "#7c3aed";
      case "Post-Op":
        return "#0576D6";
      case "Recovered":
        return "#10b981";
      default:
        return "#9ca3af";
    }
  };

  const handleStatusChange = (patientId, newStatus) => {
    const updatedPatients = patients.map((patient) =>
      patient.id === patientId ? { ...patient, status: newStatus } : patient
    );

    setPatients(updatedPatients);

    const updatedSelectedPatient = updatedPatients.find(
      (patient) => patient.id === patientId
    );
    setSelectedPatient(updatedSelectedPatient);
  };

  return (
    <div style={{ backgroundColor: "#f4f8fc", minHeight: "100vh", padding: "20px" }}>
      <h1
        style={{
          color: "#0576D6",
          marginBottom: "20px",
          textAlign: "center",
          fontSize: "64px",
        }}
      >
        Patients
      </h1>

      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <input
          type="text"
          placeholder="Search patients..."
          style={{
            width: "100%",
            maxWidth: "500px",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: selectedPatient ? "2fr 1fr" : "1fr",
          gap: "20px",
          alignItems: "start",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          {patients.map((patient) => (
            <div
              key={patient.id}
              style={{
                backgroundColor: "#FFFFFF",
                border: "2px solid #0576D6",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
              }}
            >
              <h2 style={{ color: "#0576D6", marginBottom: "10px", textAlign: "center" }}>
                {patient.name}
              </h2>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: getStatusColor(patient.status),
                    display: "inline-block",
                  }}
                ></span>
                <span style={{ fontWeight: "bold", color: "#555" }}>{patient.status}</span>
              </div>

              <p><strong>Procedure:</strong> {patient.procedure}</p>
              <p><strong>Language:</strong> {patient.language}</p>
              <p><strong>Surgery Date:</strong> {patient.surgeryDate}</p>

              <button
                onClick={() => setSelectedPatient(patient)}
                style={{
                  marginTop: "15px",
                  backgroundColor: "#0576D6",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {selectedPatient && (
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "2px solid #0576D6",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
              position: "sticky",
              top: "20px",
            }}
          >
            <h2 style={{ color: "#0576D6", marginBottom: "15px" }}>
              Patient Details
            </h2>

            <p><strong>Name:</strong> {selectedPatient.name}</p>
            <p><strong>Procedure:</strong> {selectedPatient.procedure}</p>
            <p><strong>Language:</strong> {selectedPatient.language}</p>
            <p><strong>Surgery Date:</strong> {selectedPatient.surgeryDate}</p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                margin: "10px 0",
              }}
            >
              <strong>Status:</strong>
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: getStatusColor(selectedPatient.status),
                  display: "inline-block",
                }}
              ></span>
              <span>{selectedPatient.status}</span>
            </div>

            <p><strong>Notes:</strong> {selectedPatient.notes}</p>

            <div style={{ marginTop: "20px" }}>
              <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
                Update Status
              </label>

              <select
                value={selectedPatient.status}
                onChange={(e) =>
                  handleStatusChange(selectedPatient.id, e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="Pre-Op">Pre-Op</option>
                <option value="In Surgery">In Surgery</option>
                <option value="Post-Op">Post-Op</option>
                <option value="Recovered">Recovered</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Patients;
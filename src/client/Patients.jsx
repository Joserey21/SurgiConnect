import { useState, useMemo } from "react";

function Patients({ patients, handleStatusChange, handleSurgeryDateChange }) {
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProcedure, setSelectedProcedure] = useState("All Procedures");

  const getStatusColor = (status) => {
    switch (status) {
      case "Stable":
        return "#10b981";
      case "Critical":
        return "#ef4444";
      case "Recovering":
        return "#f59e0b";
      case "Discharged":
        return "#6366f1";
      case "Monitoring":
        return "#8b5cf6";
      default:
        return "#9ca3af";
    }
  };

  const procedureOptions = useMemo(() => {
    const uniqueProcedures = [...new Set(patients.map((patient) => patient.procedure))];
    return ["All Procedures", ...uniqueProcedures];
  }, [patients]);

  // Filter patients based on search term and procedure
  const filteredPatients = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return patients.filter((patient) => {
      const matchesSearch =
        !searchTerm.trim() ||
        patient.name.toLowerCase().includes(lowerSearchTerm) ||
        patient.procedure.toLowerCase().includes(lowerSearchTerm) ||
        patient.language.toLowerCase().includes(lowerSearchTerm) ||
        patient.status.toLowerCase().includes(lowerSearchTerm);

      const matchesProcedure =
        selectedProcedure === "All Procedures" || patient.procedure === selectedProcedure;

      return matchesSearch && matchesProcedure;
    });
  }, [patients, searchTerm, selectedProcedure]);

  // Get updated selected patient data
  const updatedSelectedPatient = useMemo(() => {
    if (selectedPatientId) {
      return patients.find((patient) => patient.id === selectedPatientId);
    }
    return null;
  }, [patients, selectedPatientId]);

  return (
    <div style={{ backgroundColor: "#1a1a1a", minHeight: "100vh", padding: "20px" }}>
      <h1
        style={{
          color: "#0576D6",
          marginBottom: "40px",
          textAlign: "center",
          fontSize: "64px",
        }}
      >
        Patients
      </h1>

      <div
        style={{
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "25px",
        }}
      >
        <input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "500px",
            padding: "12px",
            border: "1px solid #0576D6",
            borderRadius: "8px",
            fontSize: "16px",
            backgroundColor: "#FFFFFF",
            color: "#000000",
          }}
        />
        <select
          value={selectedProcedure}
          onChange={(e) => setSelectedProcedure(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "240px",
            padding: "12px",
            border: "1px solid #0576D6",
            borderRadius: "8px",
            fontSize: "16px",
            backgroundColor: "#FFFFFF",
            color: "#000000",
          }}
        >
          {procedureOptions.map((procedure) => (
            <option key={procedure} value={procedure}>
              {procedure}
            </option>
          ))}
        </select>
      </div>

      {(searchTerm || selectedProcedure !== "All Procedures") && filteredPatients.length === 0 && (
        <p style={{ textAlign: "center", color: "#000000", marginBottom: "20px" }}>
          No patients found for the selected filters
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {filteredPatients.map((patient) => (
          <div key={patient.id}>
            {/* Patient Card - Rectangular spanning full width */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: "2px solid #0576D6",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
                display: "grid",
                gridTemplateColumns: "100px 1fr 1fr 1fr 1fr 150px",
                gap: "4px",
                columnGap: "20px",
                alignItems: "center",
              }}
            >
              {/* Image Box */}
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#e5e7eb",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #d1d5db",
                  fontSize: "32px",
                  color: "#9ca3af",
                }}
              >
                👤
              </div>

              <div style={{ marginLeft: "-15px" }}>
                <h2 style={{ color: "#0576D6", margin: "0 0 10px 0" }}>
                  {patient.name}
                </h2>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
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
                  <span style={{ fontWeight: "bold", color: "#000000" }}>{patient.status}</span>
                </div>
              </div>

              <div>
                <p style={{ margin: 0 }}><strong>Procedure:</strong></p>
                <p style={{ margin: "4px 0 0 0", color: "#000000" }}>{patient.procedure}</p>
              </div>

              <div>
                <p style={{ margin: 0 }}><strong>Language:</strong></p>
                <p style={{ margin: "4px 0 0 0", color: "#000000" }}>{patient.language}</p>
              </div>

              <div>
                <p style={{ margin: 0 }}><strong>Surgery Date:</strong></p>
                <p style={{ margin: "4px 0 0 0", color: "#000000" }}>{patient.surgeryDate}</p>
              </div>

              <button
                onClick={() => setSelectedPatientId(selectedPatientId === patient.id ? null : patient.id)}
                style={{
                  backgroundColor: "#0576D6",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  height: "fit-content",
                }}
              >
                {selectedPatientId === patient.id ? "Hide" : "View"} Details
              </button>
            </div>

            {/* Patient Details - Shows below when selected */}
            {selectedPatientId === patient.id && updatedSelectedPatient && (
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "2px solid #0576D6",
                  borderTop: "none",
                  borderRadius: "0 0 12px 12px",
                  padding: "20px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
                }}
              >
                <h2 style={{ color: "#0576D6", marginBottom: "15px", marginTop: 0 }}>
                  Patient Details
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "30px" }}>
                  <div>
                    <p style={{ margin: "12px 0" }}><strong>Name:</strong> {updatedSelectedPatient.name}</p>
                    <p style={{ margin: "12px 0" }}><strong>Procedure:</strong> {updatedSelectedPatient.procedure}</p>
                    <p style={{ margin: "12px 0" }}><strong>Language:</strong> {updatedSelectedPatient.language}</p>
                    <p style={{ margin: "12px 0" }}><strong>Notes:</strong> {updatedSelectedPatient.notes}</p>
                  </div>

                  <div>
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px", color: "#000000", fontSize: "13px" }}>
                        Status
                      </label>
                      <select
                        value={updatedSelectedPatient.status}
                        onChange={(e) =>
                          handleStatusChange(updatedSelectedPatient.id, e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          borderRadius: "6px",
                          border: "2px solid #0576D6",
                          fontSize: "12px",
                          fontWeight: "bold",
                          color: getStatusColor(updatedSelectedPatient.status),
                          backgroundColor: "#f9fafb",
                          boxSizing: "border-box",
                        }}
                      >
                        <option value="Discharged" style={{ color: "#6366f1" }}>Discharged</option>
                        <option value="Stable" style={{ color: "#10b981" }}>Stable</option>
                        <option value="Recovering" style={{ color: "#f59e0b" }}>Recovering</option>
                        <option value="Monitoring" style={{ color: "#8b5cf6" }}>Monitoring</option>
                        <option value="Critical" style={{ color: "#ef4444" }}>Critical</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px", color: "#000000", fontSize: "13px" }}>
                        Surgery Date
                      </label>
                      <input
                        type="date"
                        value={updatedSelectedPatient.surgeryDate}
                        onChange={(e) =>
                          handleSurgeryDateChange(updatedSelectedPatient.id, e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          borderRadius: "6px",
                          border: "2px solid #0576D6",
                          fontSize: "12px",
                          backgroundColor: "#FFFFFF",
                          color: "#000000",
                          boxSizing: "border-box",
                          colorScheme: "light",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Patients;
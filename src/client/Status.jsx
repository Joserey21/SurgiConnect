import { useEffect, useState } from "react";

function Status() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/patients")
      .then((res) => res.json())
      .then((data) => setPatients(data));
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pre-Op":
        return "#f0ad4e";
      case "In Surgery":
        return "#d9534f";
      case "Post-Op":
        return "#5bc0de";
      case "Recovered":
        return "#5cb85c";
      default:
        return "#9ca3af";
    }
  };

  const getStatusBackground = (status) => {
    switch (status) {
      case "Pre-Op":
        return "#332d1f";
      case "In Surgery":
        return "#3a1f1f";
      case "Post-Op":
        return "#1f2f3a";
      case "Recovered":
        return "#1f3a2a";
      default:
        return "#2a2a2a";
    }
  };

  return (
    <div style={{ backgroundColor: "#1a1a1a", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ color: "#0576D6", textAlign: "center", marginBottom: "30px" }}>
        Patient Status Tracker
      </h1>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {patients.map((patient) => (
          <div
            key={patient.id}
            style={{
              backgroundColor: "#FFFFFF",
              border: `3px solid ${getStatusColor(patient.status)}`,
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "20px",
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "20px",
            }}
          >
            <div>
              <h2 style={{ color: "#0576D6" }}>{patient.name}</h2>

              <p><strong>Surgery:</strong> {patient.surgeryType}</p>
              <p><strong>Surgeon:</strong> {patient.surgeon}</p>
            </div>

            <div
              style={{
                backgroundColor: getStatusBackground(patient.status),
                border: `2px solid ${getStatusColor(patient.status)}`,
                borderRadius: "8px",
                padding: "15px",
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                <span
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    backgroundColor: getStatusColor(patient.status),
                    display: "inline-block",
                    marginRight: "8px",
                  }}
                ></span>
                Status
              </div>

              <h2 style={{ color: getStatusColor(patient.status), margin: 0 }}>
                {patient.status}
              </h2>
            </div>
          </div>
        ))}

        {patients.length === 0 && (
          <p style={{ textAlign: "center", color: "#999" }}>
            No patients to display
          </p>
        )}
      </div>
    </div>
  );
}

export default Status;
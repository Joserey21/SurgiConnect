function Status({ patients = [] }) {
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

  const getStatusBackground = (status) => {
    switch (status) {
      case "Stable":
        return "#1f3a2a";
      case "Critical":
        return "#3a1f1f";
      case "Recovering":
        return "#332d1f";
      case "Discharged":
        return "#242d4a";
      case "Monitoring":
        return "#362a44";
      default:
        return "#2a2a2a";
    }
  };

  return (
    <div style={{ backgroundColor: "#1a1a1a", minHeight: "100vh", padding: "20px" }}>
      <h1
        style={{
          color: "#0576D6",
          marginBottom: "30px",
          textAlign: "center",
          fontSize: "48px",
        }}
      >
        Patient Status Tracker
      </h1>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "20px",
          }}
        >
          {patients.map((patient) => (
            <div
              key={patient.id}
              style={{
                backgroundColor: "#FFFFFF",
                border: `3px solid ${getStatusColor(patient.status)}`,
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "20px",
                alignItems: "center",
              }}
            >
              <div style={{ textAlign: "left" }}>
                <h2
                  style={{
                    color: "#0576D6",
                    margin: "0 0 15px 0",
                    fontSize: "20px",
                  }}
                >
                  {patient.name}
                </h2>
                <div style={{ fontSize: "13px", color: "#666" }}>
                  <p style={{ margin: "8px 0" }}>
                    <strong>Procedure:</strong> {patient.procedure}
                  </p>
                  <p style={{ margin: "8px 0" }}>
                    <strong>Surgery Date:</strong> {patient.surgeryDate}
                  </p>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: getStatusBackground(patient.status),
                  border: `2px solid ${getStatusColor(patient.status)}`,
                  borderRadius: "8px",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      backgroundColor: getStatusColor(patient.status),
                      display: "inline-block",
                    }}
                  ></span>
                  <span style={{ fontSize: "14px", color: "#888" }}>Status</span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "26px",
                    fontWeight: "bold",
                    color: getStatusColor(patient.status),
                  }}
                >
                  {patient.status}
                </p>
              </div>
            </div>
          ))}
        </div>

        {patients.length === 0 && (
          <p style={{ textAlign: "center", color: "#999", marginTop: "40px" }}>
            No patients to display
          </p>
        )}
      </div>

      {/* Status Legend */}
      <div
        style={{
          marginTop: "40px",
          backgroundColor: "#FFFFFF",
          border: "2px solid #ccc",
          borderRadius: "12px",
          padding: "20px",
          maxWidth: "900px",
          margin: "40px auto 0",
        }}
      >
        <h3 style={{ color: "#0576D6", marginTop: 0 }}>Status Legend</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
                display: "inline-block",
              }}
            ></span>
            <span><strong>Stable:</strong> Patient condition stable</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#ef4444",
                display: "inline-block",
              }}
            ></span>
            <span><strong>Critical:</strong> Critical condition</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#f59e0b",
                display: "inline-block",
              }}
            ></span>
            <span><strong>Recovering:</strong> In recovery phase</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#6366f1",
                display: "inline-block",
              }}
            ></span>
            <span><strong>Discharged:</strong> Discharged from hospital</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#8b5cf6",
                display: "inline-block",
              }}
            ></span>
            <span><strong>Monitoring:</strong> Under monitoring</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Status;
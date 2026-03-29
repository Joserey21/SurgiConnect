import { useEffect, useState } from "react";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPatients = () => {
    fetch("http://localhost:5000/patients")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }
        return response.json();
      })
      .then((data) => {
        setPatients(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching patients:", error);
        setError("Could not load patients");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPatients();
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
        return "#999";
    }
  };

  const handleStatusChange = async (patientId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/patients/${patientId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      fetchPatients();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Could not update patient status");
    }
  };

  if (loading) {
    return <div>Loading patients...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "#0576D6" }}>Patients</h1>

      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <div>
          {patients.map((patient) => (
            <div
              key={patient.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "15px",
                backgroundColor: "#fff"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: getStatusColor(patient.status)
                  }}
                ></div>
                <h3 style={{ margin: 0 }}>{patient.name}</h3>
              </div>

              <p><strong>Surgery:</strong> {patient.surgeryType}</p>
              <p><strong>Surgeon:</strong> {patient.surgeon}</p>
              <p><strong>Status:</strong> {patient.status}</p>
              <p><strong>Language:</strong> {patient.language}</p>

              <div style={{ marginTop: "10px" }}>
                <label><strong>Update Status: </strong></label>
                <select
                  value={patient.status}
                  onChange={(e) => handleStatusChange(patient.id, e.target.value)}
                  style={{ padding: "6px", borderRadius: "6px", marginLeft: "8px" }}
                >
                  <option value="Pre-Op">Pre-Op</option>
                  <option value="In Surgery">In Surgery</option>
                  <option value="Post-Op">Post-Op</option>
                  <option value="Recovered">Recovered</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Patients;
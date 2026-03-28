import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [messages, setMessages] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/patients`)
      .then((res) => res.json())
      .then((data) => setPatients(data))
      .catch((error) => console.error("Error loading patients:", error));

    fetch(`${API_BASE_URL}/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((error) => console.error("Error loading messages:", error));

    fetch(`${API_BASE_URL}/alerts`)
      .then((res) => res.json())
      .then((data) => setAlerts(data))
      .catch((error) => console.error("Error loading alerts:", error));
  }, []);

  const unreadMessages = messages.filter(
    (message) => message.status === "Unread"
  ).length;

  return (
    <div style={{ backgroundColor: "#1a1a1a", minHeight: "100vh", padding: "20px" }}>
      <h1
        style={{
          color: "#0576D6",
          textAlign: "center",
          fontSize: "48px",
          marginBottom: "30px",
        }}
      >
        Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          maxWidth: "1000px",
          margin: "0 auto 30px auto",
        }}
      >
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            padding: "30px",
            textAlign: "center",
            border: "2px solid #0576D6",
          }}
        >
          <h2 style={{ color: "#0576D6", marginTop: 0 }}>Patients</h2>
          <p style={{ fontSize: "48px", fontWeight: "bold", margin: 0 }}>
            {patients.length}
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            padding: "30px",
            textAlign: "center",
            border: "2px solid #0576D6",
          }}
        >
          <h2 style={{ color: "#0576D6", marginTop: 0 }}>New Messages</h2>
          <p style={{ fontSize: "48px", fontWeight: "bold", margin: 0 }}>
            {unreadMessages}
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            padding: "30px",
            textAlign: "center",
            border: "2px solid #0576D6",
          }}
        >
          <h2 style={{ color: "#0576D6", marginTop: 0 }}>Alerts</h2>
          <p style={{ fontSize: "48px", fontWeight: "bold", margin: 0 }}>
            {alerts.length}
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          padding: "25px",
          border: "2px solid #0576D6",
        }}
      >
        <h2 style={{ color: "#0576D6", marginTop: 0 }}>Recent Alerts</h2>

        {alerts.length === 0 ? (
          <p style={{ color: "#666" }}>No alerts yet.</p>
        ) : (
          alerts.slice(0, 8).map((alert) => (
            <div
              key={alert.id}
              style={{
                padding: "12px",
                borderBottom: "1px solid #ddd",
              }}
            >
              <p style={{ margin: "0 0 4px 0", fontWeight: "bold", color: "#1f2937" }}>
                {alert.text}
              </p>
              <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                {alert.timestamp}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
import { useNavigate } from "react-router-dom";

function Dashboard({ patients = [], notifications = [], clearNotification = () => {}, messages = [] }) {
  const navigate = useNavigate();
  const patientCount = patients.length;
  const messageCount = messages.filter((msg) => msg.status === "Unread").length;

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

  const CardBox = ({ title, icon, children, bgColor }) => (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: `2px solid ${bgColor}`,
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
        flex: 1,
        minHeight: "150px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <span style={{ fontSize: "32px" }}>{icon}</span>
        <h2 style={{ color: "#000000", margin: 0, fontSize: "24px" }}>{title}</h2>
      </div>
      {children}
    </div>
  );

  return (
    <div style={{ width: "100%" }}>
      <h1 style={{ color: "#0576D6", marginBottom: "30px", fontSize: "48px" }}>Dashboard</h1>

      {/* Three Box Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* Messages Box */}
        <CardBox title="Messages" icon="💬" bgColor="#0576D6">
          <div style={{ maxHeight: "250px", overflowY: "auto" }}>
            {messages.filter((msg) => msg.status === "Unread").length === 0 ? (
              <p style={{ color: "#999", textAlign: "center", margin: "40px 0" }}>No unread messages</p>
            ) : (
              messages.filter((msg) => msg.status === "Unread").slice(0, 3).map((message) => (
                <div
                  key={message.id}
                  onClick={() => navigate("/messages")}
                  style={{
                    backgroundColor: "#dbeafe",
                    border: "2px solid #0576D6",
                    borderRadius: "8px",
                    padding: "12px",
                    marginBottom: "8px",
                    fontSize: "13px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#bfdbfe";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(5, 118, 214, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#dbeafe";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 4px 0", fontWeight: "bold", color: "#0551a1" }}>
                        {message.subject}
                      </p>
                      <p style={{ margin: "0 0 4px 0", color: "#0576D6", fontSize: "12px" }}>
                        From: {message.from}
                      </p>
                      <p style={{ margin: 0, color: "#999", fontSize: "11px" }}>
                        {message.timestamp}
                      </p>
                    </div>
                    <span
                      style={{
                        backgroundColor: "#0576D6",
                        color: "#FFFFFF",
                        fontSize: "10px",
                        fontWeight: "bold",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        marginLeft: "8px",
                      }}
                    >
                      New
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => navigate("/messages")}
            style={{
              marginTop: "12px",
              backgroundColor: "#0576D6",
              color: "#FFFFFF",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              width: "100%",
            }}
          >
            View All Messages
          </button>
        </CardBox>

        {/* Patient Count Box */}
        <CardBox title="Total Patients" icon="👥" bgColor="#10b981">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "12px" }}>
            {patients.length === 0 ? (
              <p style={{ color: "#999", textAlign: "center", margin: "20px 0", gridColumn: "1 / -1" }}>No patients</p>
            ) : (
              patients.slice(0, 3).map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => navigate("/patients")}
                  style={{
                    backgroundColor: "#dbeafe",
                    border: "2px solid #0576D6",
                    borderRadius: "8px",
                    padding: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    aspectRatio: "1",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#bfdbfe";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(5, 118, 214, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#dbeafe";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <p style={{ margin: "0 0 8px 0", fontWeight: "bold", color: "#0369a1", fontSize: "13px" }}>
                    {patient.name}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      fontSize: "11px",
                      color: "#999",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: getStatusColor(patient.status),
                        display: "inline-block",
                      }}
                    ></span>
                    {patient.status}
                  </div>
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => navigate("/patients")}
            style={{
              backgroundColor: "#0576D6",
              color: "#FFFFFF",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              width: "100%",
              fontSize: "13px",
            }}
          >
            View All Patients ({patientCount})
          </button>
        </CardBox>

        {/* Alerts Box */}
        <CardBox title="Alerts" icon="🔔" bgColor="#f59e0b">
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <p style={{ color: "#999", textAlign: "center", margin: "40px 0" }}>No new alerts</p>
            ) : (
              notifications.slice(0, 3).map((notification) => {
                const alertColor = getStatusColor(notification.newStatus);
                const lightBgColor = alertColor === "#10b981" ? "#d1fae5" :
                                    alertColor === "#ef4444" ? "#fee2e2" :
                                    alertColor === "#f59e0b" ? "#fef3c7" :
                                    alertColor === "#6366f1" ? "#e0e7ff" : "#ede9fe";
                const darkTextColor = alertColor === "#10b981" ? "#065f46" :
                                     alertColor === "#ef4444" ? "#7f1d1d" :
                                     alertColor === "#f59e0b" ? "#92400e" :
                                     alertColor === "#6366f1" ? "#312e81" : "#5b21b6";
                return (
                  <div
                    key={notification.id}
                    onClick={() => navigate("/patients")}
                    style={{
                      backgroundColor: lightBgColor,
                      border: `1px solid ${alertColor}`,
                      borderRadius: "8px",
                      padding: "12px",
                      marginBottom: "8px",
                      fontSize: "13px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = alertColor;
                      e.currentTarget.style.color = "#FFFFFF";
                      e.currentTarget.style.boxShadow = `0 2px 8px ${alertColor}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = lightBgColor;
                      e.currentTarget.style.color = "inherit";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <p style={{ margin: "0 0 4px 0", fontWeight: "bold", color: darkTextColor }}>
                      {notification.message}
                    </p>
                    <p style={{ margin: 0, color: alertColor, fontSize: "12px", fontWeight: "bold" }}>
                      Status: {notification.newStatus}
                    </p>
                  </div>
                );
              })
            )}
          </div>
          {notifications.length > 0 && (
            <button
              onClick={() => {
                notifications.forEach((n) => clearNotification(n.id));
              }}
              style={{
                marginTop: "12px",
                backgroundColor: "#0576D6",
                color: "#FFFFFF",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                width: "100%",
              }}
            >
              Clear All
            </button>
          )}
        </CardBox>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
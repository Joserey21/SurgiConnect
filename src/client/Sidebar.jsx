import { Link } from "react-router-dom";
import doctorImage from "../assets/hero.png";

function Sidebar() {
  return (
    <div
      style={{
        width: "220px",
        height: "100vh",
        background: "#1e1e2f",
        color: "white",
        padding: "20px",
      }}
    >
      <Link
        to="/"
        style={{
          color: "white",
          textDecoration: "none",
          display: "inline-block",
        }}
      >
        <h2 style={{ margin: 0 }}>MedApp</h2>
      </Link>

      <div
        style={{
          marginTop: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "14px 10px",
          borderRadius: "12px",
          backgroundColor: "#2a2a40",
          border: "1px solid #3a3a57",
        }}
      >
        <img
          src={doctorImage}
          alt="Doctor profile"
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #0576D6",
          }}
        />
        <p style={{ margin: "10px 0 2px 0", fontWeight: "bold", fontSize: "14px" }}>
          Dr. Sarah Kim
        </p>
        <p style={{ margin: 0, color: "#b7bdd6", fontSize: "12px" }}>
          Orthopedic Surgeon
        </p>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "30px" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link>
        <Link to="/patients" style={{ color: "white", textDecoration: "none" }}>Patients</Link>
        <Link to="/messages" style={{ color: "white", textDecoration: "none" }}>Messages</Link>
        <Link to="/uploads" style={{ color: "white", textDecoration: "none" }}>Uploads</Link>
        <Link to="/status" style={{ color: "white", textDecoration: "none" }}>Status</Link>
      </nav>
    </div>
  );
}

export default Sidebar;
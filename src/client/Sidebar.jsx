import { Link } from "react-router-dom";

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
      <h2>MedApp</h2>

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
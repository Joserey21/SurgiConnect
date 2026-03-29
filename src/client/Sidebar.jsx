import { NavLink } from "react-router-dom";

function Sidebar() {
  const linkStyle = ({ isActive }) => ({
    display: "block",
    padding: "12px 16px",
    color: "white",
    textDecoration: "none",
    borderRadius: "10px",
    backgroundColor: isActive ? "#035fa3" : "transparent",
    fontSize: "18px",
    fontWeight: isActive ? "bold" : "normal",
    textAlign: "center",
    marginBottom: "10px",
    transition: "0.2s"
  });

  return (
    <div
      style={{
        width: "250px",
        backgroundColor: "#0576D6",
        color: "white",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        boxSizing: "border-box"
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px", fontSize: "30px" }}>SurgiConnect</h1>

      <div
        style={{
          backgroundColor: "#2b2b52",
          borderRadius: "16px",
          padding: "20px",
          textAlign: "center",
          marginBottom: "30px"
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="Profile"
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            border: "2px solid white",
            marginBottom: "15px"
          }}
        />
        <h3 style={{ margin: "0 0 10px 0" }}>Dr. Sarah Kim</h3>
        <p style={{ margin: 0, opacity: 0.9 }}>Orthopedic Surgeon</p>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <NavLink to="/" style={linkStyle}>
          Dashboard
        </NavLink>
        <NavLink to="/patients" style={linkStyle}>
          Patients
        </NavLink>
        <NavLink to="/messages" style={linkStyle}>
          Messages
        </NavLink>
        <NavLink to="/uploads" style={linkStyle}>
          Uploads
        </NavLink>
        <NavLink to="/status" style={linkStyle}>
          Status
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
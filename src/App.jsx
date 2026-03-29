import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Dashboard from "./client/Dashboard";
import Patients from "./client/Patients";
import PatientView from "./client/PatientView";
import Sidebar from "./client/Sidebar";
import Status from "./client/Status";
import Messages from "./client/Messages";
import Uploads from "./client/Uploads";

function App() {
  const [mode, setMode] = useState("surgeon");
  const [patients, setPatients] = useState([]);

  const toggleMode = () => {
    setMode((prev) => (prev === "surgeon" ? "patient" : "surgeon"));
  };

  const addPatient = (newPatient) => {
    setPatients((prev) => [...prev, newPatient]);
    return newPatient;
  };

  return (
    <Router>
      <div style={{ display: "flex" }}>
        {mode === "surgeon" && <Sidebar />}

        <div
          style={{
            marginLeft: mode === "surgeon" ? "250px" : "0",
            width: "100%",
            minHeight: "100vh",
            backgroundColor: "#0d0f1a",
            padding: "20px",
            boxSizing: "border-box"
          }}
        >
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <button
              onClick={toggleMode}
              style={{
                padding: "12px 20px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#0576D6",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Switch to {mode === "surgeon" ? "Patient View" : "Surgeon View"}
            </button>
          </div>

          <h2 style={{ textAlign: "center", color: "white", marginBottom: "25px" }}>
            {mode === "surgeon" ? "Surgeon Dashboard" : "Patient View"}
          </h2>

          <Routes>
            {mode === "surgeon" && (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/uploads" element={<Uploads addPatient={addPatient} />} />
                <Route path="/status" element={<Status />} />
              </>
            )}

            {mode === "patient" && (
              <>
                <Route path="*" element={<PatientView />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
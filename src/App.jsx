import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Patients from "./client/Patients";
import PatientDetails from "./client/PatientDetails";
import PatientView from "./client/PatientView";
import Sidebar from "./client/Sidebar";
import Status from "./client/Status";

function App() {
  const [mode, setMode] = useState("surgeon");

  const toggleMode = () => {
    setMode((prev) => (prev === "surgeon" ? "patient" : "surgeon"));
  };

  return (
    <Router>
      <div style={{ display: "flex" }}>
        {mode === "surgeon" && <Sidebar />}

        <div style={{ flex: 1, padding: "20px" }}>
          <div style={{ marginBottom: "20px" }}>
            <button
              onClick={toggleMode}
              style={{
                padding: "10px 15px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#0576D6",
                color: "white",
                cursor: "pointer",
              }}
            >
              Switch to {mode === "surgeon" ? "Patient View" : "Surgeon View"}
            </button>
          </div>

          <h2>{mode === "surgeon" ? "Surgeon Dashboard" : "Patient View"}</h2>

          <Routes>
            {mode === "surgeon" && (
              <>
                <Route path="/" element={<Patients />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/patients/:id" element={<PatientDetails />} />
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
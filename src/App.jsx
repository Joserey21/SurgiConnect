import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./client/Dashboard";
import Patients from "./client/Patients";
import Messages from "./client/Messages";
import Uploads from "./client/Uploads";
import Status from "./client/Status";
import Sidebar from "./client/Sidebar";

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ padding: "20px", width: "100%" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/uploads" element={<Uploads />} />
            <Route path="/status" element={<Status />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
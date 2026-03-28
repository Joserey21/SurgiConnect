import { useState } from "react";

function Uploads({ addPatient = () => {} }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    procedure: "",
    language: "English",
    surgeryDate: "",
    notes: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const fileList = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: (file.size / 1024).toFixed(2),
      uploadedAt: new Date().toLocaleTimeString(),
    }));
    setUploadedFiles((prev) => [...prev, ...fileList]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddPatient = () => {
    if (!formData.name.trim() || !formData.procedure.trim()) {
      alert("Please fill in at least Name and Procedure");
      return;
    }

    // Trim all input values for clean data
    const cleanedData = {
      name: formData.name.trim(),
      procedure: formData.procedure.trim(),
      language: formData.language.trim(),
      surgeryDate: formData.surgeryDate.trim(),
      notes: formData.notes.trim(),
    };

    const newPatient = addPatient(cleanedData);
    setSuccessMessage(`New patient "${newPatient.name}" added successfully!`);
    
    // Reset form
    setFormData({
      name: "",
      procedure: "",
      language: "English",
      surgeryDate: "",
      notes: "",
    });
    setUploadedFiles([]);

    // Clear success message after 5 seconds
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  const removeFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
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
        Patient Uploads
      </h1>

      {successMessage && (
        <div
          style={{
            backgroundColor: "#d1fae5",
            border: "2px solid #10b981",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "20px",
            color: "#065f46",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          ✓ {successMessage}
        </div>
      )}

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* File Upload Section */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "2px solid #0576D6",
            borderRadius: "12px",
            padding: "30px",
            marginBottom: "30px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
          }}
        >
          <h2 style={{ color: "#0576D6", marginTop: 0 }}>Upload Patient Files</h2>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            Upload medical files (documents, imaging results, lab reports, etc.)
          </p>

          <div
            style={{
              border: "2px dashed #0576D6",
              borderRadius: "8px",
              padding: "40px 20px",
              textAlign: "center",
              backgroundColor: "transparent",
              marginBottom: "20px",
            }}
          >
            <p style={{ margin: "0 0 15px 0", fontSize: "24px" }}>📁</p>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              style={{
                display: "none",
              }}
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              style={{
                cursor: "pointer",
                backgroundColor: "#0576D6",
                color: "#FFFFFF",
                padding: "10px 20px",
                borderRadius: "8px",
                display: "inline-block",
                fontWeight: "bold",
              }}
            >
              Choose Files
            </label>
            <p style={{ color: "#666", marginTop: "15px", fontSize: "13px" }}>
              or drag and drop files here
            </p>
          </div>

          {uploadedFiles.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ color: "#0576D6", marginTop: 0 }}>Uploaded Files:</h3>
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#2a2a2a",
                      border: "1px solid #444",
                      borderRadius: "6px",
                      padding: "12px",
                      marginBottom: "8px",
                    }}
                  >
                    <div>
                      <p style={{ margin: "0 0 4px 0", fontWeight: "bold", color: "#1f2937" }}>
                        📄 {file.name}
                      </p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                        {file.size} KB • {file.uploadedAt}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      style={{
                        backgroundColor: "transparent",
                        color: "#0576D6",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "20px",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Patient Information Form */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "2px solid #0576D6",
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
          }}
        >
          <h2 style={{ color: "#0576D6", marginTop: 0 }}>Patient Information</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#000000" }}>
                Patient Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter patient name"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #0576D6",
                  borderRadius: "6px",
                  fontSize: "14px",
                  backgroundColor: "#FFFFFF",
                  color: "#000000",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#000000" }}>
                Procedure *
              </label>
              <select
                name="procedure"
                value={formData.procedure}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #0576D6",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  backgroundColor: "#FFFFFF",
                  color: "#000000",
                }}
              >
                <option value="">Select a procedure...</option>
                <option value="Shoulder">Shoulder</option>
                <option value="Knee">Knee</option>
                <option value="Elbow">Elbow</option>
                <option value="Arthroplasty">Arthroplasty</option>
                <option value="Hand and Wrist">Hand and Wrist</option>
                <option value="Foot and Ankle">Foot and Ankle</option>
                <option value="Trauma">Trauma</option>
                <option value="Hip">Hip</option>
                <option value="Orthobiologics">Orthobiologics</option>
                <option value="Cardiothoracic Surgery">Cardiothoracic Surgery</option>
                <option value="Spine">Spine</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#000000" }}>
                Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #0576D6",
                  borderRadius: "6px",
                  fontSize: "14px",
                  backgroundColor: "#FFFFFF",
                  color: "#000000",
                  boxSizing: "border-box",
                }}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="Mandarin">Mandarin</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#000000" }}>
                Surgery Date
              </label>
              <input
                type="date"
                name="surgeryDate"
                value={formData.surgeryDate}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #0576D6",
                  borderRadius: "6px",
                  fontSize: "14px",
                  backgroundColor: "#FFFFFF",
                  color: "#000000",
                  boxSizing: "border-box",
                  colorScheme: "light",
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#000000" }}>
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Enter any additional notes"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #0576D6",
                borderRadius: "6px",
                fontSize: "14px",
                minHeight: "100px",
                backgroundColor: "#FFFFFF",
                color: "#000000",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            onClick={handleAddPatient}
            style={{
              marginTop: "20px",
              backgroundColor: "#0576D6",
              color: "#FFFFFF",
              border: "none",
              padding: "12px 32px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "block",
              margin: "20px auto 0",
            }}
          >
            Add New Patient
          </button>
        </div>
      </div>
    </div>
  );
}

export default Uploads;
import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Uploads({ addPatient = () => {} }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [messageUploads, setMessageUploads] = useState([]);
  const [isLoadingMessageUploads, setIsLoadingMessageUploads] = useState(false);
  const [messageUploadError, setMessageUploadError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    surgeryType: "",
    language: "English",
    surgeryDate: "",
    notes: "",
    surgeon: "",
    status: "Pre-Op",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const groupedUploadsByPatient = useMemo(() => {
    return messageUploads.reduce((groups, upload) => {
      const key = `${upload.patientId}-${upload.patientName}`;
      if (!groups[key]) {
        groups[key] = {
          patientId: upload.patientId,
          patientName: upload.patientName,
          uploads: [],
        };
      }

      groups[key].uploads.push(upload);
      return groups;
    }, {});
  }, [messageUploads]);

  const fetchMessageUploads = async () => {
    try {
      setIsLoadingMessageUploads(true);
      setMessageUploadError("");

      const response = await fetch(`${API_BASE_URL}/messages`);
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }

      const allMessages = await response.json();
      const uploadsOnly = allMessages
        .filter((msg) => msg.imageUrl)
        .map((msg) => ({
          id: msg.id,
          patientId: msg.patientId,
          patientName: msg.patientName || "Unknown Patient",
          subject: msg.subject || "Patient Upload",
          from: msg.from || "Unknown",
          timestamp: msg.timestamp || "",
          imageUrl: msg.imageUrl,
          imageName: msg.imageName || "Uploaded image",
        }));

      setMessageUploads(uploadsOnly);
    } catch (error) {
      console.error("Unable to load message uploads", error);
      setMessageUploadError("Could not load patient uploads from messages.");
    } finally {
      setIsLoadingMessageUploads(false);
    }
  };

  useEffect(() => {
    fetchMessageUploads();
  }, []);

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

  const handleAddPatient = async () => {
    if (!formData.name.trim() || !formData.surgeryType.trim()) {
      alert("Please fill in at least Name and Surgery Type");
      return;
    }

    const cleanedData = {
      name: formData.name.trim(),
      surgeryType: formData.surgeryType.trim(),
      surgeon: formData.surgeon.trim() || "Dr. Smith",
      language: formData.language.trim(),
      status: formData.status.trim(),
      surgeryDate: formData.surgeryDate.trim(),
      notes: formData.notes.trim(),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        throw new Error("Failed to add patient");
      }

      const newPatient = await response.json();

      addPatient(newPatient);
      setSuccessMessage(`New patient "${newPatient.name}" added successfully!`);

      setFormData({
        name: "",
        surgeryType: "",
        language: "English",
        surgeryDate: "",
        notes: "",
        surgeon: "",
        status: "Pre-Op",
      });
      setUploadedFiles([]);

      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Unable to add patient", error);
      alert("Could not add patient");
    }
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
            Upload medical files, documents, imaging, and reports
          </p>

          <div
            style={{
              border: "2px dashed #0576D6",
              borderRadius: "8px",
              padding: "40px 20px",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <p style={{ margin: "0 0 15px 0", fontSize: "24px" }}>📁</p>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
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
          </div>

          {uploadedFiles.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ color: "#0576D6", marginTop: 0 }}>Selected Files:</h3>
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#f9fafb",
                      border: "1px solid #ddd",
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h2 style={{ color: "#0576D6", margin: 0 }}>Uploads Grouped By Patient</h2>
            <button
              onClick={fetchMessageUploads}
              style={{
                backgroundColor: "#0576D6",
                color: "#FFFFFF",
                border: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Refresh
            </button>
          </div>

          {isLoadingMessageUploads ? (
            <p style={{ color: "#666", margin: 0 }}>Loading uploads...</p>
          ) : messageUploadError ? (
            <p style={{ color: "#b91c1c", margin: 0 }}>{messageUploadError}</p>
          ) : Object.keys(groupedUploadsByPatient).length === 0 ? (
            <p style={{ color: "#666", margin: 0 }}>No patient uploads found in messages.</p>
          ) : (
            Object.values(groupedUploadsByPatient).map((patientGroup) => (
              <div
                key={`${patientGroup.patientId}-${patientGroup.patientName}`}
                style={{
                  marginTop: "20px",
                  border: "1px solid #dbeafe",
                  borderRadius: "10px",
                  padding: "16px",
                  backgroundColor: "#f8fbff",
                }}
              >
                <h3 style={{ margin: "0 0 12px 0", color: "#1f2937" }}>
                  {patientGroup.patientName} (ID: {patientGroup.patientId})
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {patientGroup.uploads.map((upload) => (
                    <div
                      key={upload.id}
                      style={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #e5e7eb",
                        borderRadius: "10px",
                        padding: "10px",
                      }}
                    >
                      <a href={upload.imageUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                        <img
                          src={upload.imageUrl}
                          alt={upload.imageName}
                          style={{
                            width: "100%",
                            height: "160px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            marginBottom: "8px",
                            border: "1px solid #e5e7eb",
                          }}
                        />
                      </a>
                      <p style={{ margin: "0 0 4px 0", fontWeight: "bold", color: "#1f2937", fontSize: "13px" }}>
                        {upload.subject}
                      </p>
                      <p style={{ margin: "0 0 2px 0", color: "#4b5563", fontSize: "12px" }}>
                        From: {upload.from}
                      </p>
                      <p style={{ margin: 0, color: "#6b7280", fontSize: "12px" }}>
                        {upload.timestamp}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

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
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#000000" }}>
                Surgery Type *
              </label>
              <select
                name="surgeryType"
                value={formData.surgeryType}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #0576D6",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              >
                <option value="">Select a surgery type...</option>
                <option value="Knee Surgery">Knee Surgery</option>
                <option value="Shoulder Repair">Shoulder Repair</option>
                <option value="ACL Reconstruction">ACL Reconstruction</option>
                <option value="Hip Surgery">Hip Surgery</option>
                <option value="Foot and Ankle Surgery">Foot and Ankle Surgery</option>
                <option value="Spine Surgery">Spine Surgery</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#000000" }}>
                Surgeon
              </label>
              <input
                type="text"
                name="surgeon"
                value={formData.surgeon}
                onChange={handleInputChange}
                placeholder="Enter surgeon name"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #0576D6",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
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
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #0576D6",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              >
                <option value="Pre-Op">Pre-Op</option>
                <option value="In Surgery">In Surgery</option>
                <option value="Post-Op">Post-Op</option>
                <option value="Recovered">Recovered</option>
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
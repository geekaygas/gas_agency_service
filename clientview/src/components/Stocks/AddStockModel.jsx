import React, { useState } from "react";
import { X } from "lucide-react";
import "../Styles/AddStockModel.css";

const AddStockModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    Provider: "",
    Drivername: "",
    Staffname: "",
    date: "",
    time: "",
    cylinder19: "",
    cylinder5: "",
    nanoCut: "",
    cylinder19mt: "",
    cylinder5mt: "",
    nanoCutmt: "",
  });
  
 const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.Provider || !formData.Drivername || !formData.Staffname) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("https://gas-agency-service.onrender.com/api/stocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      alert("Stock added successfully ✅");
      // onSuccess();
      onClose();
    } catch (error) {
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Add Stock</h2>
          <button onClick={onClose} className="modal-close">
            <X className="icon" />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Provider</label>
              <input
                className="form-input"
                placeholder="Provider"
                value={formData.Provider}
                onChange={(e) =>
                  setFormData({ ...formData, Provider: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Driver Name</label>
              <input
                className="form-input"
                placeholder="Driver Name"
                value={formData.Drivername}
                onChange={(e) =>
                  setFormData({ ...formData, Drivername: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Loading Staff Name</label>
              <input
              className="form-input"
            placeholder="Staff Name"
            value={formData.Staffname}
            onChange={(e) => setFormData({ ...formData, Staffname: e.target.value })}
          />

            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input
                type="time"
                value={formData.time}
                 onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group form-group-full">
              <label className="form-label">Cylinder Stock</label>

              <div className="table-wrapper">
                <table className="cylinder-table">
                  <thead>
                    <tr>
                      <th>Cylinder Type</th>
                      <th>19 Kg</th>
                      <th>5 Kg</th>
                      <th>Nano Cut</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>Full Quantity</td>
                      <td>
                        <input
                          type="number"
                          value={formData.cylinder19}
                           onChange={(e) => setFormData({ ...formData, cylinder19: e.target.value })}
                          className="table-input"
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          value={formData.cylinder5}
                           onChange={(e) => setFormData({ ...formData, cylinder5: e.target.value })}
                          className="table-input"
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          value={formData.nanoCut}
                          onChange={(e) => setFormData({ ...formData, nanoCut: e.target.value })}
                          className="table-input"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Empty Quantity</td>
                      <td>
                        <input
                          type="number"
                          value={formData.cylinder19mt}
                           onChange={(e) => setFormData({ ...formData, cylinder19mt: e.target.value })}
                          className="table-input"
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          value={formData.cylinder5mt}
                           onChange={(e) => setFormData({ ...formData, cylinder5mt: e.target.value })}
                          className="table-input"
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          value={formData.nanoCutmt}
                          onChange={(e) => setFormData({ ...formData, nanoCutmt: e.target.value })}
                          className="table-input"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Add Stock"}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStockModal;

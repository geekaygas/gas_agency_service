import React, { useState } from "react";
import "../Styles/EditStockModal.css";

const EditStockModal = ({ stock, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({ ...stock });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://gas-agency-service.onrender.com/api/stocks/${stock._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      onUpdated(); // refresh table
      onClose();   // close modal
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Add Stock</h2>
        </div>
        <div className="modal-body">
          <div className="form-grid">
        {/* <div className="modal-grid"> */}
          <div className="form-group">
            <label>Provider</label>
            <input
            className="form-input"
              value={formData.Provider}
              onChange={(e) =>
                setFormData({ ...formData, Provider: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Driver Name</label>
            <input
            className="form-input"
              value={formData.Drivername}
              onChange={(e) =>
                setFormData({ ...formData, Drivername: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Staff Name</label>
            <input
            className="form-input"
              value={formData.Staffname}
              onChange={(e) =>
                setFormData({ ...formData, Staffname: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>19Kg Full Cylinders</label>
            <input
            className="form-input"
              type="number"
              value={formData.cylinder19}
              onChange={(e) =>
                setFormData({ ...formData, cylinder19: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>19Kg Empty Cylinders</label>
            <input
            className="form-input"
              type="number"
              value={formData.cylinder19mt}
              onChange={(e) =>
                setFormData({ ...formData, cylinder19mt: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>5Kg Full Cylinders</label>
            <input
            className="form-input"
              type="number"
              value={formData.cylinder5}
              onChange={(e) =>
                setFormData({ ...formData, cylinder5: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>5Kg Empty Cylinders</label>
            <input
            className="form-input"
              type="number"
              value={formData.cylinder5mt}
              onChange={(e) =>
                setFormData({ ...formData, cylinder5mt: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>NanoCut Full Cylinder</label>
            <input
            className="form-input"
              type="number"
              value={formData.nanoCut}
              onChange={(e) =>
                setFormData({ ...formData, nanoCut: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>NanoCut Empty Cylinder</label>
            <input
            className="form-input"
              type="number"
              value={formData.nanoCutmt}
              onChange={(e) =>
                setFormData({ ...formData, nanoCutmt: e.target.value })
              }
            />
          </div>
        </div>

        <div className="modal-actions">
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="save" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
        {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default EditStockModal;

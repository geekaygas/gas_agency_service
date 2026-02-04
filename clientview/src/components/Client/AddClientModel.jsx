import React, { useState } from "react";
import { X } from "lucide-react";
import "../Styles/AddClientModel.css";

const CLOUD_NAME = "df0vylc9t";
const UPLOAD_PRESET = "gas_agency_unsigned";

const AddClientModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    Shopname: "",
    contactName: "",
    mobileNumber1: "",
    mobileNumber2: "",
    cylinderType: "",
    address: "",
  });

  const [ownerImageFile, setOwnerImageFile] = useState(null);
  const [shopImageFile, setShopImageFile] = useState(null);

  const [ownerPreview, setOwnerPreview] = useState(null);
  const [shopPreview, setShopPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  /* 🔹 Upload image to Cloudinary */
const uploadToCloudinary = async (file, folder) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", UPLOAD_PRESET);
  data.append("folder", folder); // 👈 important

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: data,
    }
  );

  const json = await res.json();
  return json.secure_url;
};

  /* 🔹 Handle Image Change */
  const handleImageChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (!file) return;
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };


  /* 🔹 Submit Form */
  const handleSubmit = async () => {
  try {
    setLoading(true);

    // 1️⃣ Upload images first
    let ownerImageUrl = "";
    let shopImageUrl = "";

    if (ownerImageFile) {
      ownerImageUrl = await uploadToCloudinary(
        ownerImageFile,
        "gas-agency/owners"
      );
    }

    if (shopImageFile) {
      shopImageUrl = await uploadToCloudinary(
        shopImageFile,
        "gas-agency/shops"
      );
    }

    // 2️⃣ Send form data + image URLs to backend
    await fetch("http://localhost:4000/api/consumers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        ownerImage: ownerImageUrl,
        shopImage: shopImageUrl,
      }),
    });

    alert("Consumer added successfully ✅");
    onClose();
  } catch (err) {
    alert("Failed to add consumer");
  } finally {
    setLoading(false);
  }
};

return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <h2>Add New Consumer</h2>
          <button onClick={onClose} className="modal-close">
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label>Shop Name</label>
              <input
                className="form-input"
                value={formData.Shopname}
                onChange={(e) =>
                  setFormData({ ...formData, Shopname: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Contact Name</label>
              <input
                className="form-input"
                value={formData.contactName}
                onChange={(e) =>
                  setFormData({ ...formData, contactName: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Contact Number 1</label>
              <input
                className="form-input"
                value={formData.mobileNumber1}
                onChange={(e) =>
                  setFormData({ ...formData, mobileNumber1: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Contact Number 2 (Optional)</label>
              <input
                className="form-input"
                value={formData.mobileNumber2}
                onChange={(e) =>
                  setFormData({ ...formData, mobileNumber2: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Cylinder</label>
              <select
                className="form-input"
                value={formData.cylinderType}
                onChange={(e) =>
                  setFormData({ ...formData, cylinderType: e.target.value })
                }
              >
                <option value="">Select</option>
                <option>19 Kg</option>
                <option>5 kg</option>
                <option>Nano Cut</option>
              </select>
            </div>

            <div className="form-group full">
              <label>Address</label>
              <input
                className="form-input"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Owner Picture</label>
              <input
                className="form-input"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageChange(e, setOwnerImageFile, setOwnerPreview)
                }
              />
              {ownerPreview && <img className="image-preview" src={ownerPreview} alt="" />}
            </div>

            <div className="form-group">
              <label>Shop Picture</label>
              <input
                className="form-input"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageChange(e, setShopImageFile, setShopPreview)
                }
              />
              {shopPreview && <img className="image-preview" src={shopPreview} alt="" />}
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleSubmit} className="btn-primary">
              {loading ? "Saving..." : "Add Consumer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClientModal;

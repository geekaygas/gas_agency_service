import React, { useState } from "react";
import { X } from "lucide-react";
import "../Styles/EditConsumerModal.css";

const CLOUD_NAME = "df0vylc9t";
const UPLOAD_PRESET = "gas_agency_unsigned";

const EditConsumerModal = ({ consumer, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    Shopname: consumer.Shopname || "",
    contactName: consumer.contactName || "",
    mobileNumber1: consumer.mobileNumber1 || "",
    mobileNumber2: consumer.mobileNumber2 || "",
    cylinderType: consumer.cylinderType || "",
    address: consumer.address || "",
  });

  const [ownerImageFile, setOwnerImageFile] = useState(null);
  const [shopImageFile, setShopImageFile] = useState(null);

  const [ownerPreview, setOwnerPreview] = useState(consumer.ownerImage || null);
  const [shopPreview, setShopPreview] = useState(consumer.shopImage || null);

  const [loading, setLoading] = useState(false);

  // 🔹 Upload image to Cloudinary
  const uploadToCloudinary = async (file, folder) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    data.append("folder", folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: data }
    );

    const json = await res.json();
    return json.secure_url;
  };

  // 🔹 Handle Save
  const handleSave = async () => {
    try {
      setLoading(true);

      let ownerImageUrl = consumer.ownerImage;
      let shopImageUrl = consumer.shopImage;

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

      await fetch(
        `https://gas-agency-service.onrender.com/api/consumers/${consumer._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            ownerImage: ownerImageUrl,
            shopImage: shopImageUrl,
          }),
        }
      );

      alert("Consumer updated successfully ✅");
      onUpdated();
      onClose();
    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <h2>Edit Consumer</h2>
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
                value={formData.Shopname}
                onChange={(e) =>
                  setFormData({ ...formData, Shopname: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Contact Name</label>
              <input
                value={formData.contactName}
                onChange={(e) =>
                  setFormData({ ...formData, contactName: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Mobile Number 1</label>
              <input
                value={formData.mobileNumber1}
                onChange={(e) =>
                  setFormData({ ...formData, mobileNumber1: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Mobile Number 2</label>
              <input
                value={formData.mobileNumber2}
                onChange={(e) =>
                  setFormData({ ...formData, mobileNumber2: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Cylinder Type</label>
              <select
                value={formData.cylinderType}
                onChange={(e) =>
                  setFormData({ ...formData, cylinderType: e.target.value })
                }
              >
                <option>19 Kg</option>
                <option>5 kg</option>
                <option>Nano Cut</option>
              </select>
            </div>

            <div className="form-group full">
              <label>Address</label>
              <input
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Owner Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setOwnerImageFile(e.target.files[0]);
                  setOwnerPreview(URL.createObjectURL(e.target.files[0]));
                }}
              />
              {ownerPreview && <img src={ownerPreview} alt="Owner" />}
            </div>

            <div className="form-group">
              <label>Shop Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setShopImageFile(e.target.files[0]);
                  setShopPreview(URL.createObjectURL(e.target.files[0]));
                }}
              />
              {shopPreview && <img src={shopPreview} alt="Shop" />}
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditConsumerModal;

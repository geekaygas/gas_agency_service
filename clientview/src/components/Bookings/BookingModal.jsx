import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
// import "../Styles/BookingModal.css";

const BookingModal = ({ onClose, onUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [shopSearch, setShopSearch] = useState("");
  const [shopResults, setShopResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [selectedConsumerId, setSelectedConsumerId] = useState(null);
  const [stock, setStock] = useState({
    full: 0,
    empty: 0,
  });

  const [bookingQty, setBookingQty] = useState({
    full: 0,
    empty: 0,
  });

  const getQtyLabels = () => {
    switch (formData.cylinderType) {
      case "19 Kg":
        return { full: "19 Kg Full", empty: "19 Kg Empty" };
      case "5 kg":
        return { full: "5 Kg Full", empty: "5 Kg Empty" };
      case "Nano Cut":
        return { full: "Nano Full", empty: "Nano Empty" };
      default:
        return { full: "Full Quantity", empty: "Empty Quantity" };
    }
  };

  const buildBookingPayload = () => {
    const payload = {
      consumerId: selectedConsumerId,
      Shopname: formData.Shopname,
      contactName: formData.contactName,
      mobileNumber1: formData.mobileNumber1,
      cylinderType: formData.cylinderType,
    };

    if (formData.cylinderType === "19 Kg") {
      payload.kg19FullQty = bookingQty.full;
      payload.kg19EmptyQty = bookingQty.empty;
    }

    if (formData.cylinderType === "5 kg") {
      payload.kg5FullQty = bookingQty.full;
      payload.kg5EmptyQty = bookingQty.empty;
    }

    if (formData.cylinderType === "Nano Cut") {
      payload.nanoFullQty = bookingQty.full;
      payload.nanoEmptyQty = bookingQty.empty;
    }

    return payload;
  };

  const fetchInventoryStock = async (cylinderType) => {
    try {
      const res = await fetch("http://localhost:4000/api/inventory");
      const result = await res.json();

      const data = result.data;

      if (cylinderType === "19 Kg") {
        setStock({
          full: data.full19,
          empty: data.empty19,
        });
      }

      if (cylinderType === "5 kg") {
        setStock({
          full: data.full5,
          empty: data.empty5,
        });
      }

      if (cylinderType === "Nano Cut") {
        setStock({
          full: data.nanoFull,
          empty: data.nanoEmpty,
        });
      }
    } catch (err) {
      console.error("Failed to fetch inventory stats", err);
    }
  };

  const [stockError, setStockError] = useState("");

  const [formData, setFormData] = useState({
    Shopname: "",
    contactName: "",
    mobileNumber1: "",
    mobileNumber2: "",
    cylinderType: "",
    address: "",
  });

  useEffect(() => {
    fetchShopSuggestions();
    setBookingQty({ full: 0, empty: 0 });
    setStockError("");
  }, [formData.cylinderType]);

  const fetchShopSuggestions = async (value = "") => {
    if (!value || value.length < 1) {
      setShopResults([]);
      return;
    }

    try {
      setLoadingSearch(true);
      const res = await fetch(
        `http://localhost:4000/api/consumers?search=${value}&limit=5&filter=all`
      );
      const data = await res.json();
      setShopResults(data.data || []);
    } catch (err) {
      console.error("Shop search failed", err);
    } finally {
      setLoadingSearch(false);
    }
  };

  // 🔹 Save booking (you can later connect backend)
  const handleSave = async (e) => {
    e.preventDefault();

    if (bookingQty.full > stock.full || bookingQty.empty > stock.empty) {
      alert("Insufficient stock ❌");
      return;
    }

    try {
      setLoading(true);

      const payload = buildBookingPayload();

      const res = await fetch("http://localhost:4000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!selectedConsumerId) {
        alert("Please select a shop");
        return;
      }
      if (!formData.cylinderType) {
        alert("Please select a shop first");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Booking saved successfully ✅");
      onUpdated && onUpdated();
      onClose();
    } catch (err) {
      alert(err.message || "Booking failed");
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

        <form className="modal-body" onSubmit={handleSave}>
          <div className="form-grid">
            {/* 🔹 SHOP SELECT */}
            <div className="form-group full">
              <label>Search Shop Name</label>
              <input
                type="text"
                placeholder="Type shop name..."
                value={shopSearch}
                onChange={(e) => {
                  setShopSearch(e.target.value);
                  fetchShopSuggestions(e.target.value);
                }}
              />

              {/* 🔽 Suggestions */}
              {shopResults.length > 0 && (
                <ul className="suggestion-list">
                  {shopResults.map((shop) => (
                    <li
                      key={shop._id}
                      onClick={() => {
                        // Auto-fill form
                        setSelectedConsumerId(shop._id);
                        setFormData({
                          Shopname: shop.Shopname,
                          contactName: shop.contactName,
                          mobileNumber1: shop.mobileNumber1,
                          mobileNumber2: shop.mobileNumber2,
                          cylinderType: shop.cylinderType,
                          address: shop.address,
                        });
                        setShopSearch(shop.Shopname);
                        setShopResults([]);
                        fetchInventoryStock(shop.cylinderType);
                      }}
                    >
                      {shop.Shopname}
                    </li>
                  ))}
                </ul>
              )}

              {loadingSearch && <small>Searching...</small>}
            </div>

            <div className="form-group">
              <label>Contact Name</label>
              <input value={formData.contactName} disabled />
            </div>

            <div className="form-group">
              <label>Mobile Number 1</label>
              <input value={formData.mobileNumber1} disabled />
            </div>

            <div className="form-group">
              <label>Mobile Number 2</label>
              <input value={formData.mobileNumber2} disabled />
            </div>

            <div className="form-group">
              <label>Cylinder Type</label>
              <input value={formData.cylinderType} disabled />
            </div>

            <div className="form-group full">
              <label>Address</label>
              <input value={formData.address} disabled />
            </div>
          </div>

          <div className="form-group">
            <label>{getQtyLabels().full}</label>
            <input
              type="number"
              min={0}
              value={bookingQty.full}
              onChange={(e) => {
                const value = Math.max(0, Number(e.target.value));
                setBookingQty({ ...bookingQty, full: value });

                if (value > stock.full) {
                  setStockError(`Only ${stock.full} full cylinders available`);
                } else {
                  setStockError("");
                }
              }}
              disabled={!formData.cylinderType}
            />
            <small>Available: {stock.full}</small>
          </div>

          <div className="form-group">
            <label>{getQtyLabels().empty}</label>
            <input
              type="number"
              min={0}
              value={bookingQty.empty}
              onChange={(e) => {
                const value = Math.max(0, Number(e.target.value));
                setBookingQty({ ...bookingQty, empty: value });

                if (value > stock.empty) {
                  setStockError(
                    `Only ${stock.empty} empty cylinders available`
                  );
                } else {
                  setStockError("");
                }
              }}
              disabled={!formData.cylinderType}
            />
            <small>Available: {stock.empty}</small>
          </div>

          {stockError && (
            <div style={{ color: "red", fontSize: "13px" }}>{stockError}</div>
          )}

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;

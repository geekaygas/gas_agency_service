import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import "../Styles/StockManagement.css";
import BookingModal from "./BookingModal.jsx";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [bookingOpen, setBookingOpen] = useState(false);
  const getBookingQty = (b) => {
    if (b.cylinderType === "19 Kg") {
      return {
        full: b.kg19FullQty,
        empty: b.kg19EmptyQty,
      };
    }

    if (b.cylinderType === "5 kg") {
      return {
        full: b.kg5FullQty,
        empty: b.kg5EmptyQty,
      };
    }

    if (b.cylinderType === "Nano Cut") {
      return {
        full: b.nanoFullQty,
        empty: b.nanoEmptyQty,
      };
    }

    return { full: 0, empty: 0 };
  };

  // 🔹 FETCH CONSUMERS
  const fetchConsumers = async () => {
    try {
      const res = await fetch(
        `https://gas-agency-service.onrender.com/api/bookings?page=${page}&limit=${limit}&search=${search}&filter=all`
      );
      const data = await res.json();

      setBookings(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch consumers", err);
    }
  };

  useEffect(() => {
    fetchConsumers();
  }, [page, limit, search]);

  return (
    <div className="stock-page">
      <h2>Consumer Details</h2>
      <div className="search-filter-container">
        <div className="search-filter-content">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search shop / contact / mobile..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="search-input"
            />
          </div>

          {/* 🔹 OPEN BOOKING MODAL */}
          <button className="book" onClick={() => setBookingOpen(true)}>
            Book
          </button>
        </div>
      </div>
      <div className="table-wrapper">
        <table className="stock-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Shop Name</th>
              <th>Contact</th>
              <th>Mobile</th>
              <th>Cylinder</th>
              <th>Full Qty</th>
              <th>Empty Qty</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((b) => {
                const qty = getBookingQty(b);

                return (
                  <tr key={b._id}>
                    <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td>{new Date(b.createdAt).toLocaleTimeString()}</td>
                    <td>{b.Shopname}</td>
                    <td>{b.contactName}</td>
                    <td>{b.mobileNumber1}</td>
                    <td>{b.cylinderType}</td>
                    <td>{qty.full}</td>
                    <td>{qty.empty}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={page === i + 1 ? "active" : ""}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* 🔹 Edit Modal */}
      {bookingOpen && (
        <BookingModal
          onClose={() => setBookingOpen(false)}
          onUpdated={fetchConsumers}
        />
      )}
    </div>
  );
};

export default BookingManagement;
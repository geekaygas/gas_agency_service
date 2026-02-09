import React, { useState, useEffect } from "react";
import "../styles/ClientTable.css";

const ClientTable = () => {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchBookings = async () => {
    const res = await fetch(
      `https://gas-agency-service.onrender.com/api/bookings?page=${page}&limit=${limit}`
    );
    const result = await res.json();
    setBookings(result.data || []);
    setTotal(result.pagination?.total || 0);
  };

  useEffect(() => {
    fetchBookings();
  }, [page, limit]);

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="client-table">
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
                let full = 0;
                let empty = 0;

                if (b.cylinderType === "19 Kg") {
                  full = b.kg19FullQty;
                  empty = b.kg19EmptyQty;
                } else if (b.cylinderType === "5 kg") {
                  full = b.kg5FullQty;
                  empty = b.kg5EmptyQty;
                } else if (b.cylinderType === "Nano Cut") {
                  full = b.nanoFullQty;
                  empty = b.nanoEmptyQty;
                }

                return (
                  <tr key={b._id}>
                    <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td>{new Date(b.createdAt).toLocaleTimeString()}</td>
                    <td>{b.Shopname}</td>
                    <td>{b.contactName}</td>
                    <td>{b.mobileNumber1}</td>
                    <td>{b.cylinderType}</td>
                    <td>{full}</td>
                    <td>{empty}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="table-pagination">
        <p className="pagination-info">
          Showing {(page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, total)} of {total} results
        </p>

        <div className="pagination-buttons">
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

          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <button
            disabled={page * limit >= total}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientTable;

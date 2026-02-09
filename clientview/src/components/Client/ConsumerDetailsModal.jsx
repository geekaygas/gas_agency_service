import React, { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import "../Styles/ConsumerDetails.css";
import EditConsumerDetailsModal from "./EditConsumerDetails.jsx";

const ConsumerDetailsModal = () => {
  const [consumer, setConsumer] = useState([]);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState("all");

  const [selectedConsumerDetails, setSelectedConsumerDetails] = useState(null);

  const fetchConsumer = async () => {
    const res = await fetch(
      `https://gas-agency-service.onrender.com/api/consumers?page=${page}&limit=${limit}&search=${search}&filter=${filterType}`
    );
    const data = await res.json();
    setConsumer(data.data);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    fetchConsumer();
  }, [page, limit, search, filterType]);

  const deleteConsumer = async (id) => {
    if (!window.confirm("Delete this stock?")) return;
    await fetch(`https://gas-agency-service.onrender.com/api/consumers/${id}`, {
      method: "DELETE",
    });
    fetchConsumer();
  };

  return (
    <div className="stock-page">
      <h2>Consumer Details</h2>
      <div className="search-filter-container">
        <div className="search-filter-content">
          {/* Search */}
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search Provider / Driver / Staff..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="search-input"
            />
          </div>

          {/* Filters */}
          <div className="filter-actions">
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setPage(1);
              }}
              className="filter-select"
            >
              <option value="all">All Cylinders</option>
              <option value="19 Kg">19 Kg</option>
              <option value="5 kg">5 Kg</option>
              <option value="Nano Cut">Nano Cut</option>
            </select>

            <select
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="filter-select"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>

            <button className="filter-btn">
              <Filter className="icon" />
              <span className="filter-text">Filter</span>
            </button>
          </div>
        </div>
      </div>
      <div className="table-wrapper">
        <table className="stock-table">
          <thead>
            <tr>
              <th>Shop Name</th>
              <th>Shop Image</th>
              <th>Contact Name</th>
              <th>Owner Image</th>
              <th>Mobile 1</th>
              <th>Mobile 2</th>
              <th>Cylinder Type</th>
              <th>Address</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {consumer.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>
                  No consumers found
                </td>
              </tr>
            ) : (
              consumer.map((item) => (
                <tr key={item._id}>
                  <td>{item.Shopname}</td>

                  {/* Shop Image */}
                  <td>
                    {item.shopImage ? (
                      <img
                        src={item.shopImage}
                        alt="Shop"
                        className="table-image"
                      />
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>{item.contactName}</td>

                  {/* Owner Image */}
                  <td>
                    {item.ownerImage ? (
                      <img
                        src={item.ownerImage}
                        alt="Owner"
                        className="table-image"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{item.mobileNumber1}</td>
                  <td>{item.mobileNumber2 || "-"}</td>
                  <td>{item.cylinderType}</td>
                  <td>{item.address}</td>

                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>

                  <td className="action-btns">
                    <button
                      className="edit"
                      onClick={() => setSelectedConsumerDetails(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete"
                      onClick={() => deleteConsumer(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination">
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
      {selectedConsumerDetails && (
        <EditConsumerDetailsModal
          consumer={selectedConsumerDetails}
          onClose={() => setSelectedConsumerDetails(null)}
          onUpdated={fetchConsumer}
        />
      )}
    </div>
  );
};

export default ConsumerDetailsModal;

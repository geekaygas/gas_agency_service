import React, { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import "../Styles/StockManagement.css";
import EditStockModal from "./EditStockModal";

const StockManagement = () => {
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState("all");

  const [selectedStock, setSelectedStock] = useState(null);

  const fetchStocks = async () => {
    const res = await fetch(
      `https://gas-agency-service.onrender.com/api/stocks?page=${page}&limit=${limit}&search=${search}&filter=${filterType}`
    );
    const data = await res.json();
    setStocks(data.data);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    fetchStocks();
  }, [page, limit, search]);

  const deleteStock = async (id) => {
    if (!window.confirm("Delete this stock?")) return;
    await fetch(`https://gas-agency-service.onrender.com/api/stocks/${id}`, {
      method: "DELETE",
    });
    fetchStocks();
  };

  return (
    <div className="stock-page">
      <h2>Stock Management</h2>
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
              <option value="all">All Stocks</option>
              <option value="provider">Provider</option>
              <option value="driver">Driver</option>
              <option value="staff">Staff</option>
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
              <th>Provider</th>
              <th>Driver</th>
              <th>Staff</th>
              <th>19 Kg Full</th>
              <th>5 Kg Full</th>
              <th>NanoCut Full</th>
              <th>19 Kg Empty</th>
              <th>5 Kg Empty</th>
              <th>NanoCut Empty</th>
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {stocks.map((item) => (
              <tr key={item._id}>
                <td>{item.Provider}</td>
                <td>{item.Drivername}</td>
                <td>{item.Staffname}</td>
                <td>{item.cylinder19}</td>
                <td>{item.cylinder5}</td>
                <td>{item.nanoCut}</td>
                <td>{item.cylinder19mt}</td>
                <td>{item.cylinder5mt}</td>
                <td>{item.nanoCutmt}</td>
                <td>{item.date}</td>
                <td>{item.time}</td>
                <td className="action-btns">
                  <button
                    className="edit"
                    onClick={() => setSelectedStock(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete"
                    onClick={() => deleteStock(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
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
      {selectedStock && (
        <EditStockModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          onUpdated={fetchStocks}
        />
      )}
    </div>
  );
};

export default StockManagement;

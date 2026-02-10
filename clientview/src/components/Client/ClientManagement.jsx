import React, { useEffect, useState } from "react";
import { Plus, BatteryFull, Ban } from "lucide-react";
import StatCard from "../pages/StatCard";
import SearchFilter from "./SearchFilter";
import ClientTable from "./ClientTable";
import AddClientModal from "./AddClientModel";
import AddStockModal from "../Stocks/AddStockModel.jsx";
import "../styles/ClientManagement.css";

const ClientManagement = ({ user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // live time
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // stats
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await fetch("https://gas-agency-service.onrender.com/api/inventory");
      const data = await res.json();
      setStats(data.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const logout = async () => {
  await fetch("https://gas-agency-service.onrender.com/api/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setIsAuthenticated(false);
  setUser(null);
};

  return (
    <div className="page-content">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Empty & Filled Cylinder Management</h1>
          <p className="page-description">
            Manage your Consumers, Domains, and Email services efficiently.
          </p>
        </div>
        <button
          className="btn-warning-sm"
          onClick={() => setShowAddStockModal(true)}
        >
          <Plus className="icon" />
          Add New Stock
        </button>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus className="icon" />
          Add New Consumer
        </button>

        <div className="user-menu-wrapper">
          <div
            className="user-avatar"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            👤
          </div>

          {showUserMenu && (
            <div className="user-dropdown">
              <p className="user-name">{user?.name}</p>
              <p className="user-email">{user?.email}</p>

              <p className="user-time">
                {now.toLocaleDateString()}
                <br />
                {now.toLocaleTimeString()}
              </p>

              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stats-grid-first">
          <StatCard
            icon={<BatteryFull className="stat-icon-green" />}
            label="19 Kg"
            value={stats?.full19}
            // change="+5.2%"
            badge="Full"
            changeType="positive"
            badgeColor="green"
          />
          <StatCard
            icon={<Ban className="stat-icon-red" />}
            label="19 Kg"
            value={stats?.empty19}
            badge="Empty"
            badgeColor="red"
          />
        </div>
        <div className="stats-grid-center">
          <StatCard
            icon={<BatteryFull className="stat-icon-green" />}
            label="5 Kg"
            value={stats?.full5}
            badge="Full"
            badgeColor="green"
          />
          <StatCard
            icon={<Ban className="stat-icon-red" />}
            label="5 Kg"
            value={stats?.empty5}
            badge="Empty"
            badgeColor="red"
          />
        </div>
        <div className="stats-grid-last">
          <StatCard
            icon={<BatteryFull className="stat-icon-green" />}
            label="Nano Cut"
            value={stats?.nanoFull}
            badge="Full"
            changeType="positive"
            badgeColor="green"
          />
          <StatCard
            icon={<Ban className="stat-icon-red" />}
            label="Nano Cut"
            value={stats?.nanoEmpty}
            badge="Empty"
            badgeColor="red"
          />
        </div>{" "}
      </div>

      {/* Search and Filters */}
      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Clients Table */}
      <ClientTable />

      {/* Add Client Modal */}
      {showAddModal && (
        <AddClientModal onClose={() => setShowAddModal(false)} />
      )}
      {/* Add Client Modal */}
      {showAddStockModal && (
        <AddStockModal onClose={() => setShowAddStockModal(false)} onSuccess={fetchStats} />
      )}
    </div>
  );
};

export default ClientManagement;

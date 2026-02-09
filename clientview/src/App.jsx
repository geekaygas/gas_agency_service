import React, { useState,useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/header";
import ClientManagement from "./components/Client/ClientManagement";
import ConsumerDetails from "./components/Client/ConsumerDetailsModal.jsx";
import StockManagement from "./components/Stocks/StockManagement.jsx";
import BookingManagement from "./components/Bookings/BookingManagement.jsx";
import Login from "./components/Auth/OGLogin.jsx";
import "./components/Styles/App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

useEffect(() => {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (!token || !savedUser || savedUser === "undefined") {
    // bad or missing data → clean up
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return;
  }

  try {
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);
    setIsAuthenticated(true);
  } catch (error) {
    console.error("Corrupted user data in localStorage", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}, []);

const logout = async () => {
    try {
      await fetch("https://gas-agency-service.onrender.com/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (err) {
      console.warn("Logout API failed, continuing anyway");
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage("Dashboard");
  };


  if (!isAuthenticated) {
    return (
      <Login
        onLoginSuccess={(userData) => {
          setUser(userData);
          setIsAuthenticated(true);
          setCurrentPage("Dashboard"); // 👈 ClientManagement opens
        }}
      />
    );
  }

  // 🔓 AFTER LOGIN → SHOW FULL APP
  return (
    <div className="app-container">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />

      {showMobileMenu && (
        <div
          className="mobile-overlay"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      <main className="main-content">
        {/* <Header setShowMobileMenu={setShowMobileMenu} /> */}
        <Header setShowMobileMenu={setShowMobileMenu} user={user} onLogout={logout} />

        {currentPage === "Dashboard" && <ClientManagement  user={user} onLogout={logout}/>}
        {currentPage === "Consumer" && <ConsumerDetails />}
        {currentPage === "Stocks" && <StockManagement />}
        {currentPage === "Booking" && <BookingManagement />}
        {currentPage === "billing" && (
          <div className="page-content">
            <h1>Billing Coming Soon</h1>
          </div>
        )}
        {currentPage === "settings" && (
          <div className="page-content">
            <h1>Settings Coming Soon</h1>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

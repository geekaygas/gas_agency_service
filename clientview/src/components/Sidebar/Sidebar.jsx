// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   FiHome,
//   FiUsers,
//   FiSettings,
//   FiUserPlus,
//   FiChevronRight,
//   FiMenu,
//   FiX
// } from "react-icons/fi";
// import { IoIosArrowBack } from "react-icons/io";
// import { IoBusiness } from "react-icons/io5";
// import "./Sidebar.css";

// const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
//   const location = useLocation();
//   const [activeItem, setActiveItem] = useState("/");

//   useEffect(() => {
//     // Set active menu item based on current path
//     const path = location.pathname;
//     setActiveItem(path);
//   }, [location]);

//   return (
//     <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
//       <div className="sidebar-header">
//         <img src="/src/Utils/img/indane-gas-seeklogo.png" alt="Indane" className="sidebar-logo" />
//         {/* {isSidebarOpen && <h2 className="sidebar-title">INDANE</h2>} */}
//         <button className="sidebar-toggle" onClick={toggleSidebar}>
//           {isSidebarOpen ? <IoIosArrowBack/> : ""}
//         </button>
//       </div>

//       <div className="sidebar-content">
//         <nav className="sidebar-nav">
//           <Link to="/" className={`sidebar-link ${activeItem === '/' ? 'active' : ''}`}>
//             <FiHome className="sidebar-icon" />
//             {isSidebarOpen && <span>Dashboard</span>}
//             {isSidebarOpen && <FiChevronRight className="sidebar-arrow" />}
//           </Link>
//           <Link to="/users" className={`sidebar-link ${activeItem === '/users' ? 'active' : ''}`}>
//             <FiUsers className="sidebar-icon" />
//             {isSidebarOpen && <span>Users</span>}
//             {isSidebarOpen && <FiChevronRight className="sidebar-arrow" />}
//           </Link>
//           <Link to="/businesses" className={`sidebar-link ${activeItem === '/businesses' ? 'active' : ''}`}>
//             <IoBusiness className="sidebar-icon" />
//             {isSidebarOpen && <span>Businesses</span>}
//             {isSidebarOpen && <FiChevronRight className="sidebar-arrow" />}
//           </Link>
//           <Link to="/agents" className={`sidebar-link ${activeItem === '/agents' ? 'active' : ''}`}>
//             <FiUserPlus className="sidebar-icon" />
//             {isSidebarOpen && <span>Agents</span>}
//             {isSidebarOpen && <FiChevronRight className="sidebar-arrow" />}
//           </Link>
//           <Link to="/settings" className={`sidebar-link ${activeItem === '/settings' ? 'active' : ''}`}>
//             <FiSettings className="sidebar-icon" />
//             {isSidebarOpen && <span>Settings</span>}
//             {isSidebarOpen && <FiChevronRight className="sidebar-arrow" />}
//           </Link>
//         </nav>
//       </div>

//       {isSidebarOpen && (
//         <div className="sidebar-footer">
//           <p className="version-info">v1.0.0</p>
//         </div>
//       )}
//     </aside>
//   );
// };

// export default Sidebar;

import React from "react";
import logo from '/src/Utils/img/indane-gas-seeklogo.png';
import {
  Globe,
  LayoutDashboard,
  Users,
  Mail,
  Book,
  CreditCard,
  Settings,
} from "lucide-react";
import "../styles/Sidebar.css";

const Sidebar = ({
  currentPage,
  setCurrentPage,
  showMobileMenu,
  setShowMobileMenu,
}) => {
  const navItems = [
    { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "Consumer", label: "Consumer", icon: Users },
    { id: "Stocks", label: "Stocks", icon: Globe },
    { id: "Booking", label: "Booking Services", icon: Book },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <aside className={`sidebar ${showMobileMenu ? "sidebar-open" : ""}`}>
      <div className="sidebar-content">
        {/* Logo */}

        <div className="logo-icon">
          <img src={logo} alt="Indane Gas" />
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                setShowMobileMenu(false);
              }}
              className={`nav-item ${
                currentPage === item.id ? "nav-item-active" : ""
              }`}
            >
              <item.icon className="nav-icon" />
              <span>{item.label}</span>
            </button>
          ))}

          <div className="nav-divider"></div>

          <button
            onClick={() => setCurrentPage("settings")}
            className={`nav-item ${
              currentPage === "settings" ? "nav-item-active" : ""
            }`}
          >
            <Settings className="nav-icon" />
            <span>Settings</span>
          </button>
        </nav>

        {/* User Profile */}
        <div className="sidebar-profile">
          <div className="profile-avatar">A</div>
          <div className="profile-info">
            <p className="profile-name">Admin User</p>
            <p className="profile-email">admin@hostmaster.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

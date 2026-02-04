import React from 'react';
import { Globe, LayoutDashboard, Users, Mail, CreditCard, Settings } from 'lucide-react';
import '../styles/Sidebar.css';

const Sidebar = ({ currentPage, setCurrentPage, showMobileMenu, setShowMobileMenu }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'domains', label: 'Domains', icon: Globe },
    { id: 'email', label: 'Email Services', icon: Mail },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <aside className={`sidebar ${showMobileMenu ? 'sidebar-open' : ''}`}>
      <div className="sidebar-content">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Globe className="icon" />
          </div>
          <div>
            <h1 className="logo-title">HostMaster</h1>
            <p className="logo-subtitle">Admin Console</p>
          </div>
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
              className={`nav-item ${currentPage === item.id ? 'nav-item-active' : ''}`}
            >
              <item.icon className="nav-icon" />
              <span>{item.label}</span>
            </button>
          ))}
          
          <div className="nav-divider"></div>
          
          <button
            onClick={() => setCurrentPage('settings')}
            className={`nav-item ${currentPage === 'settings' ? 'nav-item-active' : ''}`}
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
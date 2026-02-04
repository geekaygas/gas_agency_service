import React from 'react';
import { Search, Bell, HelpCircle, Menu } from 'lucide-react';
import '../styles/Header.css';

const Header = ({ setShowMobileMenu }) => {
  return (
    <header className="header">
      <div className="header-content">
        <button className="mobile-menu-btn" onClick={() => setShowMobileMenu(prev => !prev)}>
          <Menu className="icon" />
        </button>
        
        <div className="header-search">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Global search (CMD+K)..."
              className="search-input"
            />
          </div>
        </div>
        
        <div className="header-actions">
          <button className="icon-btn">
            <Bell className="icon" />
            <span className="notification-badge"></span>
          </button>
          <button className="icon-btn">
            <HelpCircle className="icon" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

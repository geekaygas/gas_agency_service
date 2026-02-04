import React from 'react';
import { Search, Filter } from 'lucide-react';
import '../styles/SearchFilter.css';

const SearchFilter = ({ searchQuery, setSearchQuery, statusFilter, setStatusFilter }) => {
  return (
    <div className="search-filter-container">
      <div className="search-filter-content">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-actions">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option>All</option>
            <option>Active</option>
            <option>Payment Due</option>
            <option>Suspended</option>
          </select>
          <button className="filter-btn">
            <Filter className="icon" />
            <span className="filter-text">Filter</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
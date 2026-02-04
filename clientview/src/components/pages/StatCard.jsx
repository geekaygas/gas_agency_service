import React from 'react';
import '../styles/StatCard.css';

const StatCard = ({ icon, label, value, change, changeType, badge, badgeColor }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className="stat-icon-wrapper">{icon}</div>
        {change && (
          <span className={`stat-change ${changeType === 'positive' ? 'change-positive' : 'change-negative'}`}>
            {change}
          </span>
        )}
        <p className="stat-label">{label}</p>
        {badge && (
          <span className={`stat-badge badge-${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>
      
      <p className="stat-value">{value}</p>
    </div>
  );
};

export default StatCard;

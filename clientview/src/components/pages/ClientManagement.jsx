import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import StatCard from '../pages/StatCard';
import SearchFilter from '../components/SearchFilter';
import ClientTable from '../components/ClientTable';
import AddClientModal from '../components/AddClientModel';
import { Users, Globe, Settings } from 'lucide-react';
import '../styles/ClientManagement.css';

const mockClients = [
  {
    id: 'CL-8021',
    name: 'Acme Corp',
    contact: { name: 'John Doe', email: 'john@acme.com', avatar: '👤' },
    domains: ['acme.com', 'acme.io'],
    emailUsage: { used: 45, total: 100 },
    status: 'Active',
    renewalDate: '2025-03-15',
    domainCost: 299,
    hostingCost: 499
  },
  {
    id: 'CL-7743',
    name: 'TechStar Inc',
    contact: { name: 'Jane Smith', email: 'jane@techstar.io', avatar: '👤' },
    domains: ['techstar.io'],
    emailUsage: { used: 82, total: 100 },
    status: 'Payment Due',
    renewalDate: '2025-01-10',
    domainCost: 199,
    hostingCost: 699
  },
  {
    id: 'CL-3321',
    name: 'Global Logistics',
    contact: { name: 'Mike Ross', email: 'mike@global.com', avatar: '👤' },
    domains: ['global-logistics.net'],
    emailUsage: { used: 120, total: 500 },
    status: 'Active',
    renewalDate: '2025-06-20',
    domainCost: 399,
    hostingCost: 899
  },
  {
    id: 'CL-1029',
    name: 'EcoWorld',
    contact: { name: 'Sarah Connor', email: 'sarah@ecoworld.org', avatar: '👤' },
    domains: ['ecoworld.org', 'eco.net'],
    emailUsage: { used: 12, total: 20 },
    status: 'Suspended',
    renewalDate: '2024-12-01',
    domainCost: 149,
    hostingCost: 299
  }
];

const ClientManagement = () => {
  const [clients, setClients] = useState(mockClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.contact.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalClients: clients.length,
    activeDomains: clients.reduce((acc, c) => acc + c.domains.length, 0),
    pendingSetup: clients.filter(c => c.status === 'Payment Due').length
  };

  const handleAddClient = (client) => {
    setClients([...clients, client]);
    setShowAddModal(false);
  };

  return (
    <div className="page-content">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Client Management</h1>
          <p className="page-description">Manage your clients, domains, and email services efficiently.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus className="icon" />
          Add New Client
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stats-grid-first">
        <StatCard
          icon={<Users className="stat-icon-blue" />}
          label="Total Clients"
          value={stats.totalClients.toLocaleString()}
          change="+5.2%"
          changeType="positive"
        />
        <StatCard
          icon={<Globe className="stat-icon-purple" />}
          label="Active Domains"
          value={stats.activeDomains.toLocaleString()}
          badge="Stable"
          badgeColor="gray"
        /></div>
       
            <div className="stats-grid-center">
        <StatCard
          icon={<Settings className="stat-icon-orange" />}
          label="Pending Setup"
          value={stats.pendingSetup}
          badge="Action Needed"
          badgeColor="orange"
        />
         <StatCard
          icon={<Settings className="stat-icon-orange" />}
          label="Pending Setup"
          value={stats.pendingSetup}
          badge="Action Needed"
          badgeColor="orange"
        />
      </div>
      
        <div className="stats-grid-last">
        <StatCard
          icon={<Users className="stat-icon-blue" />}
          label="Total Clients"
          value={stats.totalClients.toLocaleString()}
          change="+5.2%"
          changeType="positive"
        />
        <StatCard
          icon={<Globe className="stat-icon-purple" />}
          label="Active Domains"
          value={stats.activeDomains.toLocaleString()}
          badge="Stable"
          badgeColor="gray"
        /></div> </div>

      {/* Search and Filters */}
      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Clients Table */}
      <ClientTable clients={filteredClients} totalClients={stats.totalClients} />

      {/* Add Client Modal */}
      {showAddModal && (
        <AddClientModal onClose={() => setShowAddModal(false)} onAdd={handleAddClient} />
      )}
    </div>
  );
};

export default ClientManagement;
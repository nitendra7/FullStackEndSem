import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import TicketList from '../components/TicketList';

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketRes, userRes] = await Promise.all([
          api.get('/complaints'),
          api.get('/auth/users') // I need to add this endpoint to the backend or use a mock
        ]);
        setTickets(ticketRes.data);
        // Fallback if users endpoint doesn't exist yet
        setAgents(userRes?.data?.filter(u => u.role === 'AGENT') || []);
      } catch (err) {
        console.error('Failed to fetch admin data');
        // If users fails, just show tickets
        try {
           const res = await api.get('/complaints');
           setTickets(res.data);
        } catch(e) {}
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssign = async (ticketId, agentId) => {
    try {
      await api.put(`/complaints/${ticketId}/assign?agentId=${agentId}`);
      const res = await api.get('/complaints');
      setTickets(res.data);
    } catch (err) {
      alert('Assignment failed');
    }
  };

  return (
    <div className="admin-dashboard fade-in">
      <div className="section-header">
        <h2>Global Management</h2>
        <p>Monitor all system complaints and route them to agents</p>
      </div>

      <div className="stats-grid">
        <div className="card stat-card">
          <h4>Total Tickets</h4>
          <span className="stat-val">{tickets.length}</span>
        </div>
        <div className="card stat-card">
          <h4>Unassigned</h4>
          <span className="stat-val">{tickets.filter(t => t.agentName === 'Unassigned').length}</span>
        </div>
        <div className="card stat-card">
          <h4>Resolved</h4>
          <span className="stat-val">{tickets.filter(t => t.status === 'RESOLVED').length}</span>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading global data...</div>
      ) : (
        <div className="admin-ticket-container">
           {/* Custom list for admin to show assignment controls */}
           <TicketList 
             tickets={tickets} 
             onTicketClick={(id) => navigate(`/tickets/${id}`)} 
           />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

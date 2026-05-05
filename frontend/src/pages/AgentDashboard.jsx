import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import TicketList from '../components/TicketList';

const AgentDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/complaints/assigned');
        setTickets(response.data);
      } catch (err) {
        console.error('Failed to fetch assigned tickets');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  return (
    <div className="agent-dashboard fade-in">
      <div className="section-header">
        <h2>Assigned Tasks</h2>
        <p>Manage and resolve complaints assigned to you</p>
      </div>

      {loading ? (
        <div className="loading">Loading assignments...</div>
      ) : (
        <TicketList 
          tickets={tickets} 
          onTicketClick={(id) => navigate(`/tickets/${id}`)} 
        />
      )}
    </div>
  );
};

export default AgentDashboard;

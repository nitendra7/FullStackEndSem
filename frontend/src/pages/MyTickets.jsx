import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import TicketList from '../components/TicketList';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/complaints/my');
        setTickets(response.data);
      } catch (err) {
        console.error('Failed to fetch tickets');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  return (
    <div className="my-tickets-page">
      <div className="section-header">
        <h2>My Complaint History</h2>
        <p>Tracking the progress of your submitted issues</p>
      </div>

      {loading ? (
        <div className="loading">Loading your tickets...</div>
      ) : (
        <TicketList 
          tickets={tickets} 
          onTicketClick={(id) => navigate(`/tickets/${id}`)} 
        />
      )}
    </div>
  );
};

export default MyTickets;

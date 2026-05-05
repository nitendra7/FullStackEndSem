import React from 'react';
import { Calendar, Tag, User, AlertCircle, Clock } from 'lucide-react';
import './TicketList.css';

const TicketList = ({ tickets, onTicketClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW': return 'status-new';
      case 'ASSIGNED': return 'status-assigned';
      case 'IN_PROGRESS': return 'status-progress';
      case 'RESOLVED': return 'status-resolved';
      case 'CLOSED': return 'status-closed';
      default: return '';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'HIGH': return <AlertCircle size={14} className="priority-high" />;
      case 'MEDIUM': return <Clock size={14} className="priority-medium" />;
      default: return <Clock size={14} className="priority-low" />;
    }
  };

  if (!tickets.length) {
    return (
      <div className="empty-state card">
        <h3>No complaints found</h3>
        <p>Your search or filters returned no results.</p>
      </div>
    );
  }

  return (
    <div className="ticket-grid">
      {tickets.map(ticket => (
        <div key={ticket.id} className="ticket-card card" onClick={() => onTicketClick(ticket.id)}>
          <div className="ticket-header">
            <span className={`status-badge ${getStatusColor(ticket.status)}`}>
              {ticket.status.replace('_', ' ')}
            </span>
            <span className="priority-tag">
              {getPriorityIcon(ticket.priority)}
              {ticket.priority}
            </span>
          </div>

          <h3 className="ticket-title">{ticket.title}</h3>
          <p className="ticket-desc">{ticket.description.substring(0, 100)}...</p>

          <div className="ticket-meta">
            <div className="meta-item">
              <Tag size={14} />
              <span>{ticket.categoryName}</span>
            </div>
            <div className="meta-item">
              <Calendar size={14} />
              <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="ticket-footer">
            <div className="meta-item">
              <User size={14} />
              <span>{ticket.complainantName}</span>
            </div>
            <div className="agent-badge">
              Assigned to: {ticket.agentName}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketList;

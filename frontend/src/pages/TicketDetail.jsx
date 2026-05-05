import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Send, User, Clock, ChevronLeft, Paperclip } from 'lucide-react';
import './TicketDetail.css';

const TicketDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketRes, commentRes] = await Promise.all([
          api.get(`/complaints/all`), // Simple get all for now, would ideally have a /get/{id}
          api.get(`/complaints/${id}/comments`)
        ]);
        const foundTicket = ticketRes.data.find(t => t.id === parseInt(id));
        setTicket(foundTicket);
        setComments(commentRes.data);
      } catch (err) {
        console.error('Failed to fetch ticket data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await api.put(`/complaints/${id}/status?status=${newStatus}`);
      setTicket(response.data);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await api.post(`/complaints/${id}/comments`, { text: newComment });
      const res = await api.get(`/complaints/${id}/comments`);
      setComments(res.data);
      setNewComment('');
    } catch (err) {
      alert('Failed to add comment');
    }
  };

  if (loading) return <div>Loading details...</div>;
  if (!ticket) return <div>Ticket not found</div>;

  return (
    <div className="ticket-detail-page">
      <button className="back-link" onClick={() => navigate(-1)}>
        <ChevronLeft size={18} /> Back to List
      </button>

      <div className="detail-layout">
        <div className="main-detail card">
          <div className="ticket-main-header">
            <div className="title-group">
              <span className="cat-tag">{ticket.categoryName}</span>
              <h2>{ticket.title}</h2>
              <div className="timestamp">
                <Clock size={14} /> Created on {new Date(ticket.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="status-control">
              <span className={`status-badge detail ${ticket.status}`}>
                {ticket.status.replace('_', ' ')}
              </span>
              {(user.role === 'ROLE_AGENT' || user.role === 'ROLE_ADMIN') && (
                <select 
                  value={ticket.status} 
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="status-select"
                >
                  <option value="NEW">NEW</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              )}
            </div>
          </div>

          <div className="ticket-body">
            <h3>Description</h3>
            <p>{ticket.description}</p>
            {ticket.attachmentUrl && (
              <div className="attachment-box">
                <a href={ticket.attachmentUrl} target="_blank" rel="noreferrer">
                  <Paperclip size={18} /> View Attachment
                </a>
              </div>
            )}
          </div>

          <div className="conversation-section">
            <h3>Conversation History</h3>
            <div className="comment-list">
              {comments.map(comment => (
                <div key={comment.id} className={`comment-item ${comment.userName === user.name ? 'own' : ''}`}>
                  <div className="comment-avatar">{comment.userName.charAt(0)}</div>
                  <div className="comment-content">
                    <div className="comment-info">
                      <strong>{comment.userName}</strong>
                      <span>{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    <p>{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="comment-input-area">
              <textarea 
                placeholder="Type your message here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button type="submit" className="btn-primary send-comment">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="side-detail card">
          <h3>Ticket Info</h3>
          <div className="info-row">
            <span>Ticket ID</span>
            <strong>#{ticket.id}</strong>
          </div>
          <div className="info-row">
            <span>Priority</span>
            <strong className={ticket.priority.toLowerCase()}>{ticket.priority}</strong>
          </div>
          <div className="info-row">
            <span>Complainant</span>
            <strong>{ticket.complainantName}</strong>
          </div>
          <div className="info-row">
            <span>Assigned Agent</span>
            <strong>{ticket.agentName}</strong>
          </div>
          <div className="info-row">
            <span>Last Updated</span>
            <strong>{new Date(ticket.updatedAt).toLocaleDateString()}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;

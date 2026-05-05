import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Send, Image as ImageIcon, AlertCircle } from 'lucide-react';
import './CreateTicket.css';

const CreateTicket = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    priority: 'MEDIUM',
    attachmentUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/complaints', formData);
      navigate('/my-tickets');
    } catch (err) {
      setError('Failed to lodge complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-ticket-page">
      <div className="card fade-in">
        <div className="form-header">
          <h2>Submit a New Complaint</h2>
          <p>Please provide detailed information to help us resolve the issue quickly.</p>
        </div>

        {error && <div className="error-banner"><AlertCircle size={18}/> {error}</div>}

        <form onSubmit={handleSubmit} className="complaint-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Issue Title</label>
              <input 
                type="text" 
                placeholder="Brief summary of the issue"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required 
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select 
                value={formData.categoryId}
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                required
              >
                <option value="">Select a department</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Priority Level</label>
              <div className="priority-options">
                {['LOW', 'MEDIUM', 'HIGH'].map(p => (
                  <label key={p} className={`priority-pill ${formData.priority === p ? 'active' : ''} ${p.toLowerCase()}`}>
                    <input 
                      type="radio" 
                      name="priority" 
                      value={p} 
                      checked={formData.priority === p}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    />
                    {p}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Attachment URL (Optional)</label>
              <div className="input-with-icon">
                <ImageIcon size={18} />
                <input 
                  type="url" 
                  placeholder="https://image-link.com/evidence.png"
                  value={formData.attachmentUrl}
                  onChange={(e) => setFormData({...formData, attachmentUrl: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="form-group full-width">
            <label>Detailed Description</label>
            <textarea 
              rows="5" 
              placeholder="Describe what happened, when it happened, and any other relevant details..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Lodge Complaint'}
              {!loading && <Send size={18} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Ticket, 
  Users, 
  LogOut, 
  PieChart,
  MessageSquare
} from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} />, roles: ['ROLE_USER', 'ROLE_AGENT', 'ROLE_ADMIN'] },
    { name: 'New Complaint', path: '/create', icon: <PlusCircle size={20} />, roles: ['ROLE_USER'] },
    { name: 'My Tickets', path: '/my-tickets', icon: <Ticket size={20} />, roles: ['ROLE_USER'] },
    { name: 'Assigned', path: '/assigned', icon: <Ticket size={20} />, roles: ['ROLE_AGENT'] },
    { name: 'All Complaints', path: '/all-tickets', icon: <Users size={20} />, roles: ['ROLE_ADMIN'] },
    { name: 'Analytics', path: '/analytics', icon: <PieChart size={20} />, roles: ['ROLE_ADMIN'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">CMS</div>
          <span>Complaint Hub</span>
        </div>
        
        <nav className="sidebar-nav">
          {filteredNav.map(item => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0)}</div>
            <div className="user-details">
              <p className="user-name">{user?.name}</p>
              <p className="user-role">{user?.role?.replace('ROLE_', '')}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <h1>Welcome back, {user?.name.split(' ')[0]}!</h1>
          <div className="header-actions">
            <button className="notification-btn"><MessageSquare size={20} /></button>
          </div>
        </header>
        <div className="page-container fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

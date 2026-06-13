import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Sidebar = ({ isOpen, onClose }) => {
const { user, logout } = useAuth();
const navigate = useNavigate();
const location = useLocation();

const handleLogout = () => {
logout();
toast.success('Logged out successfully');
navigate('/login');
};

const navTo = (path) => {
navigate(path);
onClose();
};

const isActive = (path) => location.pathname === path;

const userNavItems = [
{ path: '/dashboard', icon: '🏠', label: 'Dashboard' },
{ path: '/donors', icon: '🩸', label: 'Find Donors' },
{ path: '/my-profile', icon: '👤', label: 'My Donor Profile' },
{ path: '/requests', icon: '🆘', label: 'Blood Requests' },
{ path: '/my-requests', icon: '📋', label: 'My Requests' },
];

const adminNavItems = [
{ path: '/admin', icon: '📊', label: 'Admin Dashboard' },
{ path: '/admin/donors', icon: '🩸', label: 'Manage Donors' },
{ path: '/admin/requests', icon: '📝', label: 'Manage Requests' },
{ path: '/admin/users', icon: '👥', label: 'Manage Users' },
];

const initials =
user?.name
?.split(' ')
.map((n) => n[0])
.join('')
.toUpperCase()
.slice(0, 2) || '?';

return (
<>
<div
className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
onClick={onClose}
/>

```
  <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
    <div className="sidebar-logo">
      <div className="logo-icon">🩸</div>
      <div className="logo-text">
        <h2>BloodLink</h2>
        <span>Donor Management</span>
      </div>
    </div>

    <nav className="sidebar-nav">

      {user?.role === 'admin' ? (
        <>
          <div className="nav-section-title">Administration</div>

          {adminNavItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${
                isActive(item.path) ? 'active' : ''
              }`}
              onClick={() => navTo(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </>
      ) : (
        <>
          <div className="nav-section-title">Main Menu</div>

          {userNavItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${
                isActive(item.path) ? 'active' : ''
              }`}
              onClick={() => navTo(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </>
      )}

    </nav>

    <div className="sidebar-footer">
      <div className="user-info">
        <div className="user-avatar">{initials}</div>

        <div>
          <div className="user-name">{user?.name}</div>

          <div className="user-role">
            {user?.role === 'admin'
              ? '🔑 Administrator'
              : '🙂 User'}
          </div>
        </div>
      </div>

      <button
        className="btn btn-secondary"
        style={{ width: '100%' }}
        onClick={handleLogout}
      >
        🚪 Logout
      </button>
    </div>
  </aside>
</>
);
};

export default Sidebar;
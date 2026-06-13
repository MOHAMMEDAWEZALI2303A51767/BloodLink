import React, { useEffect, useState } from 'react';
import Layout from '../components/shared/Layout';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    API.get('/admin/users')
      .then(({ data }) => setUsers(data.users))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (id === currentUser.id) return toast.error("You can't delete your own account");
    if (!window.confirm('Delete this user and their donor profile?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  return (
    <Layout title="Manage Users" subtitle="View and manage all registered users">
      <div className="section-header">
        <div>
          <h2>All Users</h2>
          <p>{users.length} registered users</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 500 }}>
                    {u._id === currentUser.id ? `${u.name} (You)` : u.name}
                  </td>
                  <td className="text-muted">{u.email}</td>
                  <td>
                    <span style={{
                      padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                      background: u.role === 'admin' ? 'var(--crimson-pale)' : 'var(--gray-100)',
                      color: u.role === 'admin' ? 'var(--crimson)' : 'var(--gray-600)'
                    }}>
                      {u.role === 'admin' ? '🔑 Admin' : '👤 User'}
                    </span>
                  </td>
                  <td className="text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(u._id)}
                      disabled={u._id === currentUser.id || u.role === 'admin'}
                      title={u._id === currentUser.id ? 'Cannot delete yourself' : u.role === 'admin' ? 'Cannot delete admin' : 'Delete user'}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default AdminUsers;

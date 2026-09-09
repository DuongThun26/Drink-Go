import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <nav>
          <ul>
            <li><Link to="/admin/stats">Dashboard</Link></li>
            <li><Link to="/admin/users">User Management</Link></li>
            <li><Link to="/admin/products">Product Management</Link></li>
            <li><Link to="/admin/orders">Order Management</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="admin-content">
        <Outlet /> {/* This will render the nested admin routes */}
      </main>
    </div>
  );
};

export default AdminDashboard;

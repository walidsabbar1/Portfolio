import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Toaster } from 'react-hot-toast';
import './Admin.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? { background: '#f1f5f9', color: '#3b82f6', transform: 'translateX(5px)' } : {};
  };

  return (
    <div className="admin-layout">
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: '#363636', color: '#fff' } }} />
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav className="admin-nav">
          <Link to="/admin" className="admin-nav-link" style={isActive('/admin')}>Dashboard</Link>
          <Link to="/admin/profile" className="admin-nav-link" style={isActive('/admin/profile')}>Profile Settings</Link>
          <Link to="/admin/projects" className="admin-nav-link" style={isActive('/admin/projects')}>Projects</Link>
          <Link to="/admin/skills" className="admin-nav-link" style={isActive('/admin/skills')}>Skills</Link>
          <Link to="/admin/experience" className="admin-nav-link" style={isActive('/admin/experience')}>Experience</Link>
          <Link to="/admin/education" className="admin-nav-link" style={isActive('/admin/education')}>Education</Link>
          <button onClick={handleLogout} className="admin-logout-btn">
            Log Out
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <Outlet /> {/* This renders the specific admin pages */}
      </main>
    </div>
  );
}

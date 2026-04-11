import { Link, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f4f4' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', background: '#333', color: 'white', padding: '1rem' }}>
        <h2>Admin Panel</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/admin/profile" style={{ color: 'white', textDecoration: 'none' }}>Profile Settings</Link>
          <Link to="/admin/projects" style={{ color: 'white', textDecoration: 'none' }}>Projects</Link>
          <Link to="/admin/skills" style={{ color: 'white', textDecoration: 'none' }}>Skills</Link>
          <Link to="/admin/experience" style={{ color: 'white', textDecoration: 'none' }}>Experience</Link>
          <Link to="/admin/education" style={{ color: 'white', textDecoration: 'none' }}>Education</Link>
          <button onClick={handleLogout} style={{ marginTop: '20px', cursor: 'pointer', padding: '10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>Log Out</button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem', color: '#333' }}>
        <Outlet /> {/* This renders the specific admin pages */}
      </main>
    </div>
  );
}

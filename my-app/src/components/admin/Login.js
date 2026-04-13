import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f8fafc' }}>
      <div className="admin-container" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="admin-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 2rem 0', color: '#0f172a', fontSize: '1.8rem', fontWeight: '700' }}>Admin Login</h2>
          <form onSubmit={handleLogin} className="admin-form">
            {error && <div style={{ padding: '10px', background: '#fee2e2', color: '#ef4444', borderRadius: '8px', fontSize: '0.9rem' }}>{error}</div>}
            <input 
              type="email" 
              placeholder="Email Account" 
              value={email} onChange={e => setEmail(e.target.value)} 
              required 
              className="admin-input"
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} onChange={e => setPassword(e.target.value)} 
              required 
              className="admin-input"
            />
            <button type="submit" className="admin-btn-primary" style={{ marginTop: '10px' }}>
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

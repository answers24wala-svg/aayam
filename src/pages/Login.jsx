import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', isSuccess: false });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, message: '', isSuccess: false });

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.identifier, username: formData.identifier, password: formData.password })
      });
      const data = await res.json();

      if (data.success) {
        login(data.token, data.user);
        setAlert({ show: true, message: data.message || 'Login successful!', isSuccess: true });
        setTimeout(() => {
          if (data.user && data.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 1200);
      } else {
        setAlert({ show: true, message: data.error || 'Invalid credentials.', isSuccess: false });
        setLoading(false);
      }
    } catch (err) {
      setAlert({ show: true, message: 'Network error. Server could not be reached.', isSuccess: false });
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-overlay"></div>

      <header className="auth-header-nav">
        <Link to="/" className="nav-brand">
          <div className="ku-brand-wrap">
            <svg className="ku-flame-icon" viewBox="0 0 36 36" fill="none" width="28" height="28">
              <path d="M18 2C18 2 26 10 26 17C26 22.5228 22.4183 27 18 27C13.5817 27 10 22.5228 10 17C10 10 18 2 18 2Z" fill="#C8232C"/>
              <path d="M18 8C18 8 22.5 13.5 22.5 18C22.5 21.3137 20.4853 24 18 24C15.5147 24 13.5 21.3137 13.5 18C13.5 13.5 18 8 18 8Z" fill="#F59E0B"/>
            </svg>
            <div className="ku-text" style={{ color: '#fff' }}>
              <span className="ku-title" style={{ color: '#fff' }}>KARNAVATI</span>
              <span className="ku-sub" style={{ color: 'rgba(255,255,255,0.7)' }}>UNIVERSITY</span>
            </div>
          </div>
          <div className="nav-divider" style={{ background: 'rgba(255,255,255,0.2)' }}></div>
          <span className="uit-text" style={{ color: '#fff' }}>UIT</span>
          <div className="nav-divider" style={{ background: 'rgba(255,255,255,0.2)' }}></div>
          <div className="aayam-badge-gold">
            <span>आयाम</span>
          </div>
        </Link>

        <Link to="/" style={{ color: '#fff', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ← Back to Home
        </Link>
      </header>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-title-area">
            <div className="auth-tag">WELCOME BACK</div>
            <h1 className="auth-title">Account Login</h1>
            <p className="auth-subtitle">Enter your email or username and password</p>
          </div>

          {alert.show && (
            <div className={`auth-alert ${alert.isSuccess ? 'auth-alert-succ' : 'auth-alert-err'}`} style={{ display: 'block' }}>
              {alert.isSuccess ? '✅ ' : '⚠️ '}{alert.message}
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div className="form-group-custom">
              <label htmlFor="loginIdentifier">Email or Username *</label>
              <input
                type="text"
                id="loginIdentifier"
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                placeholder="student@ku.edu.in or admin"
                required
              />
            </div>
            <div className="form-group-custom">
              <label htmlFor="loginPassword">Password *</label>
              <input
                type="password"
                id="loginPassword"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="auth-btn-primary">
              {loading ? 'Authenticating...' : 'Log In'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </form>

          <div className="auth-footer-link">
            Don't have an account? <Link to="/signup">Sign Up Here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

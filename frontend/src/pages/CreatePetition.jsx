// ... imports
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { getCurrentUser, isOfficial } from '../utils/roleUtils';
import LogoutButton from '../components/LogoutButton';
import LocationSearch from '../components/LocationSearch';
import "../styles/dashboard.css"; // Reuse dashboard layout

export default function CreatePetition() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    goal: 100
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const user = getCurrentUser();
  const userIsOfficial = isOfficial();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.title.trim()) return "Title is required.";
    if (!formData.category) return "Category is required.";
    if (!formData.location.trim()) return "Location is required.";
    if (!formData.description.trim()) return "Description is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await api.post('/petitions', formData);
      alert('✓ Petition created successfully!');
      navigate('/petitions');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create petition.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dash-container">
      {/* TOP NAVBAR */}
      <header className="topbar">
        <div className="logo">
          <span style={{ fontSize: '20px' }}>🏛️</span>
          <b>Civix</b> <span className="beta">Beta</span>
        </div>
        <nav className="nav-links">
          <a onClick={() => navigate('/dashboard')}>Home</a>
          <a onClick={() => navigate('/petitions')}>Petitions</a>
          <a onClick={() => navigate('/polls')}>Polls</a>
          <a onClick={() => navigate('/reports')}>Reports</a>
        </nav>
        <div className="user-area">
          <div
            className="user-wrapper"
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{ position: 'relative', cursor: 'pointer' }}
          >
            <span className="user-circle">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
            <span>{user?.name || 'User'}</span>
            <span style={{ fontSize: '10px', color: '#999', marginLeft: '4px' }}>▼</span>
            {showUserMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px',
                minWidth: '160px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                zIndex: 1000
              }}>
                <LogoutButton style={{
                  width: '100%',
                  textAlign: 'left',
                  justifyContent: 'flex-start'
                }} />
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="dash-body">
        {/* LEFT SIDEBAR */}
        <aside className="left-panel">
          <div className="profile-card">
            <div className="avatar-lg">{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
            <div className="profile-info">
              <h4>{user?.name || 'User'}</h4>
              <p className="role">{user?.role || 'Citizen'}</p>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                📍 {user?.location || 'San Diego, CA'}
              </div>
            </div>
          </div>
          <ul className="side-menu">
            <li onClick={() => navigate('/dashboard')}>
              <span className="menu-icon">🏠</span> Dashboard
            </li>
            <li onClick={() => navigate('/petitions')}>
              <span className="menu-icon">📄</span> Petitions
            </li>
            <li onClick={() => navigate('/polls')} style={{ cursor: 'pointer' }}>
              <span className="menu-icon">📊</span> Polls
            </li>
            {userIsOfficial && (
              <li onClick={() => navigate('/officials')} style={{ cursor: 'pointer' }}>
                <span className="menu-icon">👥</span> Officials
              </li>
            )}
            <li onClick={() => navigate('/reports')} style={{ cursor: 'pointer' }}>
              <span className="menu-icon">📈</span> Reports
            </li>
            <li><span className="menu-icon">⚙️</span> Settings</li>
          </ul>
        </aside>

        {/* MAIN CONTENT */}
        <main className="content">
          <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '500' }}>
            &larr; Back to Dashboard
          </button>

          <div style={{ background: '#e9f9e3ff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '32px', maxWidth: '800px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: '#030812ff' }}>Create a New Petition</h2>
            <p style={{ color: '#4b5362ff', marginBottom: '32px', fontSize: '15px' }}>Complete the form below to create a petition in your community.</p>

            {error && <div style={{ background: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#232c3cff' }}>Petition Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Give your petition a clear, specific title"
                  style={{ padding: '12px', paddingLeft: '16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', color: '#111827', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#232c3cff' }}>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    style={{ padding: '12px', paddingLeft: '16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', color: '#656c7aff', outline: 'none', background: 'white' }}>
                    <option value="">Select a category</option>
                    <option value="Environment">Environment</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Education">Education</option>
                    <option value="Public Safety">Public Safety</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Housing">Housing</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <LocationSearch
                    value={{ address: formData.location }}
                    onChange={(loc) => setFormData(prev => ({ ...prev, location: loc.address }))}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#232c3cff' }}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Describe the issue and the change you'd like to see..."
                  style={{ padding: '12px', paddingLeft: '16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', color: '#111827', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#232c3cff' }}>Signature Goal</label>
                <input
                  name="goal"
                  type="number"
                  value={formData.goal}
                  onChange={handleChange}
                  style={{ padding: '12px', paddingLeft: '16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', color: '#111827', outline: 'none' }}
                />
              </div>

              <div style={{ background: '#cff1f5ff', padding: '16px', borderRadius: '8px', color: '#854d0e', fontSize: '14px', lineHeight: '1.5', border: '1px solid #fef9c3' }}>
                <strong>⚠️ Important Information</strong><br />
                By submitting this petition, you acknowledge that the content is factual to the best of your knowledge.
              </div>

              <button type="submit" disabled={loading} style={{ background: '#2563eb', color: 'white', padding: '14px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', border: 'none', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Creating...' : 'Create Petition'}
              </button>

            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

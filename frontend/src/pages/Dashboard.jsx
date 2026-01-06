import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ myPetitions: 0, successful: 0, pollsCreated: 0 });
  const [activePetitions, setActivePetitions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, petitionsRes] = await Promise.all([
          api.get('/petitions/stats'),
          api.get('/petitions?status=Active') // Assuming backend supports filtering or returns all, we slice below
        ]);
        setStats(statsRes.data);
        setActivePetitions(petitionsRes.data.slice(0, 3)); // Show top 3
      } catch (e) {
        console.error("Dashboard fetch error", e);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="dash-container">
      {/* TOP NAVBAR */}
      <header className="topbar">
        <div className="logo">
          <span style={{ fontSize: '20px' }}>🏛️</span>
          <b>Civix</b> <span className="beta">Beta</span>
        </div>

        <nav className="nav-links">
          <button onClick={() => navigate('/dashboard')} className="nav-btn active">Home</button>
          <button onClick={() => navigate('/petitions')} className="nav-btn">Petitions</button>
          <button onClick={() => navigate('/polls')} className="nav-btn">Polls</button>
          <button onClick={() => navigate('/reports')} className="nav-btn">Reports</button>
        </nav>




        <div className="user-area">
          <div className="user-wrapper">
            <span className="user-circle">S</span>
            <span>Sri</span>
            <span style={{ fontSize: '10px', color: '#999', marginLeft: '4px' }}>▼</span>
          </div>
        </div>
      </header>

      <div className="dash-body">
        {/* LEFT SIDEBAR */}
        <aside className="left-panel">
          <div className="profile-card">
            <div className="avatar-lg">S</div>
            <div className="profile-info">
              <h4>Sri</h4>
              <p className="role">Unverified Official</p>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                📍 San Diego, CA
              </div>
            </div>
          </div>

          <ul className="side-menu">
            <li className="active" onClick={() => navigate('/dashboard')}>
              <span className="menu-icon">🏠</span> Dashboard
            </li>
            <li onClick={() => navigate('/petitions')}>
              <span className="menu-icon">📄</span> Petitions
            </li>
            <li onClick={() => navigate('/polls')}>
              <span className="menu-icon">📊</span> Polls
            </li>

            <li><span className="menu-icon">👥</span> Officials</li>
            <li><span className="menu-icon">📈</span> Reports</li>
            <li><span className="menu-icon">⚙️</span> Settings</li>
          </ul>

          <div style={{ marginTop: 'auto', padding: '12px', color: '#6b7280', fontSize: '14px', cursor: 'pointer', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span>❓</span> Help & Support
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="content">
          <div className="welcome-section">
            <div className="welcome-text">
              <h2>Welcome back, Sri!</h2>
              <p>See what's happening in your community and make your voice heard.</p>
            </div>
            <button className="btn-primary" onClick={() => navigate("/petitions/create")}>
              + Create Petition
            </button>
          </div>

          {/* STATS */}
          {/* STATS */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                My Petitions <span className="stat-icon">📄</span>
              </div>
              <div className="stat-value">{stats.myPetitions}</div>
              <div className="stat-label">active petitions</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                Successful Petitions <span className="stat-icon">⚖️</span>
              </div>
              <div className="stat-value">{stats.successful}</div>
              <div className="stat-label">completed or under review</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                Polls Created <span className="stat-icon">🗳️</span>
              </div>
              <div className="stat-value">{stats.pollsCreated}</div>
              <div className="stat-label">active polls</div>
            </div>
          </div>

          {/* ACTIVE PETITIONS / FILTERS */}
          <div className="active-petitions-section">
            <div className="section-header">
              <h3 className="section-title">Active Petitions Near You</h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#eef6ff', padding: '6px 12px', borderRadius: '6px', color: '#2563eb', fontSize: '13px', fontWeight: '500' }}>
                📍 San Diego, CA <span style={{ fontSize: '10px' }}>▼</span>
              </div>
            </div>

            <div className="filter-pills">
              <div className="pill active">All Categories</div>
              <div className="pill">Environment</div>
              <div className="pill">Infrastructure</div>
              <div className="pill">Education</div>
              <div className="pill">Public Safety</div>
              <div className="pill">Transportation</div>
              <div className="pill">Healthcare</div>
              <div className="pill">Housing</div>
            </div>

            {/* Active Petitions List */}
            <div className="petition-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {activePetitions.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '12px', border: '1px dashed #e5e7eb' }}>
                  <p style={{ color: '#6b7280' }}>No active petitions found.</p>
                  <button className="btn-outline" style={{ marginTop: '16px' }} onClick={() => navigate('/petitions')}>Browse All</button>
                </div>
              ) : (
                activePetitions.map(p => (
                  <div key={p._id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '6px', background: '#10b981' }}></div>
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ background: '#f9fafb', fontSize: '11px', fontWeight: '600', color: '#9ca3af', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {p.category}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '500', color: '#09dc2cc8' }}>Active</span>
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '8px', lineHeight: '1.4' }}>
                        {p.title}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6', marginBottom: '20px', flex: 1 }}>
                        {p.description.substring(0, 80)}...
                      </p>
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                            {p.signatures || 0} <span style={{ fontWeight: '400', color: '#9ca3af' }}>of {p.goal || 100} signatures</span>
                          </span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(((p.signatures || 0) / (p.goal || 100)) * 100, 100)}%`, height: '100%', background: '#10b981' }}></div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                        <button
                          onClick={() => navigate(`/petitions/${p._id}`)}
                          style={{ flex: 1, border: 'none', background: 'transparent', color: '#2563eb', fontSize: '13px', fontWeight: '600', cursor: 'pointer', textAlign: 'left', padding: '0' }}>
                          View Details
                        </button>
                        <button
                          onClick={() => navigate(`/petitions/${p._id}`)}
                          style={{ background: '#f9fafb', border: '1px solid #e5e7eb', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: '#374151', cursor: 'pointer' }}>
                          Sign It
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>


        </main>
      </div>
    </div>
  );
}

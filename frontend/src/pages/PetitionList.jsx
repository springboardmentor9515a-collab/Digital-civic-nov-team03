// ... imports
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/dashboard.css"; // Reuse dashboard styles for layout

export default function PetitionList() {
  const navigate = useNavigate();
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Petitions");

  // ✅ DELETE PETITION FUNCTION
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this petition?")) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/petitions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // UI se remove
      setPetitions(prev => prev.filter(p => p._id !== id));
      alert("Petition deleted successfully");
    } catch (err) {
  console.error("Delete error:", err.response?.data || err.message);
  alert(err.response?.data?.message || "Delete failed");
}

  };


  // Filters
  const [locationFilter, setLocationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchPetitions = async () => {
      setLoading(true);
      try {
        const params = {};
        if (categoryFilter) params.category = categoryFilter;
        if (locationFilter) params.location = locationFilter;
        if (statusFilter && statusFilter !== 'All') params.status = statusFilter;

        const res = await api.get('/petitions', { params });
        setPetitions(res.data);
      } catch (err) {
        console.error("Failed to fetch petitions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPetitions();
  }, [categoryFilter, locationFilter, statusFilter, activeTab]);

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
          <a className="active" onClick={() => navigate('/petitions')}>Petitions</a>
          <a>Polls</a>
          <a>Reports</a>
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
            <li onClick={() => navigate('/dashboard')}>
              <span className="menu-icon">🏠</span> Dashboard
            </li>
            <li className="active" onClick={() => navigate('/petitions')}>
              <span className="menu-icon">📄</span> Petitions
            </li>
            <li><span className="menu-icon">📊</span> Polls</li>
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

          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>Petitions</h2>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Browse, sign, and track petitions in your community.</p>
          </div>

          {/* Controls Container */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px', overflow: 'hidden' }}>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', padding: '0 16px' }}>
              {['All Petitions', 'My Petitions', 'Signed by Me'].map(tab => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '16px 4px',
                    marginRight: '24px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: activeTab === tab ? '600' : '500',
                    color: activeTab === tab ? '#111827' : '#6b7280',
                    borderBottom: activeTab === tab ? '2px solid #111827' : '2px solid transparent',
                    transition: 'all 0.2s',
                    marginBottom: '-1px'
                  }}
                >
                  {tab}
                </div>
              ))}
            </div>

            {/* Filters */}
            <div style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>

              {/* Location */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>📍</span>
                <select
                  style={{ border: 'none', background: 'transparent', fontSize: '14px', fontWeight: '600', color: '#374151', cursor: 'pointer', outline: 'none', paddingRight: '20px' }}
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option value="">All Locations</option>
                  <option value="San Diego, CA">San Diego, CA</option>
                  <option value="Portland, OR">Portland, OR</option>
                </select>
              </div>

              {/* Divider */}
              <div style={{ width: '1px', height: '24px', background: '#e5e7eb' }}></div>

              {/* Category */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>🔍</span>
                <select
                  style={{ border: 'none', background: 'transparent', fontSize: '14px', fontWeight: '600', color: '#374151', cursor: 'pointer', outline: 'none' }}
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="Environment">Environment</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Public Safety">Public Safety</option>
                  <option value="Education">Education</option>
                  <option value="Public Safety">Public Safety</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Housing">Housing</option>
                </select>
              </div>

              {/* Status */}
              <div style={{ marginLeft: 'auto' }}>
                <select
                  style={{ border: '1px solid #e5e7eb', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: '#374151', outline: 'none' }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">Status: All</option>
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {loading ? (
              <p>Loading...</p>
            ) : petitions.length === 0 ? (
              <p>No petitions found.</p>
            ) : (
              petitions.map(p => (
                <div key={p._id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                  {/* Card Green Top Bar */}
                  <div style={{ height: '6px', background: '#10b981' }}></div>

                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {/* Meta Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ background: '#f9fafb', fontSize: '11px', fontWeight: '600', color: '#9ca3af', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {p.category}
                      </span>
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                        {/* Simple time logic replacement */}
                        2 minutes ago
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '8px', lineHeight: '1.4' }}>
                      {p.title}
                    </h3>

                    {/* Body */}
                    <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6', marginBottom: '20px', flex: 1 }}>
                      {p.description.substring(0, 120)}...
                    </p>

                    {/* Progress Section */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                          {p.signatures || 0} <span style={{ fontWeight: '400', color: '#9ca3af' }}>of {p.goal || 100} signatures</span>
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#10b981' }}>Active</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(((p.signatures || 0) / (p.goal || 100)) * 100, 100)}%`, height: '100%', background: '#10b981' }}></div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                      <button
                        onClick={() => navigate(`/petitions/${p._id}`)}
                        style={{ flex: 1, border: 'none', background: 'transparent', color: '#2563eb', fontSize: '13px', fontWeight: '600', cursor: 'pointer', textAlign: 'left', padding: '0' }}>
                        View Details
                      </button>

                      <button
                        onClick={() => navigate(`/petitions/${p._id}`)}
                        style={{ background: '#f9fafb', border: '1px solid #e5e7eb', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: '#374151', cursor: 'pointer' }}>
                        Sign Petition
                      </button>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

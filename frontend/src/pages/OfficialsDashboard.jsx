import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { isOfficial, getCurrentUser } from '../utils/roleUtils';
import '../styles/dashboard.css';

export default function OfficialsDashboard() {
    const navigate = useNavigate();
    const [petitions, setPetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    const user = getCurrentUser();

    // Check if user is authorized
    useEffect(() => {
        if (!isOfficial()) {
            alert("Access denied. Only officials can view this page.");
            navigate("/dashboard");
        }
    }, [navigate]);

    useEffect(() => {
        fetchGovernancePetitions();
    }, [statusFilter]);

    const fetchGovernancePetitions = async () => {
        try {
            setLoading(true);
            const query = new URLSearchParams();
            if (statusFilter !== 'all') query.append('status', statusFilter);
            // Auto-filter by official's location if available
            if (user?.location) query.append('location', user.location);

            const res = await api.get(`/governance/petitions?${query.toString()}`);
            setPetitions(res.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching petitions:', err);
            setError('Failed to load petitions');
        } finally {
            setLoading(false);
        }
    };

    // Calculate summary statistics
    const totalPetitions = petitions.length;
    const activePetitions = petitions.filter(p => p.status === 'active').length;
    const underReviewPetitions = petitions.filter(p => p.status === 'under_review').length;
    const closedPetitions = petitions.filter(p => p.status === 'closed').length;

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
                    <a className="active" onClick={() => navigate('/officials')}>Officials</a>
                    <a onClick={() => navigate('/reports')}>Reports</a>
                </nav>
                <div className="user-area">
                    <div className="user-wrapper">
                        <span className="user-circle">
                            {user?.name?.charAt(0).toUpperCase() || 'O'}
                        </span>
                        <span>{user?.name || 'Official'}</span>
                        <span style={{ fontSize: '10px', color: '#999', marginLeft: '4px' }}>▼</span>
                    </div>
                </div>
            </header>

            <div className="dash-body">
                {/* LEFT SIDEBAR */}
                <aside className="left-panel">
                    <div className="profile-card">
                        <div className="avatar-lg">
                            {user?.name?.charAt(0).toUpperCase() || 'O'}
                        </div>
                        <div className="profile-info">
                            <h4>{user?.name || 'Official'}</h4>
                            <p className="role">{user?.role || 'Official'}</p>
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
                        <li onClick={() => navigate('/polls')}>
                            <span className="menu-icon">📊</span> Polls
                        </li>
                        <li className="active" onClick={() => navigate('/officials')}>
                            <span className="menu-icon">👥</span> Officials
                        </li>
                        <li onClick={() => navigate('/reports')}>
                            <span className="menu-icon">📈</span> Reports
                        </li>
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
                            <h2>Governance Dashboard</h2>
                            <p>Manage and respond to community petitions in {user?.location || 'your area'}.</p>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                        marginBottom: '24px'
                    }}>
                        <div style={{
                            background: '#fff',
                            padding: '20px',
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                        }}>
                            <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600', marginBottom: '8px' }}>
                                Total Petitions
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: '800', color: '#111827' }}>
                                {totalPetitions}
                            </div>
                            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                                In {user?.location || 'your location'}
                            </div>
                        </div>

                        <div style={{
                            background: '#fff',
                            padding: '20px',
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                        }}>
                            <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600', marginBottom: '8px' }}>
                                Active Petitions
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: '800', color: '#2563eb' }}>
                                {activePetitions}
                            </div>
                            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                                Awaiting review
                            </div>
                        </div>

                        <div style={{
                            background: '#fff',
                            padding: '20px',
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                        }}>
                            <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600', marginBottom: '8px' }}>
                                Under Review
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: '800', color: '#f59e0b' }}>
                                {underReviewPetitions}
                            </div>
                            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                                Being processed
                            </div>
                        </div>

                        <div style={{
                            background: '#fff',
                            padding: '20px',
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                        }}>
                            <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600', marginBottom: '8px' }}>
                                Closed Petitions
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: '800', color: '#10b981' }}>
                                {closedPetitions}
                            </div>
                            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                                Resolved
                            </div>
                        </div>
                    </div>

                    {/* Petitions List */}
                    <div style={{
                        background: '#fff',
                        padding: '24px',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                                Petitions
                            </h3>

                            {/* Filter buttons */}
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    className={statusFilter === 'all' ? 'pill active' : 'pill'}
                                    onClick={() => setStatusFilter('all')}
                                >
                                    All
                                </button>
                                <button
                                    className={statusFilter === 'active' ? 'pill active' : 'pill'}
                                    onClick={() => setStatusFilter('active')}
                                >
                                    Active
                                </button>
                                <button
                                    className={statusFilter === 'under_review' ? 'pill active' : 'pill'}
                                    onClick={() => setStatusFilter('under_review')}
                                >
                                    Under Review
                                </button>
                                <button
                                    className={statusFilter === 'closed' ? 'pill active' : 'pill'}
                                    onClick={() => setStatusFilter('closed')}
                                >
                                    Closed
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                                Loading petitions...
                            </div>
                        ) : error ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
                                {error}
                            </div>
                        ) : petitions.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '40px',
                                border: '1px dashed #e5e7eb',
                                borderRadius: '8px',
                                color: '#6b7280'
                            }}>
                                No petitions found with the selected filter.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {petitions.map(petition => (
                                    <div
                                        key={petition._id}
                                        onClick={() => navigate(`/petitions/${petition._id}`)}
                                        style={{
                                            padding: '20px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            background: '#fafafa',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = '#3b82f6';
                                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = '#e5e7eb';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>
                                                    {petition.title}
                                                </h4>
                                                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                                                    {petition.description?.substring(0, 120)}
                                                    {petition.description?.length > 120 ? '...' : ''}
                                                </p>
                                                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#9ca3af' }}>
                                                    <span>✍️ {petition.signatures || 0} signatures</span>
                                                    <span>•</span>
                                                    <span>📍 {petition.targetLocation}</span>
                                                    <span>•</span>
                                                    <span>{new Date(petition.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    background: petition.status === 'active' ? '#eff6ff' :
                                                        petition.status === 'under_review' ? '#fef3c7' : '#d1fae5',
                                                    color: petition.status === 'active' ? '#2563eb' :
                                                        petition.status === 'under_review' ? '#92400e' : '#065f46'
                                                }}>
                                                    {petition.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

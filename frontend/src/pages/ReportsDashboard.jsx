import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';
import { isOfficial, getCurrentUser } from '../utils/roleUtils';
import { downloadCSV, formatReportsForExport, generateReportFilename } from '../utils/exportUtils';
import '../styles/dashboard.css';

export default function ReportsDashboard() {
    const navigate = useNavigate();
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('community');
    const [filters, setFilters] = useState({
        dateRange: 'last_month',
        location: 'San Diego, CA'
    });

    const user = getCurrentUser();
    const userIsOfficial = isOfficial();

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await api.get('/reports');
            setReportData(res.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching reports:', err);
            setError('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        if (!reportData) {
            alert('No data available to export');
            return;
        }

        const exportData = formatReportsForExport(reportData, filters);
        const filename = generateReportFilename('analytics', filters);
        downloadCSV(exportData, filename);
    };

    // Calculate statistics
    const getTotalPetitions = () => {
        if (!reportData?.petitionsByStatus) return 0;
        return reportData.petitionsByStatus.reduce((sum, item) => sum + item.count, 0);
    };

    const getTotalPolls = () => {
        if (!reportData?.pollVotes) return 0;
        return reportData.pollVotes.length;
    };

    const getTotalEngagement = () => {
        const signatures = reportData?.signatureTotals?.reduce((sum, s) => sum + (s.total || 0), 0) || 0;
        const votes = reportData?.pollVotes?.reduce((sum, p) => sum + (p.totalVotes || 0), 0) || 0;
        return signatures + votes;
    };

    // Prepare data for pie charts
    const petitionChartData = reportData?.petitionsByStatus?.map(item => ({
        label: item._id || 'Unknown',
        value: item.count,
        color: item._id === 'active' ? '#3b82f6' :
            item._id === 'under_review' ? '#f59e0b' :
                item._id === 'closed' ? '#10b981' : '#9ca3af'
    })) || [];

    const pollChartData = reportData?.pollVotes?.length > 0 ? [
        { label: 'Active', value: reportData.pollVotes.length, color: '#3b82f6' },
        { label: 'Closed', value: 0, color: '#9ca3af' }
    ] : [];

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
                    <a className="active" onClick={() => navigate('/reports')}>Reports</a>
                </nav>
                <div className="user-area">
                    <div className="user-wrapper">
                        <span className="user-circle">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                        <span>{user?.name || 'User'}</span>
                        <span style={{ fontSize: '10px', color: '#999', marginLeft: '4px' }}>▼</span>
                    </div>
                </div>
            </header>

            <div className="dash-body">
                {/* LEFT SIDEBAR */}
                <aside className="left-panel">
                    <div className="profile-card">
                        <div className="avatar-lg">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="profile-info">
                            <h4>{user?.name || 'User'}</h4>
                            <p className="role">{user?.role || 'Citizen'}</p>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                                📍 {filters.location}
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
                        {userIsOfficial && (
                            <li onClick={() => navigate('/officials')}>
                                <span className="menu-icon">👥</span> Officials
                            </li>
                        )}
                        <li className="active" onClick={() => navigate('/reports')}>
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
                            <h2>Reports & Analytics</h2>
                            <p>Track civic engagement and measure the impact of petitions and polls.</p>
                        </div>
                        {userIsOfficial && (
                            <button
                                className="btn-primary"
                                onClick={handleExportCSV}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <span>⬇️</span> Export Data
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                            Loading analytics...
                        </div>
                    ) : error ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#ef4444' }}>
                            {error}
                        </div>
                    ) : (
                        <>
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
                                    <div style={{ fontSize: '32px', fontWeight: '800', color: '#2563eb' }}>
                                        {getTotalPetitions()}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                                        {filters.dateRange === 'last_month' ? '↑ 15% increase from last month' : 'All time'}
                                    </div>
                                </div>

                                <div style={{
                                    background: '#fff',
                                    padding: '20px',
                                    borderRadius: '12px',
                                    border: '1px solid #e5e7eb',
                                }}>
                                    <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600', marginBottom: '8px' }}>
                                        Total Polls
                                    </div>
                                    <div style={{ fontSize: '32px', fontWeight: '800', color: '#10b981' }}>
                                        {getTotalPolls()}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                                        {filters.dateRange === 'last_month' ? 'In last month' : 'All time'}
                                    </div>
                                </div>

                                <div style={{
                                    background: '#fff',
                                    padding: '20px',
                                    borderRadius: '12px',
                                    border: '1px solid #e5e7eb',
                                }}>
                                    <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600', marginBottom: '8px' }}>
                                        Active Engagement
                                    </div>
                                    <div style={{ fontSize: '32px', fontWeight: '800', color: '#f59e0b' }}>
                                        {getTotalEngagement()}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                                        Active petitions and polls
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #e5e7eb' }}>
                                    <button
                                        onClick={() => setActiveTab('community')}
                                        style={{
                                            padding: '12px 20px',
                                            background: 'none',
                                            border: 'none',
                                            borderBottom: `2px solid ${activeTab === 'community' ? '#3b82f6' : 'transparent'}`,
                                            color: activeTab === 'community' ? '#3b82f6' : '#6b7280',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            marginBottom: '-2px'
                                        }}
                                    >
                                        Community Overview
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('activity')}
                                        style={{
                                            padding: '12px 20px',
                                            background: 'none',
                                            border: 'none',
                                            borderBottom: `2px solid ${activeTab === 'activity' ? '#3b82f6' : 'transparent'}`,
                                            color: activeTab === 'activity' ? '#3b82f6' : '#6b7280',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            marginBottom: '-2px'
                                        }}
                                    >
                                        My Activity
                                    </button>
                                </div>
                            </div>

                            {/* Charts Section */}
                            {activeTab === 'community' && (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                                    gap: '24px',
                                    marginBottom: '24px'
                                }}>
                                    {petitionChartData.length > 0 && (
                                        <PieChart
                                            data={petitionChartData}
                                            title="Petition Status Breakdown"
                                        />
                                    )}

                                    <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: '#374151' }}>Engagement Overview</h3>
                                        <BarChart
                                            data={[
                                                { label: 'Petitions', value: getTotalPetitions(), color: '#3b82f6' },
                                                { label: 'Polls', value: getTotalPolls(), color: '#10b981' },
                                                { label: 'Signatures', value: reportData?.signatureTotals?.reduce((sum, s) => sum + (s.total || 0), 0) || 0, color: '#8b5cf6' }
                                            ]}
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'activity' && (
                                <div style={{
                                    background: '#fff',
                                    padding: '40px',
                                    borderRadius: '12px',
                                    border: '1px solid #e5e7eb',
                                    textAlign: 'center',
                                    color: '#6b7280'
                                }}>
                                    <span style={{ fontSize: '40px', marginBottom: '16px', display: 'block' }}>📊</span>
                                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                                        Your Activity Insights
                                    </h3>
                                    <p style={{ fontSize: '14px' }}>
                                        View your personal petition and poll participation history.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

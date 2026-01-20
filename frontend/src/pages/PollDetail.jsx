import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import BarChart from '../components/BarChart';
import { isOfficial, isCitizen, getCurrentUser } from '../utils/roleUtils';
import '../styles/dashboard.css';

export default function PollDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pollData, setPollData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [hasVoted, setHasVoted] = useState(false);
    const [voting, setVoting] = useState(false);
    const [voteSuccess, setVoteSuccess] = useState(false);

    const user = getCurrentUser();
    const canVote = isCitizen();
    const isOfficialUser = isOfficial();

    useEffect(() => {
        fetchPollData();
        checkIfVoted();
    }, [id]);

    const fetchPollData = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/polls/${id}`);
            setPollData(res.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching poll:', err);
            setError('Failed to load poll details.');
        } finally {
            setLoading(false);
        }
    };

    const checkIfVoted = async () => {
        try {
            const res = await api.get(`/votes`);
            const userVote = res.data.find(
                (vote) => vote.poll === id && vote.user === user?.id
            );
            if (userVote) {
                setHasVoted(true);
                setSelectedOption(userVote.selectedOption);
            }
        } catch (err) {
            console.error('Error checking vote status:', err);
        }
    };

    const handleVote = async () => {
        if (!selectedOption || hasVoted || voting) return;

        try {
            setVoting(true);
            await api.post(`/polls/${id}/vote`, { selectedOption });
            setHasVoted(true);
            setVoteSuccess(true);

            // Refresh poll data to get updated vote counts
            await fetchPollData();

            // Show success message briefly
            setTimeout(() => {
                setVoteSuccess(false);
            }, 3000);
        } catch (err) {
            console.error('Error voting:', err);
            const errorMsg = err.response?.data?.message || 'Failed to submit vote.';
            if (errorMsg === 'Already voted') {
                setHasVoted(true);
            }
            alert(errorMsg);
        } finally {
            setVoting(false);
        }
    };

    if (loading) {
        return (
            <div className="dash-container">
                <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>
                    Loading poll details...
                </div>
            </div>
        );
    }

    if (error || !pollData) {
        return (
            <div className="dash-container">
                <div style={{ padding: '60px', textAlign: 'center', color: '#ef4444' }}>
                    {error || 'Poll not found'}
                </div>
            </div>
        );
    }

    const { poll, totalVotes, results } = pollData;

    // Prepare data for bar chart
    const chartData = results.map((result) => ({
        label: result.option,
        value: result.count,
        percentage: result.percentage,
        color: selectedOption === result.option ? '#10b981' : '#3b82f6',
    }));

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
                    <a className="active" onClick={() => navigate('/polls')}>Polls</a>
                    <a onClick={() => navigate('/reports')}>Reports</a>
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
                                📍 San Diego, CA
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
                        <li className="active" onClick={() => navigate('/polls')}>
                            <span className="menu-icon">📊</span> Polls
                        </li>
                        {isOfficialUser && (
                            <li onClick={() => navigate('/officials')}>
                                <span className="menu-icon">👥</span> Officials
                            </li>
                        )}
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
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        {/* Back button */}
                        <button
                            onClick={() => navigate('/polls')}
                            style={{
                                marginBottom: '16px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#6b7280',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            &larr; Back to Polls
                        </button>

                        {/* Success message */}
                        {voteSuccess && (
                            <div style={{
                                background: '#d1fae5',
                                border: '1px solid #10b981',
                                color: '#065f46',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                marginBottom: '16px',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>
                                ✓ Vote submitted successfully! Results have been updated.
                            </div>
                        )}

                        {/* Poll container */}
                        <div style={{
                            background: '#fff',
                            borderRadius: '16px',
                            padding: '40px',
                            border: '1px solid #eef0f3',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                        }}>
                            {/* Poll header */}
                            <div style={{ marginBottom: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                    <span style={{
                                        background: '#eff6ff',
                                        color: '#2563eb',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        letterSpacing: '0.5px',
                                        textTransform: 'uppercase'
                                    }}>
                                        POLL
                                    </span>
                                    <span style={{ color: '#ef4444', fontSize: '14px' }}>📍 {poll.targetLocation}</span>
                                </div>

                                <h1 style={{
                                    fontSize: '32px',
                                    fontWeight: '800',
                                    color: '#111827',
                                    marginBottom: '16px',
                                    lineHeight: '1.2'
                                }}>
                                    {poll.title}
                                </h1>

                                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '12px' }}>
                                    <strong>{totalVotes}</strong> {totalVotes === 1 ? 'vote' : 'votes'} • Created {new Date(poll.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div style={{ height: '1px', background: '#f3f4f6', marginBottom: '32px' }}></div>

                            {/* Voting Section for Citizens */}
                            {canVote && !hasVoted && (
                                <div style={{ marginBottom: '40px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
                                        Cast Your Vote
                                    </h3>
                                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
                                        Select one option below to participate in this poll.
                                    </p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                                        {poll.options.map((option, index) => (
                                            <label
                                                key={index}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    padding: '16px',
                                                    border: selectedOption === option ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    background: selectedOption === option ? '#eff6ff' : '#fff',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="poll-option"
                                                    value={option}
                                                    checked={selectedOption === option}
                                                    onChange={(e) => setSelectedOption(e.target.value)}
                                                    style={{ marginRight: '12px', cursor: 'pointer' }}
                                                />
                                                <span style={{ fontSize: '15px', fontWeight: '500', color: '#374151' }}>
                                                    {option}
                                                </span>
                                            </label>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleVote}
                                        disabled={!selectedOption || voting}
                                        style={{
                                            background: selectedOption && !voting ? '#3b82f6' : '#9ca3af',
                                            color: 'white',
                                            border: 'none',
                                            padding: '12px 24px',
                                            borderRadius: '8px',
                                            fontSize: '15px',
                                            fontWeight: '600',
                                            cursor: selectedOption && !voting ? 'pointer' : 'not-allowed',
                                            transition: 'background 0.2s'
                                        }}
                                    >
                                        {voting ? 'Submitting...' : 'Submit Vote'}
                                    </button>
                                </div>
                            )}

                            {/* Already voted message for citizens */}
                            {canVote && hasVoted && (
                                <div style={{
                                    background: '#f0fdf4',
                                    border: '1px solid #86efac',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    marginBottom: '32px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '20px' }}>✓</span>
                                        <div>
                                            <div style={{ fontSize: '15px', fontWeight: '600', color: '#166534' }}>
                                                You've already voted in this poll
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#15803d', marginTop: '4px' }}>
                                                Your choice: <strong>{selectedOption}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Message for officials */}
                            {isOfficialUser && (
                                <div style={{
                                    background: '#fef3c7',
                                    border: '1px solid #fbbf24',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    marginBottom: '32px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '20px' }}>ℹ️</span>
                                        <div style={{ fontSize: '14px', color: '#92400e' }}>
                                            <strong>Officials cannot vote in polls.</strong> You can view the results below.
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Results Section */}
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#111827' }}>
                                    Live Results
                                </h3>

                                {totalVotes === 0 ? (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '40px',
                                        background: '#f9fafb',
                                        borderRadius: '8px',
                                        color: '#6b7280'
                                    }}>
                                        No votes yet. Be the first to vote!
                                    </div>
                                ) : (
                                    <BarChart data={chartData} />
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

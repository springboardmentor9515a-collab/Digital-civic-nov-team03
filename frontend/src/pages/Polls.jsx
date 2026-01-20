import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCurrentUser, isOfficial } from "../utils/roleUtils";
import "../styles/dashboard.css";

const Polls = () => {
  const [polls, setPolls] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [loading, setLoading] = useState(true);
  const [userVotes, setUserVotes] = useState([]);
  const navigate = useNavigate();

  const user = getCurrentUser();
  const canCreatePolls = isOfficial();

  useEffect(() => {
    fetchPolls();
    fetchUserVotes();
  }, []);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/polls", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPolls(res.data);
    } catch (error) {
      console.error("Error fetching polls", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVotes = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/votes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUserVotes(res.data);
    } catch (error) {
      console.error("Error fetching votes", error);
    }
  };

  // Filter polls based on active tab
  const filteredPolls = polls.filter(poll => {
    const hasVoted = userVotes.some(vote => vote.poll === poll._id);

    switch (activeTab) {
      case "active":
        return true; // Show all active polls
      case "voted":
        return hasVoted;
      case "my":
        return poll.createdBy === user?.id;
      case "closed":
        return false; // Placeholder - need closeDate logic
      default:
        return true;
    }
  });

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
            <div className="avatar-lg">{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
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
            <li className="active" onClick={() => navigate('/polls')} style={{ cursor: "pointer" }}>
              <span className="menu-icon">📊</span> Polls
            </li>
            {canCreatePolls && (
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
          {/* HEADER */}
          <div className="welcome-section">
            <div className="welcome-text">
              <h2>Polls</h2>
              <p>Participate in community polls and make your voice heard.</p>
            </div>

            {canCreatePolls && (
              <button className="btn-primary" onClick={() => navigate("/create-poll")}>
                + Create Poll
              </button>
            )}
          </div>

          {/* POLLS CARD */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "24px",
            }}
          >
            {/* TABS + LOCATION */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              {/* TABS */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  className={activeTab === "active" ? "pill active" : "pill"}
                  onClick={() => setActiveTab("active")}
                >
                  Active Polls
                </button>
                <button
                  className={activeTab === "voted" ? "pill active" : "pill"}
                  onClick={() => setActiveTab("voted")}
                >
                  Polls I Voted On
                </button>
                {canCreatePolls && (
                  <button
                    className={activeTab === "my" ? "pill active" : "pill"}
                    onClick={() => setActiveTab("my")}
                  >
                    My Polls
                  </button>
                )}
                <button
                  className={activeTab === "closed" ? "pill active" : "pill"}
                  onClick={() => setActiveTab("closed")}
                >
                  Closed Polls
                </button>
              </div>

              {/* LOCATION */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "13px",
                  cursor: "pointer",
                  background: "#fff",
                  whiteSpace: "nowrap",
                }}
              >
                📍 San Diego, CA <span style={{ fontSize: "10px" }}>▼</span>
              </div>
            </div>

            {/* POLL LIST */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
                Loading polls...
              </div>
            ) : filteredPolls.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px 20px",
                  border: "1px dashed #e5e7eb",
                  borderRadius: "10px",
                }}
              >
                <p style={{ color: "#6b7280", marginBottom: "14px" }}>
                  No polls found with the current filters.
                </p>
                <button className="btn-outline" onClick={() => setActiveTab("active")}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredPolls.map(poll => {
                  const hasVoted = userVotes.some(vote => vote.poll === poll._id);
                  const userVote = userVotes.find(vote => vote.poll === poll._id);

                  return (
                    <div
                      key={poll._id}
                      onClick={() => navigate(`/polls/${poll._id}`)}
                      style={{
                        padding: '20px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: '#ffffff',
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0' }}>
                          {poll.title}
                        </h3>
                        {hasVoted && (
                          <span style={{
                            background: '#d1fae5',
                            color: '#065f46',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}>
                            ✓ Voted
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
                        <span>📍 {poll.targetLocation}</span>
                        <span>•</span>
                        <span>{poll.options?.length || 0} options</span>
                        <span>•</span>
                        <span>Created {new Date(poll.createdAt).toLocaleDateString()}</span>
                      </div>

                      {hasVoted && userVote && (
                        <div style={{
                          marginTop: '12px',
                          padding: '8px 12px',
                          background: '#f0fdf4',
                          borderRadius: '6px',
                          fontSize: '12px',
                          color: '#15803d'
                        }}>
                          Your choice: <strong>{userVote.selectedOption}</strong>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* HAVE A QUESTION BOX */}
          {canCreatePolls && (
            <div
              style={{
                background: "#eef6fb",
                border: "1px solid #dbeafe",
                borderRadius: "12px",
                padding: "32px",
                textAlign: "center",
              }}
            >
              <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>
                Have a question for your community?
              </h3>

              <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "16px" }}>
                Create a poll to gather input and understand public sentiment on local issues.
              </p>

              <button
                className="btn-primary"
                onClick={() => navigate("/create-poll")}
              >
                + Create New Poll
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Polls;

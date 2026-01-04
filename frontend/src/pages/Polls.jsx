import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Polls = () => {
  const [polls, setPolls] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/polls");
      setPolls(res.data);
    } catch (error) {
      console.error("Error fetching polls", error);
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
          <a className="active" onClick={() => navigate('/polls')}>Polls</a>
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
            <li onClick={() => navigate('/petitions')}>
              <span className="menu-icon">📄</span> Petitions
            </li>
            <li className="active" onClick={() => navigate('/polls')} style={{ cursor: "pointer" }}>
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
  {/* HEADER */}
  <div className="welcome-section">
    <div className="welcome-text">
      <h2>Polls</h2>
      <p>Participate in community polls and make your voice heard.</p>
    </div>

    <button className="btn-primary" onClick={() => navigate("/create-poll")}>
      + Create Poll
    </button>
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
        <button className="pill active">Active Polls</button>
        <button className="pill">Polls I Voted On</button>
        <button className="pill">My Polls</button>
        <button className="pill">Closed Polls</button>
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

    {/* EMPTY STATE */}
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

      <button className="btn-outline">Clear Filters</button>
    </div>
  </div>

  {/* HAVE A QUESTION BOX */}
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
      Create a poll to gather input and understand public sentiment on local
      issues.
    </p>

  </div>
</main>








  
       </div>
   </div>
   );
 }

export default Polls;

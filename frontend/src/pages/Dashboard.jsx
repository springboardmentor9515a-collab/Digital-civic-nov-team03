import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function Dashboard() {
    const navigate = useNavigate();

  return (
    <div className="dash-container">
      {/* TOP NAVBAR */}
      <header className="topbar">
        <div className="logo">
          <b>Civix</b> <span className="beta">Beta</span>
        </div>

        <nav className="nav-links">
          <a className="active">Home</a>
          <a>Petitions</a>
          <a>Polls</a>
          <a>Reports</a>
        </nav>

        <div className="user-area">
          
          <span className="user-circle">S</span>
          <span>Sri</span>
        </div>
      </header>

      <div className="dash-body">
        {/* LEFT SIDEBAR */}
        <aside className="left-panel">
          <div className="profile-card">
            <div className="avatar">S</div>
            <h4>Sri</h4>
            <p className="role">Unverified Official</p>
            <p className="location">📍 San Diego, CA</p>
            <p className="email">sri@gmail.com</p>
          </div>

          <ul className="side-menu">
            <li className="active">Dashboard</li>
            <li>Petitions</li>
            <li>Polls</li>
            <li>Officials</li>
            <li>Reports</li>
            <li>Settings</li>
          </ul>

          <div className="help">Help & Support</div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="content">
          <div className="welcome-box">
            <div>
              <h2>Welcome back, Sri!</h2>
              <p>
                See what's happening in your community and make your voice heard.
              </p>
            </div>
         <button
  className="disabled-btn"
  onClick={() => navigate("/petitions/create")}
>
  + Create Petition
</button>

          </div>

          {/* STATS */}
          <div className="stats-row">
            <div className="stat-box">
              <h4>My Petitions</h4>
              <h2>0</h2>
              <span>petitions</span>
            </div>

            <div className="stat-box">
              <h4>Successful Petitions</h4>
              <h2>0</h2>
              <span>or under review</span>
            </div>

            <div className="stat-box">
              <h4>Polls Created</h4>
              <h2>0</h2>
              <span>polls</span>
            </div>
          </div>

          {/* PETITIONS */}
          <section className="petitions-box">
            <div className="petition-head">
              <h3>Active Petitions Near You</h3>
              <button className="location-btn">📍 San Diego, CA</button>
            </div>

            <div className="categories">
              <button className="active">All Categories</button>
              <button>Environment</button>
              <button>Infrastructure</button>
              <button>Education</button>
              <button>Public Safety</button>
              <button>Transportation</button>
              <button>Healthcare</button>
              <button>Housing</button>
            </div>

            <div className="empty">
              <p>No petitions found with the current filters.</p>
              <button className="clear">Clear Filters</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

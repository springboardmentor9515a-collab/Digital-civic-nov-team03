import React from 'react'
import { Outlet } from 'react-router-dom'
import bgLeft from '../assets/bg-left.png'
import '../styles/auth.css'

export default function AuthLayout(){
  return (
    <div className="auth-root">
      <div className="left-panel" style={{ backgroundImage: `url(${bgLeft})` }}>
        <div className="left-overlay">
          <h1 className="brand">Civix</h1>
          <h2 className="title">Digital Civic Engagement Platform</h2>
          <p className="desc">
            Civix enables citizens to engage in local governance through petitions,
            voting, and tracking officials' responses. Join our platform to make your
            voice heard and drive positive change in your community.
          </p>


          <ul className="feature-list">
            <li><span className="chev">›</span>
              <div>
                <h3>Create and Sign Petitions</h3>
                <p>Easily create petitions for issues you care about and gather support from your community.</p>
              </div>
            </li>
            <li><span className="chev">›</span>
              <div>
                <h3>Participate in Public Polls</h3>
                <p>Vote on local issues and see real-time results of community sentiment.</p>
              </div>
            </li>
            <li><span className="chev">›</span>
              <div>
                <h3>Track Official Responses</h3>
                <p>See how local officials respond to community concerns and track progress on issues.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="right-panel">
        <Outlet />
      </div>
    </div>
  )
}

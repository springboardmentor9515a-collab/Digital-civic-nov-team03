import React from 'react'
import { Link } from 'react-router-dom'

export default function AuthCard({ children, activeTab = 'login' }) {
  return (
    <div className="auth-card">
      <div className="auth-heading">
        <h2>Welcome to Civix</h2>
        <p>Join our platform to make your voice heard in local governance.</p>
      </div>

      <div className="tabs">
        <Link to="/" className={activeTab === 'login' ? 'tab active' : 'tab'}>Login</Link>
        <Link to="/register" className={activeTab === 'register' ? 'tab active' : 'tab'}>Register</Link>
      </div>

      <div className="auth-body">
        {children}
      </div>
    </div>
  )
  
}
